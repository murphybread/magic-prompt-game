# Magic Game Web Application

This is a simple magic game web application using Express.js and React, with basic authentication, social login, and mana cost calculation.

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
#### nextStep
- `Socket.io` 를 활용한 양방향 통신
- Multiturn방식의 대화 구현 (로컬에서 확인 완료)

CommonJS -> ESM 마이그레이션 dhksfy
backend
- [x] app.js
- [x] config/passport
- [x] routes/authRoutes
- [x] routes/gameRoutes
- [x] src/controllers/authControllers
- [x] src/controllers/chatControllers
- [x]] src/controllers/gameControllers

## Setup

### Backend

1. Navigate to the `backend` directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the `backend` directory with the following content:
   ```
   JWT_SECRET=your_jwt_secret
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   TWITTER_CONSUMER_KEY=your_twitter_consumer_key
   TWITTER_CONSUMER_SECRET=your_twitter_consumer_secret
   SESSION_SECRET=your_session_secret
   ```

4. Start the backend server:
   ```
   npm start
   ```

### Frontend

1. Navigate to the `frontend` directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the `frontend` directory with the following content:
   ```
   REACT_APP_API_URL=http://localhost:8008/api
   ```

4. Start the frontend development server:
   ```
   npm start
   ```

## Social Login Setup

### Google OAuth

1. Go to the [Google Developers Console](https://console.developers.google.com/).
2. Create a new project or select an existing one.
3. Enable the Google+ API.
4. Go to the Credentials page and create new OAuth 2.0 Client ID credentials.
5. Set the authorized JavaScript origins to `http://localhost:3000` (for development).
6. Set the authorized redirect URI to `http://localhost:8008/api/auth/google/callback`.
7. Copy the Client ID and Client Secret to your backend `.env` file.

### Twitter OAuth

1. Go to the [Twitter Developer Portal](https://developer.twitter.com/en/portal/dashboard).
2. Create a new app or select an existing one.
3. Go to the "Keys and tokens" tab.
4. Generate API Key and API Secret Key (Consumer Keys).
5. Set the callback URL to `http://localhost:8008/api/auth/twitter/callback`.
6. Copy the API Key and API Secret Key to your backend `.env` file.

## Features

- User registration and login
- Social login with Google and Twitter
- Guest login
- Mana cost calculation
- Spell casting
- User mana management

## Technologies Used

- Backend: Node.js, Express.js, PostgreSQL
- Frontend: React.js
- Authentication: JSON Web Tokens (JWT), Passport.js
- Social Login: Google OAuth 2.0, Twitter OAuth 1.0a
