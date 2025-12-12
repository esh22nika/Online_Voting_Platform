// static/js/accessibility.js
// WCAG 2.1 AAA Compliant Accessibility Manager

(function() {
    'use strict';

    // Translation data
    const translations = {
        en: {
            skipToMain: "Skip to main content",
            settings: "Accessibility Settings",
            language: "Language",
            fontSize: "Font Size",
            screenReader: "Screen Reader",
            audioInstructions: "Audio Instructions",
            highContrast: "High Contrast Mode",
            small: "Small",
            medium: "Medium",
            large: "Large",
            enable: "Enable",
            disable: "Disable",
            close: "Close",
            save: "Save",
            instructions: "Use Tab key to navigate, Enter to select buttons, and arrow keys within menus. Press Alt+S to open settings, Alt+I for instructions."
        },
        hi: {
            skipToMain: "मुख्य सामग्री पर जाएं",
            settings: "पहुंच सेटिंग्स",
            language: "भाषा",
            fontSize: "फ़ॉन्ट आकार",
            screenReader: "स्क्रीन रीडर",
            audioInstructions: "ऑडियो निर्देश",
            highContrast: "उच्च कंट्रास्ट मोड",
            small: "छोटा",
            medium: "मध्यम",
            large: "बड़ा",
            enable: "सक्षम करें",
            disable: "अक्षम करें",
            close: "बंद करें",
            save: "सहेजें",
            instructions: "नेविगेट करने के लिए टैब कुंजी, बटन चुनने के लिए एंटर, और मेनू में तीर कुंजियों का उपयोग करें। सेटिंग्स के लिए Alt+S और निर्देशों के लिए Alt+I दबाएं।"
        },
        mr: {
            skipToMain: "मुख्य सामग्रीवर जा",
            settings: "प्रवेश सेटिंग्ज",
            language: "भाषा",
            fontSize: "फॉन्ट आकार",
            screenReader: "स्क्रीन रीडर",
            audioInstructions: "ऑडिओ सूचना",
            highContrast: "उच्च कॉन्ट्रास्ट मोड",
            small: "लहान",
            medium: "मध्यम",
            large: "मोठा",
            enable: "सक्षम करा",
            disable: "अक्षम करा",
            close: "बंद करा",
            save: "जतन करा",
            instructions: "नेव्हिगेट करण्यासाठी टॅब की, बटण निवडण्यासाठी एंटर, आणि मेनूमध्ये तीर कीज वापरा। सेटिंग्जसाठी Alt+S आणि सूचनांसाठी Alt+I दाबा।"
        },
        te: {
            skipToMain: "ప్రధాన కంటెంట్‌కు వెళ్లండి",
            settings: "యాక్సెసిబిలిటీ సెట్టింగ్‌లు",
            language: "భాష",
            fontSize: "ఫాంట్ పరిమాణం",
            screenReader: "స్క్రీన్ రీడర్",
            audioInstructions: "ఆడియో సూచనలు",
            highContrast: "అధిక కాంట్రాస్ట్ మోడ్",
            small: "చిన్నది",
            medium: "మధ్యస్థం",
            large: "పెద్దది",
            enable: "ప్రారంభించండి",
            disable: "నిలిపివేయండి",
            close: "మూసివేయండి",
            save: "సేవ్ చేయండి",
            instructions: "నావిగేట్ చేయడానికి టాబ్ కీ, బటన్‌లను ఎంచుకోవడానికి ఎంటర్, మరియు మెనూలలో బాణం కీలను ఉపయోగించండి। సెట్టింగ్‌ల కోసం Alt+S మరియు సూచనల కోసం Alt+I నొక్కండి।"
        }
    };

    // Page-specific translations
    const pageTranslations = {
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
            profile: "Your Profile",
            fullName: "Full Name",
            email: "Email",
            mobile: "Mobile",
            address: "Address",
            documentVerification: "Document Verification",
            aadharCard: "Aadhar Card",
            panCard: "PAN Card",
            voterIdCard: "Voter ID Card",
            verified: "Verified",
            logout: "Logout",
            elections: "Elections",
            dashboard: "Dashboard",
            results: "Results"
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
            profile: "आपकी प्रोफाइल",
            fullName: "पूरा नाम",
            email: "ईमेल",
            mobile: "मोबाइल",
            address: "पता",
            documentVerification: "दस्तावेज़ सत्यापन",
            aadharCard: "आधार कार्ड",
            panCard: "पैन कार्ड",
            voterIdCard: "मतदाता पहचान पत्र",
            verified: "सत्यापित",
            logout: "लॉग आउट",
            elections: "चुनाव",
            dashboard: "डैशबोर्ड",
            results: "परिणाम"
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
            profile: "तुमची प्रोफाइल",
            fullName: "पूर्ण नाव",
            email: "ईमेल",
            mobile: "मोबाइल",
            address: "पत्ता",
            documentVerification: "कागदपत्र पडताळणी",
            aadharCard: "आधार कार्ड",
            panCard: "पॅन कार्ड",
            voterIdCard: "मतदार ओळखपत्र",
            verified: "पडताळले",
            logout: "लॉग आउट",
            elections: "निवडणुका",
            dashboard: "डॅशबोर्ड",
            results: "निकाल"
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
            profile: "మీ ప్రొఫైల్",
            fullName: "పూర్తి పేరు",
            email: "ఇమెయిల్",
            mobile: "మొబైల్",
            address: "చిరునామా",
            documentVerification: "పత్రాల ధృవీకరణ",
            aadharCard: "ఆధార్ కార్డ్",
            panCard: "పాన్ కార్డ్",
            voterIdCard: "ఓటరు గుర్తింపు కార్డ్",
            verified: "ధృవీకరించబడింది",
            logout: "లాగ్ అవుట్",
            elections: "ఎన్నికలు",
            dashboard: "డాష్‌బోర్డ్",
            results: "ఫలితాలు"
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
            
            this.init();
        }
        
        init() {
            // Load saved settings
            this.loadSettings();
            
            // Apply saved settings
            this.applySettings();
            
            // Initialize event listeners
            this.initEventListeners();
            
            // Initialize screen reader if enabled
            if (this.settings.screenReader) {
                this.initScreenReader();
            }
            
            // Play instructions if enabled
            if (this.settings.audioInstructions) {
                setTimeout(() => this.playPageInstructions(), 1000);
            }
            
            // Add keyboard shortcuts
            this.addKeyboardShortcuts();
            
            // Translate page
            this.translatePage();
        }
        
        loadSettings() {
            const saved = localStorage.getItem('accessibilitySettings');
            if (saved) {
                this.settings = { ...this.settings, ...JSON.parse(saved) };
            }
        }
        
        saveSettings() {
            localStorage.setItem('accessibilitySettings', JSON.stringify(this.settings));
        }
        
        applySettings() {
            // Apply language
            document.documentElement.lang = this.settings.language;
            document.body.setAttribute('data-language', this.settings.language);
            
            // Apply font size
            document.body.classList.remove('font-small', 'font-medium', 'font-large');
            document.body.classList.add(`font-${this.settings.fontSize}`);
            
            // Apply high contrast
            if (this.settings.highContrast) {
                document.body.classList.add('high-contrast');
            } else {
                document.body.classList.remove('high-contrast');
            }
        }
        
        initEventListeners() {
            // Audio instructions button
            const audioBtn = document.getElementById('audio-instructions-btn');
            if (audioBtn) {
                audioBtn.addEventListener('click', () => this.playPageInstructions());
            }
            
            // Settings button
            const settingsBtn = document.getElementById('accessibility-settings-btn');
            if (settingsBtn) {
                settingsBtn.addEventListener('click', () => this.showSettingsModal());
            }
        }
        
        showSettingsModal() {
            // Remove existing modal if any
            const existing = document.getElementById('accessibility-modal');
            if (existing) {
                existing.remove();
            }
            
            const t = this.t.bind(this);
            
            const modal = document.createElement('div');
            modal.id = 'accessibility-modal';
            modal.className = 'settings-modal';
            modal.setAttribute('role', 'dialog');
            modal.setAttribute('aria-labelledby', 'settings-title');
            modal.setAttribute('aria-modal', 'true');
            
            modal.innerHTML = `
                <div class="settings-content">
                    <h2 id="settings-title" class="mb-4">${t('settings')}</h2>
                    
                    <!-- Language Selection -->
                    <div class="settings-row">
                        <label for="language-select" class="fw-bold">
                            <i class="fas fa-globe me-2" aria-hidden="true"></i>
                            ${t('language')}
                        </label>
                        <select id="language-select" class="form-select" style="width: 200px;" aria-label="Select language">
                            <option value="en" ${this.settings.language === 'en' ? 'selected' : ''}>English</option>
                            <option value="hi" ${this.settings.language === 'hi' ? 'selected' : ''}>हिंदी (Hindi)</option>
                            <option value="mr" ${this.settings.language === 'mr' ? 'selected' : ''}>मराठी (Marathi)</option>
                            <option value="te" ${this.settings.language === 'te' ? 'selected' : ''}>తెలుగు (Telugu)</option>
                        </select>
                    </div>
                    
                    <!-- Font Size -->
                    <div class="settings-row">
                        <label for="fontsize-select" class="fw-bold">
                            <i class="fas fa-text-height me-2" aria-hidden="true"></i>
                            ${t('fontSize')}
                        </label>
                        <select id="fontsize-select" class="form-select" style="width: 150px;" aria-label="Select font size">
                            <option value="small" ${this.settings.fontSize === 'small' ? 'selected' : ''}>${t('small')}</option>
                            <option value="medium" ${this.settings.fontSize === 'medium' ? 'selected' : ''}>${t('medium')}</option>
                            <option value="large" ${this.settings.fontSize === 'large' ? 'selected' : ''}>${t('large')}</option>
                        </select>
                    </div>
                    
                    <!-- Screen Reader Toggle -->
                    <div class="settings-row">
                        <label for="screenreader-toggle" class="fw-bold">${t('screenReader')}</label>
                        <label class="toggle-switch">
                            <input type="checkbox" id="screenreader-toggle" ${this.settings.screenReader ? 'checked' : ''} 
                                   aria-label="Toggle screen reader" aria-checked="${this.settings.screenReader}">
                            <span class="toggle-slider"></span>
                        </label>
                    </div>
                    
                    <!-- Audio Instructions Toggle -->
                    <div class="settings-row">
                        <label for="audio-toggle" class="fw-bold">${t('audioInstructions')}</label>
                        <label class="toggle-switch">
                            <input type="checkbox" id="audio-toggle" ${this.settings.audioInstructions ? 'checked' : ''}
                                   aria-label="Toggle audio instructions" aria-checked="${this.settings.audioInstructions}">
                            <span class="toggle-slider"></span>
                        </label>
                    </div>
                    
                    <!-- High Contrast Toggle -->
                    <div class="settings-row">
                        <label for="contrast-toggle" class="fw-bold">${t('highContrast')}</label>
                        <label class="toggle-switch">
                            <input type="checkbox" id="contrast-toggle" ${this.settings.highContrast ? 'checked' : ''}
                                   aria-label="Toggle high contrast mode" aria-checked="${this.settings.highContrast}">
                            <span class="toggle-slider"></span>
                        </label>
                    </div>
                    
                    <!-- Close Button -->
                    <button id="close-settings" class="btn btn-primary w-100 mt-4" aria-label="${t('close')}">
                        ${t('close')}
                    </button>
                </div>
            `;
            
            document.body.appendChild(modal);
            
            // Focus trap
            const focusableElements = modal.querySelectorAll('button, select, input');
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];
            
            firstElement.focus();
            
            // Keyboard trap
            modal.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    this.closeSettingsModal();
                }
                
                if (e.key === 'Tab') {
                    if (e.shiftKey && document.activeElement === firstElement) {
                        e.preventDefault();
                        lastElement.focus();
                    } else if (!e.shiftKey && document.activeElement === lastElement) {
                        e.preventDefault();
                        firstElement.focus();
                    }
                }
            });
            
            // Event listeners
            document.getElementById('language-select').addEventListener('change', (e) => {
                this.settings.language = e.target.value;
                this.saveSettings();
                this.applySettings();
                this.translatePage();
                this.announce('Language changed to ' + e.target.options[e.target.selectedIndex].text);
            });
            
            document.getElementById('fontsize-select').addEventListener('change', (e) => {
                this.settings.fontSize = e.target.value;
                this.saveSettings();
                this.applySettings();
                this.announce('Font size changed to ' + e.target.options[e.target.selectedIndex].text);
            });
            
            document.getElementById('screenreader-toggle').addEventListener('change', (e) => {
                this.settings.screenReader = e.target.checked;
                this.saveSettings();
                if (this.settings.screenReader) {
                    this.initScreenReader();
                    this.announce('Screen reader enabled');
                } else {
                    this.announce('Screen reader disabled');
                }
            });
            
            document.getElementById('audio-toggle').addEventListener('change', (e) => {
                this.settings.audioInstructions = e.target.checked;
                this.saveSettings();
                this.announce(e.target.checked ? 'Audio instructions enabled' : 'Audio instructions disabled');
            });
            
            document.getElementById('contrast-toggle').addEventListener('change', (e) => {
                this.settings.highContrast = e.target.checked;
                this.saveSettings();
                this.applySettings();
                this.announce(e.target.checked ? 'High contrast mode enabled' : 'High contrast mode disabled');
            });
            
            document.getElementById('close-settings').addEventListener('click', () => {
                this.closeSettingsModal();
            });
            
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeSettingsModal();
                }
            });
        }
        
        closeSettingsModal() {
            const modal = document.getElementById('accessibility-modal');
            if (modal) {
                modal.remove();
                document.getElementById('accessibility-settings-btn')?.focus();
            }
        }
        
        initScreenReader() {
            if (!('speechSynthesis' in window)) {
                console.warn('Speech synthesis not supported');
                return;
            }
            
            // Add hover and focus listeners
            const interactiveElements = document.querySelectorAll('button, a, input, select, [role="button"], .vote-btn, .icon-btn');
            
            interactiveElements.forEach(element => {
                element.addEventListener('mouseenter', (e) => {
                    if (this.settings.screenReader) {
                        this.speakElement(e.target);
                    }
                });
                
                element.addEventListener('focus', (e) => {
                    if (this.settings.screenReader) {
                        this.speakElement(e.target);
                    }
                });
            });
        }
        
        speakElement(element) {
            if (!this.settings.screenReader) return;
            
            let text = '';
            
            // Get appropriate text
            if (element.getAttribute('aria-label')) {
                text = element.getAttribute('aria-label');
            } else if (element.getAttribute('title')) {
                text = element.getAttribute('title');
            } else if (element.textContent) {
                text = element.textContent.trim();
            }
            
            // Add element type
            const role = element.getAttribute('role') || element.tagName.toLowerCase();
            if (role === 'button' || element.tagName.toLowerCase() === 'button') {
                text += ', button';
            } else if (role === 'link' || element.tagName.toLowerCase() === 'a') {
                text += ', link';
            }
            
            if (text) {
                this.speak(text);
            }
        }
        
        speak(text) {
            if (!('speechSynthesis' in window)) return;
            
            window.speechSynthesis.cancel();
            
            const utterance = new SpeechSynthesisUtterance(text);
            
            // Set language-specific voice
            const voices = window.speechSynthesis.getVoices();
            const languageMap = {
                'en': 'en-IN',
                'hi': 'hi-IN',
                'mr': 'mr-IN',
                'te': 'te-IN'
            };
            
            const preferredLang = languageMap[this.settings.language] || 'en-IN';
            const voice = voices.find(v => v.lang.startsWith(preferredLang)) || voices[0];
            
            if (voice) {
                utterance.voice = voice;
            }
            
            utterance.rate = 0.9;
            utterance.pitch = 1;
            utterance.volume = 1;
            
            window.speechSynthesis.speak(utterance);
        }
        
        playPageInstructions() {
            const instructions = this.t('instructions');
            this.speak(instructions);
        }
        
        addKeyboardShortcuts() {
            document.addEventListener('keydown', (e) => {
                // Alt + S: Open settings
                if (e.altKey && e.key === 's') {
                    e.preventDefault();
                    this.showSettingsModal();
                }
                
                // Alt + I: Play instructions
                if (e.altKey && e.key === 'i') {
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
            elements.forEach(element => {
                const key = element.getAttribute('data-translate');
                const translation = pageTranslations[this.settings.language][key];
                if (translation) {
                    element.textContent = translation;
                }
            });
        }
        
        t(key) {
            return translations[this.settings.language][key] || key;
        }
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.accessibilityManager = new AccessibilityManager();
        });
    } else {
        window.accessibilityManager = new AccessibilityManager();
    }

    // Export for use in other scripts
    window.AccessibilityManager = AccessibilityManager;

})();