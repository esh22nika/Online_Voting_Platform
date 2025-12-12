// WCAG AAA Compliant Accessibility with Auto-Translation & TTS
(function() {
    'use strict';

    // Translation data (fallback if API fails)
    const translations = {
        en: {
            title: "Voter Dashboard",
            welcome: "Welcome",
            voterId: "Voter ID",
            approved: "Approved",
            pending: "Pending",
            rejected: "Rejected",
            availableElections: "Available Elections",
            activeElections: "Active Elections",
            votesCast: "Votes Cast",
            profileStatus: "Profile Status",
            voted: "Voted",
            voteNow: "Vote Now",
            upcoming: "Upcoming",
            dashboard: "Dashboard",
            elections: "Elections",
            profile: "Profile",
            results: "Results",
            logout: "Logout",
            instructions: "Welcome to DeshKaVote. To cast your vote:Navigate to the Active Elections section. Choose the election you want to vote in, and press the Vote Now button. A list of candidates will appear.  Use your keyboard or mouse to select the candidate you prefer.  Then press the Confirm Vote button.  Your vote will be securely recorded.For accessibility Use Tab to navigate, Enter to select. Alt+S for settings, Alt+I for instructions."
        },
        hi: {
            title: "मतदाता डैशबोर्ड",
            welcome: "स्वागत है",
            voterId: "मतदाता पहचान पत्र",
            approved: "स्वीकृत",
            pending: "लंबित",
            rejected: "अस्वीकृत",
            availableElections: "उपलब्ध चुनाव",
            activeElections: "सक्रिय चुनाव",
            votesCast: "डाले गए मत",
            profileStatus: "प्रोफाइल स्थिति",
            voted: "मतदान किया",
            voteNow: "अभी मतदान करें",
            upcoming: "आगामी",
            dashboard: "डैशबोर्ड",
            elections: "चुनाव",
            profile: "प्रोफाइल",
            results: "परिणाम",
            logout: "लॉग आउट",
            instructions: "देशकावोट में आपका स्वागत है। वोट डालने के लिए:एक्टिव इलेक्शन सेक्शन में जाएं।जिस चुनाव में आप वोट देना चाहते हैं, उसे चुनें और वोट नाउ बटन दबाएं। उम्मीदवारों की एक लिस्ट दिखाई देगी।अपनी पसंद के उम्मीदवार को चुनने के लिए अपने कीबोर्ड या माउस का इस्तेमाल करें। फिर कन्फर्म वोट बटन दबाएं।आपका वोट सुरक्षित रूप से रिकॉर्ड हो जाएगा।। नेविगेट करने के लिए टैब, चयन के लिए एंटर। सेटिंग्स के लिए Alt+S, निर्देशों के लिए Alt+I।"
        },
        mr: {
            title: "मतदार डॅशबोर्ड",
            welcome: "स्वागत आहे",
            voterId: "मतदार ओळखपत्र",
            approved: "मंजूर",
            pending: "प्रलंबित",
            rejected: "नाकारले",
            availableElections: "उपलब्ध निवडणुका",
            activeElections: "सक्रिय निवडणुका",
            votesCast: "मते टाकली",
            profileStatus: "प्रोफाइल स्थिती",
            voted: "मतदान केले",
            voteNow: "आता मतदान करा",
            upcoming: "आगामी",
            dashboard: "डॅशबोर्ड",
            elections: "निवडणुका",
            profile: "प्रोफाइल",
            results: "निकाल",
            logout: "लॉग आउट",
            instructions: "देशकावोटमध्ये मध्ये आपले स्वागत आहे. तुमचे मत देण्यासाठी: सक्रिय निवडणूक विभागात जा.तुम्हाला ज्या निवडणुकीत मतदान करायचे आहे ते निवडा आणि आता मतदान करा बटण दाबा.उमेदवारांची यादी दिसेल.तुमच्या पसंतीचा उमेदवार निवडण्यासाठी तुमचा कीबोर्ड किंवा माऊस वापरा.नंतर मतदानाची पुष्टी करा बटण दाबा.तुमचे मत सुरक्षितपणे रेकॉर्ड केले जाईल.। सुलभतेसाठी: नेव्हिगेट करण्यासाठी टॅब, निवडण्यासाठी एंटर। सेटिंग्जसाठी Alt+S। या सूचना पुन्हा ऐकण्यासाठी Alt + I दाबा"
        },
        te: {
            title: "ఓటరు డాష్‌బోర్డ్",
            welcome: "స్వాగతం",
            voterId: "ఓటరు గుర్తింపు",
            approved: "ఆమోదించబడింది",
            pending: "పెండింగ్",
            rejected: "తిరస్కరించబడింది",
            availableElections: "అందుబాటులో ఉన్న ఎన్నికలు",
            activeElections: "క్రియాశీల ఎన్నికలు",
            votesCast: "వేసిన ఓట్లు",
            profileStatus: "ప్రొఫైల్ స్థితి",
            voted: "ఓటు వేశారు",
            voteNow: "ఇప్పుడు ఓటు వేయండి",
            upcoming: "రాబోయే",
            dashboard: "డాష్‌బోర్డ్",
            elections: "ఎన్నికలు",
            profile: "ప్రొఫైల్",
            results: "ఫలితాలు",
            logout: "లాగ్ అవుట్",
            instructions: "కు స్వాగతం.మీ ఓటు వేయడానికి:యాక్టివ్ ఎలక్షన్స్ విభాగానికి నావిగేట్ చేయండి.మీరు ఓటు వేయాలనుకుంటున్న ఎన్నికను ఎంచుకుని, ఇప్పుడే ఓటు వేయండి బటన్‌ను నొక్కండి.అభ్యర్థుల జాబితా కనిపిస్తుంది.మీరు ఇష్టపడే అభ్యర్థిని ఎంచుకోవడానికి మీ కీబోర్డ్ లేదా మౌస్‌ను ఉపయోగించండి.ఆపై ఓటును నిర్ధారించండి బటన్‌ను నొక్కండి.మీ ఓటు సురక్షితంగా రికార్డ్ చేయబడుతుంది.యాక్సెసిబిలిటీ కోసం:సెట్టింగ్‌లను తెరవడానికి Alt + S నొక్కండి.ఈ సూచనలను మళ్ళీ వినడానికి Alt + I నొక్కండి."
        }
    };

    class AccessibilityManager {
        constructor() {
            this.settings = {
                language: 'en',
                fontSize: 'medium',
                highContrast: false,
                screenReader: false,
                audioInstructions: false
            };
            
            this.voices = [];
            this.init();
        }
        
        init() {
            console.log('🚀 Initializing Accessibility Manager...');
            this.loadSettings();
            this.applySettings();
            this.loadVoices();
            this.initEventListeners();
            
            if (this.settings.screenReader) {
                this.initScreenReader();
            }
            
            if (this.settings.audioInstructions) {
                setTimeout(() => this.playPageInstructions(), 1500);
            }
            
            this.addKeyboardShortcuts();
            this.translatePage();
            console.log('✅ Accessibility Manager ready');
        }
        
        loadSettings() {
            const saved = localStorage.getItem('accessibilitySettings');
            if (saved) {
                this.settings = { ...this.settings, ...JSON.parse(saved) };
                console.log('📂 Loaded settings:', this.settings);
            }
        }
        
        saveSettings() {
            localStorage.setItem('accessibilitySettings', JSON.stringify(this.settings));
            console.log('💾 Saved settings:', this.settings);
        }
        
        applySettings() {
            document.documentElement.lang = this.settings.language;
            document.body.setAttribute('data-language', this.settings.language);
            
            document.body.classList.remove('font-small', 'font-medium', 'font-large');
            document.body.classList.add(`font-${this.settings.fontSize}`);
            
            if (this.settings.highContrast) {
                document.body.classList.add('high-contrast');
            } else {
                document.body.classList.remove('high-contrast');
            }
        }
        
        loadVoices() {
            if (!('speechSynthesis' in window)) {
                console.warn('⚠️ Speech synthesis not supported');
                return;
            }
            
            const updateVoices = () => {
                this.voices = window.speechSynthesis.getVoices();
                console.log(`🔊 Loaded ${this.voices.length} voices`);
                
                // Log available Indian language voices
                const indianVoices = this.voices.filter(v => 
                    v.lang.includes('hi') || 
                    v.lang.includes('mr') || 
                    v.lang.includes('te') || 
                    v.lang.includes('en-IN')
                );
                
                if (indianVoices.length > 0) {
                    console.log('🇮🇳 Indian voices:', indianVoices.map(v => `${v.name} (${v.lang})`).join(', '));
                } else {
                    console.log('ℹ️ No Indian language voices detected. Using default voices.');
                }
            };
            
            // Chrome needs voiceschanged event
            if (this.voices.length === 0) {
                window.speechSynthesis.addEventListener('voiceschanged', updateVoices, { once: true });
            }
            updateVoices();
        }
        
        initEventListeners() {
            const audioBtn = document.getElementById('audio-instructions-btn');
            const settingsBtn = document.getElementById('accessibility-settings-btn');
            
            if (audioBtn) {
                audioBtn.addEventListener('click', () => {
                    console.log('🔊 Audio button clicked');
                    this.playPageInstructions();
                });
            }
            
            if (settingsBtn) {
                settingsBtn.addEventListener('click', () => {
                    console.log('⚙️ Settings button clicked');
                    this.showSettingsModal();
                });
            }
        }
        
        showSettingsModal() {
            const modal = document.getElementById('settings-modal');
            if (!modal) return;
            
            modal.classList.add('active');
            
            // Set current values
            document.getElementById('language-select').value = this.settings.language;
            document.getElementById('fontsize-select').value = this.settings.fontSize;
            document.getElementById('screenreader-toggle').checked = this.settings.screenReader;
            document.getElementById('audio-toggle').checked = this.settings.audioInstructions;
            document.getElementById('contrast-toggle').checked = this.settings.highContrast;
            
            // Remove old listeners by cloning elements
            const langSelect = document.getElementById('language-select');
            const newLangSelect = langSelect.cloneNode(true);
            langSelect.parentNode.replaceChild(newLangSelect, langSelect);
            
            // Language change
            newLangSelect.addEventListener('change', (e) => {
                this.settings.language = e.target.value;
                this.saveSettings();
                this.applySettings();
                this.translatePage();
                this.speak(this.t('instructions'));
                console.log(`🌐 Language changed to: ${e.target.value}`);
            });
            
            // Font size
            document.getElementById('fontsize-select').addEventListener('change', (e) => {
                this.settings.fontSize = e.target.value;
                this.saveSettings();
                this.applySettings();
                this.announce('Font size changed');
            });
            
            // Screen reader
            document.getElementById('screenreader-toggle').addEventListener('change', (e) => {
                this.settings.screenReader = e.target.checked;
                this.saveSettings();
                if (this.settings.screenReader) {
                    this.initScreenReader();
                    this.speak('Screen reader enabled');
                } else {
                    this.speak('Screen reader disabled');
                }
            });
            
            // Audio instructions
            document.getElementById('audio-toggle').addEventListener('change', (e) => {
                this.settings.audioInstructions = e.target.checked;
                this.saveSettings();
                this.speak(e.target.checked ? 'Audio instructions enabled' : 'Audio instructions disabled');
            });
            
            // High contrast
            document.getElementById('contrast-toggle').addEventListener('change', (e) => {
                this.settings.highContrast = e.target.checked;
                this.saveSettings();
                this.applySettings();
                this.speak(e.target.checked ? 'High contrast enabled' : 'High contrast disabled');
            });
            
            // Close button
            document.getElementById('close-settings').addEventListener('click', () => {
                this.closeSettingsModal();
            });
            
            // Close on backdrop
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeSettingsModal();
                }
            });
        }
        
        closeSettingsModal() {
            const modal = document.getElementById('settings-modal');
            if (modal) {
                modal.classList.remove('active');
            }
        }
        
        initScreenReader() {
            if (!('speechSynthesis' in window)) return;
            
            const elements = 'button, a, input, select, [role="button"], .vote-btn, .icon-btn, .card, .nav-link, .badge';
            
            document.querySelectorAll(elements).forEach(element => {
                // Remove old listeners
                element.removeEventListener('mouseenter', element._hoverHandler);
                element.removeEventListener('focus', element._focusHandler);
                
                // Add new listeners
                element._hoverHandler = (e) => {
                    if (this.settings.screenReader) {
                        this.speakElement(e.target);
                    }
                };
                
                element._focusHandler = (e) => {
                    if (this.settings.screenReader) {
                        this.speakElement(e.target);
                    }
                };
                
                element.addEventListener('mouseenter', element._hoverHandler);
                element.addEventListener('focus', element._focusHandler);
            });
            
            console.log('✅ Screen reader initialized');
        }
        
        speakElement(element) {
            if (!this.settings.screenReader) return;
            
            let text = '';
            
            // Get translated text if available
            const translateKey = element.getAttribute('data-translate');
            if (translateKey && translations[this.settings.language]) {
                text = translations[this.settings.language][translateKey] || translateKey;
            } else if (element.getAttribute('aria-label')) {
                text = element.getAttribute('aria-label');
            } else if (element.getAttribute('title')) {
                text = element.getAttribute('title');
            } else if (element.textContent) {
                text = element.textContent.trim().substring(0, 150);
            }
            
            // Remove extra whitespace
            text = text.replace(/\s+/g, ' ').trim();
            
            if (text && text.length > 0) {
                this.speak(text);
            }
        }
        
        speak(text, forceLang = null) {
            if (!('speechSynthesis' in window)) {
                console.warn('⚠️ Speech synthesis not available');
                return;
            }
            
            if (!text || text.trim().length === 0) return;
            
            // Cancel any ongoing speech
            window.speechSynthesis.cancel();
            
            const utterance = new SpeechSynthesisUtterance(text);
            const targetLang = forceLang || this.settings.language;
            
            // Language to voice mapping
            const langMap = {
                'en': ['en-IN', 'en-US', 'en-GB'],
                'hi': ['hi-IN', 'hi'],
                'mr': ['mr-IN', 'mr'],
                'te': ['te-IN', 'te']
            };
            
            const preferredLangs = langMap[targetLang] || ['en-IN'];
            
            // Find best matching voice
            let selectedVoice = null;
            for (const lang of preferredLangs) {
                selectedVoice = this.voices.find(v => v.lang.startsWith(lang));
                if (selectedVoice) break;
            }
            
            // Fallback
            if (!selectedVoice) {
                selectedVoice = this.voices.find(v => v.lang.startsWith('en')) || this.voices[0];
            }
            
            if (selectedVoice) {
                utterance.voice = selectedVoice;
                utterance.lang = selectedVoice.lang;
                console.log(`🗣️ Speaking in ${selectedVoice.lang}: "${text.substring(0, 50)}${text.length > 50 ? '...' : ''}"`);
            }
            
            // Adjust rate for Indian languages
            utterance.rate = (targetLang === 'en') ? 0.95 : 0.85;
            utterance.pitch = 1.0;
            utterance.volume = 1.0;
            
            utterance.onerror = (e) => {
                console.error('❌ Speech error:', e.error);
            };
            
            window.speechSynthesis.speak(utterance);
        }
        
        playPageInstructions() {
            const instructions = this.t('instructions');
            this.speak(instructions);
        }
        
        addKeyboardShortcuts() {
            document.addEventListener('keydown', (e) => {
                // Alt+S for settings
                if (e.altKey && e.key.toLowerCase() === 's') {
                    e.preventDefault();
                    this.showSettingsModal();
                }
                
                // Alt+I for instructions
                if (e.altKey && e.key.toLowerCase() === 'i') {
                    e.preventDefault();
                    this.playPageInstructions();
                }
            });
        }
        
        announce(message) {
            const liveRegion = document.getElementById('aria-live-region');
            if (liveRegion) {
                liveRegion.textContent = message;
                setTimeout(() => {
                    liveRegion.textContent = '';
                }, 1000);
            }
            
            if (this.settings.screenReader) {
                this.speak(message);
            }
        }
        
        translatePage() {
            const elements = document.querySelectorAll('[data-translate]');
            const lang = this.settings.language;
            
            elements.forEach(element => {
                const key = element.getAttribute('data-translate');
                if (translations[lang] && translations[lang][key]) {
                    element.textContent = translations[lang][key];
                }
            });
            
            console.log(`🌐 Page translated to: ${lang}`);
        }
        
        t(key) {
            return (translations[this.settings.language] && translations[this.settings.language][key]) || key;
        }
    }

    // Initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.accessibilityManager = new AccessibilityManager();
        });
    } else {
        window.accessibilityManager = new AccessibilityManager();
    }

})();