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
    // Only animate on desktop - mobile gets immediate visibility
    const isMobile = window.matchMedia('(pointer: coarse)').matches;

    if (isMobile) {
        return; // Elements already visible in CSS
    }

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Add animation class and observe project cards
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.classList.add('animate-on-scroll');
        card.style.opacity = '0';
        card.style.transform = 'translateY(40px)';
        observer.observe(card);
    });

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

// Parallax Module - disabled on mobile for performance
function initParallax() {
    // Skip on touch/mobile devices for performance
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const heroVideo = document.querySelector('.hero-video');
    const philosophyImage = document.querySelector('.philosophy-image img');

    if (!heroVideo && !philosophyImage) return;

    let ticking = false;
    let scrollTimeout;

    // Throttled scroll listener
    window.addEventListener('scroll', () => {
        if (scrollTimeout) return;

        scrollTimeout = setTimeout(() => {
            scrollTimeout = null;
        }, 16); // ~60fps throttle

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
    }, { passive: true });
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

// Reveal text animation - works on both desktop and mobile
function initTextReveal() {
    const heroLines = document.querySelectorAll('.hero-line');
    const heroContent = document.querySelector('.hero-content');

    // Start with hero content visible but lines hidden
    heroLines.forEach((line, index) => {
        line.style.opacity = '0';
        line.style.transform = 'translateY(30px)';
        line.style.transition = 'opacity 0.8s ease, transform 0.8s ease';

        // Staggered reveal
        setTimeout(() => {
            line.style.opacity = '1';
            line.style.transform = 'translateY(0)';
        }, 300 + index * 200);
    });
}

// Initialize text reveal on load
if (document.readyState === 'complete') {
    initTextReveal();
} else {
    window.addEventListener('load', initTextReveal);
}

// Exploding View Scroll Video - works on desktop and mobile
function initExplodingView() {
    const video = document.getElementById('exploding-video');
    const container = document.querySelector('.exploding-view-container');
    const panels = document.querySelectorAll('.skill-panel');

    if (!video || !container) return;

    // Check if mobile
    const isMobile = window.matchMedia('(pointer: coarse)').matches;
    const isLowPower = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Setup video
    let duration = 0;
    video.muted = true;
    video.playsInline = true;

    // On mobile, loop the video; on desktop, pause for frame scrubbing
    if (isMobile || isLowPower) {
        video.loop = true;
        video.play().catch(() => {});
    } else {
        video.pause();
    }

    // Get video duration when ready
    video.addEventListener('loadedmetadata', () => {
        duration = video.duration;
        if (!isMobile) {
            video.currentTime = 0;
        }
    }, { once: true });

    if (video.readyState >= 1) {
        duration = video.duration;
    }

    // Scroll-based animation for both mobile and desktop
    const panelCount = panels.length;
    const panelThreshold = 1 / panelCount;
    let ticking = false;

    function updateOnScroll() {
        if (ticking) return;
        ticking = true;

        requestAnimationFrame(() => {
            const rect = container.getBoundingClientRect();
            const windowHeight = window.innerHeight;

            // Calculate progress through the section
            const sectionHeight = container.offsetHeight;
            const totalScrollDistance = sectionHeight + windowHeight;
            const currentPosition = windowHeight - rect.top;
            let progress = currentPosition / totalScrollDistance;
            progress = Math.max(0, Math.min(1, progress));

            // Update video time on desktop (skip on mobile since it's playing)
            if (!isMobile && duration && video.readyState >= 2) {
                video.currentTime = progress * duration;
            }

            // Update panels
            panels.forEach((panel, index) => {
                const panelStart = index * panelThreshold;
                const panelEnd = (index + 1) * panelThreshold;
                const isActivePanel = progress >= panelStart && progress < panelEnd;
                panel.classList.toggle('active', isActivePanel);
            });

            ticking = false;
        });
    }

    window.addEventListener('scroll', updateOnScroll, { passive: true });
    updateOnScroll(); // Initial call
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                isActive = true;
                handleScroll();
            } else {
                isActive = false;
            }
        });
    }, { threshold: 0, rootMargin: '100px' });

    observer.observe(container);

    // Single scroll listener for the page
    window.addEventListener('scroll', handleScroll, { passive: true });

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

// Mobile optimizations - disable heavy effects on touch devices
function initMobileOptimizations() {
    const isMobile = window.matchMedia('(pointer: coarse)').matches;

    if (isMobile) {
        // Disable parallax on mobile
        const heroVideo = document.querySelector('.hero-video');
        if (heroVideo) {
            heroVideo.style.transform = 'scale(1.05)';
            heroVideo.style.willChange = 'auto';
        }

        // Reduce frame rate for intersection observer
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: [0, 0.25, 0.5, 0.75, 1]
        };

        // Use the optimized options for any new observers
        window._mobileOptimized = true;
    }
}

// Initialize mobile optimizations
document.addEventListener('DOMContentLoaded', initMobileOptimizations);

// Video loop - simple seamless loop for better performance
function initVideoLoop() {
    const heroVideo = document.querySelector('.hero-video');

    if (heroVideo) {
        // Enable seamless loop
        heroVideo.loop = true;
        heroVideo.muted = true;
        heroVideo.playbackRate = 1;

        // Force play on mobile
        const playVideo = () => {
            heroVideo.play().catch(() => {});
        };

        playVideo();

        // Retry on user interaction if autoplay blocked
        document.addEventListener('touchstart', playVideo, { once: true });
        document.addEventListener('click', playVideo, { once: true });
    }
}

// Initialize video loop
document.addEventListener('DOMContentLoaded', initVideoLoop);
