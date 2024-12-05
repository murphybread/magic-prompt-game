# Magic Game Web Application

### 프로젝트 소개
사용자별, 시도 횟수별 고유한 마법을 생성형 AI를 통해 만들고 이를 카드화 하여 개인의 창작 즐거울을 제공하는 프로젝트입니다.

프로젝트 동작
1. 로그인
2. 대화 입력
3. 대화 중 마법을 만들고 싶으면 특수 키워드 ww입력
4. 지금까지 대화를 기반으로 텍스트 및 이미지 생성

### 주요 기능
- 회원가입 및 로그인
- 소셜 로그인
- 생성형 AI 기반 텍스및 이미지 생성


### 현재 버전 구현 데모(1.4.1기준)
[chrome-capture-2024-12-5.webm](https://github.com/user-attachments/assets/2fc6d1bc-4cbd-47d2-ac09-b3cf9ca7c36f)

### 기술 스택
- Backend: Node.js, PostgeSQL
- Frontend: React
- Authentication: JSON Web Tokens (JWT), Passport.js
- Social Login: Twitter OAuth 1.0a
- Storage: GCP Storage
- AI Features:
   - Chat Generation: OpenAI Chat
   - Image Generation: OpenAI DALL·E


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
- `Socket.io` 를 활용한 양방향 통신
- 생성된 마법의 카드화 UI 적용
- 카드 정보 텍스트 및 이미지 DB로 등록(카드 텍스트결과 및 이미지는 URL)
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


