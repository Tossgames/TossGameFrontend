const { getDefaultConfig } = require('metro-config');

const config = getDefaultConfig();

// 감시할 파일 수 제한
config.watchFolders = [];
config.resolver.platforms = ['ios', 'android', 'web'];

// 불필요한 폴더 제외
config.resolver.blockList = [
  /node_modules\/.*\/node_modules\/react-native\/.*/,
];

module.exports = config;
