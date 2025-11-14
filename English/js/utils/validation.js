/**
 * Answer Validation Utilities
 * Compare user answers with correct answers
 */

const ValidationUtils = {
    /**
     * Normalize text for comparison (lowercase, trim, remove punctuation)
     */
    normalizeText(text) {
        return text
            .toLowerCase()
            .trim()
            .replace(/[.,!?;:]/g, '');
    },

    /**
     * Check if two texts match (with fuzzy matching)
     */
    textMatches(userText, correctText, threshold = 0.8) {
        const normalized1 = this.normalizeText(userText);
        const normalized2 = this.normalizeText(correctText);

        // Exact match
        if (normalized1 === normalized2) {
            return { match: true, confidence: 1.0 };
        }

        // Check if one contains the other
        if (normalized1.includes(normalized2) || normalized2.includes(normalized1)) {
            return { match: true, confidence: 0.9 };
        }

        // Calculate similarity
        const similarity = this.calculateSimilarity(normalized1, normalized2);
        return {
            match: similarity >= threshold,
            confidence: similarity
        };
    },

    /**
     * Calculate similarity between two strings (Levenshtein-based)
     */
    calculateSimilarity(str1, str2) {
        const longer = str1.length > str2.length ? str1 : str2;
        const shorter = str1.length > str2.length ? str2 : str1;

        if (longer.length === 0) {
            return 1.0;
        }

        const distance = this.levenshteinDistance(longer, shorter);
        return (longer.length - distance) / longer.length;
    },

    /**
     * Calculate Levenshtein distance between two strings
     */
    levenshteinDistance(str1, str2) {
        const matrix = [];

        for (let i = 0; i <= str2.length; i++) {
            matrix[i] = [i];
        }

        for (let j = 0; j <= str1.length; j++) {
            matrix[0][j] = j;
        }

        for (let i = 1; i <= str2.length; i++) {
            for (let j = 1; j <= str1.length; j++) {
                if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] = Math.min(
                        matrix[i - 1][j - 1] + 1, // substitution
                        matrix[i][j - 1] + 1,     // insertion
                        matrix[i - 1][j] + 1      // deletion
                    );
                }
            }
        }

        return matrix[str2.length][str1.length];
    },

    /**
     * Check multiple choice answer
     */
    checkMultipleChoice(selectedIndex, correctIndex) {
        return selectedIndex === correctIndex;
    },

    /**
     * Provide encouraging feedback based on performance
     */
    getFeedback(isCorrect, streak = 0) {
        if (isCorrect) {
            const positive = [
                'Great job! 🌟',
                'Excellent! ⭐',
                'Perfect! 🎉',
                'Well done! 👏',
                'Amazing! ✨',
                'Fantastic! 🌈',
                'You got it! 🎯',
                'Super! 💫'
            ];

            if (streak >= 5) {
                return 'Incredible streak! You\'re on fire! 🔥';
            } else if (streak >= 3) {
                return positive[Math.floor(Math.random() * positive.length)] + ' Keep it going!';
            }

            return positive[Math.floor(Math.random() * positive.length)];
        } else {
            const encouraging = [
                'Not quite, but good try! Let\'s try again. 💪',
                'Almost! You\'re very close! 🌟',
                'Good effort! Let\'s give it another go! 🎯',
                'Nice try! You can do it! ⭐',
                'Keep trying! You\'re learning! 📚'
            ];
            return encouraging[Math.floor(Math.random() * encouraging.length)];
        }
    },

    /**
     * Check if spoken word matches target word
     */
    checkSpokenWord(spokenText, targetWord, confidence = 0) {
        // Lower threshold if confidence is low
        const threshold = confidence > 0.8 ? 0.8 : 0.7;
        return this.textMatches(spokenText, targetWord, threshold);
    },

    /**
     * Extract keywords from spoken sentence
     */
    extractKeywords(text) {
        const normalized = this.normalizeText(text);
        const words = normalized.split(/\s+/);

        // Remove common stop words
        const stopWords = ['the', 'a', 'an', 'and', 'or', 'but', 'is', 'are', 'was', 'were'];
        return words.filter(word => !stopWords.includes(word) && word.length > 0);
    },

    /**
     * Check if sentence contains required keywords
     */
    containsKeywords(text, keywords) {
        const textKeywords = this.extractKeywords(text);
        const normalizedKeywords = keywords.map(k => this.normalizeText(k));

        let matchCount = 0;
        for (const keyword of normalizedKeywords) {
            if (textKeywords.some(tk => this.normalizeText(tk).includes(keyword))) {
                matchCount++;
            }
        }

        return {
            matched: matchCount,
            total: keywords.length,
            percentage: matchCount / keywords.length
        };
    }
};
