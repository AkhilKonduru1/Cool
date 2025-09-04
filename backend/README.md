# Eventure Backend Server

This is the Python Flask backend server for the Eventure app.

## Setup Instructions

1. **Install Python dependencies:**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

2. **Run the server:**
   ```bash
   python app.py
   ```

3. **The server will start on:**
   - URL: `http://localhost:5000`
   - API endpoints: `http://localhost:5000/api/`

## API Endpoints

### Authentication
- `POST /api/register` - Register a new user
- `POST /api/login` - Login user
- `GET /api/user/profile` - Get user profile (requires auth)

### Adventures
- `POST /api/adventures` - Save a new adventure (requires auth)
- `GET /api/adventures` - Get user's adventures (requires auth)

### Friends
- `GET /api/friends/search?q=query` - Search for friends (requires auth)
- `POST /api/friends/request` - Send friend request (requires auth)
- `GET /api/friends/requests` - Get friend requests (requires auth)
- `POST /api/friends/requests/{id}/respond` - Accept/decline friend request (requires auth)
- `GET /api/friends` - Get user's friends (requires auth)

### Memories
- `POST /api/memories` - Save a memory (requires auth)
- `GET /api/memories` - Get user's memories (requires auth)

## Database

The app uses SQLite database (`eventure.db`) which will be created automatically when you first run the server.

## Configuration

- Change the `SECRET_KEY` in `app.py` for production
- Update the database URI if you want to use a different database
- Modify the API base URL in the React Native app's `apiService.ts` if needed

## Notes

- The server runs in debug mode by default
- CORS is enabled for all origins (configure for production)
- JWT tokens expire after 30 days
- Default badges are created automatically on first run

