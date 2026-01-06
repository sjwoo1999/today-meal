/**
 * Network Simulation Utilities
 * 실제 네트워크 환경 시뮬레이션을 위한 유틸리티
 */

// 네트워크 지연 활성화 여부 (환경 변수로 제어)
export const isNetworkDelayEnabled = (): boolean => {
  if (typeof window === 'undefined') return false;
  return process.env.NODE_ENV === 'development' &&
    (process.env.NEXT_PUBLIC_ENABLE_NETWORK_DELAY === 'true' ||
     localStorage.getItem('dev:networkDelay') === 'true');
};

// 간헐적 에러 활성화 여부
export const isRandomErrorEnabled = (): boolean => {
  if (typeof window === 'undefined') return false;
  return process.env.NODE_ENV === 'development' &&
    localStorage.getItem('dev:randomError') === 'true';
};

/**
 * 네트워크 지연 시뮬레이션
 * @param minMs 최소 지연 시간 (ms)
 * @param maxMs 최대 지연 시간 (ms)
 */
export const simulateNetworkDelay = async (
  minMs: number = 200,
  maxMs: number = 800
): Promise<void> => {
  if (!isNetworkDelayEnabled()) return;

  const delay = Math.random() * (maxMs - minMs) + minMs;
  await new Promise(resolve => setTimeout(resolve, delay));
};

/**
 * 네트워크 지연 프리셋
 */
export const NetworkPresets = {
  fast: { min: 50, max: 150 },     // 빠른 연결 (WiFi)
  normal: { min: 200, max: 500 },   // 일반 연결 (4G)
  slow: { min: 500, max: 1500 },    // 느린 연결 (3G)
  verylow: { min: 1500, max: 3000 }, // 매우 느린 연결 (2G)
} as const;

export type NetworkPreset = keyof typeof NetworkPresets;

/**
 * 프리셋을 사용한 네트워크 지연
 */
export const simulateNetworkWithPreset = async (
  preset: NetworkPreset = 'normal'
): Promise<void> => {
  const { min, max } = NetworkPresets[preset];
  await simulateNetworkDelay(min, max);
};

/**
 * 간헐적 네트워크 에러 시뮬레이션
 * @param errorRate 에러 발생 확률 (0-1)
 * @returns true면 에러 발생해야 함
 */
export const shouldSimulateError = (errorRate: number = 0.05): boolean => {
  if (!isRandomErrorEnabled()) return false;
  return Math.random() < errorRate;
};

/**
 * 네트워크 요청 래퍼 - 지연 + 에러 시뮬레이션
 */
export const withNetworkSimulation = async <T>(
  operation: () => Promise<T>,
  options: {
    preset?: NetworkPreset;
    errorRate?: number;
    errorMessage?: string;
  } = {}
): Promise<T> => {
  const { preset = 'normal', errorRate = 0.05, errorMessage = '네트워크 오류가 발생했습니다.' } = options;

  // 네트워크 지연 시뮬레이션
  await simulateNetworkWithPreset(preset);

  // 간헐적 에러 시뮬레이션
  if (shouldSimulateError(errorRate)) {
    throw new Error(errorMessage);
  }

  return operation();
};

/**
 * 개발자 도구에서 네트워크 시뮬레이션 제어
 */
export const DevNetworkControl = {
  enableDelay: () => {
    localStorage.setItem('dev:networkDelay', 'true');
    console.log('🌐 네트워크 지연 시뮬레이션 활성화');
  },

  disableDelay: () => {
    localStorage.setItem('dev:networkDelay', 'false');
    console.log('🌐 네트워크 지연 시뮬레이션 비활성화');
  },

  enableRandomError: () => {
    localStorage.setItem('dev:randomError', 'true');
    console.log('⚠️ 간헐적 에러 시뮬레이션 활성화');
  },

  disableRandomError: () => {
    localStorage.setItem('dev:randomError', 'false');
    console.log('⚠️ 간헐적 에러 시뮬레이션 비활성화');
  },

  setPreset: (preset: NetworkPreset) => {
    localStorage.setItem('dev:networkPreset', preset);
    console.log(`🌐 네트워크 프리셋: ${preset}`);
  },

  getStatus: (): { delayEnabled: boolean; errorEnabled: boolean; preset: NetworkPreset } => ({
    delayEnabled: isNetworkDelayEnabled(),
    errorEnabled: isRandomErrorEnabled(),
    preset: (localStorage.getItem('dev:networkPreset') as NetworkPreset) || 'normal',
  }),
};

// 브라우저 개발자 도구에서 접근 가능하도록 전역 등록
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  (window as unknown as { DevNetworkControl: typeof DevNetworkControl }).DevNetworkControl = DevNetworkControl;
}
