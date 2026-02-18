/**
 * Wallet Library — Public API
 *
 * Re-exports everything consumers need.
 *
 * Usage:
 *   import { walletManager, shortenAddress } from "@/lib/wallet";
 *   import { useWalletStore } from "@/lib/wallet"; // reactive hook
 */

export { walletManager, useWalletStore } from "./wallet-manager";
export type { Account } from "./wallet-manager";

export {
    generateMnemonic,
    validateMnemonic,
    deriveKeypair,
    keypairFromPrivateKey,
    isValidAddress,
    shortenAddress,
} from "./solana";
