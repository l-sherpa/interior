// Atelier Lumière - Interior Design Studio
// Interactive behaviors and animations

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    initNavigation();
    initScrollAnimations();
    initSmoothScroll();
    initParallax();
});

// Navigation Module
function initNavigation() {
    const nav = document.querySelector('.nav');
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    let lastScroll = 0;

    // Navbar scroll behavior
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        // Add/remove scrolled class
        if (currentScroll > 100) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }

        // Hide/show navbar on scroll
        if (currentScroll > lastScroll && currentScroll > 200) {
            nav.style.transform = 'translateY(-100%)';
        } else {
            nav.style.transform = 'translateY(0)';
        }

        lastScroll = currentScroll;
    });

    // Mobile menu toggle
    navToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        navToggle.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    });

    // Close mobile menu on link click
    const links = navLinks.querySelectorAll('.nav-link');
    links.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            navToggle.classList.remove('active');
            document.body.classList.remove('menu-open');
        });
    });
}

// Scroll Animations Module
function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe project cards
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => observer.observe(card));

    // Observe service cards
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => observer.observe(card));

    // Observe journal cards
    const journalCards = document.querySelectorAll('.journal-card');
    journalCards.forEach(card => observer.observe(card));

    // Observe philosophy section
    const philosophyContent = document.querySelector('.philosophy-content');
    if (philosophyContent) observer.observe(philosophyContent);

    // Observe contact content
    const contactContent = document.querySelector('.contact-content');
    if (contactContent) observer.observe(contactContent);

    // Observe quote section
    const quoteContent = document.querySelector('.quote-content');
    if (quoteContent) observer.observe(quoteContent);
}

// Smooth Scroll Module
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const navHeight = document.querySelector('.nav').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
                const offsetPosition = targetPosition - navHeight - 20;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Parallax Module
function initParallax() {
    const heroVideo = document.querySelector('.hero-video');
    const philosophyImage = document.querySelector('.philosophy-image img');

    if (!heroVideo && !philosophyImage) return;

    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrolled = window.pageYOffset;

                // Hero video parallax - subtle movement
                if (heroVideo && scrolled < window.innerHeight) {
                    const heroSpeed = 0.3;
                    heroVideo.style.transform = `translateY(${scrolled * heroSpeed}px) scale(1.05)`;
                }

                // Philosophy image parallax
                if (philosophyImage) {
                    const philosophySection = document.querySelector('.philosophy');
                    const sectionTop = philosophySection.offsetTop;
                    const sectionHeight = philosophySection.offsetHeight;
                    const scrollPosition = scrolled - sectionTop + window.innerHeight;

                    if (scrollPosition > 0 && scrollPosition < sectionHeight + window.innerHeight) {
                        const parallaxSpeed = 0.1;
                        philosophyImage.style.transform = `translateY(${scrollPosition * parallaxSpeed}px)`;
                    }
                }

                ticking = false;
            });

            ticking = true;
        }
    });
}

// Project Card Hover Effect
function initProjectHover() {
    const projectCards = document.querySelectorAll('.project-card');

    projectCards.forEach(card => {
        card.addEventListener('mouseenter', (e) => {
            const overlay = card.querySelector('.project-overlay');
            const view = card.querySelector('.project-view');

            if (overlay && view) {
                overlay.style.opacity = '1';
                view.style.opacity = '1';
                view.style.transform = 'translateY(0)';
            }
        });

        card.addEventListener('mouseleave', (e) => {
            const overlay = card.querySelector('.project-overlay');
            const view = card.querySelector('.project-view');

            if (overlay && view) {
                overlay.style.opacity = '0';
                view.style.opacity = '0';
                view.style.transform = 'translateY(20px)';
            }
        });
    });
}

// Custom Cursor (for desktop)
function initCustomCursor() {
    // Only on non-touch devices
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    cursor.style.cssText = `
        position: fixed;
        width: 20px;
        height: 20px;
        border: 1px solid var(--color-accent);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        transition: transform 0.15s ease-out, opacity 0.3s ease;
        opacity: 0;
    `;

    const cursorDot = document.createElement('div');
    cursorDot.className = 'cursor-dot';
    cursorDot.style.cssText = `
        position: fixed;
        width: 4px;
        height: 4px;
        background-color: var(--color-accent);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        transition: opacity 0.3s ease;
        opacity: 0;
    `;

    document.body.appendChild(cursor);
    document.body.appendChild(cursorDot);

    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursor.style.opacity = '1';
        cursorDot.style.opacity = '1';
    });

    document.addEventListener('mouseleave', () => {
        cursor.style.opacity = '0';
        cursorDot.style.opacity = '0';
    });

    // Smooth cursor animation
    function animateCursor() {
        const dx = mouseX - cursorX;
        const dy = mouseY - cursorY;

        cursorX += dx * 0.15;
        cursorY += dy * 0.15;

        cursor.style.left = cursorX - 10 + 'px';
        cursor.style.top = cursorY - 10 + 'px';
        cursorDot.style.left = mouseX - 2 + 'px';
        cursorDot.style.top = mouseY - 2 + 'px';

        requestAnimationFrame(animateCursor);
    }

    animateCursor();

    // Hover states for interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .project-card');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform = 'scale(2)';
            cursor.style.borderColor = 'var(--color-charcoal)';
        });
        el.addEventListener('mouseleave', () => {
            cursor.style.transform = 'scale(1)';
            cursor.style.borderColor = 'var(--color-accent)';
        });
    });
}

// Reveal text animation
function initTextReveal() {
    const heroLines = document.querySelectorAll('.hero-line');

    heroLines.forEach((line, index) => {
        line.style.opacity = '0';
        line.style.transform = 'translateY(100%)';

        setTimeout(() => {
            line.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            line.style.opacity = '1';
            line.style.transform = 'translateY(0)';
        }, 300 + index * 200);
    });
}

// Initialize text reveal on load
window.addEventListener('load', initTextReveal);

// Exploding View Scroll Video
function initExplodingView() {
    const video = document.getElementById('exploding-video');
    const section = document.querySelector('.exploding-view');
    const container = document.querySelector('.exploding-view-container');
    const panels = document.querySelectorAll('.skill-panel');

    if (!video || !section || !container) return;

    let ticking = false;
    let isActive = false;
    let duration = 0;

    function updateVideo(progress) {
        if (duration && video.currentTime !== progress * duration) {
            video.currentTime = progress * duration;
        }

        // Update active panel based on progress
        const panelCount = panels.length;
        const panelThreshold = 1 / panelCount;

        panels.forEach((panel, index) => {
            const panelStart = index * panelThreshold;
            const panelEnd = (index + 1) * panelThreshold;

            if (progress >= panelStart - 0.1 && progress <= panelEnd + 0.1) {
                const panelProgress = (progress - panelStart) / panelThreshold;
                const isActivePanel = progress >= panelStart && progress <= panelEnd;

                if (isActivePanel) {
                    panel.classList.add('active');
                } else {
                    panel.classList.remove('active');
                }
            } else {
                panel.classList.remove('active');
            }
        });
    }

    function handleScroll() {
        if (!isActive || !ticking) {
            ticking = true;
            requestAnimationFrame(() => {
                const rect = container.getBoundingClientRect();
                const windowHeight = window.innerHeight;

                // Calculate scroll progress through the section
                const scrollStart = windowHeight;
                const scrollEnd = -container.offsetHeight + windowHeight;
                const scrollRange = scrollStart - scrollEnd;
                const currentScroll = scrollStart - rect.top;
                let progress = currentScroll / scrollRange;

                // Clamp progress between 0 and 1
                progress = Math.max(0, Math.min(1, progress));

                updateVideo(progress);
                ticking = false;
            });
        }
    }

    // Wait for video metadata to load
    video.addEventListener('loadedmetadata', () => {
        duration = video.duration;
        video.pause();
        video.currentTime = 0;
    });

    // Create scroll observer for the section
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                isActive = true;
                window.addEventListener('scroll', handleScroll, { passive: true });
                handleScroll();
            } else {
                isActive = false;
                window.removeEventListener('scroll', handleScroll);
            }
        });
    }, { threshold: 0, rootMargin: '100px' });

    observer.observe(container);

    // Trigger loadedmetadata if already loaded
    if (video.readyState >= 2) {
        video.dispatchEvent(new Event('loadedmetadata'));
    }

    // Initial scroll check
    handleScroll();
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    initExplodingView();
});

// Magnetic button effect (disabled on touch devices)
function initMagneticButtons() {
    // Skip on touch devices
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const buttons = document.querySelectorAll('.hero-cta, .text-link');

    buttons.forEach(button => {
        button.addEventListener('mousemove', (e) => {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            button.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
        });

        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translate(0, 0)';
        });
    });
}

// Initialize magnetic buttons on load
window.addEventListener('load', initMagneticButtons);

// Mobile optimizations
function initMobileOptimizations() {
    // Disable parallax on mobile for performance
    if (window.matchMedia('(pointer: coarse)').matches) {
        const heroVideo = document.querySelector('.hero-video');
        if (heroVideo) {
            heroVideo.style.transform = 'scale(1.05)';
        }
    }
}

// Initialize mobile optimizations
document.addEventListener('DOMContentLoaded', initMobileOptimizations);

// Video Rewind and Loop - Hero video plays forward, then backward, then loops
function initVideoRewindLoop() {
    const heroVideo = document.querySelector('.hero-video');

    if (heroVideo) {
        let isRewinding = false;

        heroVideo.addEventListener('ended', () => {
            if (!isRewinding) {
                isRewinding = true;

                // Smooth rewind at 1x speed using small steps
                const stepSize = 0.033; // ~30fps, roughly 1x speed

                function rewindStep() {
                    if (heroVideo.currentTime > stepSize) {
                        heroVideo.currentTime -= stepSize;
                        requestAnimationFrame(rewindStep);
                    } else {
                        heroVideo.currentTime = 0;
                        isRewinding = false;
                        heroVideo.play();
                    }
                }

                rewindStep();
            }
                });
    }
}

// Initialize video rewind loop
document.addEventListener('DOMContentLoaded', initVideoRewindLoop);
