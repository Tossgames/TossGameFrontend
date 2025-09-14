import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { BedrockRoute } from 'react-native-bedrock';
import { GameEngine } from '../src/game/core/GameEngine';
import { TouchManager } from '../src/game/input/TouchManager';
import { PhysicsEngine } from '../src/game/physics/PhysicsEngine';
import { Player, GameWorld } from '../src/types';
import { GAME_CONFIG } from '../src/constants';
import { GameCanvas } from '../src/components/GameCanvas';

const { width, height } = Dimensions.get('window');

export const Route = BedrockRoute('/', {
  validateParams: (params) => params,
  component: Index,
});

export function Index() {
  const [gameEngine] = useState(() => new GameEngine());
  const [touchManager] = useState(() => new TouchManager());
  const [physicsEngine] = useState(() => new PhysicsEngine());
  
  const [player, setPlayer] = useState<Player>({
    position: { x: GAME_CONFIG.PLAYER_START_X, y: height / 2 - GAME_CONFIG.PLAYER_SIZE, z: 0 }, // 선 위에서 시작
    velocity: { x: 0, y: 0, z: 0 },
    isGrounded: true,
    isOnTop: true, // 선 위에 있는 상태로 시작
    canDoubleJump: true, // 더블탭을 중력전환으로 사용하므로 이 이름은 부적절하지만, 일단 유지
    hasUsedDoubleJump: false,
    hp: GAME_CONFIG.MAX_HP,
    maxHp: GAME_CONFIG.MAX_HP,
  });

  const [gameWorld, setGameWorld] = useState<GameWorld>({
    gravityDirection: { x: 0, y: 1, z: 0 }, // 아래쪽 중력으로 시작
    gravityZone: 'upper', // 이 값은 더 이상 크게 의미 없음
    centerLineY: height / 2, // 화면 중앙에 중력선
  });

  // 가로모드는 일단 제거 (네이티브 모듈 오류 때문에)

  useEffect(() => {
    // 게임 엔진 설정
    gameEngine.setPlayer(player);
    gameEngine.setGameWorld(gameWorld);
    gameEngine.setOnPlayerUpdate((updatedPlayer) => {
      setPlayer({...updatedPlayer});
    });

    // --- 입력 콜백 설정 ---
    // 한 번 탭: 점프
    touchManager.onJump(() => {
      setPlayer(prevPlayer => {
        const newPlayer = {...prevPlayer};
        physicsEngine.jump(newPlayer, gameWorld);
        return newPlayer;
      });
    });

    // 더블 탭 비활성화 - 별도 버튼으로 대체
    touchManager.onDoubleJump(() => {});

    // 게임 시작
    if (gameEngine.getGameState() === 'menu') {
      gameEngine.start();
    }

  }, []);

  // 플레이어나 게임 월드 상태가 변경될 때마다 게임 엔진에 업데이트
  useEffect(() => {
    gameEngine.setPlayer(player);
    gameEngine.setGameWorld(gameWorld);
  }, [player, gameWorld]);


  return (
    <View style={styles.container}>
      <GameCanvas
        player={player}
        gameWorld={gameWorld}
        onTouchStart={touchManager.handleTouchStart} // 점프
        onGravitySwitch={() => gameEngine.gravitySwitch()} // 중력 전환
        screenWidth={width}
        screenHeight={height}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
});
