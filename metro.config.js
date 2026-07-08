// Metro configuration for Expo.
// `expo-sqlite` ships a WebAssembly build (wa-sqlite) for its web target, so
// `.wasm` must be registered as an asset extension for the web bundle to
// resolve. SharedArrayBuffer (used by wa-sqlite) also requires the page to be
// cross-origin isolated, hence the COOP/COEP headers on the dev server.
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.assetExts.push('wasm');

config.server.enhanceMiddleware = (middleware) => {
  return (req, res, next) => {
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
    res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
    return middleware(req, res, next);
  };
};

module.exports = config;
