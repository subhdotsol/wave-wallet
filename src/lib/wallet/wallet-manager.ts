/**
 * Wallet Manager — Compatibility Layer
 *
 * Thin wrapper over the Zustand wallet store.
 * Keeps the same imperative API so existing screens don't need changes.
 *
 * Usage:
 *   import { walletManager } from "@/lib/wallet";
 *   const { mnemonic, account } = await walletManager.createWallet();
 */

import { useWalletStore } from "../../store/wallet-store";
import type { Account } from "../../store/wallet-store";

export type { Account };

// Re-export the store hook for reactive usage in components
export { useWalletStore };

export const walletManager = {
    // ── State Queries ────────────────────────────────────────────────

    isInitialized(): boolean {
        return useWalletStore.getState().accounts.length > 0;
    },

    getMnemonic(): string | null {
        return useWalletStore.getState().mnemonic;
    },

    getActiveAccount(): Account | null {
        const { accounts, activeIndex } = useWalletStore.getState();
        return accounts[activeIndex] ?? null;
    },

    getAllAccounts(): Account[] {
        return [...useWalletStore.getState().accounts];
    },

    getActiveIndex(): number {
        return useWalletStore.getState().activeIndex;
    },

    getPrivateKeyBase58(index: number): string {
        const { accounts } = useWalletStore.getState();
        if (index < 0 || index >= accounts.length) {
            throw new Error(`Invalid account index: ${index}`);
        }
        const { default: bs58 } = require("bs58");
        return bs58.encode(accounts[index].keypair.secretKey);
    },

    // ── Mutations (async — store writes to SecureStore) ──────────────

    async createWallet() {
        return useWalletStore.getState().createWallet();
    },

    async importFromMnemonic(phrase: string) {
        return useWalletStore.getState().importFromMnemonic(phrase);
    },

    async importFromPrivateKey(base58Key: string) {
        return useWalletStore.getState().importFromPrivateKey(base58Key);
    },

    addAccount(name?: string): Account {
        return useWalletStore.getState().addAccount(name);
    },

    setActiveAccount(index: number): void {
        useWalletStore.getState().setActiveAccount(index);
    },

    renameAccount(index: number, newName: string): void {
        useWalletStore.getState().renameAccount(index, newName);
    },

    removeAccount(index: number): void {
        useWalletStore.getState().removeAccount(index);
    },

    async reset(): Promise<void> {
        return useWalletStore.getState().reset();
    },
};
