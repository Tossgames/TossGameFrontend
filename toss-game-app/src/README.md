# 프로젝트 구조

```
src/
├── components/          # 재사용 가능한 UI 컴포넌트
├── game/               # 게임 로직
│   ├── core/           # 게임 엔진, 메인 루프
│   ├── physics/        # 물리 엔진, 충돌 감지
│   ├── rendering/      # 3D 렌더링, 그래픽스
│   ├── input/          # 입력 처리 (터치, 센서)
│   ├── ui/            # 게임 내 UI
│   ├── systems/       # 게임 시스템 (회전, 점수 등)
│   └── entities/      # 게임 객체 (플레이어, 장애물)
├── hooks/             # React 커스텀 훅
├── utils/             # 유틸리티 함수
├── assets/            # 에셋 파일
│   ├── images/        # 이미지 파일
│   ├── sounds/        # 사운드 파일
│   ├── models/        # 3D 모델
│   └── animations/    # 애니메이션 파일
├── types/             # TypeScript 타입 정의
└── constants/         # 상수 정의
```

## 각 폴더 역할

### `/game/core/`
- `GameEngine.ts`: 메인 게임 루프, 상태 관리
- `GameManager.ts`: 게임 전체 관리
- `SceneManager.ts`: 씬 전환 관리

### `/game/physics/`
- `PhysicsEngine.ts`: 물리 계산
- `CollisionDetector.ts`: 충돌 감지
- `GravitySystem.ts`: 중력 시스템

### `/game/input/`
- `TouchManager.ts`: 터치 입력 처리
- `DeviceMotionManager.ts`: 기기 회전 감지
- `InputMapper.ts`: 입력 매핑

### `/game/systems/`
- `WorldRotationSystem.ts`: 월드 회전 시스템
- `SectionManager.ts`: 구간 관리
- `ScoreSystem.ts`: 점수 시스템

### `/game/entities/`
- `Player.ts`: 플레이어 객체
- `Obstacle.ts`: 장애물 객체
- `Collectible.ts`: 수집 아이템

## 협업 가이드

1. **기능별 분리**: 각 시스템을 독립적으로 개발 가능
2. **타입 안정성**: 모든 인터페이스는 `/types/`에 정의
3. **상수 관리**: 게임 설정은 `/constants/`에서 중앙 관리
4. **유틸리티**: 공통 함수는 `/utils/`에서 재사용

## 개발 우선순위

1. **Core Systems** (`/game/core/`, `/game/input/`)
2. **Physics** (`/game/physics/`)
3. **Rendering** (`/game/rendering/`)
4. **Game Systems** (`/game/systems/`)
5. **UI & Polish** (`/game/ui/`, `/components/`)