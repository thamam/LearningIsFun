# Technical Notes - Emma's English Practice App

## Architecture Overview

### Technology Stack
- **Frontend**: Pure HTML5, CSS3, Vanilla JavaScript (no frameworks)
- **Voice**: Web Speech API (SpeechRecognition + SpeechSynthesis)
- **Storage**: LocalStorage for persistence
- **Design**: Responsive CSS Grid/Flexbox

### Why No Framework?
- Simplicity and maintainability
- Consistency with existing math app (`src/math/Emma_math_lab.html`)
- No build step required
- Fast load times
- Easy to understand and modify

## File Structure

```
English/
├── index.html              # Main application (single-page app)
├── css/
│   └── main.css           # All styles (~800 lines)
├── js/
│   ├── app.js             # Main application logic (~1200 lines)
│   ├── voice-manager.js   # Web Speech API wrapper
│   ├── data/
│   │   ├── vocabulary.js  # 80 words across 3 tiers
│   │   └── stories.js     # 5 easy stories + 1 medium
│   └── utils/
│       ├── storage.js     # LocalStorage management
│       └── validation.js  # Answer checking utilities
├── assets/images/          # (empty - uses emoji for MVP)
├── docs/                   # (empty - for future documentation)
├── MVP_PLAN.md            # Comprehensive planning document
├── README.md              # Project overview
├── QUICKSTART.md          # User guide
└── TECHNICAL_NOTES.md     # This file
```

## Core Components

### 1. State Management (`app.js`)

```javascript
const englishState = {
    // Navigation
    currentSection: 'home',
    currentModule: null,
    currentActivity: null,

    // Global progress
    totalWordsLearned: 0,
    consecutiveDays: 0,
    totalStars: 0,
    lastActiveDate: null,

    // Per-module progress (4 modules)
    listenProgress: { /* ... */ },
    speakProgress: { /* ... */ },
    readProgress: { /* ... */ },
    writeProgress: { /* ... */ },

    // Settings
    voiceRate: 0.9,
    voiceVolume: 1.0
};
```

### 2. Voice Manager (`voice-manager.js`)

Wrapper around Web Speech API providing:
- **Text-to-Speech**: `voiceManager.speak(text, callback)`
- **Speech-to-Text**: `voiceManager.listen(onResult, onError)`
- **Settings**: Rate, pitch, volume, voice selection

**Browser Support:**
- ✅ Chrome/Edge: Full support
- ✅ Safari: Full support
- ⚠️ Firefox: Synthesis only (no recognition)

### 3. Content Data

**Vocabulary** (`js/data/vocabulary.js`):
- 80 words across 3 tiers
- Tier 1 (25): Essential words (I, you, cat, dog, etc.)
- Tier 2 (25): Expanding (run, jump, happy, sad, etc.)
- Tier 3 (30): Advanced (because, help, think, etc.)

**Stories** (`js/data/stories.js`):
- 5 easy stories (5 sentences each)
- 1 medium story (7 sentences)
- Each with 3 comprehension questions

### 4. Validation Utilities (`validation.js`)

- Fuzzy text matching (Levenshtein distance)
- Keyword extraction
- Encouraging feedback generation
- Multiple choice validation

### 5. Storage (`storage.js`)

- Automatic LocalStorage persistence
- Export/import functionality
- Auto-save every 30 seconds
- Save on page unload

## Module Implementation

### Module 1: Listen & Respond
**Three Activities:**
1. **Story Time**: Full story reading with comprehension questions
2. **Vocabulary Builder**: Word-of-the-day with definition and example
3. **Follow Instructions**: Click objects based on spoken instructions

**Key Functions:**
- `startListenActivity(activity)`
- `loadStory()`, `playStory()`, `checkStoryAnswer()`
- `loadVocabularyWord()`, `playVocabWord()`
- `loadInstruction()`, `checkInstructionAnswer()`

### Module 2: Speak & Practice
**Three Activities:**
1. **Repeat After Me**: Hear sentence → repeat → validation
2. **Describe Picture**: Look at emoji → speak description
3. **Conversation**: Answer personal questions

**Key Functions:**
- `startSpeakActivity(activity)`
- `startRepeatRecording()` - Uses speech recognition
- `startDescribeRecording()` - Open-ended speaking
- `startConversationRecording()` - Q&A format

### Module 3: Read & Match
**Three Activities:**
1. **Sight Words**: Match spoken word to written text (3 choices)
2. **Phonics Game**: Identify word starting with sound
3. **Sentence Puzzles**: Drag words to build sentence

**Key Functions:**
- `startReadActivity(activity)`
- `loadSightWord()`, `checkSightWord()`
- `loadPhonics()`, `checkPhonics()`
- `loadSentencePuzzle()`, `checkSentence()`

### Module 4: Write & Create
**Two Activities:**
1. **Letter Practice**: Type the letter shown
2. **Word Copying**: Type the word shown

**Key Functions:**
- `startWriteActivity(activity)`
- `loadLetter()`, `checkLetter()`
- `loadWordToCopy()`, `checkWord()`

## Voice Recognition Details

### Accuracy Threshold
- Exact match: 100% confidence
- Contains match: 90% confidence
- Fuzzy match: 80%+ similarity (Levenshtein)

### Error Handling
- Microphone permission denial → Alert user
- Recognition failure → Retry prompt
- Low confidence → Lower threshold

### Best Practices
- Speak at normal speed
- Quiet environment
- Quality microphone (headset recommended)
- Allow 1-2 seconds after pressing mic button

## Progress Tracking Algorithm

### Streak Calculation
```javascript
// Check if practiced today
if (lastActiveDate !== today) {
    if (lastActiveDate === yesterday) {
        consecutiveDays++; // Continue streak
    } else {
        consecutiveDays = 1; // Start new streak
    }
}
```

### Stars System
- ✅ Correct answer = +1 star
- ✅ Complete activity = +1 star
- ✅ New word learned = +1 star

### Module Progress Bars
- **Listen**: (stories completed / 5) * 50% + (vocab mastered / 50) * 50%
- **Speak**: (successful attempts / 20) * 100%
- **Read**: (sight words / 25) * 100%
- **Write**: (letters / 26) * 50% + (words / 10) * 50%

## Responsive Design

### Breakpoints
- **Desktop**: > 768px (full layout)
- **Tablet**: 480px - 768px (stacked modules)
- **Mobile**: < 480px (simplified, larger touch targets)

### Mobile Optimizations
- Larger tap targets (80px mic button)
- Single-column layout
- Reduced font sizes
- Simplified navigation

## Performance Considerations

### Load Time
- No external dependencies (except Google Fonts)
- Minimal JavaScript (~2000 lines total)
- CSS in single file (~800 lines)
- Fast initial load (<200ms)

### Voice API
- Speech synthesis: Instantaneous (browser-native voices)
- Speech recognition: ~500ms latency (cloud processing)

### Storage
- State object: ~5-10KB (tiny)
- LocalStorage limit: 5-10MB (plenty of headroom)

## Browser Compatibility

| Feature | Chrome | Edge | Safari | Firefox |
|---------|--------|------|--------|---------|
| Speech Synthesis | ✅ | ✅ | ✅ | ✅ |
| Speech Recognition | ✅ | ✅ | ✅ | ❌ |
| LocalStorage | ✅ | ✅ | ✅ | ✅ |
| CSS Grid | ✅ | ✅ | ✅ | ✅ |

**Recommendation**: Chrome or Edge for full functionality

## Future Enhancements (Phase 2+)

### Planned Features
1. **Speechace API Integration** - Pronunciation scoring
2. **AI Story Generation** - GPT-based adaptive content
3. **Parent Dashboard** - Detailed progress analytics
4. **Adaptive Difficulty** - ML-based personalization
5. **Offline Mode** - Service worker + Vosk.js

### Architecture Readiness
- ✅ Modular design (easy to add modules)
- ✅ JSON-based content (AI-generation ready)
- ✅ Abstracted voice manager (API swappable)
- ✅ Detailed progress logging (ML training data)

## Testing Checklist

### Voice Features
- [ ] Microphone access granted
- [ ] Text-to-speech works in all modules
- [ ] Speech-to-text recognizes clear speech
- [ ] Voice settings (rate/volume) persist

### Activities (All Modules)
- [ ] All 13 activities load correctly
- [ ] Navigation works (home button, module selection)
- [ ] Answers are validated correctly
- [ ] Progress updates in real-time

### Data Persistence
- [ ] Progress saves automatically
- [ ] Progress loads on page reload
- [ ] Export creates valid JSON file
- [ ] Clear data works (with confirmation)

### Responsive Design
- [ ] Works on desktop (1920x1080)
- [ ] Works on tablet (iPad 768x1024)
- [ ] Works on mobile (iPhone 375x667)

### Error Handling
- [ ] Graceful degradation without voice support
- [ ] Clear error messages for mic issues
- [ ] Fallback for browser incompatibility

## Code Quality

### Style Guidelines
- Consistent naming: camelCase for functions, PascalCase for classes
- Comprehensive comments: Every function documented
- Semantic HTML: Proper element usage
- Accessible: ARIA labels where needed (future improvement)

### Maintainability
- Single-file HTML (like math app)
- Modular JavaScript (easy to find functions)
- CSS variables for theming
- Clear separation: data / logic / presentation

## Known Limitations (MVP)

1. **Voice Recognition**: Requires internet (Web Speech API is cloud-based)
2. **Firefox Support**: No speech recognition in Firefox
3. **Pronunciation Feedback**: Basic validation only (no phoneme-level analysis)
4. **Content**: Limited to 80 words and 6 stories (expandable)
5. **Images**: Uses emoji instead of custom illustrations
6. **Offline**: Does not work offline (voice API dependency)

## Security & Privacy

### Data Storage
- ✅ All data stored locally (LocalStorage)
- ✅ No server communication (except voice API)
- ✅ No personal data collected
- ✅ No tracking or analytics

### Voice API Privacy
- ⚠️ Audio sent to Google servers (Web Speech API)
- ⚠️ Google may use audio for improvements
- ℹ️ Not stored permanently by Google
- ℹ️ Consider privacy notice for parents

## Deployment

### Hosting Options
1. **GitHub Pages** (recommended): Free, fast, HTTPS
2. **Netlify**: Free tier, easy deployment
3. **Local**: Open `index.html` directly

### Steps for GitHub Pages
```bash
# Already in repo - just enable in settings
1. Go to repo Settings → Pages
2. Source: Deploy from branch
3. Branch: main, folder: /English
4. Save
5. Access at: https://username.github.io/LearningIsFun/English/
```

### HTTPS Requirement
- Web Speech API requires HTTPS (or localhost)
- GitHub Pages provides HTTPS automatically
- File:// protocol works for testing

## Development Workflow

### Making Changes
1. Edit files in `English/` directory
2. Test locally by opening `index.html`
3. Check browser console for errors (F12)
4. Test voice features (requires mic)
5. Commit and push to repo

### Adding Content
- **New words**: Edit `js/data/vocabulary.js`
- **New stories**: Edit `js/data/stories.js`
- **New activities**: Add to relevant module in `js/app.js`

### Debugging
- Open browser DevTools (F12)
- Check Console for errors
- Use Network tab for voice API calls
- LocalStorage in Application tab

## Contact & Support

For questions or issues, refer to:
- Main project: `LearningIsFun/README.md`
- MVP plan: `English/MVP_PLAN.md`
- User guide: `English/QUICKSTART.md`

---

**Version**: 1.0 MVP
**Last Updated**: 2025-11-13
**Status**: Complete and ready for testing
