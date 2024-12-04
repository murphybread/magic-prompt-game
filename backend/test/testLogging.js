import { logVars, logErrors, logSecrets } from '../src/utils/logging.js';

// NODE_ENV 설정 (개발 환경으로 설정)
process.env.NODE_ENV = 'development';

// 테스트 데이터
const reqBody = {
  username: 'testUser',
  email: 'test@example.com',
  password: '12345',
};

const reqUser = {
  id: '123',
  username: 'testUser',
};

const error = new Error("Sample error");

// 테스트 실행
logVars("===== Testing logVars =====");
logVars("Testing logVars with general data", reqBody, reqUser);
logVars("Testing logVars with array and string", [1, 2, 3], "A simple string");

logVars("\n===== Testing logErrors =====");
logErrors("Testing logErrors with error object", error, { endpoint: "/test-endpoint" });

logVars("\n===== Testing logSecrets =====");
logSecrets("Testing sensitive data logging", "Password", reqBody.password);
logSecrets("Testing sensitive data logging", "JWT Token", "abc123xyz");
