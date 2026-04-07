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

// Exploding View Scroll Video - smooth scroll-linked animation
function initExplodingView() {
    const video = document.getElementById('exploding-video');
    const container = document.querySelector('.exploding-view-container');
    const panels = document.querySelectorAll('.skill-panel');

    if (!video || !container || panels.length === 0) {
        console.log('Exploding view: missing elements');
        return;
    }

    console.log('Exploding view initialized');

    // Setup video
    let duration = 0;
    let targetTime = 0;
    let currentTime = 0;
    let isInView = false;
    let animationFrameId = null;
    let lastProgress = -1;

    video.muted = true;
    video.playsInline = true;
    video.loop = false;
    video.pause();

    // Smooth interpolation factor (0.1 = smooth, 0.3 = responsive)
    const lerpFactor = window.matchMedia('(pointer: coarse)').matches ? 0.15 : 0.12;

    // Get video duration
    const setupDuration = () => {
        if (video.duration) {
            duration = video.duration;
            console.log('Video duration:', duration);
            if (video.readyState >= 2) {
                video.currentTime = 0;
                currentTime = 0;
                targetTime = 0;
            }
        }
    };

    video.addEventListener('loadedmetadata', setupDuration, { once: true });
    if (video.readyState >= 1) setupDuration();

    // Panel count and thresholds
    const panelCount = panels.length;
    const panelThreshold = 1 / panelCount;

    // Smooth interpolation function
    function lerp(start, end, factor) {
        return start + (end - start) * factor;
    }

    // Animation loop for smooth video scrubbing
    function animate() {
        if (!duration) {
            animationFrameId = requestAnimationFrame(animate);
            return;
        }

        // Smoothly interpolate current time towards target
        if (Math.abs(targetTime - currentTime) > 0.01) {
            currentTime = lerp(currentTime, targetTime, lerpFactor);

            // Update video frame
            if (video.readyState >= 2) {
                video.currentTime = currentTime;
            }

            // Calculate progress for panels (0 to 1)
            const progress = currentTime / duration;

            // Only update panels if progress changed significantly
            if (Math.abs(progress - lastProgress) > 0.001) {
                lastProgress = progress;

                // Update panels based on progress
                panels.forEach((panel, index) => {
                    // Each panel gets a segment of the timeline
                    // Add small buffer zones for smoother transitions
                    const panelStart = index * panelThreshold;
                    const panelEnd = (index + 1) * panelThreshold;
                    const buffer = panelThreshold * 0.15;

                    let isActive = false;
                    if (index === 0) {
                        isActive = progress >= 0 && progress < (panelEnd - buffer);
                    } else if (index === panelCount - 1) {
                        isActive = progress >= (panelStart + buffer) && progress <= 1;
                    } else {
                        isActive = progress >= (panelStart + buffer) && progress < (panelEnd - buffer);
                    }

                    // Also handle the transition zones
                    const inTransition = progress >= (panelStart - buffer) && progress < (panelStart + buffer);
                    if (inTransition && index > 0) {
                        const transitionProgress = (progress - (panelStart - buffer)) / (buffer * 2);
                        if (transitionProgress > 0.5) {
                            isActive = true;
                        }
                    }

                    panel.classList.toggle('active', isActive);
                });
            }
        }

        animationFrameId = requestAnimationFrame(animate);
    }

    // Calculate scroll progress
    function calculateProgress() {
        const rect = container.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const containerHeight = container.offsetHeight;

        // Calculate progress based on scroll position
        // Start: when container top enters viewport bottom
        // End: when container bottom leaves viewport top
        const scrollRange = containerHeight - windowHeight;
        const scrollProgress = -rect.top / scrollRange;

        return Math.max(0, Math.min(1, scrollProgress));
    }

    // Scroll handler - only updates target, animation loop handles the rest
    function handleScroll() {
        if (!isInView || !duration) return;
        targetTime = calculateProgress() * duration;
    }

    // Intersection Observer for performance
    const observerOptions = {
        root: null,
        rootMargin: '10% 0px 10% 0px',
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            isInView = entry.isIntersecting;
            if (isInView && duration) {
                targetTime = calculateProgress() * duration;
            }
        });
    }, observerOptions);

    observer.observe(container);

    // Event listeners
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', () => {
        if (isInView && duration) {
            targetTime = calculateProgress() * duration;
        }
    }, { passive: true });

    // Touch handling for mobile smoothness
    let touchStartY = 0;
    let touchStartTime = 0;

    container.addEventListener('touchstart', (e) => {
        touchStartY = e.touches[0].clientY;
        touchStartTime = Date.now();
    }, { passive: true });

    container.addEventListener('touchmove', (e) => {
        if (!isInView || !duration) return;
        // Let the scroll event handle the progress update
    }, { passive: true });

    // Start animation loop
    animate();

    // Initial setup
    setTimeout(() => {
        if (duration) {
            targetTime = calculateProgress() * duration;
            currentTime = targetTime;
            video.currentTime = currentTime;
        }
    }, 100);

    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
        }
        observer.disconnect();
    });
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
