// Polyfills — imported FIRST in app/_layout.tsx
//
// crypto.getRandomValues is polyfilled here using expo-crypto.
// The @noble/hashes/crypto module is shimmed via metro.config.js
// to use a lazy getter, so it picks up this polyfill at call time.

import * as ExpoCrypto from 'expo-crypto';

// 1. Polyfill crypto.getRandomValues
if (typeof globalThis.crypto === 'undefined') {
    // @ts-ignore
    globalThis.crypto = {};
}
if (typeof globalThis.crypto.getRandomValues !== 'function') {
    // @ts-ignore
    globalThis.crypto.getRandomValues = function <T extends ArrayBufferView>(array: T): T {
        const bytes = ExpoCrypto.getRandomBytes(array.byteLength);
        const target = new Uint8Array(array.buffer, array.byteOffset, array.byteLength);
        target.set(bytes);
        return array;
    };
}

// 2. URL constructor polyfill
import 'react-native-url-polyfill/auto';

// 3. Buffer global
import { Buffer } from 'buffer';
// @ts-ignore
global.Buffer = Buffer;
