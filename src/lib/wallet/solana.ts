/**
 * Solana Wallet Utilities
 *
 * Low-level functions for mnemonic generation, HD key derivation,
 * and private key import. Solana-only, no persistence.
 *
 * Derivation path: m/44'/501'/{index}'/0'  (Phantom / Solflare standard)
 */

import { generateMnemonic as bip39Generate, mnemonicToSeedSync, validateMnemonic as bip39Validate } from "bip39";
import { hmac } from "@noble/hashes/hmac";
import { sha512 } from "@noble/hashes/sha2";
import { Keypair, PublicKey } from "@solana/web3.js";
import bs58 from "bs58";

// ─── SLIP-0010 HD Key Derivation (replaces ed25519-hd-key) ──────────
// Pure JS implementation — no Node.js stream dependency.

const ED25519_SEED = new TextEncoder().encode("ed25519 seed");

interface DerivedKey {
    key: Uint8Array;
    chainCode: Uint8Array;
}

function getMasterKeyFromSeed(seed: string): DerivedKey {
    const h = hmac(sha512, ED25519_SEED, hexToBytes(seed));
    return {
        key: h.slice(0, 32),
        chainCode: h.slice(32),
    };
}

function deriveChild(parent: DerivedKey, index: number): DerivedKey {
    // Hardened child: 0x00 || key || index (big-endian, with 0x80000000 flag)
    const data = new Uint8Array(37);
    data[0] = 0x00;
    data.set(parent.key, 1);
    data[33] = (index >>> 24) & 0xff;
    data[34] = (index >>> 16) & 0xff;
    data[35] = (index >>> 8) & 0xff;
    data[36] = index & 0xff;

    const h = hmac(sha512, parent.chainCode, data);
    return {
        key: h.slice(0, 32),
        chainCode: h.slice(32),
    };
}

function derivePath(path: string, seedHex: string): DerivedKey {
    const segments = path
        .split("/")
        .slice(1) // drop "m"
        .map((s) => {
            const clean = s.replace("'", "");
            return parseInt(clean, 10) + 0x80000000; // all hardened
        });

    let derived = getMasterKeyFromSeed(seedHex);
    for (const segment of segments) {
        derived = deriveChild(derived, segment);
    }
    return derived;
}

function hexToBytes(hex: string): Uint8Array {
    const bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i < hex.length; i += 2) {
        bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
    }
    return bytes;
}

// ─── Mnemonic ───────────────────────────────────────────────────────

/** Generate a new 12-word BIP39 mnemonic */
export function generateMnemonic(): string {
    return bip39Generate(128); // 128 bits → 12 words
}

/** Validate a BIP39 mnemonic phrase */
export function validateMnemonic(phrase: string): boolean {
    return bip39Validate(phrase.trim().toLowerCase());
}

// ─── Key Derivation ─────────────────────────────────────────────────

/** Standard Solana HD derivation path */
function getDerivationPath(index: number): string {
    return `m/44'/501'/${index}'/0'`;
}

/**
 * Derive a Solana Keypair from a mnemonic + account index.
 *
 * @param mnemonic  - 12-word BIP39 phrase
 * @param index     - account index (0 = first account)
 * @returns Solana Keypair
 */
export function deriveKeypair(mnemonic: string, index: number = 0): Keypair {
    const seed = mnemonicToSeedSync(mnemonic.trim().toLowerCase(), "");
    const path = getDerivationPath(index);
    const derived = derivePath(path, seed.toString("hex"));
    return Keypair.fromSeed(new Uint8Array(derived.key));
}

// ─── Private Key Import ─────────────────────────────────────────────

/**
 * Import a Keypair from a base58-encoded secret key (64 bytes).
 * This is the format Phantom exports.
 *
 * @param base58Key - bs58-encoded secret key string
 * @returns Solana Keypair
 * @throws if the key is invalid
 */
export function keypairFromPrivateKey(base58Key: string): Keypair {
    const decoded = bs58.decode(base58Key.trim());
    return Keypair.fromSecretKey(decoded);
}

// ─── Address Utilities ──────────────────────────────────────────────

/** Check if a string is a valid Solana address */
export function isValidAddress(address: string): boolean {
    try {
        const pk = new PublicKey(address);
        return PublicKey.isOnCurve(pk.toBytes());
    } catch {
        return false;
    }
}

/** Shorten an address for display: "7xKX...3nFv" */
export function shortenAddress(address: string, chars: number = 4): string {
    if (address.length <= chars * 2 + 3) return address;
    return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}
