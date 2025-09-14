import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Player, GameWorld } from '../types';
import { GAME_CONFIG } from '../constants';

interface GameCanvasProps {
  player: Player;
  gameWorld: GameWorld;
  onTouchStart: () => void;
  onGravitySwitch: () => void; // 중력 전환 버튼 콜백
  screenWidth: number;
  screenHeight: number;
}

export function GameCanvas({
  player,
  gameWorld,
  onTouchStart,
  onGravitySwitch,
  screenWidth,
  screenHeight,
}: GameCanvasProps) {
  const playerSize = GAME_CONFIG.PLAYER_SIZE;

  return (
    <View style={styles.container}>
      {/* Game Canvas - 점프 전용 터치 영역 */}
      <TouchableOpacity
        style={[styles.gameArea, { width: screenWidth, height: screenHeight }]}
        onPress={onTouchStart}
        activeOpacity={1}
      >
        {/* Background */}
        <View style={[styles.background, { width: screenWidth, height: screenHeight }]} />

        {/* Upper zone */}
        <View
          style={[
            styles.upperZone,
            {
              width: screenWidth,
              height: gameWorld.centerLineY,
            },
          ]}
        />

        {/* Lower zone */}
        <View
          style={[
            styles.lowerZone,
            {
              width: screenWidth,
              height: screenHeight - gameWorld.centerLineY,
              top: gameWorld.centerLineY,
            },
          ]}
        />

        {/* Center gravity line */}
        <View
          style={[
            styles.centerLine,
            {
              top: gameWorld.centerLineY - 1,
              width: screenWidth,
            },
          ]}
        />

        {/* Player */}
        <View
          style={[
            styles.player,
            {
              left: player.position.x,
              top: player.position.y,
              width: playerSize,
              height: playerSize,
            },
          ]}
        />
      </TouchableOpacity>

      {/* UI Overlay - 게임 영역 밖에 별도로 배치 */}
      <View style={styles.uiOverlay}>
        {/* HP Bar */}
        <View style={styles.hpBarContainer}>
          <Text style={styles.hpText}>HP</Text>
          <View style={styles.hpBarBg}>
            <View
              style={[
                styles.hpBar,
                {
                  width: `${(player.hp / player.maxHp) * 100}%`,
                },
              ]}
            />
          </View>
          <Text style={styles.hpText}>{player.hp}/{player.maxHp}</Text>
        </View>
      </View>

      {/* Gravity Direction Indicator (표시만 하고 터치 불가) */}
      <View style={styles.gravityIndicator}>
        <Text style={styles.gravityButtonText}>
          {gameWorld.gravityDirection.y === 1 ? '⬇️' : '⬆️'}
        </Text>
        <Text style={styles.gravityButtonLabel}>Gravity</Text>
      </View>

      {/* Gravity Switch Button */}
      <TouchableOpacity style={styles.gravitySwitchButton} onPress={onGravitySwitch}>
        <Text style={styles.gravitySwitchButtonText}>Switch</Text>
      </TouchableOpacity>

      {/* Debug Info */}
      <View style={styles.debugInfo}>
        <Text style={styles.debugText}>
          Pos: {Math.round(player.position.x)}, {Math.round(player.position.y)}
        </Text>
        <Text style={styles.debugText}>
          Vel: {Math.round(player.velocity.y)}
        </Text>
        <Text style={styles.debugText}>
          Grounded: {player.isGrounded ? 'Yes' : 'No'}
        </Text>
        <Text style={styles.debugText}>
          Zone: {gameWorld.gravityZone}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  gameArea: {
    flex: 1,
    position: 'relative',
  },
  background: {
    position: 'absolute',
    backgroundColor: '#1a1a2e',
  },
  upperZone: {
    position: 'absolute',
    backgroundColor: 'rgba(100, 150, 255, 0.1)',
    top: 0,
    left: 0,
  },
  lowerZone: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 100, 100, 0.1)',
    left: 0,
  },
  centerLine: {
    position: 'absolute',
    height: 2,
    backgroundColor: '#ffffff',
    left: 0,
  },
  player: {
    position: 'absolute',
    backgroundColor: '#00ff00',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  uiOverlay: {
    position: 'absolute',
    top: 40,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    pointerEvents: 'box-none', // 자식 요소만 터치 가능
  },
  hpBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
    borderRadius: 10,
    pointerEvents: 'none', // HP 바는 터치 불가
  },
  hpText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginHorizontal: 5,
  },
  hpBarBg: {
    width: 100,
    height: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 5,
    overflow: 'hidden',
  },
  hpBar: {
    height: '100%',
    backgroundColor: '#00ff00',
    borderRadius: 5,
  },
  gravityIndicator: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
    minWidth: 70,
    pointerEvents: 'none', // 터치 불가
  },
  gravityButtonText: {
    fontSize: 24,
    marginBottom: 5,
  },
  gravityButtonLabel: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  gravitySwitchButton: {
    position: 'absolute',
    bottom: 40,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 10,
  },
  gravitySwitchButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  debugInfo: {
    position: 'absolute',
    top: 80,
    left: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
    borderRadius: 5,
    pointerEvents: 'none', // 디버그 정보는 터치 불가
  },
  debugText: {
    color: '#fff',
    fontSize: 12,
    marginBottom: 2,
  },
});