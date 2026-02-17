# WaveSend Mobile Integration Guide

> **Reference branch:** `feat/wavesend-and-devnet-integration`  
> **Network:** Solana Devnet  
> **Purpose:** Port the complete WaveSend (stealth transfer) feature from the web app to the Wave mobile app (React Native / Expo).

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Complete File Map](#2-complete-file-map)
3. [Program IDs & Constants](#3-program-ids--constants)
4. [Cryptographic Primitives](#4-cryptographic-primitives)
5. [Key Derivation & Worker Security Model](#5-key-derivation--worker-security-model)
6. [Registration Flow](#6-registration-flow)
7. [Send Flow (waveSendV4 — SEQ Architecture)](#7-send-flow-wavesendv4--seq-architecture)
8. [Auto-Claim / Scanner Flow](#8-auto-claim--scanner-flow)
9. [Kora Gasless Integration](#9-kora-gasless-integration)
10. [PDA Derivation Reference](#10-pda-derivation-reference)
11. [Instruction Discriminators](#11-instruction-discriminators)
12. [Type Definitions](#12-type-definitions)
13. [Mobile-Specific Adaptations](#13-mobile-specific-adaptations)
14. [Dependencies](#14-dependencies)
15. [Step-by-Step Implementation Checklist](#15-step-by-step-implementation-checklist)

---

## 1. Architecture Overview

WaveSend implements **privacy-preserving token transfers** using stealth addresses and post-quantum cryptography (X-Wing = ML-KEM-768 + X25519). The flow ensures both sender and receiver unlinkability on-chain.

### High-Level Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        WAVESEND V4 (SEQ) ARCHITECTURE                   │
│                                                                         │
│  SENDER (3 L1 TXs — single wallet popup via signAllTransactions):       │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │ TX1: CREATE_V4_DEPOSIT_SEQ (0x3B)                                │   │
│  │   → Creates deposit record with seq_id on-chain                  │   │
│  │                                                                  │   │
│  │ TX2: UPLOAD_V4_CIPHERTEXT (0x29)                                 │   │
│  │   → Uploads X-Wing ciphertext in chunks to deposit record        │   │
│  │                                                                  │   │
│  │ TX3: COMPLETE_V4_DEPOSIT_SEQ (0x3C)                              │   │
│  │   → Creates INPUT_ESCROW + delegates to PER (MagicBlock)         │   │
│  │   → Sender deposits funds into input escrow                      │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  CRANK (Automatic — server-side, no user interaction):                  │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │ 1. REGISTER_DEPOSIT (0x3A) — Mark deposit ready for processing   │   │
│  │ 2. INPUT_TO_POOL (0x3D)   — Move funds: Input Escrow → Pool     │    │
│  │ 3. PREPARE_OUTPUT (0x40)  — Create Output Escrow for receiver    │   │
│  │ 4. POOL_TO_ESCROW (0x3E)  — Move funds: Pool → Output Escrow    │    │
│  └──────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  RECEIVER (scanning + claim):                                           │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │ 1. Scan OutputEscrows + DepositRecords (get X-Wing ciphertext)   │   │
│  │ 2. X-Wing decapsulate → sharedSecret                            │    │
│  │ 3. Verify: SHA256(sharedSecret || "stealth-derive") == stealth   │   │
│  │ 4. CLAIM_ESCROW_V4 (0x27) on PER → TEE verifies + undelegates   │    │
│  │ 5. WITHDRAW_FROM_OUTPUT_ESCROW (0x2F) on L1 → Funds to wallet   │    │
│  └──────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘
```

### Privacy Guarantees

| Property | How Achieved |
|---|---|
| **Sender unlinkability** | Funds go through mixer pool; sender never touches output escrow |
| **Receiver unlinkability** | Stealth address derived from X-Wing shared secret; no on-chain link to real wallet |
| **Post-quantum security** | X-Wing (ML-KEM-768 + X25519) hybrid KEM |
| **Gasless claiming** | Kora (Solana Foundation) pays L1 TX fees for receiver |
| **Key isolation** | Private keys kept in Web Worker (web) or secure enclave (mobile) |

---

## 2. Complete File Map

### Core Hooks (Port to React Native)

| Web File | What It Does | Mobile Equivalent |
|---|---|---|
| `apps/web/src/hooks/useWaveSend.ts` | Main send hook — init keys, register, send, claim | `hooks/useWaveSend.ts` |
| `apps/web/src/hooks/useAutoClaim.ts` | Scan for incoming payments, claim via TEE | `hooks/useAutoClaim.ts` |
| `apps/web/src/hooks/useWalletAdapter.ts` | Wallet connection adapter | Use mobile wallet SDK |

### Stealth Library (Core SDK — mostly portable as-is)

| Web File | What It Does | Lines |
|---|---|---|
| `apps/web/src/lib/stealth/index.ts` | Re-exports all SDK symbols | 150 |
| `apps/web/src/lib/stealth/client.ts` | `WaveStealthClient` class — all on-chain ops | 2936 |
| `apps/web/src/lib/stealth/config.ts` | Program IDs, PDA seeds, constants, Kora config | 535 |
| `apps/web/src/lib/stealth/crypto.ts` | Stealth key derivation, ECDH, X-Wing, encryption | 375 |
| `apps/web/src/lib/stealth/types.ts` | TypeScript interfaces | 155 |
| `apps/web/src/lib/stealth/scanner.ts` | V4 OutputEscrow + DepositRecord scanner | 846 |
| `apps/web/src/lib/stealth/xwing.ts` | X-Wing KEM (ML-KEM-768 + X25519) | 375~ |
| `apps/web/src/lib/stealth/stealth-worker.ts` | Web Worker (key isolation) | 471 |
| `apps/web/src/lib/stealth/stealth-worker-client.ts` | Main thread ↔ Worker bridge | 314 |
| `apps/web/src/lib/stealth/per-privacy.ts` | PER integration (MagicBlock TEE) | 1690 |

### UI Components (Reference for mobile screens)

| Web File | What It Does |
|---|---|
| `apps/web/src/components/Send/WaveSend.tsx` | Full send UI with token selection, recipient, amount, status banners |
| `apps/web/src/components/ui/TransactionToast.tsx` | Toast notifications for send/receive/claim |

### API Routes (May need mobile backend equivalent)

| Web File | What It Does |
|---|---|
| `apps/web/src/app/api/v1/send-transaction/route.ts` | Server-side raw TX proxy (avoids client timeout) |
| `apps/web/src/app/api/v1/rpc/` | RPC proxy (hides API keys) |
| `apps/web/src/app/api/v1/per-rpc/` | MagicBlock PER RPC proxy |

---

## 3. Program IDs & Constants

```typescript
// OceanVault Program IDs (Devnet) — MUST match deployed programs
const PROGRAM_IDS = {
  REGISTRY: "DgoW9MneWt6B3mBZqDf52csXMtJpgqwaHgP46tPs1tWu",  // Stealth key registry
  STEALTH:  "4jFg8uSh4jWkeoz6itdbsD7GadkTYLwfbyfDeNeB5nFX",  // Stealth transfers + mixer pool
  DEFI:     "8Xi4D44Xt3DnT6r8LogM4K9CSt3bHtpc1m21nErGawaA",  // Staking
  BRIDGE:   "AwZHcaizUMSsQC7fNAMbrahK2w3rLYXUDFCK4MvMKz1f",  // Bridge
  DELEGATION: "DELeGGvXpWV2fqJUhqcF5ZSYMS4JTLjteaAMARRSaeSh",// MagicBlock delegation
  MAGICBLOCK_ER: "ERdXRZQiAooqHBRQqhr6ZxppjUfuXsgPijBZaZLiZPfL",
  PERMISSION: "ACLseoPoyC3cBqoUtkbjZ4aDrkurZW86v19pXz2XQnp1",
};

// Master authority (receives rent from closed accounts)
const MASTER_AUTHORITY = "DNKKC4uCNE55w66GFENJSEo7PYVSDLnSL62jvHoNeeBU";

// Native SOL mint
const NATIVE_SOL_MINT = "So11111111111111111111111111111111111111112";

// Kora gasless config
const KORA_CONFIG = {
  RPC_URL: "https://genuine-vibrancy-production.up.railway.app",
  ENABLED: true,
};

// MagicBlock PER config
const MAGICBLOCK_PER = {
  ER_ENDPOINT: "https://devnet-as.magicblock.app",
  TEE_VALIDATOR: "MAS1Dt9qreoRMQ14YQuhg8UTZMMzDdKhmkZMECCzk57",
  MAGIC_CONTEXT: "MagicContext1111111111111111111111111111111",
  MAGIC_PROGRAM: "Magic11111111111111111111111111111111111111",
};

// Token mint addresses (Devnet)
const TOKEN_MINTS = {
  WAVE:   "6D6DjjiwtWPMCb2tkRVuTDi5esUu2rzHnhpE6z3nyskE",
  WEALTH: "Diz52amvNsWFWrA8WnwQMVxSL5asMqL8MhZVSBk8TWcz",
  USDC:   "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU",
};
```

---

## 4. Cryptographic Primitives

### Libraries Required

```json
{
  "@noble/curves": "^1.x",        // Ed25519, X25519
  "@noble/post-quantum": "^0.x",  // ML-KEM-768 (CRYSTALS-Kyber)
  "@noble/hashes": "^1.x",        // SHA-256, SHA-512
  "js-sha3": "^0.9.x"             // SHA3-256 (Keccak)
}
```

### Key Derivation Chain

```
Wallet Signature (64 bytes)
    │
    ├─ SHA3-256(signature + "oceanvault:spend") → spendPrivkey (32 bytes)
    │   └─ Ed25519 getPublicKey → spendPubkey (32 bytes)
    │
    ├─ SHA3-256(signature + "oceanvault:view") → viewPrivkey (32 bytes)
    │   └─ Ed25519 getPublicKey → viewPubkey (32 bytes)
    │
    └─ X-Wing Key Generation:
        ├─ X25519 component: Ed25519 spendPrivkey → X25519 (SHA-512 + clamp)
        │   └─ X25519 getPublicKey → x25519Pubkey (32 bytes)
        │
        └─ ML-KEM-768 component: deterministicRandom(signature, "oceanvault:xwing:mlkem", 64)
            └─ ml_kem768.keygen(seed) → mlkemPubkey (1184 bytes), mlkemSecretKey (2400 bytes)

Total X-Wing Public Key: 1216 bytes (mlkemPubkey[1184] + x25519Pubkey[32])
Total X-Wing Secret Key: 2432 bytes (mlkemSecretKey[2400] + x25519SecretKey[32])
```

### Stealth Address Derivation (for Sending)

```
recipientXWingPublicKey (1216 bytes)
    │
    └─ xwingEncapsulate(recipientPK)
        ├─ ciphertext (1120 bytes) — uploaded on-chain in deposit record
        └─ sharedSecret (32 bytes) — used for:
            ├─ stealthPubkey = SHA256(sharedSecret + "stealth-derive")   ← 32 bytes
            ├─ viewTag = sharedSecret[0]                                  ← 1 byte
            ├─ ephemeralPubkey = ciphertext[last 32 bytes]                ← 32 bytes
            └─ encryptedDestination = AES-GCM(recipient_wallet, sharedSecret) ← 48 bytes
```

### Stealth Address Verification (for Scanning/Claiming)

```
xwingCiphertext (1120 bytes from deposit record)
    │
    └─ xwingDecapsulate(mySecretKey, ciphertext) → sharedSecret (32 bytes)
        │
        └─ derivedStealth = SHA256(sharedSecret + "stealth-derive")
            │
            └─ derivedStealth == escrow.stealthPubkey?  → YES = This is our payment!
```

### Stealth Sign Message (MUST match exactly)

```
Sign this message to generate your WaveSwap stealth viewing keys.

This signature will be used to derive your private viewing keys. Never share this signature with anyone.

Domain: OceanVault:ViewingKeys:v1
```

> **CRITICAL:** This exact message string is the root of all key derivation. Changing a single character will produce different keys.

---

## 5. Key Derivation & Worker Security Model

### Web Architecture (Reference)

On web, private keys **never touch the main thread**. A Web Worker holds all secret material:

```
Main Thread                         Web Worker
┌─────────────────┐                 ┌──────────────────────────┐
│                 │  signature(64B) │                          │
│ useWaveSend()   │ ──────────────→ │ deriveKeysFromSignature() │
│                 │  (zeroed after) │                          │
│                 │ ←────────────── │ Returns PUBLIC keys only │
│                 │   pubkeys only  │                          │
│                 │                 │ Holds PRIVATE keys:      │
│                 │                 │  - spendPrivkey (32B)    │
│                 │                 │  - viewPrivkey  (32B)    │
│                 │                 │  - xwingSecretKey(2432B) │
│                 │                 │                          │
│ scanForEscrows()│ ciphertext[]   │                          │
│                 │ ──────────────→ │ xwingDecapsulate()       │
│                 │ ←────────────── │ Returns: matched indices │
│                 │  sharedSecrets  │  + sharedSecrets only    │
└─────────────────┘                 └──────────────────────────┘
```

### Mobile Adaptation

On mobile, you **cannot use Web Workers**. Options:

1. **React Native JSI + Secure Enclave** (best): Use `expo-crypto` or a native module to keep keys in device secure storage. Derive keys in a background thread.

2. **In-memory with secure cleanup** (simpler): Keep keys in a module-level variable (not React state), wipe on wallet disconnect. Not as secure as Web Worker but acceptable for mobile.

3. **expo-secure-store** for encrypted persistence: Store the wallet signature (or derived keys) encrypted in secure storage so the user doesn't need to re-sign every session.

**Recommended approach for mobile:**

```typescript
// lib/stealth-keys.ts (singleton, NOT React state)
let keys: FullKeySet | null = null;

export function initializeKeys(signature: Uint8Array): StealthPublicKeys {
  // Wipe old keys if they exist
  if (keys) wipeAllKeys(keys);
  
  keys = deriveKeysFromSignature(signature);
  
  // Zero the signature
  signature.fill(0);
  
  return {
    spendPubkey: keys.spendPubkey,
    viewPubkey: keys.viewPubkey,
    xwingPubkey: serializeXWingPublicKey(keys.xwingKeys.publicKey),
  };
}

export function getKeys(): FullKeySet | null { return keys; }
export function wipeKeys(): void { if (keys) { wipeAllKeys(keys); keys = null; } }
```

---

## 6. Registration Flow

### Purpose
Before a user can **receive** stealth payments, they must register their X-Wing public key on-chain. This is a multi-transaction process because the key is 1216 bytes (too large for a single TX).

### Steps

```
1. Initialize Keys
   └─ User signs the STEALTH_SIGN_MESSAGE
   └─ Derive spend/view/xwing keys from signature

2. Check if Already Registered
   └─ client.isRecipientRegistered(walletPubkey)
   └─ Reads on-chain Registry PDA

3. Register (Multi-TX — X-Wing Public Key Upload)
   └─ TX1: INITIALIZE_REGISTRY (or INITIALIZE_REGISTRY_GASLESS with Kora)
   │   Accounts: [payer, registryPda, systemProgram]
   │   PDA: ["registry", ownerPubkey] on REGISTRY program
   │
   └─ TX2..N: UPLOAD_KEY_CHUNK (up to 800 bytes per chunk)
   │   Accounts: [owner, registryPda]
   │   Data: chunk_offset(2) + chunk_data(variable up to 800 bytes)
   │
   └─ TX_Final: FINALIZE_REGISTRY
       Accounts: [owner, registryPda]
       Marks registry as finalized (ready to receive)
```

### Kora Gasless Registration (RECOMMENDED)

```typescript
// 1. Get Kora fee payer
const payerRes = await fetch(KORA_CONFIG.RPC_URL, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'getPayerSigner', params: [] }),
});
const koraFeePayer = payerRes.result.signer_address; // PublicKey

// 2. Get blockhash from Kora
const bhRes = await fetch(KORA_CONFIG.RPC_URL, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'getBlockhash', params: [] }),
});
const blockhash = bhRes.result.blockhash;

// 3. Build TXs with Kora as feePayer, user only signs
// 4. Submit to Kora: signAndSendTransaction(txBase64)
const submitRes = await fetch(KORA_CONFIG.RPC_URL, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    jsonrpc: '2.0', id: 1,
    method: 'signAndSendTransaction',
    params: [txBase64]
  }),
});
```

### Registry PDA Layout

```
OLD format (1260 bytes) — discriminator "REGISTRY":
  8  bytes: discriminator
  1  byte:  bump
  32 bytes: owner
  1  byte:  is_finalized
  2  bytes: bytes_written
  1216 bytes: xwing_public_key (spend[32] + view[32] + padding[1152])

NEW format (112 bytes) — discriminator "SIMPREG\0":
  8  bytes: discriminator
  1  byte:  bump
  32 bytes: owner
  1  byte:  is_finalized
  32 bytes: spend_pubkey
  32 bytes: view_pubkey
  6  bytes: reserved
```

---

## 7. Send Flow (waveSendV4 — SEQ Architecture)

This is the **active, recommended** send method. The sender signs 3 transactions in a single wallet popup.

### Pre-requisites
- Sender is connected and has initialized stealth keys
- Recipient is registered (has finalized X-Wing registry on-chain)
- Sender has sufficient balance

### Step-by-Step

#### Step 0: Pre-computation
```typescript
// 1. Fetch recipient's registry (X-Wing public key)
const registry = await client.getRegistry(recipientWallet);
const recipientXWingPk = deserializeXWingPublicKey(registry.xwingPubkey); // 1216 bytes

// 2. X-Wing encapsulate → ciphertext + sharedSecret
const { ciphertext, sharedSecret } = xwingEncapsulate(recipientXWingPk);
// ciphertext: 1120 bytes, sharedSecret: 32 bytes

// 3. Derive stealth pubkey (MUST use SHA-256, NOT SHA3-256!)
const stealthPubkey = SHA256(sharedSecret + "stealth-derive"); // 32 bytes

// 4. Extract ephemeral pubkey and view tag
const ephemeralPubkey = ciphertext.slice(-32); // last 32 bytes
const viewTag = sharedSecret[0]; // 1 byte

// 5. Encrypt destination wallet with AES-GCM
const encryptedDestination = await encryptDestinationWallet(recipientWallet.toBytes(), sharedSecret);
// 48 bytes (nonce + ciphertext + tag packed)

// 6. Get next sequential ID from PER pool
const seqId = await client.getNextSeqId(); // bigint
```

#### Step 1: Derive All PDAs (seqId-based)

```typescript
// PER mixer pool PDA (singleton)
const [perMixerPoolPda, poolBump] = findProgramAddressSync(
  ["per-mixer-pool-oceanvault"], STEALTH_PROGRAM
);

// Deposit record PDA
const seqIdBuf = Buffer.alloc(8); // LE encoding of seqId
writeBigUint64LE(seqIdBuf, seqId, 0);
const [depositRecordPda, recordBump] = findProgramAddressSync(
  ["deposit-seq", seqIdBuf], STEALTH_PROGRAM
);

// Input escrow PDA
const [escrowPda, escrowBump] = findProgramAddressSync(
  ["input-seq", seqIdBuf], STEALTH_PROGRAM
);

// Delegation PDAs (for MagicBlock PER delegation)
const [escrowBuffer] = findProgramAddressSync(["buffer", escrowPda], STEALTH_PROGRAM);
const [escrowDelegationRecord] = findProgramAddressSync(["delegation", escrowPda], DELEGATION_PROGRAM);
const [escrowDelegationMetadata] = findProgramAddressSync(["delegation-metadata", escrowPda], DELEGATION_PROGRAM);
const [permissionPda] = findProgramAddressSync(["permission:", escrowPda], PERMISSION_PROGRAM);
// ... more delegation PDAs (see config.ts for full list)
```

#### Step 2: Build TX1 — CREATE_V4_DEPOSIT_SEQ (0x3B)

```
Accounts (3):
  [0] payer (signer, writable) = wallet
  [1] deposit_record (writable) = depositRecordPda
  [2] system_program = SystemProgram

Data layout:
  [0]     1 byte:  discriminator = 0x3B
  [1-8]   8 bytes: seq_id (LE)
  [9]     1 byte:  record_bump
  [10-17] 8 bytes: amount (LE)
  [18-49] 32 bytes: stealth_pubkey
  [50-81] 32 bytes: ephemeral_pubkey
  [82]    1 byte:  view_tag
  [83-130] 48 bytes: encrypted_destination
  Total: 131 bytes
```

#### Step 3: Build TX2 — UPLOAD_V4_CIPHERTEXT (0x29)

Upload 1120-byte X-Wing ciphertext in chunks (≤800 bytes per TX).

```
Accounts (2):
  [0] owner (signer) = wallet
  [1] deposit_record (writable) = depositRecordPda

Data layout:
  [0]     1 byte:  discriminator = 0x29
  [1-2]   2 bytes: chunk_offset (LE)
  [3..]   variable: chunk_data (up to 800 bytes)

Requires 2 TXs: chunk 0 (800 bytes) + chunk 1 (320 bytes)
```

#### Step 4: Build TX3 — COMPLETE_V4_DEPOSIT_SEQ (0x3C)

```
Accounts (19!):
  [0]  payer (signer, writable) = wallet
  [1]  pool (writable) = perMixerPoolPda
  [2]  deposit_record (writable) = depositRecordPda
  [3]  escrow (writable) = escrowPda  
  [4]  escrow_buffer (writable) = escrowBuffer
  [5]  escrow_delegation_record (writable)
  [6]  escrow_delegation_metadata (writable)
  [7]  permission (writable) = permissionPda
  [8]  permission_delegation_buffer (writable)
  [9]  permission_delegation_record (writable)
  [10] permission_delegation_metadata (writable)
  [11] deposit_record_buffer (writable)
  [12] deposit_record_delegation_record (writable)
  [13] deposit_record_delegation_metadata (writable)
  [14] delegation_program = DELEGATION_PROGRAM
  [15] permission_program = PERMISSION_PROGRAM
  [16] tee_validator = TEE_VALIDATOR
  [17] magic_program = MAGIC_PROGRAM
  [18] system_program = SystemProgram

Data layout:
  [0]    1 byte:  discriminator = 0x3C
  [1-8]  8 bytes: seq_id (LE)
  [9]    1 byte:  escrow_bump
  [10]   1 byte:  pool_bump
  [11-18] 8 bytes: amount (LE)
  Total: 19 bytes
```

#### Step 5: Sign & Submit All Transactions

```typescript
// Batch sign ALL TXs with ONE wallet popup
const allTxs = [tx1, tx2_chunk1, tx2_chunk2, tx3];
const signedTxs = await wallet.signAllTransactions(allTxs);

// Submit sequentially (order matters!)
for (const signedTx of signedTxs) {
  const sig = await connection.sendRawTransaction(signedTx.serialize());
  await confirmTransactionPolling(connection, sig);
}
```

#### Step 6: Trigger Crank (Automatic)

```typescript
// Hit the crank API to process the deposit
await fetch(`${window.location.origin}/api/v1/crank`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ seq_id: seqId.toString() }),
});
```

The crank handles: `REGISTER_DEPOSIT → INPUT_TO_POOL → PREPARE_OUTPUT → POOL_TO_ESCROW`

---

## 8. Auto-Claim / Scanner Flow

### How Scanning Works

The scanner polls for `OutputEscrow` accounts (91 bytes) and `DepositRecord` accounts (1364 bytes) on both L1 (devnet) and PER (MagicBlock).

```
Phase 1: Fetch all DepositRecord accounts (1364 bytes each)
  → Filter by PERDEPRC discriminator
  → Extract ciphertext (1120 bytes starting at offset 210)
  → Extract stealthPubkey (32 bytes at offset 57)
  → Build ctMap: stealthPubkey_hex → ciphertext

Phase 2: Fetch all OutputEscrow accounts (91 bytes each)
  → Filter by OUTESCRO discriminator (8 bytes)
  → For each non-withdrawn escrow:
    → Look up ciphertext from ctMap via stealthPubkey
    → xwingDecapsulate(mySecretKey, ciphertext) → sharedSecret
    → derivedStealth = SHA256(sharedSecret + "stealth-derive")
    → IF derivedStealth == escrow.stealthPubkey → THIS IS OUR PAYMENT!
```

### OutputEscrow Account Layout (91 bytes)

```
  [0-7]   8 bytes:  discriminator "OUTESCRO"
  [8]     1 byte:   bump
  [9-40]  32 bytes: stealth_pubkey (nonce/identifier)
  [41-48] 8 bytes:  amount (LE u64)
  [49-80] 32 bytes: verified_destination (set by TEE during claim)
  [81]    1 byte:   is_verified (0 or 1)
  [82]    1 byte:   is_withdrawn (0 or 1)
  [83-90] 8 bytes:  reserved
```

### DepositRecord SEQ Account Layout (1364 bytes)

```
  [0-7]   8 bytes:  discriminator "PERDEPRC"
  [8]     1 byte:   bump
  [9-16]  8 bytes:  seq_id (LE u64)
  ...
  [57-88] 32 bytes: stealth_pubkey
  ...
  [210-1329] 1120 bytes: xwing_ciphertext
  ... remaining: metadata + reserved
```

### Claim Flow (TEE Privacy — RECOMMENDED)

```typescript
// 1. Verify locally
const derivedStealth = deriveStealthPubkeyFromSharedSecret(sharedSecret);
assert(derivedStealth === escrow.stealthPubkey);

// 2. Check if already verified on L1 (skip CLAIM step)
const escrowInfo = await connection.getAccountInfo(escrowPda);
if (escrowInfo.data[81] === 1 && escrowInfo.data[82] !== 1) {
  // Already verified, skip to WITHDRAW
  goto step4;
}

// 3. CLAIM_ESCROW_V4 (0x27) on PER
const claimData = Buffer.alloc(65);
claimData[0] = 0x27; // CLAIM_ESCROW_V4
Buffer.from(sharedSecret).copy(claimData, 1);   // sharedSecret (32 bytes)
Buffer.from(destination.toBytes()).copy(claimData, 33); // destination wallet (32 bytes)

const claimTx = new Transaction();
claimTx.add(new TransactionInstruction({
  keys: [
    { pubkey: payer, isSigner: true, isWritable: true },
    { pubkey: escrowPda, isSigner: false, isWritable: true },
    { pubkey: MAGIC_CONTEXT, isSigner: false, isWritable: true },
    { pubkey: MAGIC_PROGRAM, isSigner: false, isWritable: false },
  ],
  programId: STEALTH_PROGRAM,
  data: claimData,
}));
// Submit to MagicBlock PER RPC (not L1!)
await perConnection.sendRawTransaction(signedTx.serialize());

// 4. WITHDRAW_FROM_OUTPUT_ESCROW (0x2F) on L1 — Gasless via Kora
const withdrawData = Buffer.alloc(33);
withdrawData[0] = 0x2F;
Buffer.from(stealthPubkey).copy(withdrawData, 1);

const withdrawTx = new Transaction();
withdrawTx.add(new TransactionInstruction({
  keys: [
    { pubkey: koraFeePayer, isSigner: true, isWritable: false },
    { pubkey: escrowPda, isSigner: false, isWritable: true },
    { pubkey: destination, isSigner: false, isWritable: true },
    { pubkey: MASTER_AUTHORITY, isSigner: false, isWritable: true },
    { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
    // Optional: XWingCiphertextPda if it exists and is owned by STEALTH program
  ],
  programId: STEALTH_PROGRAM,
  data: withdrawData,
}));
// Submit gasless via Kora (user pays NOTHING)
```

### Scan Interval

```
- Default: 10 seconds
- Timeout: 15 seconds per scan
- Incremental: Uses cache to only fetch new deposits (dramatically faster after first scan)
```

---

## 9. Kora Gasless Integration

Kora (Solana Foundation) provides gasless transaction support. Used for:
- **Registration** (Kora pays rent + TX fees)
- **Withdrawal** (Receiver pays NOTHING to claim funds)

### Kora JSON-RPC Methods

```typescript
// 1. Get fee payer address
{ jsonrpc: '2.0', id: 1, method: 'getPayerSigner', params: [] }
// Response: { result: { signer_address: "..." } }

// 2. Get blockhash (Kora-compatible)
{ jsonrpc: '2.0', id: 1, method: 'getBlockhash', params: [] }
// Response: { result: { blockhash: "..." } }

// 3. Sign and send transaction
{ jsonrpc: '2.0', id: 1, method: 'signAndSendTransaction', params: [txBase64] }
// Response: { result: { signed_transaction: "base64..." } }
// NOTE: Kora returns the signed TX, you need to extract the signature from bytes 1-64
```

### Extracting Signature from Kora Response

```typescript
const signedTxBytes = Buffer.from(koraResult.signed_transaction, 'base64');
const signatureBytes = signedTxBytes.slice(1, 65); // byte 0 = sig count, 1-64 = feePayer sig
// Convert to base58 for explorer links
const bs58Chars = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
let sig = '', num = BigInt(0);
for (const byte of signatureBytes) num = num * BigInt(256) + BigInt(byte);
while (num > 0) { sig = bs58Chars[Number(num % BigInt(58))] + sig; num /= BigInt(58); }
```

---

## 10. PDA Derivation Reference

All PDAs are derived as `PublicKey.findProgramAddressSync(seeds, programId)`.

| PDA | Seeds | Program |
|---|---|---|
| Registry | `["registry", owner]` | REGISTRY |
| Announcement | `["announcement", nonce]` | STEALTH |
| Stealth Vault | `["stealth_vault", stealthPubkey]` | STEALTH |
| PER Mixer Pool | `["per-mixer-pool-oceanvault"]` | STEALTH |
| Deposit Record SEQ | `["deposit-seq", seqId(8B LE)]` | STEALTH |
| Input Escrow SEQ | `["input-seq", seqId(8B LE)]` | STEALTH |
| Output Escrow | `["output-escrow", stealthPubkey]` | STEALTH |
| Claim Escrow | `["claim-escrow", nonce]` | STEALTH |
| X-Wing Ciphertext | `["xwing-ct", escrowPda]` | STEALTH |
| Escrow Buffer | `["buffer", escrowPda]` | STEALTH |
| Delegation Record | `["delegation", account]` | DELEGATION |
| Delegation Metadata | `["delegation-metadata", account]` | DELEGATION |
| Permission | `["permission:", account]` | PERMISSION |
| Tee Public Registry | `["tee-pubkey", owner]` | STEALTH |
| Tee Secret Store | `["tee-secret", owner]` | STEALTH |
| Pool Deposit | `["pool-deposit", nonce]` | STEALTH |

---

## 11. Instruction Discriminators

### Active (WAVETEK V4 SEQ — use these for new code)

| Name | Hex | Decimal | Description |
|---|---|---|---|
| `CREATE_V4_DEPOSIT_SEQ` | `0x3B` | 59 | Create deposit record with seq_id |
| `UPLOAD_V4_CIPHERTEXT` | `0x29` | 41 | Upload X-Wing ciphertext chunks |
| `COMPLETE_V4_DEPOSIT_SEQ` | `0x3C` | 60 | Create input escrow + delegate |
| `REGISTER_DEPOSIT` | `0x3A` | 58 | Mark deposit ready (crank) |
| `INPUT_TO_POOL_SEQ` | `0x3D` | 61 | Input escrow → Pool (crank) |
| `PREPARE_OUTPUT_SEQ` | `0x40` | 64 | Create output escrow (crank) |
| `POOL_TO_ESCROW_SEQ` | `0x3E` | 62 | Pool → Output escrow (crank) |
| `CLAIM_ESCROW_V4` | `0x27` | 39 | Claim via TEE on PER |
| `WITHDRAW_FROM_OUTPUT_ESCROW` | `0x2F` | 47 | Withdraw from output escrow on L1 |

### Registry Discriminators

| Name | Buffer (8 bytes) |
|---|---|
| `INITIALIZE_REGISTRY` | `[0x01, 0, 0, 0, 0, 0, 0, 0]` |
| `UPLOAD_KEY_CHUNK` | `[0x02, 0, 0, 0, 0, 0, 0, 0]` |
| `FINALIZE_REGISTRY` | `[0x03, 0, 0, 0, 0, 0, 0, 0]` |
| `INITIALIZE_REGISTRY_GASLESS` | `[0x08, 0, 0, 0, 0, 0, 0, 0]` |

---

## 12. Type Definitions

### `WaveSendParams`

```typescript
interface WaveSendParams {
  recipientWallet: PublicKey;
  amount: bigint;       // in lamports (1 SOL = 1_000_000_000)
  mint?: PublicKey;      // undefined = SOL
}
```

### `SendResult`

```typescript
interface SendResult {
  success: boolean;
  signature?: string;       // L1 transaction signature
  error?: string;
  stealthPubkey?: Uint8Array;
  ephemeralPubkey?: Uint8Array;
  viewTag?: number;
  vaultPda?: PublicKey;
  escrowPda?: PublicKey;
  isV4?: boolean;           // true for WAVETEK V4
}
```

### `UseWaveSendReturn` (Hook interface)

```typescript
interface UseWaveSendReturn {
  // State
  isInitialized: boolean;    // Keys derived
  isRegistered: boolean;     // On-chain registry exists
  isPoolRegistered: boolean; // Pool Registry status
  isLoading: boolean;
  isSending: boolean;
  error: string | null;
  registrationProgress: RegistrationProgress | null;

  // Actions
  initializeKeys: () => Promise<boolean>;
  register: () => Promise<boolean>;
  send: (params: { recipientAddress: string; amount: string; tokenMint?: string }) => Promise<SendResult>;
  checkRecipientRegistered: (address: string) => Promise<boolean>;
  claimByVault: (vaultAddress: string, stealthPubkey: Uint8Array) => Promise<{ success: boolean; signature?: string; error?: string }>;
  
  // Pool Registry Methods
  registerPoolRegistry: () => Promise<boolean>;
  sendViaPool: (recipientAddress: string, amount: string) => Promise<SendResult>;
  checkPoolRegistered: (address: string) => Promise<boolean>;

  clearError: () => void;
}
```

### `StealthKeyPair`

```typescript
interface StealthKeyPair {
  spendPrivkey: Uint8Array; // 32 bytes
  spendPubkey: Uint8Array;  // 32 bytes
  viewPrivkey: Uint8Array;  // 32 bytes
  viewPubkey: Uint8Array;   // 32 bytes
  xwingKeys?: XWingKeyPair;
}

interface XWingKeyPair {
  publicKey: XWingPublicKey;
  secretKey: XWingSecretKey;
}

interface XWingPublicKey {
  mlkem: Uint8Array;   // 1184 bytes
  x25519: Uint8Array;  // 32 bytes
}

interface XWingSecretKey {
  mlkem: Uint8Array;   // 2400 bytes
  x25519: Uint8Array;  // 32 bytes
}
```

---

## 13. Mobile-Specific Adaptations

### What to Reuse As-Is

The entire `lib/stealth/` directory is **mostly portable** to React Native:
- `config.ts` — Constants, PDA derivations (uses `@solana/web3.js`)
- `types.ts` — Pure TypeScript interfaces
- `crypto.ts` — Uses `@noble/*` libraries (pure JS, no browser APIs except AES-GCM)
- `xwing.ts` — Uses `@noble/post-quantum` (pure JS)
- `scanner.ts` — Uses `@solana/web3.js` Connection (works on mobile)
- `client.ts` — `WaveStealthClient` class (core logic, all portable)

### What Needs Adaptation

| Component | Web | Mobile Approach |
|---|---|---|
| **Web Worker** | `stealth-worker.ts` + `stealth-worker-client.ts` | Replace with in-memory singleton module. Use `expo-secure-store` for persistence. |
| **AES-GCM** | `crypto.subtle` (Web Crypto API) | Use `react-native-quick-crypto` or `expo-crypto` |
| **Wallet Adapter** | `@solana/wallet-adapter-react` | Use Mobile Wallet Adapter (MWA) or app's internal wallet |
| **RPC Proxy** | Next.js API routes (`/api/v1/rpc`) | Direct RPC calls or separate backend service |
| **PER RPC Proxy** | Next.js API route (`/api/v1/per-rpc`) | Direct calls to `https://devnet-as.magicblock.app` |
| **Crank Trigger** | `fetch(/api/v1/crank)` | Call crank endpoint directly |
| **Toast Notifications** | `sonner` | Use React Native toast library |
| **Buffer Polyfill** | Available in Next.js | Need `buffer` polyfill for React Native |

### AES-GCM Replacement for Mobile

The `encryptDestinationWallet` and `decryptDestinationWallet` functions use Web Crypto API (`crypto.subtle.encrypt/decrypt`). For React Native:

```typescript
// Option 1: react-native-quick-crypto (recommended)
import { createCipheriv, createDecipheriv, randomBytes } from 'react-native-quick-crypto';

export function encryptDestinationWallet(
  destination: Uint8Array,
  sharedSecret: Uint8Array
): Uint8Array {
  const nonce = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', sharedSecret, nonce);
  const encrypted = Buffer.concat([cipher.update(destination), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([nonce, encrypted, tag]); // 12 + 32 + 16 = 60 bytes → packed to 48
}

// Option 2: Use @noble/ciphers if available
import { gcm } from '@noble/ciphers/aes';
```

### Transaction Confirmation (Avoid WebSocket)

Both hooks use HTTP polling instead of WebSocket-based confirmation to avoid connectivity issues:

```typescript
async function confirmTransactionPolling(
  connection: Connection,
  signature: string,
  maxAttempts = 6,
  intervalMs = 500
): Promise<boolean> {
  for (let i = 0; i < maxAttempts; i++) {
    const status = await connection.getSignatureStatus(signature);
    if (status?.value?.confirmationStatus === 'confirmed' ||
        status?.value?.confirmationStatus === 'finalized') {
      return true;
    }
    if (status?.value?.err) return false;
    await new Promise(r => setTimeout(r, intervalMs));
  }
  return true; // Optimistic return
}
```

---

## 14. Dependencies

### NPM Packages for Mobile

```json
{
  "@solana/web3.js": "^1.x",
  "@solana/spl-token": "^0.4.x",
  "@noble/curves": "^1.x",
  "@noble/hashes": "^1.x",
  "@noble/post-quantum": "^0.x",
  "js-sha3": "^0.9.x",
  "buffer": "^6.x",
  "react-native-quick-crypto": "^0.x"
}
```

### React Native Polyfills

```typescript
// In your app entry point (before any crypto code):
import { Buffer } from 'buffer';
global.Buffer = Buffer;

// If using @solana/web3.js, you may also need:
import 'react-native-url-polyfill/auto';
```

---

## 15. Step-by-Step Implementation Checklist

### Phase 1: Core Library Setup

- [ ] Copy `lib/stealth/config.ts` → portable as-is
- [ ] Copy `lib/stealth/types.ts` → portable as-is
- [ ] Copy `lib/stealth/crypto.ts` → replace `crypto.subtle` with RN crypto
- [ ] Copy `lib/stealth/xwing.ts` → portable as-is (uses `@noble/*`)
- [ ] Create `lib/stealth/keys.ts` → singleton key manager (replaces Web Worker)
- [ ] Copy `lib/stealth/client.ts` → replace fetch URLs, remove `window.location`
- [ ] Copy `lib/stealth/scanner.ts` → portable as-is
- [ ] Copy `lib/stealth/per-privacy.ts` → update RPC URLs
- [ ] Create `lib/stealth/index.ts` → re-export everything

### Phase 2: Hooks

- [ ] Create `hooks/useWaveSend.ts` — port from web, replace Worker with key singleton
- [ ] Create `hooks/useAutoClaim.ts` — port from web, replace Worker calls
- [ ] Connect to mobile wallet adapter (MWA or internal wallet)

### Phase 3: UI Screens

- [ ] **Token Selection Screen** — select SOL/WAVE/WEALTH/USDC
- [ ] **Recipient Input Screen** — paste address, check registration status
- [ ] **Amount Input Screen** — enter amount, show balance
- [ ] **Send Confirmation Screen** — initialize keys if needed, register if needed, send
- [ ] **Incoming Payments Screen** — show scanned escrows, claim buttons
- [ ] **Transaction History** — show claim history

### Phase 4: Background Services

- [ ] Background scanning interval (10s) for incoming payments
- [ ] Push notification on detected incoming payment
- [ ] Auto-claim via TEE + Kora gasless withdrawal

### Phase 5: Testing

- [ ] Test registration on devnet
- [ ] Test send SOL between two wallets
- [ ] Test scanning and detecting incoming payments
- [ ] Test claim via TEE + Kora withdrawal
- [ ] Test key persistence across app restarts
- [ ] Test wallet disconnect → key wipe

---

## Important Notes

> [!CAUTION]
> **DO NOT** modify the stealth sign message, key derivation domain strings, or SHA hash algorithms. These must match the on-chain program exactly or derived keys will be wrong and funds will be **permanently unrecoverable**.

> [!CAUTION]
> **DO NOT** use SHA3-256 for `deriveStealthPubkeyFromSharedSecret`. The on-chain program uses **SHA-256** (`pinocchio::sha256::hashv`). The JS code uses `@noble/hashes/sha256`.

> [!WARNING]
> **DO NOT** cache private keys in React state or AsyncStorage. Use a module-level singleton or secure enclave.

> [!TIP]
> **DO** use `signAllTransactions` to batch-sign all send TXs in a single wallet popup.
> **DO** use HTTP polling for transaction confirmation (not WebSocket).
> **DO** implement Kora gasless for registration and claiming (receiver pays NOTHING).

---

## 16. Step-by-Step Integration (Expo + NativeWind)

> **Your setup:** Expo app with NativeWind, user can already reach the home page (not yet designed).
> Below is the exact order to follow. Each step must be completed before the next.

---

### Step 1 — Install Polyfills & Crypto Dependencies

React Native doesn't ship with Node.js `Buffer`, `crypto`, or `URL`. Install these **before any Solana or stealth code**.

```bash
npx expo install expo-crypto expo-secure-store
npm install buffer react-native-url-polyfill react-native-get-random-values @noble/curves @noble/hashes @noble/post-quantum js-sha3
npm install react-native-quick-crypto  # AES-GCM replacement for Web Crypto API
```

Then create a **polyfill file** that runs before anything else:

```typescript
// src/polyfills.ts — IMPORT THIS FIRST in app/_layout.tsx
import 'react-native-get-random-values';     // Must be first (randomBytes)
import 'react-native-url-polyfill/auto';       // URL constructor
import { Buffer } from 'buffer';
global.Buffer = Buffer;
```

In your root layout:
```typescript
// app/_layout.tsx
import '../src/polyfills';   // ← VERY FIRST LINE, before any other imports
import { Stack } from 'expo-router';
// ...rest of layout
```

> **Checkpoint:** App still boots to home page. Run `npx expo start` and confirm no crashes.

---

### Step 2 — Install Solana Dependencies

```bash
npm install @solana/web3.js@1 @solana/spl-token bs58
```

> [!NOTE]
> Use `@solana/web3.js` v1 (not v2). The stealth SDK is written for v1 APIs (`Connection`, `Transaction`, `PublicKey`, `Keypair`, etc).

Create a connection singleton:

```typescript
// src/lib/solana/connection.ts
import { Connection } from '@solana/web3.js';

const RPC_URL = 'https://api.devnet.solana.com';  // or your custom RPC
const PER_URL = 'https://devnet-as.magicblock.app';

export const connection = new Connection(RPC_URL, { commitment: 'confirmed' });
export const perConnection = new Connection(PER_URL, { commitment: 'confirmed' });
```

> **Checkpoint:** Import `connection` somewhere and call `connection.getSlot()`. It should return a number.

---

### Step 3 — Copy the Stealth Library

Copy these files from `apps/web/src/lib/stealth/` → your Expo app `src/lib/stealth/`:

| # | File | Changes Needed |
|---|---|---|
| 1 | `config.ts` | ✅ None — all pure JS constants + `@solana/web3.js` PDAs |
| 2 | `types.ts` | ✅ None — pure TypeScript interfaces |
| 3 | `xwing.ts` | ✅ None — uses `@noble/*` (pure JS) |
| 4 | `crypto.ts` | ⚠️ Replace `crypto.subtle.encrypt/decrypt` with `react-native-quick-crypto` (see Step 4) |
| 5 | `scanner.ts` | ✅ None — uses `Connection.getProgramAccounts()` |
| 6 | `client.ts` | ⚠️ Remove `window.location`, replace Worker refs (see Step 5) |
| 7 | `per-privacy.ts` | ⚠️ Hardcode PER URL instead of `/api/v1/per-rpc` proxy |
| 8 | `index.ts` | ✅ Update re-exports to match new file structure |

**Do NOT copy** `stealth-worker.ts` or `stealth-worker-client.ts` — these are Web Worker files. You'll replace them in Step 5.

> **Checkpoint:** All files compile without errors (fix any import paths). `npx expo start` still boots.

---

### Step 4 — Fix AES-GCM in `crypto.ts`

The web version uses `crypto.subtle.encrypt('AES-GCM', ...)`. React Native doesn't have `crypto.subtle`. Replace the two functions:

```typescript
// In src/lib/stealth/crypto.ts — replace encryptDestinationWallet and decryptDestinationWallet

import { createCipheriv, createDecipheriv, randomBytes } from 'react-native-quick-crypto';

export async function encryptDestinationWallet(
  destination: Uint8Array,  // 32-byte wallet pubkey
  sharedSecret: Uint8Array  // 32-byte X-Wing shared secret
): Promise<Uint8Array> {
  const nonce = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', Buffer.from(sharedSecret), Buffer.from(nonce));
  const encrypted = Buffer.concat([
    cipher.update(Buffer.from(destination)),
    cipher.final()
  ]);
  const tag = cipher.getAuthTag();
  // Pack: encrypted(32) + tag(16) = 48 bytes (nonce is derived from sharedSecret on-chain)
  return new Uint8Array(Buffer.concat([encrypted, tag]));
}

export async function decryptDestinationWallet(
  encryptedData: Uint8Array,  // 48-byte packed ciphertext
  sharedSecret: Uint8Array
): Promise<Uint8Array> {
  const encrypted = encryptedData.slice(0, 32);
  const tag = encryptedData.slice(32, 48);
  // Derive nonce from sharedSecret (first 12 bytes)
  const nonce = sharedSecret.slice(0, 12);
  const decipher = createDecipheriv('aes-256-gcm', Buffer.from(sharedSecret), Buffer.from(nonce));
  decipher.setAuthTag(Buffer.from(tag));
  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(encrypted)),
    decipher.final()
  ]);
  return new Uint8Array(decrypted);
}
```

> [!IMPORTANT]
> Compare with the web `crypto.ts` to make sure the nonce derivation matches exactly. The web version derives nonce from `sharedSecret.slice(0, 12)` inside the encrypt function.

> **Checkpoint:** `encryptDestinationWallet` and `decryptDestinationWallet` can round-trip a 32-byte buffer.

---

### Step 5 — Create the Key Manager (Replaces Web Worker)

Instead of a Web Worker, create a **module-level singleton** that holds keys in memory:

```typescript
// src/lib/stealth/key-manager.ts
import { generateViewingKeys, StealthKeyPair } from './crypto';
import { serializeXWingPublicKey } from './xwing';
import * as SecureStore from 'expo-secure-store';

// ═══════ PRIVATE STATE (never export the keys directly) ═══════
let keys: StealthKeyPair | null = null;

export interface StealthPublicKeys {
  spendPubkey: Uint8Array;
  viewPubkey: Uint8Array;
  xwingPubkey: Uint8Array;
}

// Initialize keys from wallet signature
export function initializeKeys(signature: Uint8Array): StealthPublicKeys {
  if (keys) wipeKeys();

  keys = generateViewingKeys(signature);

  // Zero the signature immediately (root seed)
  signature.fill(0);

  return {
    spendPubkey: new Uint8Array(keys.spendPubkey),
    viewPubkey: new Uint8Array(keys.viewPubkey),
    xwingPubkey: serializeXWingPublicKey(keys.xwingKeys!.publicKey),
  };
}

// Get keys (for scanner, client, etc)
export function getKeys(): StealthKeyPair | null { return keys; }

// Check if initialized
export function isReady(): boolean { return keys !== null; }

// Get public keys only (safe to expose)
export function getPublicKeys(): StealthPublicKeys | null {
  if (!keys) return null;
  return {
    spendPubkey: new Uint8Array(keys.spendPubkey),
    viewPubkey: new Uint8Array(keys.viewPubkey),
    xwingPubkey: serializeXWingPublicKey(keys.xwingKeys!.publicKey),
  };
}

// Securely wipe all key material
export function wipeKeys(): void {
  if (!keys) return;
  keys.spendPrivkey.fill(0);
  keys.viewPrivkey.fill(0);
  if (keys.xwingKeys) {
    keys.xwingKeys.secretKey.mlkem.fill(0);
    keys.xwingKeys.secretKey.x25519.fill(0);
  }
  keys = null;
}

// Persist public keys to SecureStore (so we know registration status across app restarts)
export async function cachePublicKeys(walletAddress: string, pubKeys: StealthPublicKeys) {
  await SecureStore.setItemAsync(
    `stealth_pubkeys_${walletAddress}`,
    JSON.stringify({
      spend: Buffer.from(pubKeys.spendPubkey).toString('hex'),
      view: Buffer.from(pubKeys.viewPubkey).toString('hex'),
      xwing: Buffer.from(pubKeys.xwingPubkey).toString('hex'),
    })
  );
}
```

> **Checkpoint:** Import `key-manager.ts`, call `initializeKeys(someFakeBytes)`, then `isReady()` returns `true`. Call `wipeKeys()`, `isReady()` returns `false`.

---

### Step 6 — Update `client.ts` for Mobile

Search and replace these patterns in your copied `client.ts`:

| Find | Replace With |
|---|---|
| `StealthWorkerClient.getInstance()` | `import * as KeyManager from './key-manager'` |
| `this.worker?.init(signature)` | `KeyManager.initializeKeys(signature)` |
| `this.worker?.checkEscrows(deposits)` | Use `scanForEscrowsV4()` from `scanner.ts` directly (pass `getKeys()` instead of worker) |
| `this.worker?.getRegistrationKey()` | `KeyManager.getPublicKeys()?.xwingPubkey` |
| `this.worker?.wipe()` | `KeyManager.wipeKeys()` |
| `window.location.origin` | Your crank API URL constant (e.g. `CRANK_API_URL`) |
| `fetch('/api/v1/...')` | Direct fetch to the actual endpoint URL |

> **Checkpoint:** `WaveStealthClient` instantiates without errors. `new WaveStealthClient(connection)` works.

---

### Step 7 — Set Up Wallet Integration

For your mobile wallet, you need an adapter that provides:
- `publicKey: PublicKey`
- `signMessage(message: Uint8Array): Promise<Uint8Array>`
- `signTransaction(tx: Transaction): Promise<Transaction>`
- `signAllTransactions(txs: Transaction[]): Promise<Transaction[]>`

If you're building an **embedded wallet** (keys stored on device):

```typescript
// src/lib/wallet/wallet-adapter.ts
import { Keypair, Transaction, PublicKey } from '@solana/web3.js';
import * as SecureStore from 'expo-secure-store';
import { sign } from '@noble/curves/ed25519';

export class MobileWalletAdapter {
  private keypair: Keypair;

  constructor(keypair: Keypair) {
    this.keypair = keypair;
  }

  get publicKey(): PublicKey {
    return this.keypair.publicKey;
  }

  async signMessage(message: Uint8Array): Promise<Uint8Array> {
    return sign(message, this.keypair.secretKey.slice(0, 32));
  }

  async signTransaction(tx: Transaction): Promise<Transaction> {
    tx.sign(this.keypair);
    return tx;
  }

  async signAllTransactions(txs: Transaction[]): Promise<Transaction[]> {
    return txs.map(tx => { tx.sign(this.keypair); return tx; });
  }
}
```

If using **Mobile Wallet Adapter (MWA)** for external wallets (Phantom, Solflare):

```bash
npm install @solana-mobile/mobile-wallet-adapter-protocol
```

> **Checkpoint:** You can call `wallet.signMessage(new TextEncoder().encode("test"))` and get back a signature.

---

### Step 8 — Port `useWaveSend` Hook

Create `src/hooks/useWaveSend.ts`. Key changes from web version:

```typescript
// src/hooks/useWaveSend.ts
import { useState, useCallback, useEffect } from 'react';
import { WaveStealthClient } from '../lib/stealth/client';
import * as KeyManager from '../lib/stealth/key-manager';
import { connection } from '../lib/solana/connection';
import { useWallet } from './useWallet'; // your mobile wallet hook

const STEALTH_SIGN_MESSAGE = `Sign this message to generate your WaveSwap stealth viewing keys.

This signature will be used to derive your private viewing keys. Never share this signature with anyone.

Domain: OceanVault:ViewingKeys:v1`;

export function useWaveSend() {
  const { wallet } = useWallet();
  const [isInitialized, setIsInitialized] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const client = new WaveStealthClient(connection);

  // Check registration on wallet connect
  useEffect(() => {
    if (!wallet?.publicKey) return;
    client.isRecipientRegistered(wallet.publicKey)
      .then(setIsRegistered)
      .catch(() => {});
  }, [wallet?.publicKey]);

  const initializeKeys = useCallback(async (): Promise<boolean> => {
    if (!wallet) return false;
    setIsLoading(true);
    try {
      const msg = new TextEncoder().encode(STEALTH_SIGN_MESSAGE);
      const signature = await wallet.signMessage(msg);
      const pubKeys = KeyManager.initializeKeys(new Uint8Array(signature));

      // Pass keys to client
      client.setStealthKeys({
        spendPubkey: pubKeys.spendPubkey,
        viewPubkey: pubKeys.viewPubkey,
        xwingPubkey: pubKeys.xwingPubkey,
        // Private keys accessed internally via KeyManager.getKeys()
      });

      setIsInitialized(true);
      return true;
    } catch (e: any) {
      setError(e.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [wallet]);

  const register = useCallback(async (): Promise<boolean> => {
    // Call client.register() or client.registerSimple()
    // Uses Kora gasless — see Section 6
    // ...
  }, [wallet, isInitialized]);

  const send = useCallback(async (params: {
    recipientAddress: string;
    amount: string;
    tokenMint?: string;
  }) => {
    // Call client.waveSendV4()
    // See Section 7 for full flow
    // ...
  }, [wallet, isInitialized]);

  return { isInitialized, isRegistered, isLoading, isSending, error, initializeKeys, register, send };
}
```

> **Checkpoint:** Hook mounts without error. `initializeKeys()` prompts the wallet, derives keys, `isInitialized` becomes `true`.

---

### Step 9 — Port `useAutoClaim` Hook

Create `src/hooks/useAutoClaim.ts`. Key changes:

- Replace `StealthWorkerClient` calls with `scanForEscrowsV4(connection, KeyManager.getKeys()!, perConnection)`
- Replace `setInterval` with a React Native-friendly interval (use `useEffect` + `setInterval` or `expo-task-manager` for background)
- Use `KeyManager.getKeys()` instead of worker for X-Wing decapsulation

```typescript
// Scanning loop
useEffect(() => {
  if (!isInitialized) return;
  
  const interval = setInterval(async () => {
    const keys = KeyManager.getKeys();
    if (!keys) return;
    
    const escrows = await scanForEscrowsV4(connection, keys, perConnection, scanCache);
    const ours = escrows.filter(e => e.isOurs && !e.isWithdrawn);
    setPendingClaims(ours);
  }, 10_000); // 10 seconds
  
  return () => clearInterval(interval);
}, [isInitialized]);
```

> **Checkpoint:** After initialization, scan returns an array (empty is fine if no payments sent yet).

---

### Step 10 — Build the Home Screen (Phantom-style)

Now design your home screen with NativeWind. Phantom's layout has:

```
┌──────────────────────────────────┐
│  🔒 Privacy Badge     ⚙️ Gear   │  ← Top bar
│                                  │
│         $XX.XX                   │  ← Total balance  
│        +X.X% ↑                   │  ← 24h change
│                                  │
│  [Receive] [Send] [Swap] [Buy]   │  ← Action buttons row
│                                  │
│  ── Tokens ──────────────────    │
│  SOL          XX.XX    $XX.XX    │  ← Token list
│  WAVE         XX.XX    $XX.XX    │
│  USDC         XX.XX    $XX.XX    │
│                                  │
│  ── Pending Claims (if any) ──   │  ← WaveSend-specific
│  ✉️ Incoming: 0.5 SOL  [Claim]  │
└──────────────────────────────────┘
│  🏠 Home  📤 Send  🔄 Swap  ⚙️  │  ← Tab bar
└──────────────────────────────────┘
```

**Key components to build:**

1. **`BalanceCard`** — fetch SOL + token balances via `connection.getBalance()` and `getTokenAccountsByOwner()`
2. **`ActionButtons`** — row of circular buttons. **Send** button navigates to the Send flow
3. **`TokenList`** — `FlatList` showing all tokens with Jupiter icon URLs (`https://img.icons8.com/...` or `cdn.jsdelivr.net`)
4. **`PendingClaims`** — shows results from `useAutoClaim` hook

> **Checkpoint:** Home screen renders with balance and action buttons. Pressing "Send" navigates forward.

---

### Step 11 — Build the Send Flow Screens

Create these screens using `expo-router`:

```
app/
  (tabs)/
    send/
      _layout.tsx        ← Stack navigator for send flow
      index.tsx          ← Token selection
      recipient.tsx      ← Paste/scan address
      amount.tsx         ← Enter amount
      confirm.tsx        ← Review + Init + Register + Send
      success.tsx        ← Transaction confirmation
```

**Screen flow:**

1. **Token Selection (`index.tsx`)** — Show user's tokens, tap to select
2. **Recipient (`recipient.tsx`)** — Text input for address, validate with `PublicKey.isOnCurve()`, check if recipient is registered via `client.getRegistry()`
3. **Amount (`amount.tsx`)** — Numeric keypad, show max balance, handle SOL rent-exempt minimum
4. **Confirm (`confirm.tsx`)** — Show summary, then:
   - IF not initialized → show "Initialize Keys" button → calls `initializeKeys()`
   - IF not registered → show "Register" button → calls `register()`
   - Show "Send Privately" button → calls `send()`
5. **Success (`success.tsx`)** — Show checkmark, transaction signature, Solscan link

> **Checkpoint:** Full flow from token selection to confirm screen works. Send button triggers the actual `waveSendV4` call on devnet.

---

### Step 12 — Add Incoming Payments UI

Create a screen or modal for incoming stealth payments:

```
app/
  (tabs)/
    activity/
      index.tsx          ← Shows pending claims + history
```

This screen uses `useAutoClaim`:
- List pending `OutputEscrow` payments (amount, stealth pubkey truncated)
- "Claim" button per item → calls `claimViaTEE()` on PER, then `withdrawFromOutputEscrow()` on L1 via Kora
- Show claimed history with Solscan links

> **Checkpoint:** After sending SOL from another wallet, this screen detects the incoming payment within ~20 seconds and shows a "Claim" button.

---

### Step 13 — Test End-to-End on Devnet

| Test | How | Expected |
|---|---|---|
| **Init keys** | Tap "Initialize" → sign message | Keys derived, `isInitialized = true` |
| **Register** | Tap "Register" (gasless via Kora) | Registry PDA created on-chain, `isRegistered = true` |
| **Send SOL** | Send 0.01 SOL to another registered wallet | 4 TXs signed + submitted, crank triggered |
| **Scan** | Wait 10-20s on receiver's app | Incoming payment appears in Activity tab |
| **Claim** | Tap "Claim" on incoming payment | TEE claim on PER → Kora gasless withdrawal → SOL in wallet |
| **Disconnect** | Disconnect wallet | Keys wiped, `isInitialized = false` |
| **Re-connect** | Connect same wallet, re-initialize | Same keys derived (deterministic from signature) |

> [!IMPORTANT]
> For testing, you need **two wallets** both registered on devnet. Use the web app to register the second wallet, or register both from the mobile app.

---

### Step 14 — Production Hardening

Once the above all works:

- [ ] Add error boundaries and retry logic for failed TXs
- [ ] Add loading skeletons and progress indicators during send (4 TXs + crank can take 15-30s)
- [ ] Add `expo-task-manager` for background scanning when app is minimized
- [ ] Add push notifications for incoming payments
- [ ] Store `isRegistered` flag in `expo-secure-store` to avoid re-checking every app open
- [ ] Add transaction history persistence (local SQLite or your backend)
- [ ] Add biometric lock for key initialization (FaceID/TouchID before signing)
- [ ] Rate-limit RPC calls to avoid devnet throttling
