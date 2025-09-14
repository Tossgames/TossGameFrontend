import { defineConfig } from 'react-native-bedrock/config';

export default defineConfig({
  appName: 'toss-game-app',
  plugins: [
    // 토스 플러그인은 @apps-in-toss/framework 패키지가 필요
    // appsInToss({
    //   brand: {
    //     displayName: "토스 게임", 
    //     primaryColor: "#3182F6",
    //     icon: null,
    //     bridgeColorMode: "basic",
    //   },
    //   permissions: [],
    // }),
  ],
});
