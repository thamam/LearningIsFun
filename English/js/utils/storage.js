/**
 * LocalStorage Persistence Manager
 * Handles saving and loading progress data
 */

const StorageManager = {
    // Storage keys
    keys: {
        state: 'emmaEnglishState',
        listenProgress: 'emmaListenProgress',
        speakProgress: 'emmaSpeakProgress',
        readProgress: 'emmaReadProgress',
        writeProgress: 'emmaWriteProgress',
        settings: 'emmaEnglishSettings'
    },

    /**
     * Save entire state object
     */
    saveState(state) {
        try {
            localStorage.setItem(this.keys.state, JSON.stringify(state));
            return true;
        } catch (error) {
            console.error('Error saving state:', error);
            return false;
        }
    },

    /**
     * Load entire state object
     */
    loadState() {
        try {
            const data = localStorage.getItem(this.keys.state);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Error loading state:', error);
            return null;
        }
    },

    /**
     * Save module-specific progress
     */
    saveModuleProgress(moduleName, progressData) {
        try {
            const key = this.keys[`${moduleName}Progress`];
            if (key) {
                localStorage.setItem(key, JSON.stringify(progressData));
                return true;
            }
            return false;
        } catch (error) {
            console.error(`Error saving ${moduleName} progress:`, error);
            return false;
        }
    },

    /**
     * Load module-specific progress
     */
    loadModuleProgress(moduleName) {
        try {
            const key = this.keys[`${moduleName}Progress`];
            if (key) {
                const data = localStorage.getItem(key);
                return data ? JSON.parse(data) : null;
            }
            return null;
        } catch (error) {
            console.error(`Error loading ${moduleName} progress:`, error);
            return null;
        }
    },

    /**
     * Save settings
     */
    saveSettings(settings) {
        try {
            localStorage.setItem(this.keys.settings, JSON.stringify(settings));
            return true;
        } catch (error) {
            console.error('Error saving settings:', error);
            return false;
        }
    },

    /**
     * Load settings
     */
    loadSettings() {
        try {
            const data = localStorage.getItem(this.keys.settings);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Error loading settings:', error);
            return null;
        }
    },

    /**
     * Clear all data
     */
    clearAll() {
        try {
            Object.values(this.keys).forEach(key => {
                localStorage.removeItem(key);
            });
            return true;
        } catch (error) {
            console.error('Error clearing data:', error);
            return false;
        }
    },

    /**
     * Export all data as JSON
     */
    exportData() {
        const data = {};
        Object.entries(this.keys).forEach(([name, key]) => {
            const item = localStorage.getItem(key);
            if (item) {
                data[name] = JSON.parse(item);
            }
        });
        return data;
    },

    /**
     * Import data from JSON
     */
    importData(data) {
        try {
            Object.entries(data).forEach(([name, value]) => {
                const key = this.keys[name];
                if (key) {
                    localStorage.setItem(key, JSON.stringify(value));
                }
            });
            return true;
        } catch (error) {
            console.error('Error importing data:', error);
            return false;
        }
    }
};
