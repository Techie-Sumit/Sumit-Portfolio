/* ===== OPTIMIZED JAVASCRIPT FOR PORTFOLIO - COPY THIS ENTIRE FILE ===== */

/**
 * Modern Portfolio Website JavaScript
 * Optimized for Performance, Accessibility, and Responsive Design
 * @version 2.0.0
 * @author Senior Web Developer
 */

'use strict';

// ===== CONFIGURATION & CONSTANTS =====
const CONFIG = {
    BREAKPOINTS: {
        mobile: 480,
        tablet: 768,
        desktop: 1024
    },
    TIMING: {
        debounceDelay: 100,
        scrollThrottle: 16, // ~60fps
        animationDelay: 200,
        typingSpeed: 100,
        typingDeleteSpeed: 50,
        typingPause: 2000
    },
    SCROLL: {
        navbarOffset: 50,
        backToTopOffset: 300,
        sectionOffset: 100
    }
};

// ===== UTILITY FUNCTIONS =====
class Utils {
    /**
     * Debounce function to limit function calls
     */
    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    /**
     * Throttle function for scroll events
     */
    static throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    /**
     * Check if element is in viewport
     */
    static isInViewport(element, offset = 0) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) - offset &&
            rect.bottom >= offset &&
            rect.left <= (window.innerWidth || document.documentElement.clientWidth) &&
            rect.right >= 0
        );
    }

    /**
     * Smooth scroll to element
     */
    static smoothScrollTo(element, offset = 0) {
        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset - offset;
        
        if ('scrollBehavior' in document.documentElement.style) {
            window.scrollTo({
                top: elementPosition,
                behavior: 'smooth'
            });
        } else {
            // Fallback for browsers without smooth scroll support
            this.polyfillSmoothScroll(elementPosition);
        }
    }

    /**
     * Smooth scroll polyfill
     */
    static polyfillSmoothScroll(targetPosition) {
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        const duration = 800;
        let start = null;

        function step(timestamp) {
            if (!start) start = timestamp;
            const progress = timestamp - start;
            const progressPercentage = Math.min(progress / duration, 1);
            
            // Easing function (ease-out-cubic)
            const ease = 1 - Math.pow(1 - progressPercentage, 3);
            
            window.scrollTo(0, startPosition + distance * ease);
            
            if (progress < duration) {
                window.requestAnimationFrame(step);
            }
        }
        
        window.requestAnimationFrame(step);
    }

    /**
     * Get current viewport size category
     */
    static getViewportSize() {
        const width = window.innerWidth;
        if (width <= CONFIG.BREAKPOINTS.mobile) return 'mobile';
        if (width <= CONFIG.BREAKPOINTS.tablet) return 'tablet';
        if (width <= CONFIG.BREAKPOINTS.desktop) return 'desktop';
        return 'large';
    }

    /**
     * Check if user prefers reduced motion
     */
    static prefersReducedMotion() {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
}

// ===== DOM ELEMENT CACHE =====
class DOMCache {
    constructor() {
        this.elements = new Map();
        this.cacheElements();
    }

    cacheElements() {
        const selectors = {
            // Navigation
            navbar: '#navbar',
            navToggle: '#nav-toggle',
            navMenu: '#nav-menu',
            navLinks: '.nav-link',
            
            // Theme
            themeToggle: '#theme-toggle',
            themeToggleMobile: '#theme-toggle-mobile',
            
            // Hero
            typingText: '#typing-text',
            heroText: '.hero-text',
            heroImage: '.hero-image',
            heroSocial: '.hero-social',
            
            // Other elements
            backToTop: '#back-to-top',
            contactForm: '#contact-form',
            
            // Animation elements
            animateElements: '.animate-on-scroll',
            statNumbers: '.stat-number',
            skillBars: '.skill-progress'
        };

        for (const [key, selector] of Object.entries(selectors)) {
            if (selector.startsWith('.')) {
                this.elements.set(key, document.querySelectorAll(selector));
            } else {
                this.elements.set(key, document.querySelector(selector));
            }
        }
    }

    get(key) {
        return this.elements.get(key);
    }

    refresh(key, selector) {
        if (selector.startsWith('.')) {
            this.elements.set(key, document.querySelectorAll(selector));
        } else {
            this.elements.set(key, document.querySelector(selector));
        }
    }
}

// ===== THEME MANAGER =====
class ThemeManager {
    constructor() {
        this.themeToggle = DOMCache.instance.get('themeToggle');
        this.themeToggleMobile = DOMCache.instance.get('themeToggleMobile');
        this.currentTheme = this.getStoredTheme() || this.getSystemTheme();
        this.init();
    }

    init() {
        this.setTheme(this.currentTheme);
        this.bindEvents();
        this.updateIcon();
    }

    getStoredTheme() {
        return localStorage.getItem('portfolio-theme');
    }

    getSystemTheme() {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    setTheme(theme) {
        this.currentTheme = theme;
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('portfolio-theme', theme);
        this.updateIcon();
        
        // Announce theme change to screen readers
        this.announceThemeChange(theme);
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.setTheme(newTheme);
        
        // Add smooth transition
        document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
        setTimeout(() => {
            document.body.style.transition = '';
        }, 300);
    }

    updateIcon() {
        const buttons = [this.themeToggle, this.themeToggleMobile].filter(Boolean);
        
        buttons.forEach(button => {
            const icon = button.querySelector('i');
            if (icon) {
                icon.className = this.currentTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
            }
            
            button.setAttribute('aria-pressed', this.currentTheme === 'dark');
            button.title = `Switch to ${this.currentTheme === 'dark' ? 'light' : 'dark'} theme`;
        });
    }

    announceThemeChange(theme) {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'sr-only';
        announcement.textContent = `Switched to ${theme} theme`;
        
        document.body.appendChild(announcement);
        
        setTimeout(() => {
            document.body.removeChild(announcement);
        }, 1000);
    }

    bindEvents() {
        const buttons = [this.themeToggle, this.themeToggleMobile].filter(Boolean);
        
        buttons.forEach(button => {
            button.addEventListener('click', () => this.toggleTheme());
            
            // Keyboard support
            button.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.toggleTheme();
                }
            });
        });

        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!this.getStoredTheme()) {
                this.setTheme(e.matches ? 'dark' : 'light');
            }
        });
    }
}

// ===== NAVIGATION MANAGER =====
class NavigationManager {
    constructor() {
        this.navbar = DOMCache.instance.get('navbar');
        this.navToggle = DOMCache.instance.get('navToggle');
        this.navMenu = DOMCache.instance.get('navMenu');
        this.navLinks = DOMCache.instance.get('navLinks');
        this.isMenuOpen = false;
        this.activeSection = null;
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.updateActiveLink();
    }

    bindEvents() {
        // Mobile menu toggle
        if (this.navToggle && this.navMenu) {
            this.navToggle.addEventListener('click', () => this.toggleMobileMenu());
            
            // Keyboard support for mobile menu
            this.navToggle.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.toggleMobileMenu();
                }
            });

            // Close menu on escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.isMenuOpen) {
                    this.closeMobileMenu();
                }
            });

            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (this.isMenuOpen && !this.navMenu.contains(e.target) && !this.navToggle.contains(e.target)) {
                    this.closeMobileMenu();
                }
            });
        }

        // Navigation link clicks
        if (this.navLinks) {
            this.navLinks.forEach(link => {
                link.addEventListener('click', (e) => this.handleNavClick(e, link));
            });
        }

        // Scroll events for navbar styling and active link
        const handleScroll = Utils.throttle(() => {
            this.handleNavbarScroll();
            this.updateActiveLink();
        }, CONFIG.TIMING.scrollThrottle);

        window.addEventListener('scroll', handleScroll);
        
        // Handle resize events
        const handleResize = Utils.debounce(() => {
            if (Utils.getViewportSize() !== 'mobile' && this.isMenuOpen) {
                this.closeMobileMenu();
            }
        }, CONFIG.TIMING.debounceDelay);

        window.addEventListener('resize', handleResize);
    }

    toggleMobileMenu() {
        this.isMenuOpen = !this.isMenuOpen;
        
        this.navMenu.classList.toggle('active', this.isMenuOpen);
        this.navToggle.classList.toggle('active', this.isMenuOpen);
        
        // Update ARIA attributes
        this.navToggle.setAttribute('aria-expanded', this.isMenuOpen);
        this.navMenu.setAttribute('aria-hidden', !this.isMenuOpen);
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = this.isMenuOpen ? 'hidden' : '';
        
        // Focus management
        if (this.isMenuOpen) {
            this.navMenu.focus();
        } else {
            this.navToggle.focus();
        }
    }

    closeMobileMenu() {
        if (this.isMenuOpen) {
            this.toggleMobileMenu();
        }
    }

    handleNavClick(e, link) {
        const href = link.getAttribute('href');
        
        // Handle hash links
        if (href && href.startsWith('#')) {
            const targetSection = document.querySelector(href);
            
            if (targetSection) {
                e.preventDefault();
                this.closeMobileMenu();
                
                // Small delay to allow menu close animation
                setTimeout(() => {
                    Utils.smoothScrollTo(targetSection, 70);
                }, this.isMenuOpen ? 300 : 0);
            }
        }
    }

    handleNavbarScroll() {
        if (!this.navbar) return;
        
        const scrolled = window.scrollY > CONFIG.SCROLL.navbarOffset;
        this.navbar.classList.toggle('scrolled', scrolled);
    }

    updateActiveLink() {
        if (!this.navLinks) return;
        
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + CONFIG.SCROLL.sectionOffset;
        let currentSection = null;

        // Find current section
        sections.forEach(section => {
            const top = section.getBoundingClientRect().top + window.scrollY;
            const height = section.offsetHeight;
            
            if (scrollPos >= top && scrollPos < top + height) {
                currentSection = section.getAttribute('id');
            }
        });

        // Update active link if section changed
        if (currentSection && currentSection !== this.activeSection) {
            this.activeSection = currentSection;
            
            this.navLinks.forEach(link => {
                const isActive = link.getAttribute('href') === `#${currentSection}`;
                link.classList.toggle('active', isActive);
                link.setAttribute('aria-current', isActive ? 'page' : 'false');
            });
        }
    }
}

// ===== TYPING ANIMATION =====
class TypingAnimation {
    constructor(element, texts) {
        this.element = element;
        this.texts = texts || [
            'Java Full Stack Enthusiast',
            'Aspiring Software Engineer', 
            'Exploring Web Technologies',
            'Problem Solver',
            'Tech Innovation Lover'
        ];
        this.currentTextIndex = 0;
        this.currentCharIndex = 0;
        this.isDeleting = false;
        this.isPaused = false;
        
        if (this.element) {
            this.start();
        }
    }

    start() {
        if (Utils.prefersReducedMotion()) {
            this.element.textContent = this.texts[0];
            return;
        }
        
        this.type();
    }

    type() {
        const currentText = this.texts[this.currentTextIndex];
        
        if (this.isDeleting) {
            this.currentCharIndex--;
        } else {
            this.currentCharIndex++;
        }

        this.element.textContent = currentText.substring(0, this.currentCharIndex);

        let typeSpeed = CONFIG.TIMING.typingSpeed;
        
        if (this.isDeleting) {
            typeSpeed = CONFIG.TIMING.typingDeleteSpeed;
        }

        // Handle text completion
        if (!this.isDeleting && this.currentCharIndex === currentText.length) {
            this.isPaused = true;
            typeSpeed = CONFIG.TIMING.typingPause;
            this.isDeleting = true;
        } else if (this.isDeleting && this.currentCharIndex === 0) {
            this.isDeleting = false;
            this.currentTextIndex = (this.currentTextIndex + 1) % this.texts.length;
        }

        setTimeout(() => this.type(), typeSpeed);
    }
}

// ===== SCROLL ANIMATIONS =====
class ScrollAnimations {
    constructor() {
        this.animatedElements = DOMCache.instance.get('animateElements');
        this.observedElements = new Set();
        this.init();
    }

    init() {
        if (!this.animatedElements || Utils.prefersReducedMotion()) return;
        
        if ('IntersectionObserver' in window) {
            this.setupIntersectionObserver();
        } else {
            // Fallback for browsers without IntersectionObserver
            this.fallbackAnimation();
        }
    }

    setupIntersectionObserver() {
        const options = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElement(entry.target);
                    observer.unobserve(entry.target);
                    this.observedElements.delete(entry.target);
                }
            });
        }, options);

        this.animatedElements.forEach(el => {
            observer.observe(el);
            this.observedElements.add(el);
        });
    }

    animateElement(element) {
        element.classList.add('animated');
        
        // Add stagger delays for child elements
        const children = element.querySelectorAll('.stagger-1, .stagger-2, .stagger-3, .stagger-4, .stagger-5');
        children.forEach((child, index) => {
            setTimeout(() => {
                child.classList.add('animated');
            }, index * 100);
        });
    }

    fallbackAnimation() {
        const handleScroll = Utils.throttle(() => {
            this.animatedElements.forEach(element => {
                if (Utils.isInViewport(element, 50)) {
                    this.animateElement(element);
                }
            });
        }, CONFIG.TIMING.scrollThrottle);

        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Check initial state
    }
}

// ===== STATS COUNTER =====
class StatsCounter {
    constructor() {
        this.statElements = DOMCache.instance.get('statNumbers');
        this.animatedStats = new Set();
        this.init();
    }

    init() {
        if (!this.statElements || Utils.prefersReducedMotion()) return;
        
        if ('IntersectionObserver' in window) {
            this.setupIntersectionObserver();
        } else {
            this.fallbackCounter();
        }
    }

    setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.animatedStats.has(entry.target)) {
                    this.animateCounter(entry.target);
                    this.animatedStats.add(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        this.statElements.forEach(stat => observer.observe(stat));
    }

    animateCounter(element) {
        const target = parseInt(element.getAttribute('data-count'), 10);
        const increment = Math.ceil(target / 100);
        let current = 0;

        const updateCounter = () => {
            current += increment;
            
            if (current >= target) {
                current = target;
                element.textContent = current;
                return;
            }
            
            element.textContent = current;
            requestAnimationFrame(updateCounter);
        };

        updateCounter();
    }

    fallbackCounter() {
        const handleScroll = Utils.throttle(() => {
            this.statElements.forEach(element => {
                if (Utils.isInViewport(element, 50) && !this.animatedStats.has(element)) {
                    this.animateCounter(element);
                    this.animatedStats.add(element);
                }
            });
        }, CONFIG.TIMING.scrollThrottle);

        window.addEventListener('scroll', handleScroll);
    }
}

// ===== SKILL BARS =====
class SkillBars {
    constructor() {
        this.skillBars = DOMCache.instance.get('skillBars');
        this.animatedBars = new Set();
        this.init();
    }

    init() {
        if (!this.skillBars || Utils.prefersReducedMotion()) return;
        
        if ('IntersectionObserver' in window) {
            this.setupIntersectionObserver();
        } else {
            this.fallbackAnimation();
        }
    }

    setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.animatedBars.has(entry.target)) {
                    this.animateSkillBar(entry.target);
                    this.animatedBars.add(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        this.skillBars.forEach(bar => observer.observe(bar));
    }

    animateSkillBar(bar) {
        const width = bar.getAttribute('data-width');
        
        setTimeout(() => {
            bar.style.width = `${width}%`;
        }, CONFIG.TIMING.animationDelay);
    }

    fallbackAnimation() {
        const handleScroll = Utils.throttle(() => {
            this.skillBars.forEach(bar => {
                if (Utils.isInViewport(bar, 50) && !this.animatedBars.has(bar)) {
                    this.animateSkillBar(bar);
                    this.animatedBars.add(bar);
                }
            });
        }, CONFIG.TIMING.scrollThrottle);

        window.addEventListener('scroll', handleScroll);
    }
}

// ===== CONTACT FORM =====
class ContactForm {
    constructor() {
        this.form = DOMCache.instance.get('contactForm');
        this.init();
    }

    init() {
        if (!this.form) return;
        
        this.bindEvents();
        this.setupValidation();
    }

    bindEvents() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Real-time validation
        const formFields = this.form.querySelectorAll('input, textarea');
        formFields.forEach(field => {
            field.addEventListener('input', () => this.validateField(field));
            field.addEventListener('blur', () => this.validateField(field));
        });
    }

    setupValidation() {
        const validators = {
            email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
            phone: (value) => !value || /^[\d\s\-\+\(\)]+$/.test(value),
            required: (value) => value.trim().length > 0
        };

        this.validators = validators;
    }

    validateField(field) {
        const value = field.value.trim();
        const isRequired = field.hasAttribute('required');
        const type = field.type || field.tagName.toLowerCase();
        const errorElement = field.parentNode.querySelector('.form-error');
        
        let isValid = true;
        let errorMessage = '';

        // Required validation
        if (isRequired && !value) {
            isValid = false;
            errorMessage = 'This field is required';
        }
        // Type-specific validation
        else if (value) {
            if (type === 'email' && !this.validators.email(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            } else if (field.name === 'phone' && !this.validators.phone(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid phone number';
            }
        }

        // Update UI
        field.classList.toggle('error', !isValid);
        if (errorElement) {
            errorElement.textContent = errorMessage;
        }

        return isValid;
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        const submitBtn = this.form.querySelector('button[type="submit"]');
        const formData = new FormData(this.form);
        
        // Validate all fields
        const formFields = this.form.querySelectorAll('input[required], textarea[required]');
        let isFormValid = true;
        
        formFields.forEach(field => {
            if (!this.validateField(field)) {
                isFormValid = false;
            }
        });

        if (!isFormValid) {
            this.showMessage('Please fix the errors above', 'error');
            return;
        }

        // Show loading state
        this.setLoadingState(submitBtn, true);

        try {
            // Simulate API call (replace with actual endpoint)
            await this.simulateFormSubmission(formData);
            
            // Success
            this.showMessage('Thank you! Your message has been sent successfully. I\'ll get back to you soon.', 'success');
            this.form.reset();
            this.clearErrors();
            
        } catch (error) {
            console.error('Form submission error:', error);
            this.showMessage('Sorry, there was an error sending your message. Please try again.', 'error');
        } finally {
            this.setLoadingState(submitBtn, false);
        }
    }

    async simulateFormSubmission(formData) {
        // Simulate API delay
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate success (replace with actual API call)
                const success = Math.random() > 0.1; // 90% success rate for demo
                success ? resolve() : reject(new Error('Simulated error'));
            }, 1500);
        });
    }

    setLoadingState(button, isLoading) {
        button.classList.toggle('loading', isLoading);
        button.disabled = isLoading;
        
        const btnText = button.querySelector('.btn-text');
        if (btnText) {
            btnText.style.opacity = isLoading ? '0' : '1';
        }
    }

    showMessage(message, type) {
        // Create and show notification
        const notification = document.createElement('div');
        notification.className = `form-notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        // Style the notification
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '16px 20px',
            borderRadius: '12px',
            color: 'white',
            fontSize: '14px',
            fontWeight: '500',
            maxWidth: '400px',
            zIndex: '10000',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            background: type === 'success' 
                ? 'linear-gradient(135deg, #10b981, #059669)'
                : 'linear-gradient(135deg, #ef4444, #dc2626)',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
        });

        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Auto-remove
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 5000);
    }

    clearErrors() {
        const errorElements = this.form.querySelectorAll('.form-error');
        errorElements.forEach(error => error.textContent = '');
        
        const errorFields = this.form.querySelectorAll('.error');
        errorFields.forEach(field => field.classList.remove('error'));
    }
}

// ===== BACK TO TOP BUTTON =====
class BackToTop {
    constructor() {
        this.button = DOMCache.instance.get('backToTop');
        this.init();
    }

    init() {
        if (!this.button) return;
        
        this.bindEvents();
        this.handleScroll(); // Initial check
    }

    bindEvents() {
        // Click event
        this.button.addEventListener('click', () => this.scrollToTop());
        
        // Keyboard support
        this.button.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.scrollToTop();
            }
        });

        // Scroll event
        const handleScroll = Utils.throttle(() => this.handleScroll(), CONFIG.TIMING.scrollThrottle);
        window.addEventListener('scroll', handleScroll);
    }

    handleScroll() {
        const shouldShow = window.scrollY > CONFIG.SCROLL.backToTopOffset;
        this.button.classList.toggle('show', shouldShow);
        this.button.setAttribute('aria-hidden', !shouldShow);
    }

    scrollToTop() {
        if ('scrollBehavior' in document.documentElement.style) {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        } else {
            Utils.polyfillSmoothScroll(0);
        }
    }
}

// ===== LAZY LOADING =====
class LazyLoader {
    constructor() {
        this.images = document.querySelectorAll('img[data-src]');
        this.init();
    }

    init() {
        if (!this.images.length) return;
        
        if ('IntersectionObserver' in window) {
            this.setupIntersectionObserver();
        } else {
            this.fallbackLoading();
        }
    }

    setupIntersectionObserver() {
        const options = {
            threshold: 0.1,
            rootMargin: '50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.loadImage(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, options);

        this.images.forEach(img => observer.observe(img));
    }

    loadImage(img) {
        const src = img.getAttribute('data-src');
        if (!src) return;

        // Create new image to preload
        const newImg = new Image();
        newImg.onload = () => {
            img.src = src;
            img.removeAttribute('data-src');
            img.classList.add('loaded');
        };
        newImg.onerror = () => {
            img.classList.add('error');
            console.warn(`Failed to load image: ${src}`);
        };
        newImg.src = src;
    }

    fallbackLoading() {
        this.images.forEach(img => this.loadImage(img));
    }
}

// ===== ERROR HANDLER =====
class ErrorHandler {
    constructor() {
        this.setupGlobalErrorHandling();
    }

    setupGlobalErrorHandling() {
        // JavaScript errors
        window.addEventListener('error', (e) => {
            console.error('Global error:', e.error);
            this.logError('JavaScript Error', e.error?.message || 'Unknown error', e.filename, e.lineno);
        });

        // Unhandled promise rejections
        window.addEventListener('unhandledrejection', (e) => {
            console.error('Unhandled promise rejection:', e.reason);
            this.logError('Promise Rejection', e.reason?.message || 'Unknown error');
        });

        // Image loading errors
        document.addEventListener('error', (e) => {
            if (e.target.tagName === 'IMG') {
                console.warn(`Failed to load image: ${e.target.src}`);
                e.target.style.display = 'none';
            }
        }, true);
    }

    logError(type, message, filename = '', lineno = '') {
        // In production, you would send this to your error tracking service
        const errorData = {
            type,
            message,
            filename,
            lineno,
            userAgent: navigator.userAgent,
            url: window.location.href,
            timestamp: new Date().toISOString()
        };
        
        console.error('Error logged:', errorData);
    }
}

// ===== PERFORMANCE MONITOR =====
class PerformanceMonitor {
    constructor() {
        this.metrics = {};
        this.init();
    }

    init() {
        if ('PerformanceObserver' in window) {
            this.observePerformance();
        }
        
        this.measurePageLoad();
    }

    observePerformance() {
        // Observe Largest Contentful Paint
        try {
            const lcpObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1];
                this.metrics.lcp = lastEntry.startTime;
            });
            lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
        } catch (e) {
            console.warn('LCP observation not supported');
        }

        // Observe First Input Delay
        try {
            const fidObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach(entry => {
                    this.metrics.fid = entry.processingStart - entry.startTime;
                });
            });
            fidObserver.observe({ type: 'first-input', buffered: true });
        } catch (e) {
            console.warn('FID observation not supported');
        }
    }

    measurePageLoad() {
        window.addEventListener('load', () => {
            setTimeout(() => {
                const navigation = performance.getEntriesByType('navigation')[0];
                if (navigation) {
                    this.metrics.domContentLoaded = navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart;
                    this.metrics.loadComplete = navigation.loadEventEnd - navigation.loadEventStart;
                }
                
                console.log('Performance metrics:', this.metrics);
            }, 0);
        });
    }
}

// ===== ACCESSIBILITY ENHANCER =====
class AccessibilityEnhancer {
    constructor() {
        this.init();
    }

    init() {
        this.setupSkipLinks();
        this.setupFocusManagement();
        this.setupKeyboardNavigation();
        this.setupScreenReaderSupport();
    }

    setupSkipLinks() {
        // Add skip link if not present
        if (!document.querySelector('.skip-link')) {
            const skipLink = document.createElement('a');
            skipLink.className = 'skip-link';
            skipLink.href = '#main';
            skipLink.textContent = 'Skip to main content';
            skipLink.style.cssText = `
                position: absolute;
                top: -40px;
                left: 6px;
                background: #4f46e5;
                color: white;
                padding: 8px;
                text-decoration: none;
                border-radius: 4px;
                z-index: 9999;
                transform: translateY(-100%);
                transition: transform 0.3s;
            `;
            
            skipLink.addEventListener('focus', () => {
                skipLink.style.transform = 'translateY(0)';
            });
            
            skipLink.addEventListener('blur', () => {
                skipLink.style.transform = 'translateY(-100%)';
            });
            
            document.body.insertBefore(skipLink, document.body.firstChild);
        }
    }

    setupFocusManagement() {
        // Enhanced focus indicators
        const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
        
        document.querySelectorAll(focusableElements).forEach(element => {
            element.addEventListener('focus', (e) => {
                e.target.setAttribute('data-focus-visible', 'true');
            });
            
            element.addEventListener('blur', (e) => {
                e.target.removeAttribute('data-focus-visible');
            });
        });
    }

    setupKeyboardNavigation() {
        // Enhanced keyboard navigation for interactive elements
        document.addEventListener('keydown', (e) => {
            // Tab trapping for modals (if any)
            if (e.key === 'Tab') {
                this.handleTabNavigation(e);
            }
        });
    }

    setupScreenReaderSupport() {
        // Add screen reader only text for context
        const srOnlyStyle = `
            position: absolute !important;
            width: 1px !important;
            height: 1px !important;
            padding: 0 !important;
            margin: -1px !important;
            overflow: hidden !important;
            clip: rect(0, 0, 0, 0) !important;
            white-space: nowrap !important;
            border: 0 !important;
        `;

        // Add sr-only class if not present
        if (!document.querySelector('style[data-sr-only]')) {
            const style = document.createElement('style');
            style.setAttribute('data-sr-only', 'true');
            style.textContent = `.sr-only { ${srOnlyStyle} }`;
            document.head.appendChild(style);
        }
    }

    handleTabNavigation(e) {
        // This would be expanded for modal tab trapping
        // For now, just ensure proper tab order
        const focusableElements = document.querySelectorAll(
            'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        
        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];
        
        if (e.shiftKey) {
            if (document.activeElement === firstFocusable) {
                lastFocusable.focus();
                e.preventDefault();
            }
        } else {
            if (document.activeElement === lastFocusable) {
                firstFocusable.focus();
                e.preventDefault();
            }
        }
    }
}

// ===== MAIN APPLICATION CLASS =====
class PortfolioApp {
    constructor() {
        this.isInitialized = false;
        this.components = new Map();
        
        // Initialize when DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }

    init() {
        if (this.isInitialized) return;
        
        try {
            // Initialize DOM cache
            DOMCache.instance = new DOMCache();
            
            // Initialize all components
            this.initializeComponents();
            
            // Setup global event listeners
            this.setupGlobalEvents();
            
            this.isInitialized = true;
            console.log('Portfolio app initialized successfully');
            
        } catch (error) {
            console.error('Failed to initialize portfolio app:', error);
        }
    }

    initializeComponents() {
        const components = [
            { name: 'errorHandler', Class: ErrorHandler },
            { name: 'performanceMonitor', Class: PerformanceMonitor },
            { name: 'accessibilityEnhancer', Class: AccessibilityEnhancer },
            { name: 'themeManager', Class: ThemeManager },
            { name: 'navigationManager', Class: NavigationManager },
            { name: 'scrollAnimations', Class: ScrollAnimations },
            { name: 'statsCounter', Class: StatsCounter },
            { name: 'skillBars', Class: SkillBars },
            { name: 'contactForm', Class: ContactForm },
            { name: 'backToTop', Class: BackToTop },
            { name: 'lazyLoader', Class: LazyLoader }
        ];

        components.forEach(({ name, Class }) => {
            try {
                this.components.set(name, new Class());
            } catch (error) {
                console.warn(`Failed to initialize ${name}:`, error);
            }
        });

        // Initialize typing animation separately
        const typingElement = DOMCache.instance.get('typingText');
        if (typingElement) {
            this.components.set('typingAnimation', new TypingAnimation(typingElement));
        }
    }

    setupGlobalEvents() {
        // Handle visibility change (for performance optimization)
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                // Pause non-critical animations when tab is hidden
                this.pauseAnimations();
            } else {
                // Resume animations when tab becomes visible
                this.resumeAnimations();
            }
        });

        // Handle online/offline status
        window.addEventListener('online', () => {
            console.log('Connection restored');
        });

        window.addEventListener('offline', () => {
            console.log('Connection lost');
        });
    }

    pauseAnimations() {
        // Pause CPU-intensive animations when page is hidden
        const typingAnimation = this.components.get('typingAnimation');
        if (typingAnimation) {
            typingAnimation.isPaused = true;
        }
    }

    resumeAnimations() {
        // Resume animations when page becomes visible
        const typingAnimation = this.components.get('typingAnimation');
        if (typingAnimation) {
            typingAnimation.isPaused = false;
        }
    }

    // Public API methods
    getComponent(name) {
        return this.components.get(name);
    }

    refresh() {
        // Refresh DOM cache and reinitialize components if needed
        DOMCache.instance.cacheElements();
    }
}

// ===== INITIALIZE APPLICATION =====
// Create global instance
window.PortfolioApp = new PortfolioApp();

// Export for module systems (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PortfolioApp;
}

// ===== END OF OPTIMIZED JAVASCRIPT =====