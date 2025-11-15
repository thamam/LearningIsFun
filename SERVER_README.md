# Flag Logging Server

Backend server for Emma's Math Practice app that silently logs flagged questions to organized log files.

## Quick Start

### One-Command Launch (Recommended)

```bash
npm install           # First time only
npm run launch        # Starts server + opens browser automatically
```

That's it! The launcher will:
- ✅ Start the backend server on port 3000
- ✅ Wait for server to be ready
- ✅ Open `src/math/Emma_math_lab.html` in your browser
- ✅ Handle graceful shutdown on Ctrl+C

### Manual Start (Alternative)

If you prefer to start server and browser separately:

```bash
npm install           # First time only
npm start             # Start server only
```

Then manually open `src/math/Emma_math_lab.html` in your browser.

## How It Works

When Emma clicks the 🚩 flag button on a question:
1. Frontend sends flag data to `http://localhost:3000/api/flag`
2. Server appends the flag to: `logs/[module]/YYYY-MM-DD.json`
3. Frontend shows: "🚩 השאלה נשמרה ביומן!" (Question saved to log!)

**No file dialogs** - completely silent background logging.

## Directory Structure

```
logs/
├── decimal/
│   ├── .gitkeep
│   └── 2025-11-15.json    (created when flags are logged)
├── multiplication/
│   ├── .gitkeep
│   └── 2025-11-15.json
└── numberline/
    ├── .gitkeep
    └── 2025-11-15.json
```

## Log File Format

Each log file contains an array of flagged questions:

```json
[
  {
    "timestamp": 1731681045000,
    "date": "15/11/2025, 14:30:45",
    "module": "decimal",
    "question": {
      "text": "4,521 = ? + 500 + 20 + 1",
      "type": "input",
      "fullObject": {
        "question": "4,521 = ? + 500 + 20 + 1",
        "type": "input"
      }
    },
    "userAnswer": "4000",
    "correctAnswer": "4000",
    "state": {
      "level": "בינוני",
      "totalQuestions": 15,
      "correctAnswers": 12,
      "currentStreak": 3,
      "bestStreak": 7,
      "consecutiveCorrect": 3,
      "consecutiveWrong": 0
    }
  }
]
```

## API Endpoints

### POST /api/flag
Logs a flagged question.

**Request Body:**
```json
{
  "timestamp": 1731681045000,
  "date": "15/11/2025, 14:30:45",
  "module": "decimal",
  "question": {...},
  "userAnswer": "123",
  "correctAnswer": "456",
  "state": {...}
}
```

**Response:**
```json
{
  "success": true,
  "message": "Flag logged successfully",
  "logFile": "logs/decimal/2025-11-15.json",
  "totalFlags": 5
}
```

### GET /api/health
Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "message": "Flag logging server is running",
  "timestamp": "2025-11-15T14:05:38.358Z"
}
```

## Configuration

### Change Port
Set environment variable:
```bash
PORT=8080 npm start
```

Or edit `server.js`:
```javascript
const PORT = process.env.PORT || 3000;
```

### Change Server URL in Frontend
Edit `src/math/Emma_math_lab.html`:
```javascript
const FLAG_SERVER_URL = 'http://localhost:3000/api/flag';
```

## Development

### Watch Mode (Auto-Restart)
```bash
npm run dev
```

Requires `nodemon` (already in devDependencies).

## Troubleshooting

### "⚠️ השרת לא זמין" in browser
- **Cause**: Server is not running
- **Solution**: Run `npm start` in terminal

### "EADDRINUSE: address already in use"
- **Cause**: Port 3000 is already in use
- **Solution**: Kill the process on port 3000 or change port

```bash
# Find process on port 3000
lsof -i :3000

# Kill process
kill -9 <PID>
```

### CORS Errors
- Already handled by `cors` middleware in `server.js`
- No configuration needed for local development

## Git & Version Control

### .gitignore Configuration
Log files are ignored but directory structure is tracked:
```
# flag logging
logs/**/*.json
!logs/**/.gitkeep
```

### Viewing Logs
```bash
# List all logs
ls logs/*/*.json

# View specific log
cat logs/decimal/2025-11-15.json | python3 -m json.tool

# Count total flags for today
cat logs/*/$(date +%Y-%m-%d).json | jq '. | length'
```

## Production Deployment

For production use, consider:
1. **Reverse proxy** (nginx/Apache) for port 80/443
2. **Process manager** (PM2) for auto-restart
3. **Log rotation** for old log files
4. **Authentication** if exposing publicly
5. **HTTPS** for secure communication

Example PM2 setup:
```bash
npm install -g pm2
pm2 start server.js --name "flag-logger"
pm2 save
pm2 startup
```

## Dependencies

- **express** (^4.18.2) - Web framework
- **cors** (^2.8.5) - CORS middleware
- **nodemon** (^3.0.1) - Development auto-reload (devDependency)

## License

ISC
