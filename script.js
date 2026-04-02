// Atelier Lumière - Interior Design Studio
// Interactive behaviors and animations

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    initNavigation();
    initScrollAnimations();
    initSmoothScroll();
    initParallax();
    initExplodingView();
    initVideoLoop();
    initTextReveal();
});

// Navigation Module
function initNavigation() {
    const nav = document.querySelector('.nav');
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    let lastScroll = 0;

    if (!nav) return;

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
    }, { passive: true });

    // Mobile menu toggle
    if (navToggle && navLinks) {
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
}

// Scroll Animations Module - works on both desktop and mobile
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

    // Observe project cards - add animation class first
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.classList.add('animate-on-scroll');
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
                const nav = document.querySelector('.nav');
                const navHeight = nav ? nav.offsetHeight : 0;
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
                    if (philosophySection) {
                        const sectionTop = philosophySection.offsetTop;
                        const sectionHeight = philosophySection.offsetHeight;
                        const scrollPosition = scrolled - sectionTop + window.innerHeight;

                        if (scrollPosition > 0 && scrollPosition < sectionHeight + window.innerHeight) {
                            const parallaxSpeed = 0.1;
                            philosophyImage.style.transform = `translateY(${scrollPosition * parallaxSpeed}px)`;
                        }
                    }
                }

                ticking = false;
            });

            ticking = true;
        }
    }, { passive: true });
}

// Reveal text animation - works on both desktop and mobile
function initTextReveal() {
    const heroContent = document.querySelector('.hero-content');
    const heroLines = document.querySelectorAll('.hero-line');

    if (heroLines.length === 0) return;

    // Add animation class to hero content
    if (heroContent) {
        heroContent.classList.add('animate-in');
    }

    // Start with lines hidden
    heroLines.forEach((line) => {
        line.style.opacity = '0';
        line.style.transform = 'translateY(30px)';
    });

    // Trigger animation after a short delay
    setTimeout(() => {
        heroLines.forEach((line, index) => {
            line.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            // Staggered reveal
            setTimeout(() => {
                line.style.opacity = '1';
                line.style.transform = 'translateY(0)';
            }, index * 200);
        });
    }, 600);
}

// Exploding View Scroll Video - works on desktop and mobile
function initExplodingView() {
    const video = document.getElementById('exploding-video');
    const container = document.querySelector('.exploding-view-container');
    const panels = document.querySelectorAll('.skill-panel');

    if (!video || !container || panels.length === 0) return;

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
        if (!isMobile && !isLowPower) {
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
            if (!isMobile && !isLowPower && duration && video.readyState >= 2) {
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
}

// Video loop - simple seamless loop for better performance
function initVideoLoop() {
    const heroVideo = document.querySelector('.hero-video');

    if (!heroVideo) return;

    // Enable seamless loop
    heroVideo.loop = true;
    heroVideo.muted = true;
    heroVideo.playbackRate = 1;

    // Force play
    const playVideo = () => {
        heroVideo.play().catch(() => {});
    };

    playVideo();

    // Retry on user interaction if autoplay blocked
    document.addEventListener('touchstart', playVideo, { once: true });
    document.addEventListener('click', playVideo, { once: true });
}
