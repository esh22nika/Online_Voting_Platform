// DeshKaVote - Enhanced Landing Page Animations
// Indian Flag & Democracy Themed Interactive Elements

document.addEventListener('DOMContentLoaded', function() {
    
    // ==========================================
    // INDIAN FLAG PARTICLE SYSTEM
    // ==========================================
    function createFlagParticles() {
        const canvas = document.createElement('canvas');
        canvas.id = 'flag-particles';
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.pointerEvents = 'none';
        canvas.style.zIndex = '1';
        canvas.style.opacity = '0.6';
        document.body.insertBefore(canvas, document.body.firstChild);

        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const particles = [];
        const colors = ['#ff9933', '#ffffff', '#138808']; // Saffron, White, Green
        
        class Particle {
            constructor() {
                this.reset();
                this.y = Math.random() * canvas.height;
            }
            
            reset() {
                this.x = Math.random() * canvas.width;
                this.y = -10;
                this.speed = 0.5 + Math.random() * 1;
                this.radius = 2 + Math.random() * 3;
                this.color = colors[Math.floor(Math.random() * colors.length)];
                this.swing = Math.random() * 2 - 1;
                this.swingSpeed = 0.01 + Math.random() * 0.02;
                this.swingAmount = 20 + Math.random() * 30;
            }
            
            update() {
                this.swing += this.swingSpeed;
                this.x += Math.sin(this.swing) * 0.5;
                this.y += this.speed;
                
                if (this.y > canvas.height + 10) {
                    this.reset();
                }
                
                if (this.x > canvas.width + 10 || this.x < -10) {
                    this.x = Math.random() * canvas.width;
                }
            }
            
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.fill();
            }
        }
        
        // Create particles
        for (let i = 0; i < 50; i++) {
            particles.push(new Particle());
        }
        
        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(particle => {
                particle.update();
                particle.draw();
            });
            requestAnimationFrame(animate);
        }
        
        animate();
        
        // Resize handler
        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });
    }
    
    createFlagParticles();
    
    // ==========================================
    // PARALLAX SCROLLING EFFECT
    // ==========================================
    function initParallax() {
        const hero = document.querySelector('.hero');
        const heroText = document.querySelector('.hero-text');
        const heroImage = document.querySelector('.hero-image');
        const header = document.querySelector('header.landing-page-header');
        
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * 0.5;
            
            if (header) {
                header.style.transform = `translateY(${scrolled * 0.3}px)`;
                header.style.opacity = 1 - (scrolled / 500);
            }
            
            if (heroText) {
                heroText.style.transform = `translateY(${rate * 0.5}px)`;
            }
            
            if (heroImage) {
                heroImage.style.transform = `translateY(${-rate * 0.8}px) scale(${1 + scrolled * 0.0005})`;
            }
        });
    }
    
    initParallax();
    
    // ==========================================
    // ASHOKA CHAKRA ROTATION IN LOGO
    // ==========================================
    function createAshokChakra() {
        const heroImage = document.querySelector('.hero-image div');
        if (!heroImage) return;
        
        const chakra = document.createElement('div');
        chakra.style.position = 'absolute';
        chakra.style.width = '40px';
        chakra.style.height = '40px';
        chakra.style.top = '50%';
        chakra.style.left = '50%';
        chakra.style.transform = 'translate(-50%, -50%)';
        chakra.style.opacity = '0.3';
        chakra.style.pointerEvents = 'none';
        chakra.innerHTML = `
            <svg viewBox="0 0 100 100" style="width: 100%; height: 100%; animation: rotateChakra 10s linear infinite;">
                <circle cx="50" cy="50" r="45" fill="none" stroke="#000080" stroke-width="2"/>
                ${Array.from({length: 24}, (_, i) => {
                    const angle = (i * 360 / 24) * Math.PI / 180;
                    const x1 = 50 + 20 * Math.cos(angle);
                    const y1 = 50 + 20 * Math.sin(angle);
                    const x2 = 50 + 42 * Math.cos(angle);
                    const y2 = 50 + 42 * Math.sin(angle);
                    return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#000080" stroke-width="2"/>`;
                }).join('')}
                <circle cx="50" cy="50" r="8" fill="#000080"/>
            </svg>
        `;
        
        const style = document.createElement('style');
        style.textContent = `
            @keyframes rotateChakra {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
        
        heroImage.style.position = 'relative';
        heroImage.appendChild(chakra);
    }
    
    createAshokChakra();
    
    // ==========================================
    // VOTING BALLOT FLOATING ANIMATION
    // ==========================================
    function createFloatingBallots() {
        const ballotsContainer = document.createElement('div');
        ballotsContainer.id = 'floating-ballots';
        ballotsContainer.style.position = 'fixed';
        ballotsContainer.style.top = '0';
        ballotsContainer.style.left = '0';
        ballotsContainer.style.width = '100%';
        ballotsContainer.style.height = '100%';
        ballotsContainer.style.pointerEvents = 'none';
        ballotsContainer.style.zIndex = '1';
        ballotsContainer.style.overflow = 'hidden';
        document.body.appendChild(ballotsContainer);
        
        function createBallot() {
            const ballot = document.createElement('div');
            ballot.style.position = 'absolute';
            ballot.style.fontSize = '30px';
            ballot.style.opacity = '0.4';
            ballot.innerHTML = '🗳️';
            ballot.style.left = Math.random() * 100 + '%';
            ballot.style.top = '-50px';
            ballot.style.animation = `floatBallot ${8 + Math.random() * 4}s linear`;
            
            ballotsContainer.appendChild(ballot);
            
            setTimeout(() => ballot.remove(), 12000);
        }
        
        const style = document.createElement('style');
        style.textContent = `
            @keyframes floatBallot {
                0% {
                    transform: translateY(-50px) rotateZ(0deg);
                    opacity: 0;
                }
                10% {
                    opacity: 0.4;
                }
                90% {
                    opacity: 0.4;
                }
                100% {
                    transform: translateY(calc(100vh + 50px)) rotateZ(360deg);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
        
        // Create ballot every 3 seconds
        setInterval(createBallot, 3000);
    }
    
    createFloatingBallots();
    
    // ==========================================
    // MOUSE TRAIL WITH FLAG COLORS
    // ==========================================
    function createMouseTrail() {
        const colors = ['#ff9933', '#ffffff', '#138808'];
        let colorIndex = 0;
        
        document.addEventListener('mousemove', (e) => {
            const trail = document.createElement('div');
            trail.style.position = 'fixed';
            trail.style.width = '8px';
            trail.style.height = '8px';
            trail.style.borderRadius = '50%';
            trail.style.backgroundColor = colors[colorIndex % colors.length];
            trail.style.left = e.clientX + 'px';
            trail.style.top = e.clientY + 'px';
            trail.style.pointerEvents = 'none';
            trail.style.zIndex = '9999';
            trail.style.transform = 'translate(-50%, -50%)';
            trail.style.animation = 'trailFade 1s ease-out forwards';
            
            document.body.appendChild(trail);
            
            colorIndex++;
            
            setTimeout(() => trail.remove(), 1000);
        });
        
        const style = document.createElement('style');
        style.textContent = `
            @keyframes trailFade {
                0% {
                    transform: translate(-50%, -50%) scale(1);
                    opacity: 0.8;
                }
                100% {
                    transform: translate(-50%, -50%) scale(0);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    createMouseTrail();
    
    // ==========================================
    // INTERACTIVE HOVER EFFECTS ON SECTIONS
    // ==========================================
    function addSectionInteractivity() {
        const sections = document.querySelectorAll('.announcements, .documents');
        
        sections.forEach(section => {
            section.addEventListener('mouseenter', function() {
                this.style.transition = 'all 0.4s ease';
                this.style.borderColor = '#138808';
                this.style.borderWidth = '2px';
            });
            
            section.addEventListener('mouseleave', function() {
                this.style.borderColor = '#000';
                this.style.borderWidth = '1px';
            });
        });
    }
    
    addSectionInteractivity();
    
    // ==========================================
    // ANIMATED COUNTER FOR STATISTICS
    // ==========================================
    function animateCounters() {
        const createCounter = (target, text) => {
            let count = 0;
            const increment = target / 100;
            const timer = setInterval(() => {
                count += increment;
                if (count >= target) {
                    count = target;
                    clearInterval(timer);
                }
                // You can display this somewhere if needed
            }, 20);
        };
    }
    
    // ==========================================
    // SCROLL REVEAL ANIMATIONS
    // ==========================================
    function scrollReveal() {
        const elements = document.querySelectorAll('.announcements, .documents');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, {
            threshold: 0.1
        });
        
        elements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'all 0.6s ease';
            observer.observe(el);
        });
    }
    
    scrollReveal();
    
    // ==========================================
    // INDIAN FLAG WAVE EFFECT ON HEADER
    // ==========================================
    function createFlagWave() {
        const header = document.querySelector('header.landing-page-header');
        if (!header) return;
        
        const flagOverlay = document.createElement('div');
        flagOverlay.style.position = 'absolute';
        flagOverlay.style.top = '0';
        flagOverlay.style.left = '0';
        flagOverlay.style.width = '100%';
        flagOverlay.style.height = '100%';
        flagOverlay.style.background = `
            linear-gradient(180deg, 
                #ff9933 0%, #ff9933 33%, 
                #ffffff 33%, #ffffff 66%, 
                #138808 66%, #138808 100%)
        `;
        flagOverlay.style.opacity = '0';
        flagOverlay.style.transition = 'opacity 0.5s ease';
        flagOverlay.style.pointerEvents = 'none';
        flagOverlay.style.mixBlendMode = 'overlay';
        
        header.style.position = 'relative';
        header.appendChild(flagOverlay);
        
        header.addEventListener('mouseenter', () => {
            flagOverlay.style.opacity = '0.3';
        });
        
        header.addEventListener('mouseleave', () => {
            flagOverlay.style.opacity = '0';
        });
    }
    
    createFlagWave();
    
    // ==========================================
    // TYPEWRITER EFFECT FOR HERO TEXT
    // ==========================================
    function typewriterEffect() {
        const heroSubtext = document.querySelector('.hero-text p');
        if (!heroSubtext) return;
        
        const originalText = heroSubtext.textContent;
        heroSubtext.textContent = '';
        let index = 0;
        
        function type() {
            if (index < originalText.length) {
                heroSubtext.textContent += originalText.charAt(index);
                index++;
                setTimeout(type, 30);
            }
        }
        
        // Start typing after a delay
        setTimeout(type, 1000);
    }
    
    typewriterEffect();
    
    // ==========================================
    // CLICK RIPPLE EFFECT ON BUTTONS/LINKS
    // ==========================================
    function addRippleEffect() {
        const buttons = document.querySelectorAll('nav a, .btn');
        
        buttons.forEach(button => {
            button.addEventListener('click', function(e) {
                const ripple = document.createElement('span');
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.width = ripple.style.height = size + 'px';
                ripple.style.left = x + 'px';
                ripple.style.top = y + 'px';
                ripple.style.position = 'absolute';
                ripple.style.borderRadius = '50%';
                ripple.style.backgroundColor = 'rgba(255, 255, 255, 0.6)';
                ripple.style.transform = 'scale(0)';
                ripple.style.animation = 'ripple 0.6s ease-out';
                ripple.style.pointerEvents = 'none';
                
                this.style.position = 'relative';
                this.style.overflow = 'hidden';
                this.appendChild(ripple);
                
                setTimeout(() => ripple.remove(), 600);
            });
        });
        
        const style = document.createElement('style');
        style.textContent = `
            @keyframes ripple {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    addRippleEffect();
    
    // ==========================================
    // LOTUS (NATIONAL FLOWER) BLOOM EFFECT
    // ==========================================
    function createLotusBloom() {
        const footer = document.querySelector('footer');
        if (!footer) return;
        
        const lotus = document.createElement('div');
        lotus.innerHTML = '🪷';
        lotus.style.position = 'absolute';
        lotus.style.bottom = '10px';
        lotus.style.right = '20px';
        lotus.style.fontSize = '30px';
        lotus.style.cursor = 'pointer';
        lotus.style.transition = 'all 0.5s ease';
        lotus.style.opacity = '0.6';
        
        footer.style.position = 'relative';
        footer.appendChild(lotus);
        
        lotus.addEventListener('mouseenter', () => {
            lotus.style.transform = 'scale(1.5) rotate(360deg)';
            lotus.style.opacity = '1';
        });
        
        lotus.addEventListener('mouseleave', () => {
            lotus.style.transform = 'scale(1) rotate(0deg)';
            lotus.style.opacity = '0.6';
        });
    }
    
    createLotusBloom();
    
    // ==========================================
    // DEMOCRACY PULSE EFFECT
    // ==========================================
    function democracyPulse() {
        const title = document.querySelector('header.landing-page-header h1');
        if (!title) return;
        
        setInterval(() => {
            title.style.textShadow = '0 0 20px rgba(255, 153, 51, 0.8), 0 0 30px rgba(19, 136, 8, 0.6)';
            setTimeout(() => {
                title.style.textShadow = 'none';
            }, 500);
        }, 3000);
    }
    
    democracyPulse();
    
    // ==========================================
    // VOTE COUNT ANIMATION ON SCROLL
    // ==========================================
    function voteCountAnimation() {
        const announcements = document.querySelector('.announcements');
        if (!announcements) return;
        
        const counter = document.createElement('div');
        counter.style.position = 'absolute';
        counter.style.top = '10px';
        counter.style.right = '10px';
        counter.style.fontSize = '12px';
        counter.style.color = '#138808';
        counter.style.fontWeight = 'bold';
        counter.innerHTML = '👥 10M+ Voters';
        counter.style.animation = 'fadeIn 1s ease-out 1.5s both';
        
        announcements.style.position = 'relative';
        announcements.appendChild(counter);
    }
    
    voteCountAnimation();
    
    console.log('🇮🇳 DeshKaVote animations loaded successfully!');
});