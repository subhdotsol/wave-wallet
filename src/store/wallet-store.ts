/**
 * Zustand Wallet Store — Persistent Global State
 *
 * Persists lightweight metadata to AsyncStorage.
 * Stores mnemonic / imported private keys in expo-secure-store (encrypted).
 * Re-derives Keypairs on hydration.
 *
 * Usage (reactive — inside components):
 *   import { useWalletStore } from "@/store/wallet-store";
 *   const accounts = useWalletStore(s => s.accounts);
 *
 * Usage (imperative — outside components):
 *   import { useWalletStore } from "@/store/wallet-store";
 *   useWalletStore.getState().createWallet();
 */

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { Keypair } from "@solana/web3.js";
import {
    generateMnemonic,
    deriveKeypair,
    keypairFromPrivateKey,
    validateMnemonic,
    shortenAddress,
} from "../lib/wallet/solana";

// ─── Secure Store Keys ──────────────────────────────────────────────

const SECURE_KEY_MNEMONIC = "wave_mnemonic";
const SECURE_KEY_IMPORTED_PK = "wave_imported_pk"; // base58 private key for non-HD imports

// ─── Types ──────────────────────────────────────────────────────────

/** Lightweight, serializable account metadata (persisted to AsyncStorage) */
export interface AccountMeta {
    name: string;
    /** HD derivation index, null if imported via private key */
    hdIndex: number | null;
}

/** Full account with derived Keypair (NOT persisted) */
export interface Account {
    name: string;
    index: number | null;
    keypair: Keypair;
    address: string;
    shortAddress: string;
}

interface WalletState {
    // ── Persisted (AsyncStorage) ─────────────────────────────────────
    accountMetas: AccountMeta[];
    activeIndex: number;
    nextHdIndex: number;

    // ── Derived (in-memory, rebuilt on hydration) ────────────────────
    accounts: Account[];
    mnemonic: string | null;
    isHydrated: boolean;

    // ── Actions ──────────────────────────────────────────────────────
    hydrate: () => Promise<void>;
    createWallet: () => Promise<{ mnemonic: string; account: Account }>;
    importFromMnemonic: (phrase: string) => Promise<{ account: Account }>;
    importFromPrivateKey: (base58Key: string) => Promise<{ account: Account }>;
    addAccount: (name?: string) => Account;
    setActiveAccount: (index: number) => void;
    renameAccount: (index: number, newName: string) => void;
    removeAccount: (index: number) => void;
    reset: () => Promise<void>;
}

// ─── Helpers ────────────────────────────────────────────────────────

function makeAccount(keypair: Keypair, name: string, hdIndex: number | null): Account {
    const address = keypair.publicKey.toBase58();
    return {
        name,
        index: hdIndex,
        keypair,
        address,
        shortAddress: shortenAddress(address),
    };
}

/** Rebuild full Account objects from metas + secrets */
function rebuildAccounts(
    metas: AccountMeta[],
    mnemonic: string | null,
    importedPk: string | null,
): Account[] {
    return metas.map((meta) => {
        let keypair: Keypair;
        if (meta.hdIndex !== null && mnemonic) {
            keypair = deriveKeypair(mnemonic, meta.hdIndex);
        } else if (importedPk) {
            keypair = keypairFromPrivateKey(importedPk);
        } else {
            throw new Error("Cannot rebuild account — missing secrets");
        }
        return makeAccount(keypair, meta.name, meta.hdIndex);
    });
}

// ─── Store ──────────────────────────────────────────────────────────

export const useWalletStore = create<WalletState>()(
    persist(
        (set, get) => ({
            // ── Initial state ────────────────────────────────────────
            accountMetas: [],
            activeIndex: 0,
            nextHdIndex: 0,
            accounts: [],
            mnemonic: null,
            isHydrated: false,

            // ── Hydrate (called once on app boot) ────────────────────
            hydrate: async () => {
                const state = get();
                if (state.accountMetas.length === 0) {
                    set({ isHydrated: true });
                    return;
                }

                // Load secrets from secure store
                const mnemonic = await SecureStore.getItemAsync(SECURE_KEY_MNEMONIC);
                const importedPk = await SecureStore.getItemAsync(SECURE_KEY_IMPORTED_PK);

                try {
                    const accounts = rebuildAccounts(state.accountMetas, mnemonic, importedPk);
                    set({ accounts, mnemonic, isHydrated: true });
                } catch (err) {
                    console.error("Failed to hydrate wallet:", err);
                    // If secrets are gone, reset to clean slate
                    set({
                        accountMetas: [],
                        activeIndex: 0,
                        nextHdIndex: 0,
                        accounts: [],
                        mnemonic: null,
                        isHydrated: true,
                    });
                }
            },

            // ── Create wallet ────────────────────────────────────────
            createWallet: async () => {
                const mnemonic = generateMnemonic();
                const keypair = deriveKeypair(mnemonic, 0);
                const account = makeAccount(keypair, "Account 1", 0);

                await SecureStore.setItemAsync(SECURE_KEY_MNEMONIC, mnemonic);
                await SecureStore.deleteItemAsync(SECURE_KEY_IMPORTED_PK);

                set({
                    mnemonic,
                    accountMetas: [{ name: "Account 1", hdIndex: 0 }],
                    accounts: [account],
                    activeIndex: 0,
                    nextHdIndex: 1,
                });

                return { mnemonic, account };
            },

            // ── Import from mnemonic ─────────────────────────────────
            importFromMnemonic: async (phrase: string) => {
                const trimmed = phrase.trim().toLowerCase();
                if (!validateMnemonic(trimmed)) {
                    throw new Error("Invalid seed phrase. Please check your words and try again.");
                }

                const keypair = deriveKeypair(trimmed, 0);
                const account = makeAccount(keypair, "Account 1", 0);

                await SecureStore.setItemAsync(SECURE_KEY_MNEMONIC, trimmed);
                await SecureStore.deleteItemAsync(SECURE_KEY_IMPORTED_PK);

                set({
                    mnemonic: trimmed,
                    accountMetas: [{ name: "Account 1", hdIndex: 0 }],
                    accounts: [account],
                    activeIndex: 0,
                    nextHdIndex: 1,
                });

                return { account };
            },

            // ── Import from private key ──────────────────────────────
            importFromPrivateKey: async (base58Key: string) => {
                let keypair: Keypair;
                try {
                    keypair = keypairFromPrivateKey(base58Key);
                } catch {
                    throw new Error("Invalid private key. Please check and try again.");
                }

                const account = makeAccount(keypair, "Account 1", null);

                await SecureStore.deleteItemAsync(SECURE_KEY_MNEMONIC);
                await SecureStore.setItemAsync(SECURE_KEY_IMPORTED_PK, base58Key.trim());

                set({
                    mnemonic: null,
                    accountMetas: [{ name: "Account 1", hdIndex: null }],
                    accounts: [account],
                    activeIndex: 0,
                    nextHdIndex: 0,
                });

                return { account };
            },

            // ── Add HD account ───────────────────────────────────────
            addAccount: (name?: string) => {
                const { mnemonic, accountMetas, accounts, nextHdIndex } = get();
                if (!mnemonic) {
                    throw new Error("Cannot add accounts — wallet was imported via private key (no mnemonic).");
                }

                const accountName = name ?? `Account ${accountMetas.length + 1}`;
                const keypair = deriveKeypair(mnemonic, nextHdIndex);
                const account = makeAccount(keypair, accountName, nextHdIndex);

                set({
                    accountMetas: [...accountMetas, { name: accountName, hdIndex: nextHdIndex }],
                    accounts: [...accounts, account],
                    nextHdIndex: nextHdIndex + 1,
                });

                return account;
            },

            // ── Switch active account ────────────────────────────────
            setActiveAccount: (index: number) => {
                const { accounts } = get();
                if (index < 0 || index >= accounts.length) {
                    throw new Error(`Invalid account index: ${index}`);
                }
                set({ activeIndex: index });
            },

            // ── Rename ──────────────────────────────────────────────
            renameAccount: (index: number, newName: string) => {
                const { accountMetas, accounts } = get();
                if (index < 0 || index >= accounts.length) {
                    throw new Error(`Invalid account index: ${index}`);
                }

                const trimmed = newName.trim() || accounts[index].name;
                const updatedMetas = [...accountMetas];
                updatedMetas[index] = { ...updatedMetas[index], name: trimmed };

                const updatedAccounts = [...accounts];
                updatedAccounts[index] = { ...updatedAccounts[index], name: trimmed };

                set({ accountMetas: updatedMetas, accounts: updatedAccounts });
            },

            // ── Remove ──────────────────────────────────────────────
            removeAccount: (index: number) => {
                const { accountMetas, accounts, activeIndex } = get();
                if (accounts.length <= 1) {
                    throw new Error("Cannot remove the last account.");
                }
                if (index < 0 || index >= accounts.length) {
                    throw new Error(`Invalid account index: ${index}`);
                }

                const updatedMetas = accountMetas.filter((_, i) => i !== index);
                const updatedAccounts = accounts.filter((_, i) => i !== index);

                let newActiveIndex = activeIndex;
                if (activeIndex >= updatedAccounts.length) {
                    newActiveIndex = updatedAccounts.length - 1;
                } else if (activeIndex > index) {
                    newActiveIndex--;
                }

                set({
                    accountMetas: updatedMetas,
                    accounts: updatedAccounts,
                    activeIndex: newActiveIndex,
                });
            },

            // ── Reset ───────────────────────────────────────────────
            reset: async () => {
                await SecureStore.deleteItemAsync(SECURE_KEY_MNEMONIC);
                await SecureStore.deleteItemAsync(SECURE_KEY_IMPORTED_PK);

                set({
                    mnemonic: null,
                    accountMetas: [],
                    accounts: [],
                    activeIndex: 0,
                    nextHdIndex: 0,
                });
            },
        }),
        {
            name: "wave-wallet-store",
            storage: createJSONStorage(() => AsyncStorage),
            // Only persist serializable metadata — NOT keypairs, mnemonic, or accounts
            partialize: (state) => ({
                accountMetas: state.accountMetas,
                activeIndex: state.activeIndex,
                nextHdIndex: state.nextHdIndex,
            }),
        },
    ),
);
