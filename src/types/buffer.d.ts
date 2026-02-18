/**
 * Buffer ↔ Uint8Array compatibility
 *
 * React Native's `buffer` polyfill declares Buffer extending Uint8Array,
 * but TS5+ strict mode considers them incompatible. This augmentation
 * makes Buffer assignable to Uint8Array throughout the project.
 */
declare module "buffer" {
    interface Buffer extends Uint8Array {}
}

export {};
