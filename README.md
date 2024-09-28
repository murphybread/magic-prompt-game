# Magic Game Web Application

This is a simple magic game web application using Express.js and React, with basic authentication, social login, and mana cost calculation.

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
