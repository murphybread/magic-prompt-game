import dotenv from 'dotenv';

dotenv.config(); // dotenv 초기화

const isDev = process.env.NODE_ENV === 'development'; // NODE_ENV 기준 활성화
const maskSecrets = process.env.MASK_SECRETS;
// 일반 데이터 로깅 함수
export function logVars(message, ...vars) {
    if (!isDev) return; // 개발 환경에서만 실행
  
    console.log(`[INFO] ${message}`); // 메시지 출력
    vars.forEach((v) => {
      if (v === undefined) {
        console.log('undefined');
      } else if (v === null) {
        console.log('null');
      } else if (Array.isArray(v)) {
        // 배열 처리
        v.forEach((item, index) => console.log(`[${index}]:`, item));
      } else if (typeof v === 'object') {
        // 객체 처리
        Object.entries(v).forEach(([key, value]) => console.log(`${key}:`, value));
      } else {
        // 일반 문자열 또는 숫자를 한 줄로 출력
        console.log(vars.join(' '));
        return; // 한 번만 출력하고 종료
      }
    });
  }

// 에러 로깅 함수
export function logErrors(message, error, meta = {}) {
  if (!isDev) return; // 개발 환경에서만 실행

  console.error(`[ERROR] ${message}`);
  if (error instanceof Error) {
    console.error(`[STACK] ${error.stack}`);
  }
  if (Object.keys(meta).length > 0) {
    console.error(`[META]`, meta);
  }
}

// 민감 데이터 로깅 함수
export function logSecrets(message, secretValue) {
    if (!isDev) return; // Only run in the development environment

    
  
    let maskedValue;
    if (secretValue === undefined) {
      maskedValue = "undefined";
    } else if (secretValue === null) {
      maskedValue = "null";
    } else if (typeof secretValue === "string" || typeof secretValue === "number" ) {
        maskedValue = maskSecrets === "false"
        ? secretValue // 마스킹 비활성화 시 원본 출력
        : '*'.repeat(secretValue.length);
    } else {
      // For non-string values, convert to a safe string representation
      maskedValue = maskSecrets === "false"
      ? JSON.stringify(secretValue, null, 2) // 마스킹 비활성화 시 원본 출력
      : "[non-string value] " + typeof secretValue; // 기본 마스킹 처리
    }
  
    console.log(`[SECRET] ${message}: ${maskedValue}`);
  }
  