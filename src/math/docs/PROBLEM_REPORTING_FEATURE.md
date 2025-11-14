# Problem Reporting Feature - Documentation

## Overview
A comprehensive problem reporting system has been implemented to allow Emma to report issues she encounters during practice. When a problem is reported, the system captures the complete context of the exercise, stores it locally, and automatically moves to the next question.

## User Flow

### 1. Initial State
- A button labeled "⚠️ יש בעיה בתרגיל הזה" (There is a problem with this exercise) appears below the feedback area in all three modules:
  - מבנה עשרוני (Decimal)
  - כפל (Multiplication)
  - ישר מספרים (Number line)

### 2. Reporting a Problem
When Emma clicks the button:
1. The button hides and a form appears with three options:
   - ❌ התשובה הנכונה לא התקבלה (Correct answer wasn't accepted)
   - ❓ מטרת התרגיל לא ברורה (Exercise purpose unclear)
   - 📝 אחר (Other)

2. If "אחר" (Other) is selected, a text field appears for additional details

3. Submit and Cancel buttons appear at the bottom

### 3. After Submission
- A confirmation message appears: "✅ תודה על הדיווח! נעבור לשאלה הבאה..." (Thank you for the report! Moving to next question...)
- After 1.5 seconds, a new question is automatically generated
- The form resets and the report button reappears

## Data Captured

Each problem report includes:

```javascript
{
    timestamp: 1699999999999,                    // Unix timestamp
    dateString: "12/11/2025, 14:30:45",         // Hebrew locale formatted date
    module: "decimal",                          // Module name
    reportType: "wrong-answer",                 // Type of problem
    additionalNotes: "...",                     // Optional user notes (if "other" selected)
    question: {
        text: "...",                            // Question text
        type: "input",                          // Question type
        choices: [],                            // Available choices (if any)
        fullQuestion: {...}                     // Complete question object
    },
    userAnswer: "123",                          // Answer provided by Emma
    correctAnswer: "456",                       // Expected correct answer
    moduleState: {
        level: "בינוני",                        // Current difficulty level
        totalQuestions: 15,                     // Total questions answered
        correctAnswers: 12,                     // Correct answers count
        currentStreak: 3,                       // Current correct streak
        bestStreak: 7,                          // Best streak achieved
        consecutiveCorrect: 3,                  // Consecutive correct
        consecutiveWrong: 0                     // Consecutive wrong
    }
}
```

## Data Storage

### LocalStorage
- **Key**: `emmaProblemReports`
- **Format**: JSON array of all problem reports
- **Persistence**: Survives page refreshes and browser restarts
- **Access**: Available via `window.problemReports` in browser console

### In-Memory
- Reports are stored in `window.problemReports` array during the session
- Previously saved reports are loaded automatically on page load

## Exporting Reports

### From Browser Console
To download all problem reports as a JSON file:

```javascript
exportProblemReports()
```

This will download a file named: `בעיות-תרגילים-אמה-YYYY-MM-DD.json`

### From Browser DevTools
1. Open DevTools (F12)
2. Go to Application tab → Local Storage → `file://` or domain
3. Find key: `emmaProblemReports`
4. Copy the value and save to a file

### Viewing Current Reports
In browser console:
```javascript
console.log(window.problemReports)
console.log(`Total reports: ${window.problemReports.length}`)
```

## Technical Implementation

### Files Modified
1. **src/math/css/main.css** (lines 1099-1231)
   - Added styles for report button, form, and options
   - Orange color scheme to match existing UI

2. **src/math/Emma_math_lab.html**
   - Added HTML for report buttons in decimal section (lines 223-245)
   - Added HTML for report buttons in multiplication section (lines 321-343)
   - Added HTML for report buttons in numberline section (lines 517-539)
   - Added JavaScript for problem reporting system (lines 3539-3760)

### Key Functions
- `showProblemReportForm(moduleName)` - Shows the report form
- `selectReportOption(moduleName, reportType)` - Handles option selection
- `cancelProblemReport(moduleName)` - Cancels and resets the form
- `submitProblemReport(moduleName)` - Submits report and moves to next question
- `getUserAnswer(moduleName)` - Retrieves user's answer from UI
- `window.exportProblemReports()` - Downloads reports as JSON file

## Next Steps

After collecting problem reports from Emma's practice sessions:

1. **Export the reports**:
   ```javascript
   exportProblemReports()
   ```

2. **Analyze the reports** to identify:
   - Common patterns in problems
   - Specific question types causing issues
   - Unclear exercise purposes
   - Validation errors in the answer checking logic

3. **Reproduce issues**:
   - Each report contains the complete question object
   - Can recreate the exact scenario Emma encountered
   - Module state provides context about difficulty and progression

4. **Fix identified issues**:
   - Update answer validation logic
   - Clarify question wording
   - Adjust difficulty progression
   - Fix any bugs in question generation

## Console Messages

The system logs these messages to the browser console:
- `✅ Problem Reporting System Loaded Successfully!` - On page load
- `Loaded N existing problem reports` - When loading saved reports
- `Problem Report Submitted: {...}` - When a report is submitted (includes full report object)
- `Exported N problem reports` - When exporting to JSON file

## Browser Compatibility

The feature uses standard Web APIs:
- LocalStorage (IE8+)
- querySelector/querySelectorAll (IE8+)
- Blob/URL.createObjectURL (IE10+)
- Arrow functions and template literals (Modern browsers)

Should work on all browsers Emma is likely to use (Chrome, Firefox, Safari, Edge).
