/**
 * Wallet Library — Public API
 *
 * Re-exports everything consumers need.
 *
 * Usage:
 *   import { walletManager, shortenAddress } from "@/lib/wallet";
 */

export { walletManager } from "./wallet-manager";
export type { Account } from "./wallet-manager";

export {
    generateMnemonic,
    validateMnemonic,
    deriveKeypair,
    keypairFromPrivateKey,
    isValidAddress,
    shortenAddress,
} from "./solana";
