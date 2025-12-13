// Enhanced Voice Command System with Fuzzy Matching & Intent Recognition
(function() {
    'use strict';

    class EnhancedVoiceCommandSystem {
        constructor() {
            this.recognition = null;
            this.synthesis = window.speechSynthesis;
            this.isListening = false;
            this.currentContext = null;
            this.selectedElection = null;
            this.selectedCandidate = null;
            this.availableElections = [];
            this.availableCandidates = [];
            
            // Intent patterns with fuzzy matching
            this.intents = {
                help: {
                    patterns: ['help', 'what can', 'commands', 'options', 'assist', 'guide'],
                    keywords: ['help', 'command', 'what', 'how', 'assist']
                },
                showElections: {
                    patterns: ['show election', 'list election', 'available election', 'see election', 'display election', 'election list'],
                    keywords: ['show', 'list', 'election', 'available', 'see', 'display']
                },
                voteInElection: {
                    patterns: ['vote in', 'open election', 'start voting', 'vote for election', 'select election', 'choose election'],
                    keywords: ['vote', 'open', 'start', 'election', 'select', 'choose']
                },
                listCandidates: {
                    patterns: ['list candidate', 'show candidate', 'who are', 'available candidate', 'candidate list'],
                    keywords: ['list', 'show', 'candidate', 'who', 'available']
                },
                voteForCandidate: {
                    patterns: ['vote for', 'select', 'choose', 'pick', 'cast vote for'],
                    keywords: ['vote', 'select', 'choose', 'pick', 'cast', 'for']
                },
                confirmVote: {
                    patterns: ['confirm', 'yes', 'cast vote', 'submit', 'proceed', 'go ahead', 'okay'],
                    keywords: ['confirm', 'yes', 'cast', 'submit', 'proceed', 'okay', 'ok']
                },
                cancel: {
                    patterns: ['cancel', 'no', 'go back', 'stop', 'abort', 'nevermind'],
                    keywords: ['cancel', 'no', 'back', 'stop', 'abort', 'never']
                },
                navigateProfile: {
                    patterns: ['profile', 'my profile', 'go to profile', 'show profile'],
                    keywords: ['profile', 'my', 'go', 'show']
                },
                navigateResults: {
                    patterns: ['result', 'show result', 'go to result', 'election result'],
                    keywords: ['result', 'show', 'go', 'election']
                }
            };
            
            this.init();
        }
        
        init() {
            if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
                console.error('Speech recognition not supported');
                this.showNotification('Voice commands are not supported in this browser', 'error');
                return;
            }
            
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.recognition = new SpeechRecognition();
            
            this.recognition.continuous = true;
            this.recognition.interimResults = false;
            this.recognition.lang = 'en-IN';
            this.recognition.maxAlternatives = 3; // Get multiple alternatives
            
            this.setupRecognitionEvents();
            this.setupUIEvents();
            this.loadElectionsData();
            
            document.addEventListener('keydown', (e) => {
                if (e.altKey && e.key.toLowerCase() === 'v') {
                    e.preventDefault();
                    this.openVoiceModal();
                }
            });
            
            console.log('Enhanced Voice Command System initialized with fuzzy matching');
        }
        
        // Levenshtein distance for fuzzy matching
        levenshteinDistance(str1, str2) {
            const len1 = str1.length;
            const len2 = str2.length;
            const matrix = Array(len2 + 1).fill(null).map(() => Array(len1 + 1).fill(null));
            
            for (let i = 0; i <= len1; i++) matrix[0][i] = i;
            for (let j = 0; j <= len2; j++) matrix[j][0] = j;
            
            for (let j = 1; j <= len2; j++) {
                for (let i = 1; i <= len1; i++) {
                    const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
                    matrix[j][i] = Math.min(
                        matrix[j][i - 1] + 1,
                        matrix[j - 1][i] + 1,
                        matrix[j - 1][i - 1] + indicator
                    );
                }
            }
            
            return matrix[len2][len1];
        }
        
        // Calculate similarity score (0-1, where 1 is perfect match)
        calculateSimilarity(str1, str2) {
            const longer = str1.length > str2.length ? str1 : str2;
            const shorter = str1.length > str2.length ? str2 : str1;
            
            if (longer.length === 0) return 1.0;
            
            const distance = this.levenshteinDistance(longer, shorter);
            return (longer.length - distance) / longer.length;
        }
        
        // Fuzzy match intent
        matchIntent(transcript) {
            const transcriptLower = transcript.toLowerCase().trim();
            let bestMatch = { intent: null, confidence: 0, entityText: null };
            
            // Check each intent
            for (const [intentName, intentData] of Object.entries(this.intents)) {
                let maxConfidence = 0;
                
                // Check against patterns
                for (const pattern of intentData.patterns) {
                    const similarity = this.calculateSimilarity(transcriptLower, pattern);
                    
                    // Also check if transcript contains the pattern (partial match)
                    const containsPattern = transcriptLower.includes(pattern) || pattern.includes(transcriptLower.split(' ')[0]);
                    
                    // Keyword matching
                    const words = transcriptLower.split(/\s+/);
                    const keywordMatches = intentData.keywords.filter(kw => 
                        words.some(word => this.calculateSimilarity(word, kw) > 0.7)
                    ).length;
                    
                    // Combined confidence score
                    let confidence = similarity * 0.5 + 
                                   (containsPattern ? 0.3 : 0) + 
                                   (keywordMatches / intentData.keywords.length) * 0.2;
                    
                    if (confidence > maxConfidence) {
                        maxConfidence = confidence;
                    }
                }
                
                if (maxConfidence > bestMatch.confidence) {
                    bestMatch = {
                        intent: intentName,
                        confidence: maxConfidence,
                        entityText: transcriptLower
                    };
                }
            }
            
            console.log(`Intent match: ${bestMatch.intent} (${(bestMatch.confidence * 100).toFixed(1)}%)`);
            return bestMatch;
        }
        
        // Extract entity (election/candidate name) from transcript
        extractEntity(transcript, entityList, intentType) {
            const transcriptLower = transcript.toLowerCase();
            let bestMatch = { entity: null, confidence: 0 };
            
            // Remove common intent keywords
            let cleanTranscript = transcriptLower;
            const removeWords = ['vote', 'in', 'for', 'the', 'open', 'select', 'choose', 'election', 'candidate'];
            removeWords.forEach(word => {
                cleanTranscript = cleanTranscript.replace(new RegExp(`\\b${word}\\b`, 'g'), '');
            });
            cleanTranscript = cleanTranscript.trim();
            
            // Match against entity list
            for (const entity of entityList) {
                const entityName = entity.name || entity.fullData?.name || '';
                const entityParty = entity.party || entity.fullData?.party || '';
                
                // Calculate similarity for name
                const nameSimilarity = this.calculateSimilarity(cleanTranscript, entityName);
                
                // Check if transcript contains entity name words
                const entityWords = entityName.split(/\s+/);
                const transcriptWords = cleanTranscript.split(/\s+/);
                const wordMatches = entityWords.filter(ew => 
                    transcriptWords.some(tw => this.calculateSimilarity(tw, ew) > 0.75)
                ).length;
                
                // Check party name match (for candidates)
                const partyMatch = entityParty ? this.calculateSimilarity(cleanTranscript, entityParty) : 0;
                
                // Combined confidence
                const confidence = Math.max(
                    nameSimilarity,
                    wordMatches / entityWords.length,
                    partyMatch
                );
                
                if (confidence > bestMatch.confidence) {
                    bestMatch = { entity, confidence };
                }
            }
            
            console.log(`Entity match: ${bestMatch.entity?.name || 'none'} (${(bestMatch.confidence * 100).toFixed(1)}%)`);
            return bestMatch;
        }
        
        setupRecognitionEvents() {
            this.recognition.onstart = () => {
                this.isListening = true;
                this.updateStatus('Listening...', 'listening');
                document.getElementById('startVoiceBtn').style.display = 'none';
                document.getElementById('stopVoiceBtn').style.display = 'inline-block';
            };
            
            this.recognition.onend = () => {
                this.isListening = false;
                this.updateStatus('Ready', 'ready');
                document.getElementById('startVoiceBtn').style.display = 'inline-block';
                document.getElementById('stopVoiceBtn').style.display = 'none';
            };
            
            this.recognition.onresult = (event) => {
                const last = event.results.length - 1;
                const transcript = event.results[last][0].transcript.trim();
                
                // Get alternative transcripts
                const alternatives = [];
                for (let i = 0; i < event.results[last].length && i < 3; i++) {
                    alternatives.push(event.results[last][i].transcript.trim());
                }
                
                console.log('Recognized:', transcript);
                console.log('Alternatives:', alternatives);
                
                this.displayTranscript(transcript);
                this.processCommandWithFuzzyMatch(transcript, alternatives);
            };
            
            this.recognition.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                let message = 'Voice recognition error. Please try again.';
                
                if (event.error === 'no-speech') {
                    message = 'No speech detected. Please speak clearly and try again.';
                } else if (event.error === 'not-allowed') {
                    message = 'Microphone access denied. Please enable it in browser settings.';
                }
                
                this.showNotification(message, 'error');
                this.updateStatus('Error', 'error');
            };
        }
        
        processCommandWithFuzzyMatch(transcript, alternatives = []) {
            // Try to match intent from all alternatives
            let bestIntent = { intent: null, confidence: 0 };
            
            for (const alt of [transcript, ...alternatives]) {
                const match = this.matchIntent(alt);
                if (match.confidence > bestIntent.confidence) {
                    bestIntent = match;
                    bestIntent.transcript = alt;
                }
            }
            
            // Confidence threshold
            if (bestIntent.confidence < 0.3) {
                this.speak('Sorry, I did not understand that command. Please try again or say "help" for available commands.');
                this.displayResponse('Command not recognized (low confidence)');
                return;
            }
            
            console.log(`Processing intent: ${bestIntent.intent}`);
            
            // Route to appropriate handler
            switch (bestIntent.intent) {
                case 'help':
                    this.handleHelpCommand();
                    break;
                case 'showElections':
                    this.handleShowElections();
                    break;
                case 'voteInElection':
                    this.handleVoteInElectionFuzzy(bestIntent.transcript);
                    break;
                case 'listCandidates':
                    this.handleListCandidates();
                    break;
                case 'voteForCandidate':
                    this.handleVoteForCandidateFuzzy(bestIntent.transcript);
                    break;
                case 'confirmVote':
                    this.handleConfirmVote();
                    break;
                case 'cancel':
                    this.handleCancel();
                    break;
                case 'navigateProfile':
                    this.handleNavigateProfile();
                    break;
                case 'navigateResults':
                    this.handleNavigateResults();
                    break;
                default:
                    this.speak('I did not understand that. Say "help" for available commands.');
                    this.displayResponse('Command not recognized');
            }
        }
        
        async handleVoteInElectionFuzzy(transcript) {
            if (this.availableElections.length === 0) {
                this.speak('There are no active elections available for voting.');
                this.displayResponse('No active elections');
                return;
            }
            
            // Extract election name using fuzzy matching
            const match = this.extractEntity(transcript, this.availableElections, 'election');
            
            if (!match.entity || match.confidence < 0.4) {
                // Low confidence - ask for clarification
                let electionList = 'I found these elections: ';
                this.availableElections.forEach((election, index) => {
                    electionList += `${index + 1}. ${election.name}. `;
                });
                electionList += 'Please say the full name of the election.';
                
                this.speak(electionList);
                this.displayResponse('Please clarify election name');
                return;
            }
            
            const election = match.entity;
            this.selectedElection = election;
            
            this.speak(`Opening ${election.name}. Loading candidates...`);
            this.displayResponse(`Selected: ${election.name}`);
            
            const loaded = await this.loadCandidatesForElection(election.id);
            
            if (loaded && this.availableCandidates.length > 0) {
                this.currentContext = 'candidate-selection';
                
                let candidateList = `There are ${this.availableCandidates.length} candidates. `;
                this.availableCandidates.forEach((candidate, index) => {
                    candidateList += `${index + 1}. ${candidate.fullData.name} from ${candidate.fullData.party}. `;
                });
                candidateList += 'Say "vote for" followed by the candidate name.';
                
                this.speak(candidateList);
                
                const voteButton = election.element.querySelector('.vote-btn');
                if (voteButton) {
                    voteButton.click();
                }
            } else {
                this.speak('Sorry, could not load candidates for this election.');
                this.displayResponse('Error loading candidates');
            }
        }
        
        handleVoteForCandidateFuzzy(transcript) {
            if (this.availableCandidates.length === 0) {
                this.speak('Please open an election first. Say "show elections" to see available elections.');
                this.displayResponse('No candidates loaded');
                return;
            }
            
            // Extract candidate name using fuzzy matching
            const match = this.extractEntity(transcript, this.availableCandidates, 'candidate');
            
            if (!match.entity || match.confidence < 0.4) {
                // Low confidence - list candidates
                let candidateList = 'Available candidates are: ';
                this.availableCandidates.forEach((candidate, index) => {
                    candidateList += `${index + 1}. ${candidate.fullData.name} from ${candidate.fullData.party}. `;
                });
                candidateList += 'Please say the full candidate name.';
                
                this.speak(candidateList);
                this.displayResponse('Please clarify candidate name');
                return;
            }
            
            const candidate = match.entity;
            this.selectedCandidate = candidate;
            this.currentContext = 'confirm-vote';
            
            this.speak(`You selected ${candidate.fullData.name} from ${candidate.fullData.party}. Say "confirm vote" to cast your vote, or say "cancel" to choose another candidate.`);
            this.displayResponse(`Selected: ${candidate.fullData.name}`);
            
            setTimeout(() => {
                const candidateButtons = document.querySelectorAll('.candidate-vote-btn');
                candidateButtons.forEach(btn => {
                    if (btn.dataset.candidateId === candidate.id) {
                        btn.click();
                    }
                });
            }, 500);
        }
        
        setupUIEvents() {
            const voiceBtn = document.getElementById('voice-command-btn');
            if (voiceBtn) {
                voiceBtn.addEventListener('click', () => this.openVoiceModal());
            }
            
            document.getElementById('startVoiceBtn').addEventListener('click', () => {
                this.startListening();
            });
            
            document.getElementById('stopVoiceBtn').addEventListener('click', () => {
                this.stopListening();
            });
            
            const modal = document.getElementById('voiceCommandModal');
            modal.addEventListener('shown.bs.modal', () => {
                this.speak('Voice command assistant activated. I can understand commands even if they are not exact. Say "help" to hear what I can do.');
            });
            
            modal.addEventListener('hidden.bs.modal', () => {
                this.stopListening();
            });
        }
        
        loadElectionsData() {
            const electionContainers = document.querySelectorAll('.election-container');
            this.availableElections = [];
            
            electionContainers.forEach((container, index) => {
                const electionId = container.dataset.electionId;
                const electionName = container.querySelector('h6')?.textContent.trim();
                const voteButton = container.querySelector('.vote-btn');
                const hasVoted = container.querySelector('.voted-container') !== null;
                
                if (electionName && !hasVoted && voteButton) {
                    this.availableElections.push({
                        id: electionId,
                        name: electionName.toLowerCase(),
                        index: index,
                        element: container
                    });
                }
            });
            
            console.log('Loaded elections:', this.availableElections);
        }
        
        async loadCandidatesForElection(electionId) {
            try {
                const response = await fetch(`/api/candidates/${electionId}/`);
                const data = await response.json();
                
                if (data.success) {
                    this.availableCandidates = data.candidates.map(c => ({
                        id: c.id,
                        name: c.name.toLowerCase(),
                        party: c.party.toLowerCase(),
                        fullData: c
                    }));
                    return true;
                }
                return false;
            } catch (error) {
                console.error('Error loading candidates:', error);
                return false;
            }
        }
        
        handleHelpCommand() {
            const helpText = `I understand natural voice commands. You can say things like: 
                "Show me the elections", 
                "I want to vote in the municipal election", 
                "List all candidates", 
                "Vote for John Smith", 
                "Confirm my vote", 
                "Go to my profile", 
                "Show results", 
                or "Cancel". 
                I can understand even if you don't say the exact words.`;
            
            this.speak(helpText);
            this.displayResponse('Help provided');
        }
        
        handleShowElections() {
            if (this.availableElections.length === 0) {
                this.speak('There are no active elections available for voting.');
                this.displayResponse('No active elections');
                return;
            }
            
            let electionList = 'Available elections are: ';
            this.availableElections.forEach((election, index) => {
                electionList += `${index + 1}. ${election.name}. `;
            });
            electionList += 'Say "vote in" followed by the election name.';
            
            this.speak(electionList);
            this.displayResponse(`Found ${this.availableElections.length} elections`);
        }
        
        handleListCandidates() {
            if (!this.selectedElection) {
                this.speak('Please select an election first. Say "show elections" to see available elections.');
                this.displayResponse('No election selected');
                return;
            }
            
            if (this.availableCandidates.length === 0) {
                this.speak('No candidates found for this election.');
                this.displayResponse('No candidates');
                return;
            }
            
            let candidateList = `Candidates for ${this.selectedElection.name} are: `;
            this.availableCandidates.forEach((candidate, index) => {
                candidateList += `${index + 1}. ${candidate.fullData.name} from ${candidate.fullData.party}. `;
            });
            candidateList += 'Say "vote for" followed by the candidate name.';
            
            this.speak(candidateList);
            this.displayResponse(`Listed ${this.availableCandidates.length} candidates`);
        }
        
        async handleConfirmVote() {
            if (!this.selectedCandidate || !this.selectedElection) {
                this.speak('No candidate selected. Please select a candidate first.');
                this.displayResponse('No selection to confirm');
                return;
            }
            
            if (this.currentContext !== 'confirm-vote') {
                this.speak('Nothing to confirm. Say "vote for" followed by a candidate name first.');
                return;
            }
            
            this.speak(`Casting your vote for ${this.selectedCandidate.fullData.name}. Please wait.`);
            this.displayResponse('Processing vote...');
            
            try {
                const response = await fetch('/api/cast-vote/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': this.getCookie('csrftoken')
                    },
                    body: JSON.stringify({
                        election_id: this.selectedElection.id,
                        candidate_id: this.selectedCandidate.id
                    })
                });
                
                const data = await response.json();
                
                if (data.success) {
                    this.speak(`Your vote has been cast successfully for ${this.selectedCandidate.fullData.name}. Thank you for voting!`);
                    this.displayResponse('✓ Vote cast successfully');
                    
                    this.resetState();
                    
                    setTimeout(() => {
                        bootstrap.Modal.getInstance(document.getElementById('voiceCommandModal')).hide();
                        location.reload();
                    }, 3000);
                } else {
                    this.speak(`Error: ${data.message}`);
                    this.displayResponse(`Error: ${data.message}`);
                }
            } catch (error) {
                console.error('Error casting vote:', error);
                this.speak('Sorry, there was an error casting your vote. Please try again.');
                this.displayResponse('Error casting vote');
            }
        }
        
        handleCancel() {
            if (this.currentContext === 'confirm-vote') {
                this.speak('Vote cancelled. Say "vote for" to select a different candidate.');
                this.selectedCandidate = null;
                this.currentContext = 'candidate-selection';
                this.displayResponse('Cancelled');
            } else {
                this.speak('Cancelled. Say "help" for available commands.');
                this.resetState();
                this.displayResponse('Cancelled');
            }
        }
        
        handleNavigateProfile() {
            this.speak('Navigating to your profile.');
            window.location.href = '#profile';
            setTimeout(() => {
                document.getElementById('profile')?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        }
        
        handleNavigateResults() {
            this.speak('Navigating to results page.');
            setTimeout(() => {
                window.location.href = '/voter-results/';
            }, 1000);
        }
        
        resetState() {
            this.currentContext = null;
            this.selectedElection = null;
            this.selectedCandidate = null;
            this.availableCandidates = [];
        }
        
        startListening() {
            if (!this.recognition) {
                this.showNotification('Speech recognition not available', 'error');
                return;
            }
            
            try {
                this.recognition.start();
            } catch (error) {
                console.error('Error starting recognition:', error);
                this.showNotification('Could not start voice recognition', 'error');
            }
        }
        
        stopListening() {
            if (this.recognition && this.isListening) {
                this.recognition.stop();
            }
        }
        
        speak(text) {
            this.synthesis.cancel();
            
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'en-IN';
            utterance.rate = 0.9;
            utterance.pitch = 1;
            utterance.volume = 1;
            
            this.synthesis.speak(utterance);
        }
        
        openVoiceModal() {
            const modal = new bootstrap.Modal(document.getElementById('voiceCommandModal'));
            modal.show();
        }
        
        updateStatus(text, className) {
            const statusEl = document.getElementById('voiceStatus');
            let badgeClass = 'bg-secondary';
            
            if (className === 'listening') badgeClass = 'bg-success';
            else if (className === 'error') badgeClass = 'bg-danger';
            else if (className === 'processing') badgeClass = 'bg-warning';
            
            statusEl.innerHTML = `<span class="badge ${badgeClass}">${text}</span>`;
        }
        
        displayTranscript(text) {
            document.getElementById('transcriptText').textContent = text;
            document.getElementById('voiceTranscript').style.display = 'block';
            
            setTimeout(() => {
                document.getElementById('voiceTranscript').style.display = 'none';
            }, 5000);
        }
        
        displayResponse(text) {
            document.getElementById('responseText').textContent = text;
            document.getElementById('voiceResponse').style.display = 'block';
            
            setTimeout(() => {
                document.getElementById('voiceResponse').style.display = 'none';
            }, 5000);
        }
        
        showNotification(message, type) {
            if (typeof Swal !== 'undefined') {
                Swal.fire({
                    title: type === 'error' ? 'Error' : 'Notice',
                    text: message,
                    icon: type === 'error' ? 'error' : 'info',
                    timer: 3000
                });
            } else {
                alert(message);
            }
        }
        
        getCookie(name) {
            let cookieValue = null;
            if (document.cookie && document.cookie !== '') {
                const cookies = document.cookie.split(';');
                for (let i = 0; i < cookies.length; i++) {
                    const cookie = cookies[i].trim();
                    if (cookie.substring(0, name.length + 1) === (name + '=')) {
                        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                        break;
                    }
                }
            }
            return cookieValue;
        }
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.voiceCommandSystem = new EnhancedVoiceCommandSystem();
        });
    } else {
        window.voiceCommandSystem = new EnhancedVoiceCommandSystem();
    }

})();