// voice-config.js - Easy Configuration for Voice System
// Place this file in static/js/ and load it BEFORE voice-commands.js

const VOICE_CONFIG = {
    // ============================================
    // RECOGNITION SETTINGS
    // ============================================
    recognition: {
        language: 'en-IN',              // Primary language
        maxAlternatives: 5,             // Number of alternative transcripts (1-5)
        continuous: true,               // Keep listening after recognition
        interimResults: false,          // Show results while speaking
    },

    // ============================================
    // CONFIDENCE THRESHOLDS
    // ============================================
    confidence: {
        intent: 0.3,                    // Minimum confidence for intent matching (0.2-0.5)
        entity: 0.4,                    // Minimum confidence for entity extraction (0.3-0.6)
        exactMatch: 0.95,               // Consider as exact match (0.9-1.0)
        goodMatch: 0.85,                // Good phonetic match (0.8-0.9)
        fairMatch: 0.70,                // Fair match, acceptable (0.6-0.8)
    },

    // ============================================
    // SPEECH SYNTHESIS (Text-to-Speech)
    // ============================================
    speech: {
        language: 'en-IN',              // Voice language
        rate: 0.9,                      // Speech speed (0.5-2.0)
        pitch: 1.0,                     // Voice pitch (0.5-2.0)
        volume: 1.0,                    // Volume (0.0-1.0)
        preferredVoices: [              // Preferred voice names (in order)
            'Google हिन्दी',
            'Microsoft Zira - English (India)',
            'Google US English'
        ]
    },

    // ============================================
    // CUSTOM PHONETIC MAPPINGS
    // ============================================
    // Add your candidate names and their common mispronunciations
    customPhonetics: {
        // Format: 'correctname': ['variation1', 'variation2', 'variation3']
        
        // Example candidates (replace with your actual candidates)
        'arvind': ['arvind', 'arwind', 'aravind', 'arvind'],
        'mamta': ['mamata', 'mamtha', 'mamtaa', 'mamata'],
        'yogi': ['yogi', 'jogee', 'yogee', 'yogi'],
        'uddhav': ['udhav', 'uddhav', 'udhav', 'uddhaw'],
        'nitin': ['nitin', 'neetin', 'nithin', 'netin'],
        'devendra': ['devendra', 'devender', 'devindra'],
        'pinarayi': ['pinarayi', 'pinarai', 'pinrayi'],
        'hemant': ['hemant', 'hementh', 'haimant'],
        'bhagwant': ['bhagwant', 'bhagwanth', 'bhagvant'],
        'pushkar': ['pushkar', 'pooshkar', 'pushkaar'],
        
        // Party names
        'congress': ['kangres', 'congres', 'congrss'],
        'bharatiya': ['bhartiya', 'bhaaratiya', 'bhartia'],
        'janata': ['janatha', 'janata', 'jantha'],
        'samajwadi': ['samajvadi', 'samajwadee', 'samajwadi'],
        'trinamool': ['trinamul', 'trinamool', 'trina mool'],
        'shiv': ['shiv', 'shiva', 'shiw'],
        'sena': ['sena', 'senaa', 'sainna'],
    },

    // ============================================
    // REGIONAL LANGUAGE SUPPORT
    // ============================================
    regionalLanguages: {
        hindi: {
            enabled: false,              // Enable Hindi commands
            patterns: {
                'vote': ['वोट', 'मतदान'],
                'show': ['दिखाओ', 'बताओ'],
                'confirm': ['पुष्टि', 'ठीक है', 'हाँ'],
                'cancel': ['रद्द', 'नहीं', 'रोको']
            }
        },
        marathi: {
            enabled: false,              // Enable Marathi commands
            patterns: {
                'vote': ['मत', 'मतदान'],
                'show': ['दाखवा', 'सांगा'],
                'confirm': ['पुष्टी', 'ठीक आहे', 'होय'],
                'cancel': ['रद्द', 'नाही', 'थांबा']
            }
        },
        telugu: {
            enabled: false,              // Enable Telugu commands
            patterns: {
                'vote': ['ఓటు', 'మతదానం'],
                'show': ['చూపించు', 'చెప్పండి'],
                'confirm': ['నిర్ధారించు', 'సరే', 'అవును'],
                'cancel': ['రద్దు', 'వద్దు', 'ఆపు']
            }
        }
    },

    // ============================================
    // UI CUSTOMIZATION
    // ============================================
    ui: {
        showTranscript: true,           // Show what was heard
        showResponse: true,             // Show system response
        transcriptTimeout: 5000,        // Hide transcript after ms
        responseTimeout: 5000,          // Hide response after ms
        statusColors: {
            listening: 'bg-success',
            ready: 'bg-secondary',
            error: 'bg-danger',
            processing: 'bg-warning'
        }
    },

    // ============================================
    // DEBUGGING
    // ============================================
    debug: {
        enabled: true,                  // Enable console logging
        showAlternatives: true,         // Log all speech alternatives
        showConfidence: true,           // Log confidence scores
        showPhoneticMatches: true,      // Log phonetic matching details
        logToServer: false,             // Send logs to server (requires endpoint)
        serverEndpoint: '/api/voice-logs/'
    },

    // ============================================
    // PERFORMANCE OPTIMIZATION
    // ============================================
    performance: {
        maxCandidates: 50,              // Maximum candidates to process
        cacheResults: true,             // Cache phonetic calculations
        lazyLoadPhonetics: false,       // Load phonetics on demand
        throttleRecognition: 500,       // Throttle processing (ms)
    },

    // ============================================
    // ACCESSIBILITY
    // ============================================
    accessibility: {
        announceActions: true,          // Speak actions to user
        verboseMode: false,             // Detailed voice feedback
        repeatLastCommand: true,        // Allow "repeat" command
        confirmBeforeAction: true,      // Require confirmation for votes
        keyboardShortcuts: {
            toggleMic: 'Alt+V',
            stopListening: 'Escape',
            repeatLast: 'Alt+R'
        }
    },

    // ============================================
    // ADVANCED SETTINGS
    // ============================================
    advanced: {
        // Phonetic algorithm weights
        algorithmWeights: {
            soundex: 0.85,              // Weight for Soundex matches
            metaphone: 0.85,            // Weight for Metaphone matches
            levenshtein: 0.90,          // Weight for Levenshtein matches
            database: 0.95,             // Weight for database matches
            prefix: 0.08                // Bonus per matching prefix character
        },

        // Entity extraction settings
        entityExtraction: {
            removeStopWords: true,
            stopWords: ['vote', 'in', 'for', 'the', 'a', 'an', 'open', 
                       'select', 'choose', 'election', 'candidate', 'show', 'list'],
            matchPartialNames: true,    // Match first/last name only
            matchPartyNames: true,      // Match by party name
            partyMatchWeight: 0.8       // Weight for party matches
        },

        // Intent matching settings
        intentMatching: {
            patternWeight: 0.6,         // Weight for pattern matches
            keywordWeight: 0.4,         // Weight for keyword matches
            allowPartialMatch: true,    // Allow partial intent matches
            fuzzyKeywords: true         // Use phonetic matching for keywords
        },

        // Multi-word matching
        multiWord: {
            enabled: true,
            matchAsPhrase: true,        // Try matching as complete phrase
            matchWordByWord: true,      // Try word-by-word matching
            requireAllWords: false,     // Require all words to match
            minWordMatch: 0.5           // Minimum proportion of words to match
        }
    },

    // ============================================
    // ERROR HANDLING
    // ============================================
    errorHandling: {
        maxRetries: 3,                  // Max retries on error
        retryDelay: 1000,               // Delay between retries (ms)
        fallbackToText: true,           // Allow text input on repeated failures
        showErrorMessages: true,        // Show user-friendly error messages
        customErrors: {
            'no-speech': 'No speech detected. Please speak clearly.',
            'audio-capture': 'Microphone not accessible. Check permissions.',
            'not-allowed': 'Microphone access denied. Please enable it.',
            'network': 'Network error. Check your connection.',
            'aborted': 'Speech recognition was aborted.'
        }
    },

    // ============================================
    // ANALYTICS (Optional)
    // ============================================
    analytics: {
        enabled: false,                 // Track usage analytics
        endpoint: '/api/voice-analytics/',
        trackEvents: {
            commandUsed: true,
            intentMatched: true,
            entityExtracted: true,
            voteCompleted: true,
            errorOccurred: true
        }
    }
};

// ============================================
// CONFIGURATION VALIDATION
// ============================================
(function validateConfig() {
    const warnings = [];

    if (VOICE_CONFIG.confidence.intent < 0.2) {
        warnings.push('⚠️ Intent confidence is very low - may cause false matches');
    }

    if (VOICE_CONFIG.confidence.entity < 0.3) {
        warnings.push('⚠️ Entity confidence is very low - may cause false matches');
    }

    if (VOICE_CONFIG.recognition.maxAlternatives > 5) {
        warnings.push('⚠️ maxAlternatives > 5 may impact performance');
    }

    if (VOICE_CONFIG.speech.rate < 0.5 || VOICE_CONFIG.speech.rate > 2.0) {
        warnings.push('⚠️ Speech rate outside recommended range (0.5-2.0)');
    }

    if (warnings.length > 0) {
        console.warn('Voice Config Warnings:');
        warnings.forEach(w => console.warn(w));
    }

    console.log('✅ Voice configuration loaded successfully');
})();

// Export for use in voice-commands.js
if (typeof window !== 'undefined') {
    window.VOICE_CONFIG = VOICE_CONFIG;
}

// ============================================
// HELPER FUNCTIONS
// ============================================

// Add a new phonetic mapping at runtime
VOICE_CONFIG.addPhonetic = function(correctName, variations) {
    this.customPhonetics[correctName.toLowerCase()] = variations.map(v => v.toLowerCase());
    console.log(`✓ Added phonetic mapping: ${correctName} → [${variations.join(', ')}]`);
};

// Update confidence threshold
VOICE_CONFIG.setConfidence = function(type, value) {
    if (this.confidence[type] !== undefined && value >= 0 && value <= 1) {
        this.confidence[type] = value;
        console.log(`✓ Updated ${type} confidence to ${value}`);
    } else {
        console.error(`❌ Invalid confidence setting: ${type} = ${value}`);
    }
};

// Enable/disable regional language
VOICE_CONFIG.enableRegionalLanguage = function(language, enabled) {
    if (this.regionalLanguages[language]) {
        this.regionalLanguages[language].enabled = enabled;
        console.log(`✓ ${language} support ${enabled ? 'enabled' : 'disabled'}`);
    } else {
        console.error(`❌ Unknown language: ${language}`);
    }
};

// Bulk add phonetic mappings from CSV
VOICE_CONFIG.importPhonetics = function(csvData) {
    const lines = csvData.split('\n');
    let count = 0;
    
    lines.forEach(line => {
        const parts = line.split(',').map(s => s.trim());
        if (parts.length >= 2) {
            const [correctName, ...variations] = parts;
            this.addPhonetic(correctName, variations);
            count++;
        }
    });
    
    console.log(`✓ Imported ${count} phonetic mappings`);
};

// Export current config as JSON
VOICE_CONFIG.export = function() {
    return JSON.stringify(this, null, 2);
};

// ============================================
// USAGE EXAMPLES
// ============================================

/*
// Example 1: Add candidate names at runtime
VOICE_CONFIG.addPhonetic('Tejashwi', ['tejaswi', 'tejaswee', 'tejasvi']);

// Example 2: Change confidence thresholds
VOICE_CONFIG.setConfidence('entity', 0.35);

// Example 3: Enable Hindi support
VOICE_CONFIG.enableRegionalLanguage('hindi', true);

// Example 4: Bulk import from CSV
const csv = `
Akhilesh,Akilesh,Akhilesh,Akilesh
Mayawati,Mayavati,Mayawathi,Maya
Naveen,Navin,Naveen,Naven
`;
VOICE_CONFIG.importPhonetics(csv);

// Example 5: Export current configuration
console.log(VOICE_CONFIG.export());
*/