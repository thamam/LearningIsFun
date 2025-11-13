/**
 * Emma's English Practice - Main Application Logic
 * Manages state, navigation, and all activities
 */

// ============================================================================
// STATE MANAGEMENT
// ============================================================================

const englishState = {
    currentSection: 'home',
    currentModule: null,
    currentActivity: null,

    // Global progress
    totalWordsLearned: 0,
    consecutiveDays: 0,
    totalStars: 0,
    lastActiveDate: null,

    // Module progress
    listenProgress: {
        totalQuestions: 0,
        correctAnswers: 0,
        currentStreak: 0,
        bestStreak: 0,
        storiesCompleted: [],
        vocabularyMastered: []
    },

    speakProgress: {
        totalAttempts: 0,
        successfulAttempts: 0,
        currentStreak: 0,
        bestStreak: 0,
        wordsSpoken: []
    },

    readProgress: {
        totalQuestions: 0,
        correctAnswers: 0,
        currentStreak: 0,
        bestStreak: 0,
        sightWordsMastered: []
    },

    writeProgress: {
        totalQuestions: 0,
        correctAnswers: 0,
        currentStreak: 0,
        bestStreak: 0,
        lettersCompleted: [],
        wordsWritten: []
    },

    // Current activity state
    currentQuestion: null,
    currentStory: null,
    currentWord: null,

    // Settings
    voiceRate: 0.9,
    voiceVolume: 1.0
};

// ============================================================================
// INITIALIZATION
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('✨ Emma\'s English Practice - Loading...');

    // Load saved state
    loadAllProgress();

    // Check voice support
    checkVoiceSupport();

    // Update home dashboard
    updateHomeDashboard();

    // Setup settings listeners
    setupSettingsListeners();

    // Update progress display
    updateAllProgress();

    console.log('✅ Application loaded successfully!');
});

// ============================================================================
// NAVIGATION
// ============================================================================

function showSection(sectionName) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });

    // Show target section
    const targetSection = document.getElementById(sectionName + 'Section');
    if (targetSection) {
        targetSection.classList.add('active');
        englishState.currentSection = sectionName;

        // Show/hide home button
        const homeButton = document.getElementById('homeButton');
        if (sectionName === 'home') {
            homeButton.classList.add('hidden');
        } else {
            homeButton.classList.remove('hidden');
        }

        // Save progress when leaving a section
        if (sectionName === 'home') {
            saveAllProgress();
            updateHomeDashboard();
        }
    }
}

// ============================================================================
// MODULE 1: LISTEN & RESPOND
// ============================================================================

let currentStoryIndex = 0;
let currentVocabIndex = 0;

function startListenActivity(activity) {
    // Hide selector, show content
    document.getElementById('listenActivitySelector').style.display = 'none';
    document.getElementById('listenActivityContent').classList.remove('hidden');

    // Hide all activity panels
    document.querySelectorAll('#listenActivityContent .activity-panel').forEach(panel => {
        panel.classList.add('hidden');
    });

    // Show selected activity
    englishState.currentActivity = activity;

    if (activity === 'story') {
        document.getElementById('storyActivity').classList.remove('hidden');
        loadStory();
    } else if (activity === 'vocabulary') {
        document.getElementById('vocabularyActivity').classList.remove('hidden');
        loadVocabularyWord();
    } else if (activity === 'instructions') {
        document.getElementById('instructionsActivity').classList.remove('hidden');
        loadInstruction();
    }
}

// Story Activity
function loadStory() {
    const stories = getStoriesByLevel('easy');
    const story = stories[currentStoryIndex % stories.length];
    englishState.currentStory = story;

    document.getElementById('storyTitle').textContent = story.title;

    // Combine all sentences
    const fullText = story.sentences.map(s => s.text).join(' ');
    document.getElementById('storyText').textContent = fullText;
    document.getElementById('storyImage').textContent = '📖';

    // Hide question initially
    document.getElementById('storyQuestion').classList.add('hidden');
}

function playStory() {
    const story = englishState.currentStory;
    if (!story) return;

    const fullText = story.sentences.map(s => s.text).join(' ');

    voiceManager.speak(fullText, () => {
        // After story ends, show first question
        showStoryQuestion(0);
    });
}

let currentQuestionIndex = 0;

function showStoryQuestion(index) {
    const story = englishState.currentStory;
    if (!story || !story.questions[index]) return;

    const question = story.questions[index];
    currentQuestionIndex = index;

    document.getElementById('questionText').textContent = question.question;

    // Create choice buttons
    const choicesContainer = document.getElementById('questionChoices');
    choicesContainer.innerHTML = '';

    question.options.forEach((option, i) => {
        const button = document.createElement('button');
        button.className = 'choice-button';
        button.textContent = option;
        button.onclick = () => checkStoryAnswer(i);
        choicesContainer.appendChild(button);
    });

    document.getElementById('storyQuestion').classList.remove('hidden');

    // Read question aloud
    voiceManager.speak(question.question);
}

function checkStoryAnswer(selectedIndex) {
    const story = englishState.currentStory;
    const question = story.questions[currentQuestionIndex];
    const isCorrect = selectedIndex === question.correct;

    // Update button states
    const buttons = document.querySelectorAll('.choice-button');
    buttons[selectedIndex].classList.add(isCorrect ? 'correct' : 'incorrect');
    if (!isCorrect) {
        buttons[question.correct].classList.add('correct');
    }

    // Update stats
    englishState.listenProgress.totalQuestions++;
    if (isCorrect) {
        englishState.listenProgress.correctAnswers++;
        englishState.listenProgress.currentStreak++;
        if (englishState.listenProgress.currentStreak > englishState.listenProgress.bestStreak) {
            englishState.listenProgress.bestStreak = englishState.listenProgress.currentStreak;
        }
        englishState.totalStars++;
    } else {
        englishState.listenProgress.currentStreak = 0;
    }

    // Show feedback
    showFeedbackModal(isCorrect);

    // Update display
    updateModuleStats('listen');

    // Move to next question or complete story
    setTimeout(() => {
        if (currentQuestionIndex < story.questions.length - 1) {
            showStoryQuestion(currentQuestionIndex + 1);
        } else {
            // Story completed
            if (!englishState.listenProgress.storiesCompleted.includes(story.id)) {
                englishState.listenProgress.storiesCompleted.push(story.id);
            }
            currentStoryIndex++;
            loadStory();
        }
    }, 2000);
}

// Vocabulary Activity
function loadVocabularyWord() {
    const allWords = getAllVocabulary();
    const word = allWords[currentVocabIndex % allWords.length];
    englishState.currentWord = word;

    document.getElementById('vocabWord').textContent = word.word;
    document.getElementById('vocabDefinition').textContent = word.definition;
    document.getElementById('vocabExample').textContent = `"${word.example}"`;
    document.getElementById('vocabImage').textContent = '📝';

    // Auto-play word
    voiceManager.speak(`The word is: ${word.word}. ${word.definition}. For example: ${word.example}`);
}

function playVocabWord() {
    const word = englishState.currentWord;
    if (!word) return;
    voiceManager.speak(word.word);
}

function vocabNextWord() {
    // Mark as learned
    if (englishState.currentWord && !englishState.listenProgress.vocabularyMastered.includes(englishState.currentWord.word)) {
        englishState.listenProgress.vocabularyMastered.push(englishState.currentWord.word);
        englishState.totalWordsLearned++;
        englishState.totalStars++;
    }

    currentVocabIndex++;
    loadVocabularyWord();
    updateModuleStats('listen');
}

// Instructions Activity
let instructionSequence = [];
let userSequence = [];

function loadInstruction() {
    // Generate simple instruction
    const colors = ['red', 'blue', 'green', 'yellow'];
    const shapes = ['circle', 'square', 'triangle', 'star'];

    instructionSequence = [
        { color: colors[Math.floor(Math.random() * colors.length)], shape: shapes[Math.floor(Math.random() * shapes.length)] }
    ];

    const instruction = `Click the ${instructionSequence[0].color} ${instructionSequence[0].shape}`;
    document.getElementById('instructionText').textContent = instruction;

    // Create objects
    const container = document.getElementById('instructionObjects');
    container.innerHTML = '';

    // Generate 4 objects
    const allOptions = [];
    allOptions.push(instructionSequence[0]); // Correct option

    // Add 3 wrong options
    while (allOptions.length < 4) {
        const randomOption = {
            color: colors[Math.floor(Math.random() * colors.length)],
            shape: shapes[Math.floor(Math.random() * shapes.length)]
        };
        if (!allOptions.some(o => o.color === randomOption.color && o.shape === randomOption.shape)) {
            allOptions.push(randomOption);
        }
    }

    // Shuffle
    allOptions.sort(() => Math.random() - 0.5);

    // Create clickable objects
    allOptions.forEach((option, index) => {
        const obj = document.createElement('div');
        obj.className = 'instruction-object';
        obj.style.cssText = `
            display: inline-block;
            width: 80px;
            height: 80px;
            margin: 10px;
            background: ${option.color};
            cursor: pointer;
            border: 3px solid transparent;
            border-radius: ${option.shape === 'circle' ? '50%' : '8px'};
        `;
        obj.onclick = () => selectInstructionObject(option);
        container.appendChild(obj);
    });

    userSequence = [];
}

function playInstruction() {
    const instruction = `Click the ${instructionSequence[0].color} ${instructionSequence[0].shape}`;
    voiceManager.speak(instruction);
}

function selectInstructionObject(option) {
    userSequence = [option];
}

function checkInstructionAnswer() {
    if (userSequence.length === 0) {
        voiceManager.speak('Please select an object first');
        return;
    }

    const isCorrect = userSequence[0].color === instructionSequence[0].color &&
                      userSequence[0].shape === instructionSequence[0].shape;

    englishState.listenProgress.totalQuestions++;
    if (isCorrect) {
        englishState.listenProgress.correctAnswers++;
        englishState.listenProgress.currentStreak++;
        if (englishState.listenProgress.currentStreak > englishState.listenProgress.bestStreak) {
            englishState.listenProgress.bestStreak = englishState.listenProgress.currentStreak;
        }
        englishState.totalStars++;
    } else {
        englishState.listenProgress.currentStreak = 0;
    }

    showFeedbackModal(isCorrect);
    updateModuleStats('listen');

    setTimeout(() => loadInstruction(), 1500);
}

// ============================================================================
// MODULE 2: SPEAK & PRACTICE
// ============================================================================

function startSpeakActivity(activity) {
    document.getElementById('speakActivitySelector').style.display = 'none';
    document.getElementById('speakActivityContent').classList.remove('hidden');

    document.querySelectorAll('#speakActivityContent .activity-panel').forEach(panel => {
        panel.classList.add('hidden');
    });

    englishState.currentActivity = activity;

    if (activity === 'repeat') {
        document.getElementById('repeatActivity').classList.remove('hidden');
        loadRepeatSentence();
    } else if (activity === 'describe') {
        document.getElementById('describeActivity').classList.remove('hidden');
        loadDescribeImage();
    } else if (activity === 'conversation') {
        document.getElementById('conversationActivity').classList.remove('hidden');
        loadConversation();
    }
}

// Repeat Activity
const repeatSentences = [
    'I like to play.',
    'The cat is happy.',
    'We go to school.',
    'I see a bird.',
    'The ball is red.',
    'My mom is nice.',
    'I can run fast.',
    'The dog is big.',
    'I love my family.',
    'Today is a good day.'
];

let currentRepeatIndex = 0;

function loadRepeatSentence() {
    const sentence = repeatSentences[currentRepeatIndex % repeatSentences.length];
    englishState.currentQuestion = sentence;
    document.getElementById('repeatText').textContent = sentence;
    document.getElementById('userSpeechDisplay').textContent = '';
    document.getElementById('repeatFeedback').textContent = '';
    document.getElementById('repeatFeedback').className = 'feedback-display';
}

function playRepeatSentence() {
    voiceManager.speak(englishState.currentQuestion);
}

function startRepeatRecording() {
    const button = document.getElementById('repeatMicButton');
    button.classList.add('listening');
    button.textContent = '🎤 Listening...';

    voiceManager.listen((transcript, confidence) => {
        button.classList.remove('listening');
        button.textContent = '🎤 Press to Speak';

        document.getElementById('userSpeechDisplay').textContent = `You said: "${transcript}"`;

        // Check answer
        const result = ValidationUtils.textMatches(transcript, englishState.currentQuestion);

        englishState.speakProgress.totalAttempts++;

        if (result.match) {
            englishState.speakProgress.successfulAttempts++;
            englishState.speakProgress.currentStreak++;
            if (englishState.speakProgress.currentStreak > englishState.speakProgress.bestStreak) {
                englishState.speakProgress.bestStreak = englishState.speakProgress.currentStreak;
            }
            englishState.totalStars++;

            if (!englishState.speakProgress.wordsSpoken.includes(englishState.currentQuestion)) {
                englishState.speakProgress.wordsSpoken.push(englishState.currentQuestion);
            }

            const feedback = document.getElementById('repeatFeedback');
            feedback.textContent = ValidationUtils.getFeedback(true, englishState.speakProgress.currentStreak);
            feedback.className = 'feedback-display success';

            // Move to next sentence
            setTimeout(() => {
                currentRepeatIndex++;
                loadRepeatSentence();
            }, 2000);
        } else {
            englishState.speakProgress.currentStreak = 0;

            const feedback = document.getElementById('repeatFeedback');
            feedback.textContent = ValidationUtils.getFeedback(false) + ' Try again!';
            feedback.className = 'feedback-display error';
        }

        updateModuleStats('speak');
    }, (error) => {
        button.classList.remove('listening');
        button.textContent = '🎤 Press to Speak';
        alert('Could not recognize speech. Please try again. Make sure to allow microphone access.');
    });
}

// Describe Activity
function loadDescribeImage() {
    document.getElementById('describeImage').textContent = '🐱';
    document.getElementById('describeSpeechDisplay').textContent = '';
    document.getElementById('sentenceStarters').innerHTML = '<p>Try saying: "I see a cat" or "The cat is happy"</p>';
}

function startDescribeRecording() {
    voiceManager.listen((transcript, confidence) => {
        document.getElementById('describeSpeechDisplay').textContent = `You said: "${transcript}"`;

        englishState.speakProgress.totalAttempts++;
        englishState.speakProgress.successfulAttempts++;
        englishState.totalStars++;

        voiceManager.speak('Great job describing the picture!');
        updateModuleStats('speak');
    }, (error) => {
        alert('Could not recognize speech. Please try again.');
    });
}

function nextDescribeImage() {
    const images = ['🐱', '🐶', '🏠', '🌳', '☀️', '🌈', '🚗', '📚'];
    const randomImage = images[Math.floor(Math.random() * images.length)];
    document.getElementById('describeImage').textContent = randomImage;
    document.getElementById('describeSpeechDisplay').textContent = '';
}

// Conversation Activity
const conversationQuestions = [
    'What is your name?',
    'How old are you?',
    'What is your favorite color?',
    'Do you like animals?',
    'What do you like to eat?'
];

let currentConversationIndex = 0;

function loadConversation() {
    const question = conversationQuestions[currentConversationIndex % conversationQuestions.length];
    document.getElementById('conversationDisplay').textContent = question;
    document.getElementById('conversationSpeechDisplay').textContent = '';

    voiceManager.speak(question);
}

function playConversationQuestion() {
    const question = document.getElementById('conversationDisplay').textContent;
    voiceManager.speak(question);
}

function startConversationRecording() {
    voiceManager.listen((transcript, confidence) => {
        document.getElementById('conversationSpeechDisplay').textContent = `You said: "${transcript}"`;

        englishState.speakProgress.totalAttempts++;
        englishState.speakProgress.successfulAttempts++;
        englishState.totalStars++;

        voiceManager.speak(`Nice answer! ${transcript}`);
        updateModuleStats('speak');

        setTimeout(() => {
            currentConversationIndex++;
            loadConversation();
        }, 3000);
    }, (error) => {
        alert('Could not recognize speech. Please try again.');
    });
}

// ============================================================================
// MODULE 3: READ & MATCH
// ============================================================================

function startReadActivity(activity) {
    document.getElementById('readActivitySelector').style.display = 'none';
    document.getElementById('readActivityContent').classList.remove('hidden');

    document.querySelectorAll('#readActivityContent .activity-panel').forEach(panel => {
        panel.classList.add('hidden');
    });

    englishState.currentActivity = activity;

    if (activity === 'sightwords') {
        document.getElementById('sightwordsActivity').classList.remove('hidden');
        loadSightWord();
    } else if (activity === 'phonics') {
        document.getElementById('phonicsActivity').classList.remove('hidden');
        loadPhonics();
    } else if (activity === 'sentences') {
        document.getElementById('sentencesActivity').classList.remove('hidden');
        loadSentencePuzzle();
    }
}

// Sight Words Activity
let currentSightWord = null;

function loadSightWord() {
    // Get 3 random sight words
    const shuffled = [...sightWords].sort(() => 0.5 - Math.random());
    const options = shuffled.slice(0, 3);
    currentSightWord = options[0];

    const container = document.getElementById('sightwordChoices');
    container.innerHTML = '';

    // Shuffle options
    options.sort(() => 0.5 - Math.random());

    options.forEach(word => {
        const button = document.createElement('div');
        button.className = 'word-choice';
        button.textContent = word;
        button.onclick = () => checkSightWord(word);
        container.appendChild(button);
    });

    document.getElementById('sightwordFeedback').textContent = '';
    document.getElementById('sightwordFeedback').className = 'feedback-display';
}

function playSightWord() {
    if (currentSightWord) {
        voiceManager.speak(currentSightWord);
    }
}

function checkSightWord(selectedWord) {
    const isCorrect = selectedWord === currentSightWord;

    englishState.readProgress.totalQuestions++;
    if (isCorrect) {
        englishState.readProgress.correctAnswers++;
        englishState.readProgress.currentStreak++;
        if (englishState.readProgress.currentStreak > englishState.readProgress.bestStreak) {
            englishState.readProgress.bestStreak = englishState.readProgress.currentStreak;
        }
        englishState.totalStars++;

        if (!englishState.readProgress.sightWordsMastered.includes(currentSightWord)) {
            englishState.readProgress.sightWordsMastered.push(currentSightWord);
            englishState.totalWordsLearned++;
        }
    } else {
        englishState.readProgress.currentStreak = 0;
    }

    const feedback = document.getElementById('sightwordFeedback');
    feedback.textContent = ValidationUtils.getFeedback(isCorrect, englishState.readProgress.currentStreak);
    feedback.className = `feedback-display ${isCorrect ? 'success' : 'error'}`;

    updateModuleStats('read');

    if (isCorrect) {
        setTimeout(() => loadSightWord(), 1500);
    }
}

// Phonics Activity
const phonicsData = [
    { sound: '/b/', words: ['ball', 'cat', 'dog'] },
    { sound: '/k/', words: ['cat', 'ball', 'sun'] },
    { sound: '/d/', words: ['dog', 'fish', 'moon'] },
    { sound: '/s/', words: ['sun', 'tree', 'ball'] }
];

let currentPhonics = null;

function loadPhonics() {
    currentPhonics = phonicsData[Math.floor(Math.random() * phonicsData.length)];

    const container = document.getElementById('phonicsChoices');
    container.innerHTML = '';

    currentPhonics.words.sort(() => 0.5 - Math.random());

    currentPhonics.words.forEach(word => {
        const button = document.createElement('div');
        button.className = 'phonics-choice';
        button.textContent = word;
        button.onclick = () => checkPhonics(word);
        container.appendChild(button);
    });

    document.getElementById('phonicsFeedback').textContent = '';
}

function playPhonicsSound() {
    if (currentPhonics) {
        voiceManager.speak(`Which word starts with the sound ${currentPhonics.sound}?`);
    }
}

function checkPhonics(selectedWord) {
    const isCorrect = selectedWord === currentPhonics.words[0];

    englishState.readProgress.totalQuestions++;
    if (isCorrect) {
        englishState.readProgress.correctAnswers++;
        englishState.readProgress.currentStreak++;
        if (englishState.readProgress.currentStreak > englishState.readProgress.bestStreak) {
            englishState.readProgress.bestStreak = englishState.readProgress.currentStreak;
        }
        englishState.totalStars++;
    } else {
        englishState.readProgress.currentStreak = 0;
    }

    const feedback = document.getElementById('phonicsFeedback');
    feedback.textContent = ValidationUtils.getFeedback(isCorrect, englishState.readProgress.currentStreak);
    feedback.className = `feedback-display ${isCorrect ? 'success' : 'error'}`;

    updateModuleStats('read');

    if (isCorrect) {
        setTimeout(() => loadPhonics(), 1500);
    }
}

// Sentence Puzzle Activity
const simpleSentences = [
    ['I', 'like', 'cats'],
    ['The', 'dog', 'runs'],
    ['We', 'go', 'home'],
    ['I', 'see', 'you']
];

let currentSentence = null;

function loadSentencePuzzle() {
    currentSentence = simpleSentences[Math.floor(Math.random() * simpleSentences.length)];

    const wordBank = document.getElementById('wordBank');
    wordBank.innerHTML = '';

    const shuffled = [...currentSentence].sort(() => 0.5 - Math.random());

    shuffled.forEach(word => {
        const tile = document.createElement('div');
        tile.className = 'word-tile';
        tile.textContent = word;
        tile.draggable = true;
        tile.onclick = () => moveWordToBuilder(word);
        wordBank.appendChild(tile);
    });

    document.getElementById('sentenceBuilder').innerHTML = '';
    document.getElementById('sentenceFeedback').textContent = '';
}

function playSentence() {
    if (currentSentence) {
        voiceManager.speak(currentSentence.join(' '));
    }
}

function moveWordToBuilder(word) {
    const builder = document.getElementById('sentenceBuilder');
    const wordBank = document.getElementById('wordBank');

    // Remove from word bank
    Array.from(wordBank.children).forEach(tile => {
        if (tile.textContent === word) {
            wordBank.removeChild(tile);
        }
    });

    // Add to builder
    const tile = document.createElement('div');
    tile.className = 'word-tile';
    tile.textContent = word;
    tile.onclick = () => moveWordToBank(word);
    builder.appendChild(tile);
}

function moveWordToBank(word) {
    const builder = document.getElementById('sentenceBuilder');
    const wordBank = document.getElementById('wordBank');

    // Remove from builder
    Array.from(builder.children).forEach(tile => {
        if (tile.textContent === word) {
            builder.removeChild(tile);
        }
    });

    // Add back to word bank
    const tile = document.createElement('div');
    tile.className = 'word-tile';
    tile.textContent = word;
    tile.onclick = () => moveWordToBuilder(word);
    wordBank.appendChild(tile);
}

function checkSentence() {
    const builder = document.getElementById('sentenceBuilder');
    const userSentence = Array.from(builder.children).map(tile => tile.textContent);

    const isCorrect = JSON.stringify(userSentence) === JSON.stringify(currentSentence);

    englishState.readProgress.totalQuestions++;
    if (isCorrect) {
        englishState.readProgress.correctAnswers++;
        englishState.readProgress.currentStreak++;
        if (englishState.readProgress.currentStreak > englishState.readProgress.bestStreak) {
            englishState.readProgress.bestStreak = englishState.readProgress.currentStreak;
        }
        englishState.totalStars++;
    } else {
        englishState.readProgress.currentStreak = 0;
    }

    const feedback = document.getElementById('sentenceFeedback');
    feedback.textContent = ValidationUtils.getFeedback(isCorrect, englishState.readProgress.currentStreak);
    feedback.className = `feedback-display ${isCorrect ? 'success' : 'error'}`;

    updateModuleStats('read');

    if (isCorrect) {
        setTimeout(() => loadSentencePuzzle(), 2000);
    }
}

// ============================================================================
// MODULE 4: WRITE & CREATE
// ============================================================================

function startWriteActivity(activity) {
    document.getElementById('writeActivitySelector').style.display = 'none';
    document.getElementById('writeActivityContent').classList.remove('hidden');

    document.querySelectorAll('#writeActivityContent .activity-panel').forEach(panel => {
        panel.classList.add('hidden');
    });

    englishState.currentActivity = activity;

    if (activity === 'letters') {
        document.getElementById('lettersActivity').classList.remove('hidden');
        loadLetter();
    } else if (activity === 'words') {
        document.getElementById('wordsActivity').classList.remove('hidden');
        loadWordToCopy();
    }
}

// Letter Practice
const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
let currentLetterIndex = 0;

function loadLetter() {
    const letter = alphabet[currentLetterIndex % alphabet.length];
    englishState.currentQuestion = letter;

    document.getElementById('letterDisplay').textContent = letter;
    document.getElementById('letterInput').value = '';
    document.getElementById('letterFeedback').textContent = '';
    document.getElementById('letterFeedback').className = 'feedback-display';
}

function playLetter() {
    voiceManager.speak(`The letter ${englishState.currentQuestion}`);
}

function checkLetter() {
    const userInput = document.getElementById('letterInput').value.toUpperCase();
    const isCorrect = userInput === englishState.currentQuestion;

    englishState.writeProgress.totalQuestions++;
    if (isCorrect) {
        englishState.writeProgress.correctAnswers++;
        englishState.writeProgress.currentStreak++;
        if (englishState.writeProgress.currentStreak > englishState.writeProgress.bestStreak) {
            englishState.writeProgress.bestStreak = englishState.writeProgress.currentStreak;
        }
        englishState.totalStars++;

        if (!englishState.writeProgress.lettersCompleted.includes(englishState.currentQuestion)) {
            englishState.writeProgress.lettersCompleted.push(englishState.currentQuestion);
        }
    } else {
        englishState.writeProgress.currentStreak = 0;
    }

    const feedback = document.getElementById('letterFeedback');
    feedback.textContent = ValidationUtils.getFeedback(isCorrect, englishState.writeProgress.currentStreak);
    feedback.className = `feedback-display ${isCorrect ? 'success' : 'error'}`;

    updateModuleStats('write');

    if (isCorrect) {
        setTimeout(() => {
            currentLetterIndex++;
            loadLetter();
        }, 1500);
    }
}

// Word Copying
let currentWordIndex = 0;

function loadWordToCopy() {
    const words = getVocabularyByTier(1);
    const word = words[currentWordIndex % words.length];
    englishState.currentQuestion = word.word;

    document.getElementById('wordDisplay').textContent = word.word;
    document.getElementById('wordImage').textContent = '📝';
    document.getElementById('wordInput').value = '';
    document.getElementById('wordFeedback').textContent = '';
    document.getElementById('wordFeedback').className = 'feedback-display';
}

function playWord() {
    voiceManager.speak(englishState.currentQuestion);
}

function checkWord() {
    const userInput = document.getElementById('wordInput').value.toLowerCase();
    const result = ValidationUtils.textMatches(userInput, englishState.currentQuestion);

    englishState.writeProgress.totalQuestions++;
    if (result.match) {
        englishState.writeProgress.correctAnswers++;
        englishState.writeProgress.currentStreak++;
        if (englishState.writeProgress.currentStreak > englishState.writeProgress.bestStreak) {
            englishState.writeProgress.bestStreak = englishState.writeProgress.currentStreak;
        }
        englishState.totalStars++;

        if (!englishState.writeProgress.wordsWritten.includes(englishState.currentQuestion)) {
            englishState.writeProgress.wordsWritten.push(englishState.currentQuestion);
        }
    } else {
        englishState.writeProgress.currentStreak = 0;
    }

    const feedback = document.getElementById('wordFeedback');
    feedback.textContent = ValidationUtils.getFeedback(result.match, englishState.writeProgress.currentStreak);
    feedback.className = `feedback-display ${result.match ? 'success' : 'error'}`;

    updateModuleStats('write');

    if (result.match) {
        setTimeout(() => {
            currentWordIndex++;
            loadWordToCopy();
        }, 1500);
    }
}

// ============================================================================
// PROGRESS TRACKING
// ============================================================================

function updateHomeDashboard() {
    // Update streak
    updateStreak();
    document.getElementById('streakDisplay').textContent = englishState.consecutiveDays;

    // Update words learned
    const uniqueWords = new Set([
        ...englishState.listenProgress.vocabularyMastered,
        ...englishState.readProgress.sightWordsMastered
    ]);
    englishState.totalWordsLearned = uniqueWords.size;
    document.getElementById('wordsDisplay').textContent = englishState.totalWordsLearned;

    // Update stars
    document.getElementById('starsDisplay').textContent = englishState.totalStars;

    // Update module progress bars
    updateModuleProgressBar('listen');
    updateModuleProgressBar('speak');
    updateModuleProgressBar('read');
    updateModuleProgressBar('write');
}

function updateStreak() {
    const today = new Date().toDateString();
    const lastActive = englishState.lastActiveDate;

    if (lastActive !== today) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        if (lastActive === yesterday.toDateString()) {
            // Continued streak
            englishState.consecutiveDays++;
        } else if (lastActive === null) {
            // First day
            englishState.consecutiveDays = 1;
        } else {
            // Streak broken
            englishState.consecutiveDays = 1;
        }

        englishState.lastActiveDate = today;
        saveAllProgress();
    }
}

function updateModuleProgressBar(moduleName) {
    const progress = englishState[moduleName + 'Progress'];
    let percentage = 0;

    if (moduleName === 'listen') {
        const storyProgress = (progress.storiesCompleted.length / 5) * 50;
        const vocabProgress = (progress.vocabularyMastered.length / 50) * 50;
        percentage = Math.min(100, storyProgress + vocabProgress);
    } else if (moduleName === 'speak') {
        percentage = Math.min(100, (progress.successfulAttempts / 20) * 100);
    } else if (moduleName === 'read') {
        percentage = Math.min(100, (progress.sightWordsMastered.length / 25) * 100);
    } else if (moduleName === 'write') {
        const letterProgress = (progress.lettersCompleted.length / 26) * 50;
        const wordProgress = (progress.wordsWritten.length / 10) * 50;
        percentage = Math.min(100, letterProgress + wordProgress);
    }

    document.getElementById(moduleName + 'Progress').style.width = percentage + '%';
}

function updateModuleStats(moduleName) {
    const progress = englishState[moduleName + 'Progress'];
    const scoreElement = document.getElementById(moduleName + 'Score');
    const streakElement = document.getElementById(moduleName + 'Streak');

    if (moduleName === 'speak') {
        scoreElement.textContent = `${progress.successfulAttempts}/${progress.totalAttempts} successful`;
    } else {
        scoreElement.textContent = `${progress.correctAnswers}/${progress.totalQuestions} correct`;
    }

    streakElement.textContent = `Streak: ${progress.currentStreak}`;
}

function updateAllProgress() {
    updateModuleStats('listen');
    updateModuleStats('speak');
    updateModuleStats('read');
    updateModuleStats('write');
}

// ============================================================================
// FEEDBACK MODAL
// ============================================================================

function showFeedbackModal(isCorrect) {
    const modal = document.getElementById('feedbackModal');
    const icon = document.getElementById('modalIcon');
    const text = document.getElementById('modalText');

    if (isCorrect) {
        icon.textContent = '⭐';
        text.textContent = ValidationUtils.getFeedback(true, englishState.listenProgress.currentStreak);
    } else {
        icon.textContent = '💪';
        text.textContent = ValidationUtils.getFeedback(false);
    }

    modal.classList.remove('hidden');

    // Auto-close after 2 seconds
    setTimeout(() => {
        modal.classList.add('hidden');
    }, 2000);
}

function closeFeedbackModal() {
    document.getElementById('feedbackModal').classList.add('hidden');
}

// ============================================================================
// SETTINGS
// ============================================================================

function setupSettingsListeners() {
    const speedSlider = document.getElementById('voiceSpeed');
    const volumeSlider = document.getElementById('voiceVolume');

    if (speedSlider) {
        speedSlider.value = englishState.voiceRate;
        document.getElementById('voiceSpeedValue').textContent = englishState.voiceRate + 'x';

        speedSlider.addEventListener('input', (e) => {
            const value = parseFloat(e.target.value);
            englishState.voiceRate = value;
            voiceManager.setRate(value);
            document.getElementById('voiceSpeedValue').textContent = value + 'x';
            saveAllProgress();
        });
    }

    if (volumeSlider) {
        volumeSlider.value = englishState.voiceVolume;
        document.getElementById('voiceVolumeValue').textContent = Math.round(englishState.voiceVolume * 100) + '%';

        volumeSlider.addEventListener('input', (e) => {
            const value = parseFloat(e.target.value);
            englishState.voiceVolume = value;
            voiceManager.setVolume(value);
            document.getElementById('voiceVolumeValue').textContent = Math.round(value * 100) + '%';
            saveAllProgress();
        });
    }
}

function checkVoiceSupport() {
    const support = voiceManager.isSupported();
    const container = document.getElementById('voiceSupport');

    if (container) {
        container.innerHTML = `
            <div>Speech Synthesis: ${support.synthesis ? '✅ Supported' : '❌ Not Supported'}</div>
            <div>Speech Recognition: ${support.recognition ? '✅ Supported' : '❌ Not Supported'}</div>
        `;

        if (!support.full) {
            container.innerHTML += '<div style="color: var(--warning); margin-top: 10px;">⚠️ Some features may not work properly. Please use Chrome, Edge, or Safari.</div>';
        }
    }
}

function confirmClearData() {
    if (confirm('Are you sure you want to clear all progress? This cannot be undone!')) {
        StorageManager.clearAll();
        location.reload();
    }
}

function exportProgress() {
    const data = StorageManager.exportData();
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `emma-english-progress-${new Date().toISOString().split('T')[0]}.json`;
    a.click();

    URL.revokeObjectURL(url);
}

// ============================================================================
// STORAGE
// ============================================================================

function saveAllProgress() {
    StorageManager.saveState(englishState);
}

function loadAllProgress() {
    const savedState = StorageManager.loadState();

    if (savedState) {
        // Merge saved state with default state
        Object.assign(englishState, savedState);
        console.log('✅ Progress loaded from LocalStorage');
    } else {
        console.log('📝 Starting fresh - no saved progress found');
    }
}

// Auto-save every 30 seconds
setInterval(() => {
    saveAllProgress();
}, 30000);

// Save before page unload
window.addEventListener('beforeunload', () => {
    saveAllProgress();
});

console.log('✅ Emma\'s English Practice App Loaded Successfully!');
