/**
 * Shim for @noble/hashes/crypto
 *
 * This replaces the default @noble/hashes/crypto module which captures
 * globalThis.crypto at module evaluation time (before polyfills run).
 *
 * Instead, this shim lazily reads from globalThis.crypto on first access,
 * giving our polyfill time to set it up.
 */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

// Use a getter so the crypto object is resolved at call time, not import time.
// This gives our polyfill in src/polyfills.ts time to set globalThis.crypto.
Object.defineProperty(exports, "crypto", {
    get: function () {
        return typeof globalThis === "object" && "crypto" in globalThis
            ? globalThis.crypto
            : undefined;
    },
    enumerable: true,
    configurable: true,
});
