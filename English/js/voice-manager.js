/**
 * Voice Manager - Wrapper for Web Speech API
 * Handles speech recognition (speech-to-text) and synthesis (text-to-speech)
 */

class VoiceManager {
    constructor() {
        // Check browser support
        this.speechSynthesisSupported = 'speechSynthesis' in window;
        this.speechRecognitionSupported = 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;

        // Initialize speech synthesis
        if (this.speechSynthesisSupported) {
            this.synthesis = window.speechSynthesis;
            this.voices = [];
            this.selectedVoice = null;
            this.loadVoices();
        }

        // Initialize speech recognition
        if (this.speechRecognitionSupported) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.recognition = new SpeechRecognition();
            this.recognition.lang = 'en-US';
            this.recognition.continuous = false;
            this.recognition.interimResults = false;
            this.recognition.maxAlternatives = 1;
        }

        // State
        this.isSpeaking = false;
        this.isListening = false;
        this.rate = 0.9; // Slightly slower for clarity
        this.pitch = 1.0;
        this.volume = 1.0;
    }

    /**
     * Load available voices
     */
    loadVoices() {
        if (!this.speechSynthesisSupported) return;

        this.voices = this.synthesis.getVoices();

        // If voices not loaded yet, wait for event
        if (this.voices.length === 0) {
            this.synthesis.addEventListener('voiceschanged', () => {
                this.voices = this.synthesis.getVoices();
                this.selectBestVoice();
            });
        } else {
            this.selectBestVoice();
        }
    }

    /**
     * Select best English voice (prefer female for children)
     */
    selectBestVoice() {
        if (this.voices.length === 0) return;

        // Try to find US English female voice
        let voice = this.voices.find(v => v.lang === 'en-US' && v.name.includes('Female'));

        // Fallback: any US English voice
        if (!voice) {
            voice = this.voices.find(v => v.lang === 'en-US');
        }

        // Fallback: any English voice
        if (!voice) {
            voice = this.voices.find(v => v.lang.startsWith('en'));
        }

        // Fallback: first available voice
        if (!voice) {
            voice = this.voices[0];
        }

        this.selectedVoice = voice;
        console.log('Selected voice:', voice ? voice.name : 'Default');
    }

    /**
     * Speak text using speech synthesis
     * @param {string} text - Text to speak
     * @param {function} onEnd - Callback when speech ends
     * @param {function} onError - Callback on error
     */
    speak(text, onEnd = null, onError = null) {
        if (!this.speechSynthesisSupported) {
            console.warn('Speech synthesis not supported');
            if (onError) onError('Speech synthesis not supported');
            return;
        }

        // Cancel any ongoing speech
        this.stopSpeaking();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = this.rate;
        utterance.pitch = this.pitch;
        utterance.volume = this.volume;
        utterance.lang = 'en-US';

        if (this.selectedVoice) {
            utterance.voice = this.selectedVoice;
        }

        utterance.onstart = () => {
            this.isSpeaking = true;
        };

        utterance.onend = () => {
            this.isSpeaking = false;
            if (onEnd) onEnd();
        };

        utterance.onerror = (event) => {
            this.isSpeaking = false;
            console.error('Speech synthesis error:', event);
            if (onError) onError(event);
        };

        this.synthesis.speak(utterance);
    }

    /**
     * Stop current speech
     */
    stopSpeaking() {
        if (this.speechSynthesisSupported && this.synthesis.speaking) {
            this.synthesis.cancel();
            this.isSpeaking = false;
        }
    }

    /**
     * Listen for speech input
     * @param {function} onResult - Callback with transcript and confidence
     * @param {function} onError - Callback on error
     */
    listen(onResult, onError = null) {
        if (!this.speechRecognitionSupported) {
            console.warn('Speech recognition not supported');
            if (onError) onError('Speech recognition not supported');
            return;
        }

        if (this.isListening) {
            console.warn('Already listening');
            return;
        }

        this.recognition.onstart = () => {
            this.isListening = true;
            console.log('Listening...');
        };

        this.recognition.onresult = (event) => {
            const result = event.results[0][0];
            const transcript = result.transcript.trim();
            const confidence = result.confidence;

            console.log('Heard:', transcript, 'Confidence:', confidence);

            if (onResult) {
                onResult(transcript, confidence);
            }
        };

        this.recognition.onerror = (event) => {
            this.isListening = false;
            console.error('Speech recognition error:', event.error);

            if (onError) {
                onError(event.error);
            }
        };

        this.recognition.onend = () => {
            this.isListening = false;
            console.log('Stopped listening');
        };

        try {
            this.recognition.start();
        } catch (error) {
            console.error('Failed to start recognition:', error);
            this.isListening = false;
            if (onError) onError(error);
        }
    }

    /**
     * Stop listening
     */
    stopListening() {
        if (this.speechRecognitionSupported && this.isListening) {
            try {
                this.recognition.stop();
            } catch (error) {
                console.error('Error stopping recognition:', error);
            }
            this.isListening = false;
        }
    }

    /**
     * Set speech rate (0.1 to 10)
     */
    setRate(rate) {
        this.rate = Math.max(0.1, Math.min(10, rate));
    }

    /**
     * Set speech pitch (0 to 2)
     */
    setPitch(pitch) {
        this.pitch = Math.max(0, Math.min(2, pitch));
    }

    /**
     * Set speech volume (0 to 1)
     */
    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume));
    }

    /**
     * Check if browser supports voice features
     */
    isSupported() {
        return {
            synthesis: this.speechSynthesisSupported,
            recognition: this.speechRecognitionSupported,
            full: this.speechSynthesisSupported && this.speechRecognitionSupported
        };
    }

    /**
     * Get list of available voices
     */
    getVoices() {
        return this.voices;
    }

    /**
     * Set specific voice by name
     */
    setVoice(voiceName) {
        const voice = this.voices.find(v => v.name === voiceName);
        if (voice) {
            this.selectedVoice = voice;
            return true;
        }
        return false;
    }
}

// Create global instance
const voiceManager = new VoiceManager();
