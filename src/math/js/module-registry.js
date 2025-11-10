/**
 * Emma Math Lab - Module Registry System
 *
 * Provides unified interface for registering and managing math practice modules.
 * Enables parallel development of modules following a consistent interface.
 *
 * @version 1.0.0
 * @date 2025-11-09
 */

// ============================================================================
// JSDoc Type Definitions
// ============================================================================

/**
 * Module state object structure (REQUIRED for all modules)
 *
 * @typedef {Object} ModuleState
 * @property {('קל'|'בינוני'|'קשה')} level - Current difficulty level
 * @property {number} totalQuestions - Total questions attempted
 * @property {number} correctAnswers - Number of correct answers
 * @property {number} currentStreak - Current consecutive correct streak
 * @property {number} bestStreak - Best streak achieved this session
 * @property {number} consecutiveCorrect - Consecutive correct (for difficulty adjustment)
 * @property {number} consecutiveWrong - Consecutive wrong (for difficulty adjustment)
 * @property {QuestionObject|null} currentQuestion - Current question object
 * @property {*} currentAnswer - Expected answer (number, string, or object)
 * @property {Array<HistoryEntry>} sessionHistory - Question history
 * @property {number} startTime - Session start timestamp
 * @property {number|null} lastSaved - Last save timestamp
 * @property {Array<QuestionObject>} [questionBank] - All generated questions (navigation)
 * @property {number} [currentQuestionIndex] - Current position (navigation)
 * @property {Array<number>} [skippedQuestions] - Skipped indices (navigation)
 * @property {Array<number>} [answeredQuestions] - Answered indices (navigation)
 * @property {Object} [questionStatus] - Question state map (navigation)
 * @property {*} [selectedChoice] - Currently selected choice (for choice questions)
 */

/**
 * Question object structure
 *
 * @typedef {Object} QuestionObject
 * @property {string} question - Question text in Hebrew
 * @property {('input'|'choice'|'visual'|'visual-input'|'visual-choice')} type - Question type
 * @property {Array<*>} [choices] - Available choices (REQUIRED if type includes 'choice')
 * @property {Object} [range] - Range configuration (for visual questions)
 * @property {number} [arrowPosition] - Arrow position (for numberline questions)
 * @property {*} [data] - Module-specific question data
 */

/**
 * History entry for session tracking
 *
 * @typedef {Object} HistoryEntry
 * @property {string} question - Question text
 * @property {*} userAnswer - User's answer
 * @property {*} correctAnswer - Correct answer
 * @property {boolean} isCorrect - Whether answer was correct
 * @property {number} timestamp - Timestamp of answer
 * @property {string} level - Difficulty level at time of answer
 */

/**
 * Level configuration object
 *
 * @typedef {Object} LevelConfig
 * @property {number} [min] - Minimum value
 * @property {number} [max] - Maximum value
 * @property {number} [interval] - Interval size
 * @property {Array<string>} [types] - Available question types
 * @property {*} [data] - Module-specific configuration
 */

/**
 * Module configuration for registry
 *
 * @typedef {Object} ModuleConfig
 * @property {string} name - Module name (lowercase, e.g., 'fraction')
 * @property {string} title - Module title in Hebrew
 * @property {string} storageKey - LocalStorage key (e.g., 'emmaFractionProgress')
 * @property {function():ModuleState} state - Function returning state object
 * @property {function():void} generateQuestion - Generate new question
 * @property {function():void} checkAnswer - Check user answer
 * @property {function(*, HTMLElement):void} [selectChoice] - Handle choice selection (optional)
 * @property {function():void} [displayVisual] - Display visual elements (optional)
 * @property {function():LevelConfig} [getConfig] - Get level-based config (optional)
 * @property {string} [description] - Module description
 * @property {Array<string>} [questionTypes] - Available question types
 */

/**
 * Module interface - required methods for all modules
 *
 * @typedef {Object} ModuleInterface
 * @property {string} name - Module name
 * @property {string} title - Module title in Hebrew
 * @property {string} storageKey - LocalStorage key
 * @property {function():ModuleState} getState - Get module state
 * @property {function():void} generateQuestion - Generate new question
 * @property {function():void} checkAnswer - Check user answer
 * @property {function():void} adjustDifficulty - Adjust difficulty based on performance
 * @property {function(*, HTMLElement):void} [selectChoice] - Handle choice selection
 * @property {function():void} [displayVisual] - Display visual elements
 */

// ============================================================================
// Module Registry Class
// ============================================================================

/**
 * Centralized registry for all math practice modules
 */
class ModuleRegistryClass {
    constructor() {
        /** @type {Object<string, ModuleInterface>} */
        this.modules = {};

        /** @type {boolean} */
        this.initialized = false;

        console.log('📦 Module Registry initialized');
    }

    /**
     * Register a new module
     *
     * @param {ModuleConfig} config - Module configuration
     * @returns {boolean} Success status
     *
     * @example
     * ModuleRegistry.register({
     *     name: 'fraction',
     *     title: 'שברים',
     *     storageKey: 'emmaFractionProgress',
     *     state: () => fractionState,
     *     generateQuestion: generateFractionQuestion,
     *     checkAnswer: checkFractionAnswer
     * });
     */
    register(config) {
        // Validate required fields
        if (!config.name) {
            console.error('❌ Module registration failed: name is required');
            return false;
        }

        if (!config.title) {
            console.error(`❌ Module registration failed: title is required for ${config.name}`);
            return false;
        }

        if (!config.state || typeof config.state !== 'function') {
            console.error(`❌ Module registration failed: state must be a function for ${config.name}`);
            return false;
        }

        if (!config.generateQuestion || typeof config.generateQuestion !== 'function') {
            console.error(`❌ Module registration failed: generateQuestion must be a function for ${config.name}`);
            return false;
        }

        if (!config.checkAnswer || typeof config.checkAnswer !== 'function') {
            console.error(`❌ Module registration failed: checkAnswer must be a function for ${config.name}`);
            return false;
        }

        // Check if module already registered
        if (this.modules[config.name]) {
            console.warn(`⚠️ Module '${config.name}' already registered, overwriting...`);
        }

        // Create module interface
        const module = {
            name: config.name,
            title: config.title,
            storageKey: config.storageKey || `emma${this.capitalize(config.name)}Progress`,
            getState: config.state,
            generateQuestion: config.generateQuestion,
            checkAnswer: config.checkAnswer,
            adjustDifficulty: this.createAdjustDifficultyFunction(config.name, config.state),
            selectChoice: config.selectChoice || null,
            displayVisual: config.displayVisual || null,
            getConfig: config.getConfig || null,
            description: config.description || '',
            questionTypes: config.questionTypes || []
        };

        // Store in registry
        this.modules[config.name] = module;

        // Auto-expose to window for backward compatibility and navigation patch
        const capitalizedName = this.capitalize(config.name);
        window[`generate${capitalizedName}Question`] = config.generateQuestion;
        window[`check${capitalizedName}Answer`] = config.checkAnswer;

        if (config.selectChoice) {
            window[`select${capitalizedName}Choice`] = config.selectChoice;
        }

        if (config.displayVisual) {
            window[`display${capitalizedName}Visual`] = config.displayVisual;
        }

        // Validate state structure
        this.validateState(config.name, config.state());

        console.log(`✅ Module registered: ${config.name} (${config.title})`);
        return true;
    }

    /**
     * Get a registered module by name
     *
     * @param {string} name - Module name
     * @returns {ModuleInterface|null} Module interface or null if not found
     */
    get(name) {
        return this.modules[name] || null;
    }

    /**
     * Get state for a module
     *
     * @param {string} name - Module name
     * @returns {ModuleState|null} Module state or null if not found
     */
    getState(name) {
        const module = this.get(name);
        return module ? module.getState() : null;
    }

    /**
     * Get storage key for a module
     *
     * @param {string} name - Module name
     * @returns {string|null} Storage key or null if not found
     */
    getStorageKey(name) {
        const module = this.get(name);
        return module ? module.storageKey : null;
    }

    /**
     * Get all registered modules
     *
     * @returns {Array<string>} Array of module names
     */
    getAllModules() {
        return Object.keys(this.modules);
    }

    /**
     * Get all module states as a dictionary
     *
     * @returns {Object<string, ModuleState>} Dictionary of module name → state
     */
    getAllStates() {
        const states = {};
        for (const name in this.modules) {
            states[name] = this.modules[name].getState();
        }
        return states;
    }

    /**
     * Get all storage keys as a dictionary
     *
     * @returns {Object<string, string>} Dictionary of module name → storage key
     */
    getAllStorageKeys() {
        const keys = {};
        for (const name in this.modules) {
            keys[name] = this.modules[name].storageKey;
        }
        return keys;
    }

    /**
     * Check if a module is registered
     *
     * @param {string} name - Module name
     * @returns {boolean} True if registered
     */
    isRegistered(name) {
        return this.modules.hasOwnProperty(name);
    }

    /**
     * Get module count
     *
     * @returns {number} Number of registered modules
     */
    getModuleCount() {
        return Object.keys(this.modules).length;
    }

    /**
     * Get module info for display
     *
     * @param {string} name - Module name
     * @returns {Object|null} Module info object
     */
    getModuleInfo(name) {
        const module = this.get(name);
        if (!module) return null;

        return {
            name: module.name,
            title: module.title,
            storageKey: module.storageKey,
            hasSelectChoice: module.selectChoice !== null,
            hasDisplayVisual: module.displayVisual !== null,
            description: module.description,
            questionTypes: module.questionTypes
        };
    }

    /**
     * Validate state object structure
     *
     * @param {string} moduleName - Module name for error messages
     * @param {*} state - State object to validate
     * @returns {boolean} True if valid
     */
    validateState(moduleName, state) {
        const requiredProps = [
            'level', 'totalQuestions', 'correctAnswers', 'currentStreak',
            'bestStreak', 'consecutiveCorrect', 'consecutiveWrong',
            'currentQuestion', 'currentAnswer', 'sessionHistory',
            'startTime', 'lastSaved'
        ];

        let isValid = true;

        for (const prop of requiredProps) {
            if (!(prop in state)) {
                console.error(`❌ ${moduleName}: Missing required state property '${prop}'`);
                isValid = false;
            }
        }

        // Validate types
        if (state.level && !['קל', 'בינוני', 'קשה'].includes(state.level)) {
            console.warn(`⚠️ ${moduleName}: Invalid level value '${state.level}', expected 'קל', 'בינוני', or 'קשה'`);
        }

        if (typeof state.totalQuestions !== 'number') {
            console.warn(`⚠️ ${moduleName}: totalQuestions should be a number`);
        }

        if (!Array.isArray(state.sessionHistory)) {
            console.warn(`⚠️ ${moduleName}: sessionHistory should be an array`);
        }

        return isValid;
    }

    /**
     * Create a generic difficulty adjustment function for a module
     *
     * @param {string} moduleName - Module name
     * @param {function():ModuleState} getStateFn - Function to get state
     * @returns {function():void} Difficulty adjustment function
     */
    createAdjustDifficultyFunction(moduleName, getStateFn) {
        return function() {
            const state = getStateFn();

            // Level up after 3 consecutive correct
            if (state.consecutiveCorrect >= 3 && state.level !== 'קשה') {
                if (state.level === 'קל') {
                    state.level = 'בינוני';
                } else if (state.level === 'בינוני') {
                    state.level = 'קשה';
                }

                if (typeof showLevelUp === 'function') {
                    showLevelUp(moduleName);
                }

                state.consecutiveCorrect = 0;
            }
            // Level down after 2 consecutive wrong
            else if (state.consecutiveWrong >= 2 && state.level !== 'קל') {
                if (state.level === 'קשה') {
                    state.level = 'בינוני';
                } else if (state.level === 'בינוני') {
                    state.level = 'קל';
                }

                if (typeof showLevelDown === 'function') {
                    showLevelDown(moduleName);
                }

                state.consecutiveWrong = 0;
            }
        };
    }

    /**
     * Capitalize first letter of string
     *
     * @param {string} str - String to capitalize
     * @returns {string} Capitalized string
     */
    capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    /**
     * Get registry statistics
     *
     * @returns {Object} Registry statistics
     */
    getStats() {
        return {
            totalModules: this.getModuleCount(),
            modules: this.getAllModules().map(name => ({
                name: name,
                title: this.modules[name].title,
                hasChoices: this.modules[name].selectChoice !== null,
                hasVisual: this.modules[name].displayVisual !== null
            }))
        };
    }

    /**
     * Log registry status to console
     */
    logStatus() {
        const stats = this.getStats();
        console.log('📊 Module Registry Status:');
        console.log(`   Total modules: ${stats.totalModules}`);
        console.log('   Registered modules:');
        stats.modules.forEach(m => {
            console.log(`   - ${m.name} (${m.title}) ${m.hasChoices ? '[choices]' : ''} ${m.hasVisual ? '[visual]' : ''}`);
        });
    }
}

// ============================================================================
// Create Global Registry Instance
// ============================================================================

/**
 * Global module registry instance
 * @type {ModuleRegistryClass}
 */
const ModuleRegistry = new ModuleRegistryClass();

// Expose to window for global access
window.ModuleRegistry = ModuleRegistry;

// ============================================================================
// Register Existing Modules
// ============================================================================

// Note: These registrations reference existing functions in Emma_math_lab.html
// The existing module code is NOT modified - we just wrap it in the registry

/**
 * Register decimal module
 */
if (typeof decimalState !== 'undefined' && typeof generateDecimalQuestion !== 'undefined') {
    ModuleRegistry.register({
        name: 'decimal',
        title: 'מבנה עשרוני',
        storageKey: 'emmaDecimalProgress',
        state: () => decimalState,
        generateQuestion: generateDecimalQuestion,
        checkAnswer: checkDecimalAnswer,
        selectChoice: selectDecimalChoice,
        description: 'תרגול מבנה עשרוני - פירוק מספרים, ערך ספרתי, השוואה',
        questionTypes: ['decomposition', 'digitValue', 'nextPrevious', 'compare', 'missingDigit']
    });
}

/**
 * Register multiplication module
 */
if (typeof multiplicationState !== 'undefined' && typeof generateMultiplicationQuestion !== 'undefined') {
    ModuleRegistry.register({
        name: 'multiplication',
        title: 'כפל',
        storageKey: 'emmaMultiplicationProgress',
        state: () => multiplicationState,
        generateQuestion: generateMultiplicationQuestion,
        checkAnswer: checkMultiplicationAnswer,
        description: 'תרגול כפל וחילוק - טבלאות כפל, כפל ספרתי, חילוק',
        questionTypes: ['missingMultiplier', 'missingMultiplicand', 'missingProduct', 'division']
    });
}

/**
 * Register numberline module
 */
if (typeof numberlineState !== 'undefined' && typeof generateNumberlineQuestion !== 'undefined') {
    ModuleRegistry.register({
        name: 'numberline',
        title: 'ישר מספרים',
        storageKey: 'emmaNumberLineProgress',
        state: () => numberlineState,
        generateQuestion: generateNumberlineQuestion,
        checkAnswer: checkNumberlineAnswer,
        selectChoice: selectNumberlineChoice,
        displayVisual: displayNumberLine,
        description: 'תרגול ישר מספרים - מיקום מספרים, מספרים בין, קרוב יותר',
        questionTypes: ['whatIsNumber', 'betweenNumbers', 'closerTo']
    });
}

// ============================================================================
// Initialization
// ============================================================================

// Log registry status when loaded
console.log('✅ Module Registry System Loaded');
ModuleRegistry.logStatus();
