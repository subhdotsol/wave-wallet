/**
 * Wallet Manager — In-Memory Singleton
 *
 * Holds the current mnemonic and derived accounts.
 * No persistence — state is lost when app restarts.
 *
 * Usage:
 *   import { walletManager } from "@/lib/wallet";
 *   const { mnemonic, account } = walletManager.createWallet();
 */

import { Keypair } from "@solana/web3.js";
import {
    generateMnemonic,
    deriveKeypair,
    keypairFromPrivateKey,
    validateMnemonic,
    shortenAddress,
} from "./solana";

// ─── Types ──────────────────────────────────────────────────────────

export interface Account {
    /** Display name, e.g. "Account 1" */
    name: string;
    /** HD derivation index (null if imported via private key) */
    index: number | null;
    /** Solana Keypair (holds both public + secret key) */
    keypair: Keypair;
    /** Base58-encoded public key */
    address: string;
    /** Shortened address for display */
    shortAddress: string;
}

// ─── Singleton State ────────────────────────────────────────────────

let _mnemonic: string | null = null;
let _accounts: Account[] = [];
let _activeIndex: number = 0;
let _nextHdIndex: number = 0; // next HD derivation index to use

// ─── Helper ─────────────────────────────────────────────────────────

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

// ─── Public API ─────────────────────────────────────────────────────

export const walletManager = {
    // ── State Queries ───────────────────────────────────────────────

    /** Whether any wallet has been created or imported */
    isInitialized(): boolean {
        return _accounts.length > 0;
    },

    /** Get the mnemonic (null if imported via private key) */
    getMnemonic(): string | null {
        return _mnemonic;
    },

    /** Get the currently active account */
    getActiveAccount(): Account | null {
        return _accounts[_activeIndex] ?? null;
    },

    /** Get all accounts */
    getAllAccounts(): Account[] {
        return [..._accounts];
    },

    /** Get the active account index */
    getActiveIndex(): number {
        return _activeIndex;
    },

    /** Get the base58-encoded private key for an account */
    getPrivateKeyBase58(index: number): string {
        if (index < 0 || index >= _accounts.length) {
            throw new Error(`Invalid account index: ${index}`);
        }
        const { default: bs58 } = require("bs58");
        return bs58.encode(_accounts[index].keypair.secretKey);
    },

    // ── Create ──────────────────────────────────────────────────────

    /**
     * Create a brand-new wallet.
     * Generates a 12-word mnemonic and derives the first account.
     */
    createWallet(): { mnemonic: string; account: Account } {
        // Reset any existing state
        _mnemonic = generateMnemonic();
        _accounts = [];
        _activeIndex = 0;
        _nextHdIndex = 0;

        const keypair = deriveKeypair(_mnemonic, 0);
        const account = makeAccount(keypair, "Account 1", 0);
        _accounts.push(account);
        _nextHdIndex = 1;

        return { mnemonic: _mnemonic, account };
    },

    // ── Import ──────────────────────────────────────────────────────

    /**
     * Import wallet from a mnemonic phrase.
     * Validates the phrase and derives the first account.
     *
     * @throws if the mnemonic is invalid
     */
    importFromMnemonic(phrase: string): { account: Account } {
        const trimmed = phrase.trim().toLowerCase();
        if (!validateMnemonic(trimmed)) {
            throw new Error("Invalid seed phrase. Please check your words and try again.");
        }

        // Reset state
        _mnemonic = trimmed;
        _accounts = [];
        _activeIndex = 0;
        _nextHdIndex = 0;

        const keypair = deriveKeypair(_mnemonic, 0);
        const account = makeAccount(keypair, "Account 1", 0);
        _accounts.push(account);
        _nextHdIndex = 1;

        return { account };
    },

    /**
     * Import wallet from a base58 private key.
     * No mnemonic is stored — "Add Account" will be disabled.
     *
     * @throws if the key is invalid
     */
    importFromPrivateKey(base58Key: string): { account: Account } {
        let keypair: Keypair;
        try {
            keypair = keypairFromPrivateKey(base58Key);
        } catch {
            throw new Error("Invalid private key. Please check and try again.");
        }

        // Reset state — no mnemonic for private key imports
        _mnemonic = null;
        _accounts = [];
        _activeIndex = 0;
        _nextHdIndex = 0;

        const account = makeAccount(keypair, "Account 1", null);
        _accounts.push(account);

        return { account };
    },

    // ── Multi-Account ───────────────────────────────────────────────

    /**
     * Derive and add the next HD account.
     * Only works if wallet was created or imported via mnemonic.
     *
     * @param name - optional account name, defaults to "Account N"
     * @throws if no mnemonic is available
     */
    addAccount(name?: string): Account {
        if (!_mnemonic) {
            throw new Error("Cannot add accounts — wallet was imported via private key (no mnemonic).");
        }

        const accountName = name ?? `Account ${_accounts.length + 1}`;
        const keypair = deriveKeypair(_mnemonic, _nextHdIndex);
        const account = makeAccount(keypair, accountName, _nextHdIndex);
        _accounts.push(account);
        _nextHdIndex++;

        return account;
    },

    /** Switch the active account by its position in the accounts array */
    setActiveAccount(index: number): void {
        if (index < 0 || index >= _accounts.length) {
            throw new Error(`Invalid account index: ${index}`);
        }
        _activeIndex = index;
    },

    // ── Account Management ───────────────────────────────────────────

    /** Rename an account by its index */
    renameAccount(index: number, newName: string): void {
        if (index < 0 || index >= _accounts.length) {
            throw new Error(`Invalid account index: ${index}`);
        }
        _accounts[index].name = newName.trim() || _accounts[index].name;
    },

    /** Remove an account by its index (cannot remove the last account) */
    removeAccount(index: number): void {
        if (_accounts.length <= 1) {
            throw new Error("Cannot remove the last account.");
        }
        if (index < 0 || index >= _accounts.length) {
            throw new Error(`Invalid account index: ${index}`);
        }
        _accounts.splice(index, 1);
        // Adjust active index
        if (_activeIndex >= _accounts.length) {
            _activeIndex = _accounts.length - 1;
        } else if (_activeIndex > index) {
            _activeIndex--;
        }
    },

    // ── Reset ───────────────────────────────────────────────────────

    /** Wipe all wallet state */
    reset(): void {
        _mnemonic = null;
        _accounts = [];
        _activeIndex = 0;
        _nextHdIndex = 0;
    },
};
