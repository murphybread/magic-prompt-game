# Magic Game Web Application

### 프로젝트 소개
사용자의 입력을 기반으로 생성형 AI를 활용하여 고유한 마법을 만들어주는 프로젝트입니다.

프로젝트 동작
1. 로그인
2. 대화 입력
3. 대화 중 마법을 만들고 싶으면 특수 키워드 ww입력
4. 지금까지 질의응답을 기반으로 텍스트 및 이미지 생성

### 주요 기능
- 회원가입 및 로그인
- 소셜 로그인(트위터)
- 생성형 AI 기반 이미지 생성


### 현재 버전 구현 데모(1.4.1기준)
[chrome-capture-2024-12-5.webm](https://github.com/user-attachments/assets/2fc6d1bc-4cbd-47d2-ac09-b3cf9ca7c36f)

### 기술 스택 및 지식

## 주요 프레임워크 및 라이브러리
### 백엔드(BE)
- **Node.js**: 비동기 I/O를 효율적으로 처리하여 OpenAI API 호출 시 응답 대기 시간을 관리하면서도 서버의 성능을 유지
- **Express.js**: 미들웨어 기반 구조를 활용해 인증, 라우팅, 에러 처리를 모듈화하여 코드 유지보수성을 높임
- **PostgreSQL**: 유저 정보와 생성된 마법 카드의 지속적인 저장을 위해 사용, 관계형 데이터베이스로 유저-카드 간 관계 모델링에 적합
- **Passport.js**: 다양한 인증 전략을 손쉽게 통합할 수 있어, 트위터 소셜 로그인과 로컬 인증을 일관된 방식으로 처리
- **JWT**: 서버의 상태 유지 없이도 클라이언트의 인증 상태를 관리해 확장성을 높이고, 토큰 만료 시간을 24시간으로 설정해 사용자 경험 개선

### 프론트엔드(FE)
- **React**: 컴포넌트 기반 구조로 UI 요소를 모듈화하여 채팅 인터페이스, 로그인 폼, 마법 카드 표시 등 각 각 기능을 상태 관리를 통해 효율적으로 구현
- **Axios**: Promise 기반 HTTP 클라이언트로 백엔드 API 호출을 간소화하고, 인터셉터를 통해 JWT 토큰을 모든 요청에 자동 첨부
- **비동기 상태 관리**: 요청 중 로딩 스피너를 표시하고 버튼 비활성화를 통해 사용자에게 진행 상황을 명확히 전달
- **이미지 갤러리 통합**: 생성된 마법 이미지들을 대화 컨텍스트와 함께 표시하여 사용자의 창작물을 즉시 확인 가능


### 외부 API 통합
- **OpenAI API**: 프로젝트의 핵심 기능인 대화형 마법 생성 구현에 활용, GPT-4o와 DALL-E 3 모델을 사용해 텍스트와 이미지 생성
- **Zod**: OpenAI의 structured output 기능과 함께 사용해 일관된 형식의 마법 속성(이름, 타입, 데미지 등)을 보장, 프론트엔드에서 데이터 처리를 단순화

### 클라우드 서비스
- **Google Cloud Storage**: DALL-E로 생성된 이미지를 영구 저장하고 공개 URL로 제공해 프론트엔드에서 쉽게 액세스할 수 있게 구현


## 트러블 슈팅 사례
CORS, 소셜 로그인 등 https://www.murphybooks.me/projects/library/kr/100/110/110-40/kr-110-40-a/
DB 설계, 기능 구현 및 UI UX관련 https://www.murphybooks.me/projects/library/kr/100/110/110-40/kr-110-40-b/



### 버전 기록

1.0.0: 백엔드(Express)와 프론트엔드(React)간의 연동. 백엔드의 API 기능을 프론트엔드의 버튼을 클릭하였을 때 동작 가능 여부 확인 (Key Word CORS )

1.1.0: DB와의 연동. 기존 In-memory에 저장하던 유저정보를 Postgresql 외부 DB에 저장. NEON 플랫폼을 사용하여 유저 생성, 삭제등으로 DB변하는 것과, 유저 목록시 해당 DB를 참조하는 점으로 연결여부 확인 (Postgresql pool)

1.1.1: 소셜 트위터, 구글 로그인. 일단 로그인 버튼 구현하기 위한 환경변수들 발급 후 설정.
   - 현재 둘다 동작에 문제가 있으며 트위터 먼저 구현중, 트위터의 경우 인증까지 됐지만 이후 다시 홈페이지 돌아왔을때 문제 생김
   - 원하는 기능
      -  처음 소셜 로그인 시 인증 후 유저가 DB에 없다면 Create User 기능 수행 후 로그인
      -  이후 소셜 로그인 시 DB에 유저가 있다면 해당 정보로 로그인

1.1.2: 트위터 소셜 로그인 성공

1.2.0: openai chat서비스 기능 추가
- openai 기능추가

1.3.0: openai chatbot 및 이미지생성기능 추가
- openai요청 후 대답 출력 + 이미지 출력
- 해당 이미지 google cloud storage 에 업로드

1.3.1: structured output 기능을 통해 정해진 양식 출력

1.3.2: multiturnconversation 방식 구현. 최종적으로 특정 키워드 입력시  structured output기능 사용. 이후 기존 generated Image동작, 리팩토링 CommonJS->ESM

1.4.1: 대화시 표기화면 UI변경 및 multiconversation 반영시 기존의 대화를 기반으로 동작

### 추가 예정 기능
- 생성된 마법의 카드화 UI 적용
- 카드 인벤토리 구현

CommonJS -> ESM 마이그레이션 dhksfy
backend
- [x] app.js
- [x] config/passport
- [x] routes/authRoutes
- [x] routes/gameRoutes
- [x] src/controllers/authControllers
- [x] src/controllers/chatControllers
- [x] src/controllers/gameControllers


