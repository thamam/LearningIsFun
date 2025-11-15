# לוח הכפל - משחק אינטראקטיבי
# Multiplication Table - Interactive Game

## Overview

An interactive, fun web-based game to help kids memorize the multiplication table through engaging activities. The application features three distinct modes designed to support different learning styles and practice needs.

## Features

### 🎯 Three Learning Modes

#### 1. **Learn Mode (מצב למידה)** 📚
- Interactive multiplication table grid (1-10)
- Click any cell to see the equation
- Visual highlighting and animations
- Perfect for exploring patterns and relationships

#### 2. **Practice Mode (מצב תרגול)** ✏️
- Choose a specific multiplication table to practice (2-10)
- Input-based questions for active recall
- Real-time feedback on answers
- Statistics tracking:
  - Correct answers
  - Wrong answers
  - Current streak
- Progress saved automatically

#### 3. **Game Mode (מצב משחק)** 🎯
- 60-second timed challenge
- Multiple choice questions
- Select which tables to include (2-10)
- Tracks score and accuracy
- Celebratory confetti for high scores!

## Technical Details

### Technology Stack
- **Pure HTML/CSS/JavaScript** - No frameworks or dependencies
- **Single-file application** - All code in `index.html`
- **Responsive design** - Works on desktop and mobile
- **LocalStorage** - Automatic progress saving

### Hebrew RTL Support
- Full right-to-left (RTL) layout
- Hebrew UI text throughout
- Noto Sans Hebrew font from Google Fonts
- Culturally appropriate design

### Key Features
- **Visual feedback** - Animations and color coding
- **Confetti celebrations** - Rewards for correct answers
- **Progress tracking** - Saves practice statistics
- **Responsive design** - Adapts to screen size
- **Keyboard support** - Enter key works in practice mode

## File Structure

```
multiplication-table/
├── index.html          # Main application (complete standalone)
└── README.md          # This documentation
```

## How to Use

### For Students

1. **Open the game**: Open `index.html` in any modern web browser
2. **Choose a mode**:
   - Start with **Learn Mode** to explore the table
   - Use **Practice Mode** to master specific tables
   - Try **Game Mode** for a fun timed challenge
3. **Track your progress**: Stats are saved automatically

### For Parents/Teachers

- **Learn Mode**: Great for introducing multiplication concepts
- **Practice Mode**: Ideal for daily practice sessions, focus on one table at a time
- **Game Mode**: Fun way to test overall knowledge and speed

## Game Modes in Detail

### Learn Mode
- Click any cell in the 10×10 grid
- The equation appears (e.g., "5 × 7 = 35")
- Visual highlighting helps identify patterns
- No pressure, pure exploration

### Practice Mode
1. Select a multiplication table (2-10)
2. Answer questions by typing the result
3. Get immediate feedback
4. Track your progress with statistics
5. Press Enter or click "בדוק תשובה" to check

### Game Mode
1. Select which tables to include in the game
2. Click "התחל משחק!" to start
3. Answer as many questions as possible in 60 seconds
4. Choose from 4 multiple-choice options
5. See your final score and accuracy

## Statistics & Progress

### Saved Data
- Practice mode: Total correct/wrong answers, current streak
- Game mode: High scores
- All data stored in browser's LocalStorage

### Reset Progress
To reset progress, open browser console (F12) and run:
```javascript
localStorage.removeItem('multiplicationTableProgress')
```

## Design Philosophy

### Child-Friendly
- Large, clickable buttons
- Clear visual feedback
- Positive reinforcement (confetti, celebrations)
- No punishment for mistakes

### Pedagogically Sound
- Active recall practice
- Immediate feedback
- Spaced repetition support
- Multiple learning modalities

### Technical Excellence
- No dependencies - works offline
- Fast loading
- Smooth animations
- Cross-browser compatible

## Browser Compatibility

Works on all modern browsers:
- Chrome/Edge (recommended)
- Firefox
- Safari
- Mobile browsers (iOS Safari, Chrome Android)

## Future Enhancements

Potential features for future versions:
- [ ] Division practice mode
- [ ] Leaderboard/achievements system
- [ ] Print-friendly worksheets
- [ ] Parent dashboard
- [ ] Audio pronunciation
- [ ] More language support
- [ ] Advanced statistics and analytics
- [ ] Adaptive difficulty

## Credits

- **Font**: Noto Sans Hebrew by Google Fonts
- **Design**: Custom CSS with gradient backgrounds
- **Language**: Hebrew (עברית)
- **Target Audience**: Elementary school students

## License

Part of the LearningIsFun project - Educational use encouraged!

---

**Created for**: Emma and students learning multiplication
**Last Updated**: November 2025
