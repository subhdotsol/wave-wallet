const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");
const path = require("path");

const config = getDefaultConfig(__dirname);

// Path to our shim that replaces @noble/hashes/crypto with a lazy getter
const nobleHashesCryptoShim = path.resolve(
    __dirname,
    "src/noble-hashes-crypto-shim.js"
);

// Add SVG transformer support
config.transformer = {
    ...config.transformer,
    babelTransformerPath: require.resolve("react-native-svg-transformer/expo"),
};

// Intercept @noble/hashes/crypto imports and redirect to our shim.
// The original module captures globalThis.crypto at import time — too early.
// Our shim uses a lazy getter so it reads globalThis.crypto on first access,
// giving our polyfill in src/polyfills.ts time to set it up.
const originalResolveRequest = config.resolver?.resolveRequest;

config.resolver = {
    ...config.resolver,
    assetExts: config.resolver.assetExts.filter((ext) => ext !== "svg"),
    sourceExts: [...config.resolver.sourceExts, "svg"],
    unstable_enablePackageExports: true,
    unstable_conditionNames: ["browser", "require", "react-native"],
    resolveRequest: (context, moduleName, platform) => {
        // Redirect any import of @noble/hashes/crypto (or crypto.js) to our shim
        if (
            moduleName === "@noble/hashes/crypto" ||
            moduleName === "@noble/hashes/crypto.js"
        ) {
            return {
                filePath: nobleHashesCryptoShim,
                type: "sourceFile",
            };
        }
        // Also catch relative imports from within @noble/hashes (e.g. "./crypto.js")
        if (
            context.originModulePath &&
            context.originModulePath.includes("@noble/hashes") &&
            (moduleName === "./crypto" || moduleName === "./crypto.js")
        ) {
            return {
                filePath: nobleHashesCryptoShim,
                type: "sourceFile",
            };
        }
        // Default resolution
        if (originalResolveRequest) {
            return originalResolveRequest(context, moduleName, platform);
        }
        return context.resolveRequest(context, moduleName, platform);
    },
};

module.exports = withNativeWind(config, { input: "./global.css" });