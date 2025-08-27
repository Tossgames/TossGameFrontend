import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import { BedrockRoute } from 'react-native-bedrock';
import { GameEngine } from '../src/game/core/GameEngine';
import { TouchManager } from '../src/game/input/TouchManager';
import { PhysicsEngine } from '../src/game/physics/PhysicsEngine';
import { WorldRotationSystem } from '../src/game/systems/WorldRotationSystem';
import { Player, GameWorld } from '../src/types';
import { WORLD_ROTATIONS, GRAVITY_DIRECTIONS } from '../src/constants';

export const Route = BedrockRoute('/', {
  validateParams: (params) => params,
  component: Index,
});

export function Index() {
  const [gameEngine] = useState(() => new GameEngine());
  const [touchManager] = useState(() => new TouchManager());
  const [physicsEngine] = useState(() => new PhysicsEngine());
  const [rotationSystem] = useState(() => new WorldRotationSystem());
  
  const [player, setPlayer] = useState<Player>({
    position: { x: 0, y: 0, z: 0 },
    velocity: { x: 0, y: 0, z: 0 },
    isGrounded: true,
    canDoubleJump: true,
    hasUsedDoubleJump: false,
  });

  const [gameWorld, setGameWorld] = useState<GameWorld>({
    rotation: WORLD_ROTATIONS.NORMAL,
    gravityDirection: GRAVITY_DIRECTIONS[WORLD_ROTATIONS.NORMAL],
    currentSection: 0,
  });

  const [testLogs, setTestLogs] = useState<string[]>([]);

  useEffect(() => {
    // Set up GameEngine with player and world references
    gameEngine.setPlayer(player);
    gameEngine.setGameWorld(gameWorld);
    gameEngine.setOnPlayerUpdate((updatedPlayer) => {
      setPlayer({...updatedPlayer});
    });

    // Set up WorldRotationSystem callback for smooth animations
    rotationSystem.onWorldUpdate((updatedWorld) => {
      setGameWorld({...updatedWorld});
    });

    touchManager.onJump(() => {
      let actionTaken = false;
      
      if (player.isGrounded) {
        // Ground jump
        const jumped = physicsEngine.jump(player, gameWorld);
        addLog(`Jump attempted: ${jumped ? 'Success' : 'Failed'}`);
        actionTaken = jumped;
      } else if (player.canDoubleJump && !player.hasUsedDoubleJump) {
        // Air jump (double jump)
        const doubleJumped = physicsEngine.doubleJump(player, gameWorld);
        addLog(`Double jump attempted: ${doubleJumped ? 'Success' : 'Failed'}`);
        actionTaken = doubleJumped;
      } else {
        addLog('Jump attempted: Failed');
      }
      
      if (actionTaken) {
        setPlayer({...player});
      }
    });

  }, [player, gameWorld]);

  const addLog = (message: string) => {
    setTestLogs(prev => [...prev.slice(-4), `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const handleTouchTest = () => {
    touchManager.handleTouchStart();
    touchManager.handleTouchEnd();
    addLog('Touch input processed');
  };

  const handleRotateWorld = () => {
    if (!rotationSystem.isCurrentlyRotating()) {
      const newWorld = {...gameWorld};
      rotationSystem.rotateWorld(newWorld, 'clockwise');
      setGameWorld(newWorld);
      addLog(`World rotating to ${newWorld.rotation}°`);
    } else {
      addLog('World already rotating');
    }
  };

  const handleResetPlayer = () => {
    setPlayer({
      position: { x: 0, y: 0, z: 0 },
      velocity: { x: 0, y: 0, z: 0 },
      isGrounded: true,
      canDoubleJump: true,
      hasUsedDoubleJump: false,
    });
    addLog('Player reset');
  };

  const handleGameEngineTest = () => {
    const state = gameEngine.getGameState();
    if (state === 'menu') {
      gameEngine.start();
      addLog('Game started');
    } else if (state === 'playing') {
      gameEngine.pause();
      addLog('Game paused');
    } else if (state === 'paused') {
      gameEngine.resume();
      addLog('Game resumed');
    }
  };

  const getGravityDirectionText = () => {
    const gravity = gameWorld.gravityDirection;
    if (gravity.y < 0) return 'Down';
    if (gravity.y > 0) return 'Up';
    if (gravity.x < 0) return 'Left';
    if (gravity.x > 0) return 'Right';
    return 'None';
  };

  const getCurrentPosition = () => {
    const gravity = gameWorld.gravityDirection;
    if (gravity.y !== 0) return player.position.y.toFixed(2);
    if (gravity.x !== 0) return player.position.x.toFixed(2);
    return '0.00';
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎮 Game Systems Test</Text>
      
      <View style={styles.statusContainer}>
        <Text style={styles.statusText}>Game State: {gameEngine.getGameState()}</Text>
        <Text style={styles.statusText}>World Rotation: {gameWorld.rotation}°</Text>
        <Text style={styles.statusText}>Gravity: {getGravityDirectionText()}</Text>
        <Text style={styles.statusText}>Position: {getCurrentPosition()}</Text>
        <Text style={styles.statusText}>Grounded: {player.isGrounded ? 'Yes' : 'No'}</Text>
        <Text style={styles.statusText}>Can Double Jump: {player.canDoubleJump && !player.hasUsedDoubleJump ? 'Yes' : 'No'}</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleTouchTest}>
          <Text style={styles.buttonText}>Test Touch/Jump</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.button} onPress={handleRotateWorld}>
          <Text style={styles.buttonText}>Rotate World</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.button} onPress={handleResetPlayer}>
          <Text style={styles.buttonText}>Reset Player</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.button} onPress={handleGameEngineTest}>
          <Text style={styles.buttonText}>Toggle Game State</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.logContainer}>
        <Text style={styles.logTitle}>System Logs:</Text>
        {testLogs.map((log, index) => (
          <Text key={index} style={styles.logText}>{log}</Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#1a1a1a',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  statusContainer: {
    backgroundColor: '#2a2a2a',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  statusText: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    width: '48%',
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  logContainer: {
    backgroundColor: '#2a2a2a',
    padding: 15,
    borderRadius: 10,
    flex: 1,
  },
  logTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  logText: {
    color: '#ccc',
    fontSize: 14,
    marginBottom: 5,
  },
});
