// OceanVault Program IDs (Devnet) — MUST match deployed programs
const PROGRAM_IDS = {
  REGISTRY: 'DgoW9MneWt6B3mBZqDf52csXMtJpgqwaHgP46tPs1tWu', // Stealth key registry
  STEALTH: '4jFg8uSh4jWkeoz6itdbsD7GadkTYLwfbyfDeNeB5nFX', // Stealth transfers + mixer pool
  DEFI: '8Xi4D44Xt3DnT6r8LogM4K9CSt3bHtpc1m21nErGawaA', // Staking
  BRIDGE: 'AwZHcaizUMSsQC7fNAMbrahK2w3rLYXUDFCK4MvMKz1f', // Bridge
  DELEGATION: 'DELeGGvXpWV2fqJUhqcF5ZSYMS4JTLjteaAMARRSaeSh', // MagicBlock delegation
  MAGICBLOCK_ER: 'ERdXRZQiAooqHBRQqhr6ZxppjUfuXsgPijBZaZLiZPfL',
  PERMISSION: 'ACLseoPoyC3cBqoUtkbjZ4aDrkurZW86v19pXz2XQnp1',
}

// Master authority (receives rent from closed accounts)
const MASTER_AUTHORITY = 'DNKKC4uCNE55w66GFENJSEo7PYVSDLnSL62jvHoNeeBU'

// Native SOL mint
const NATIVE_SOL_MINT = 'So11111111111111111111111111111111111111112'

// Kora gasless config
const KORA_CONFIG = {
  RPC_URL: 'https://genuine-vibrancy-production.up.railway.app',
  ENABLED: true,
}

// MagicBlock PER config
const MAGICBLOCK_PER = {
  ER_ENDPOINT: 'https://devnet-as.magicblock.app',
  TEE_VALIDATOR: 'MAS1Dt9qreoRMQ14YQuhg8UTZMMzDdKhmkZMECCzk57',
  MAGIC_CONTEXT: 'MagicContext1111111111111111111111111111111',
  MAGIC_PROGRAM: 'Magic11111111111111111111111111111111111111',
}

// Token mint addresses (Devnet)
const TOKEN_MINTS = {
  WAVE: '6D6DjjiwtWPMCb2tkRVuTDi5esUu2rzHnhpE6z3nyskE',
  WEALTH: 'Diz52amvNsWFWrA8WnwQMVxSL5asMqL8MhZVSBk8TWcz',
  USDC: '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU',
}