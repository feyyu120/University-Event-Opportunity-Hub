# University Event Opportunity Hub - Backend (Express.js)

Express.js backend for the University Event Opportunity Hub application.

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create `.env` file with:

   ```
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_jwt_secret
   PORT=3000
   NODE_ENV=production
   ```

3. Start the server:
   ```bash
   npm start
   ```

## API Endpoints

### Authentication

- `POST /auth/register` - Register new user
- `POST /auth/login` - User login
- `POST /auth/autorize` - Check authorization
- `POST /auth/logout` - Logout
- `POST /auth/admin_login` - Admin login
- `POST /auth/club_member_login` - Club leader login

### Users

- `GET /users/me` - Get user profile
- `GET /users/saved` - Get saved opportunities
- `POST /users/interests` - Update interests
- `GET /users/applications` - Get applications

### Opportunities

- `GET /opportunities/feed` - Get opportunities feed
- `GET /opportunities/detail/:id` - Get opportunity details
- `POST /opportunities/like/:id` - Like/unlike opportunity
- `POST /opportunities/comment/:id` - Add comment
- `POST /opportunities/report/:id` - Report opportunity

### Admin

- `GET /admin/users` - Get users list
- `GET /admin/clubs` - Get clubs list
- `GET /admin/moderation/pending` - Get pending moderations
- `GET /admin/reports` - Get reports
- `GET /admin/blacklist` - Get IP blacklist
- `POST /admin/blacklist/action` - Manage blacklist

### Init

- `GET /init/social` - Initialize social data

## Deployment

This backend is configured for deployment on Render with the provided Dockerfile.
