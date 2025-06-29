// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Performance optimization: debounced scroll handler
    let scrollTimeout;
    const debounce = (func, wait) => {
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(scrollTimeout);
                func(...args);
            };
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(later, wait);
        };
    };

    // Loading Screen
    const loadingScreen = document.getElementById('loading-screen');
    const loadingProgress = document.querySelector('.loading-progress');
    
    // Simulate loading progress with better performance
    let progress = 0;
    const loadingInterval = setInterval(() => {
        progress += Math.random() * 25 + 5; // Faster loading
        if (progress > 100) progress = 100;
        loadingProgress.style.width = progress + '%';
        
        if (progress === 100) {
            clearInterval(loadingInterval);
            setTimeout(() => {
                loadingScreen.style.opacity = '0';
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                    // Initialize AOS animations
                    if (typeof AOS !== 'undefined') {
                        AOS.init({
                            duration: 800,
                            once: true,
                            offset: 50,
                            easing: 'ease-out-cubic'
                        });
                    }
                }, 500);
            }, 300);
        }
    }, 80);

    // Mobile Navigation Toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const navbar = document.querySelector('.navbar');

    // Toggle mobile menu
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
            
            // Animate hamburger bars
            const bars = navToggle.querySelectorAll('.bar');
            if (navToggle.classList.contains('active')) {
                bars[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                bars[1].style.opacity = '0';
                bars[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
            } else {
                bars.forEach(bar => {
                    bar.style.transform = '';
                    bar.style.opacity = '';
                });
            }
        });

        // Close mobile menu when clicking on a link
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                
                // Reset hamburger bars
                const bars = navToggle.querySelectorAll('.bar');
                bars.forEach(bar => {
                    bar.style.transform = '';
                    bar.style.opacity = '';
                });
            });
        });
    }

    // Enhanced Navbar Scroll Behavior
    let lastScrollTop = 0;
    const scrollHandler = debounce(function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add scrolled class based on scroll position
        if (scrollTop > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Hide/show navbar on scroll with better performance
        if (scrollTop > lastScrollTop && scrollTop > 200) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; // For Mobile or negative scrolling

        // Update active nav link based on scroll position
        updateActiveNavLink();
    }, 16); // ~60fps

    window.addEventListener('scroll', scrollHandler, { passive: true });

    // Update active navigation link with intersection observer for better performance
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => link.classList.remove('active'));
                if (navLink) navLink.classList.add('active');
            }
        });
    }

    // Smooth Scrolling for Anchor Links with offset calculation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);
            
            if (target) {
                const navbarHeight = navbar.offsetHeight;
                const offsetTop = target.offsetTop - navbarHeight - 20;
                
                window.scrollTo({
                    top: Math.max(0, offsetTop),
                    behavior: 'smooth'
                });
            }
        });
    });

    // Enhanced Theme Toggle with system preference detection
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const themeIcon = themeToggle ? themeToggle.querySelector('i') : null;

    // Check for system theme preference
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Initialize theme
    function initializeTheme() {
        const savedTheme = localStorage.getItem('theme');
        const systemTheme = prefersDarkScheme.matches ? 'dark-theme' : 'light-theme';
        const currentTheme = savedTheme || systemTheme;
        
        if (currentTheme === 'dark-theme') {
            body.classList.add('dark-theme');
            if (themeIcon) themeIcon.className = 'fas fa-sun';
        } else {
            body.classList.remove('dark-theme');
            if (themeIcon) themeIcon.className = 'fas fa-moon';
        }
    }

    // Listen for system theme changes
    prefersDarkScheme.addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            initializeTheme();
        }
    });

    // Initialize theme on load
    initializeTheme();

    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            body.classList.toggle('dark-theme');
            const isDark = body.classList.contains('dark-theme');
            
            if (themeIcon) {
                themeIcon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
            }
            
            // Save theme preference
            localStorage.setItem('theme', isDark ? 'dark-theme' : 'light-theme');
        });
    }

    // Enhanced Counter Animation with Intersection Observer
    function animateCounters() {
        const counters = document.querySelectorAll('.stat-number');
        
        const observerOptions = {
            threshold: 0.5,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const target = parseInt(counter.textContent.replace(/\D/g, ''));
                    const duration = 2000; // 2 seconds
                    const step = target / (duration / 16); // 60fps
                    let current = 0;
                    
                    const updateCounter = () => {
                        if (current < target) {
                            current += step;
                            counter.textContent = Math.floor(current) + '+';
                            requestAnimationFrame(updateCounter);
                        } else {
                            counter.textContent = target + '+';
                        }
                    };
                    
                    requestAnimationFrame(updateCounter);
                    counterObserver.unobserve(counter);
                }
            });
        }, observerOptions);

        counters.forEach(counter => {
            counterObserver.observe(counter);
        });
    }

    // Initialize counter animation
    animateCounters();

    // Enhanced Floating Cards Animation
    const floatingCards = document.querySelectorAll('.floating-card');
    floatingCards.forEach((card, index) => {
        // Add random rotation and movement with better performance
        const randomRotation = (Math.random() - 0.5) * 10; // -5 to 5 degrees
        const randomDelay = Math.random() * 2; // 0 to 2 seconds
        
        card.style.transform = `rotate(${randomRotation}deg)`;
        card.style.animationDelay = `${randomDelay}s`;
        
        // Enhanced hover interaction with transform3d for better performance
        card.addEventListener('mouseenter', function() {
            this.style.transform = `translate3d(0, -20px, 0) scale(1.05) rotate(0deg)`;
            this.style.zIndex = '10';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = `translate3d(0, 0, 0) scale(1) rotate(${randomRotation}deg)`;
            this.style.zIndex = '1';
        });
    });

    // Optimized Parallax Effect with transform3d
    const parallaxHandler = debounce(function() {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        const heroHeight = hero ? hero.offsetHeight : 0;
        
        if (scrolled < heroHeight) {
            const parallaxElements = document.querySelectorAll('.floating-card');
            parallaxElements.forEach((element, index) => {
                const speed = 0.3 + (index * 0.05); // Reduced speed for smoother effect
                const yPos = scrolled * speed * 0.1;
                const currentTransform = element.style.transform;
                const rotateMatch = currentTransform.match(/rotate\([^)]*\)/);
                const scaleMatch = currentTransform.match(/scale\([^)]*\)/);
                const rotate = rotateMatch ? rotateMatch[0] : '';
                const scale = scaleMatch ? scaleMatch[0] : '';
                
                element.style.transform = `translate3d(0, ${yPos}px, 0) ${scale} ${rotate}`;
            });
        }
    }, 16);

    window.addEventListener('scroll', parallaxHandler, { passive: true });

    // Enhanced Tech Stack Items with staggered animation
    const techItems = document.querySelectorAll('.tech-item');
    techItems.forEach((item, index) => {
        // Stagger animation on load
        item.style.animationDelay = `${index * 0.1}s`;
        
        // Add pulse animation on hover with better performance
        item.addEventListener('mouseenter', function() {
            this.style.animation = 'none';
            requestAnimationFrame(() => {
                this.style.animation = 'pulse 0.6s ease-in-out';
            });
        });
        
        item.addEventListener('animationend', function() {
            this.style.animation = '';
        });
    });

    // Add pulse animation keyframes
    const pulseKeyframes = `
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
        }
    `;
    
    const style = document.createElement('style');
    style.textContent = pulseKeyframes;
    document.head.appendChild(style);

    // Enhanced Scroll Reveal Animation for Service Cards
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const revealObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                revealObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe service cards and other elements for animation
    const animatedElements = document.querySelectorAll('.service-card, .portfolio-item, .stat-box');
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        revealObserver.observe(element);
    });

    // Enhanced Portfolio items hover effect
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    portfolioItems.forEach(item => {
        const overlay = item.querySelector('.portfolio-overlay');
        
        item.addEventListener('mouseenter', function() {
            if (overlay) {
                overlay.style.opacity = '1';
                overlay.style.transform = 'scale(1)';
            }
        });
        
        item.addEventListener('mouseleave', function() {
            if (overlay) {
                overlay.style.opacity = '0';
                overlay.style.transform = 'scale(1.05)';
            }
        });
    });

    // Enhanced Contact Form Handling with better validation
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData);
            
            // Enhanced validation
            const errors = validateForm(data);
            
            if (errors.length > 0) {
                showNotification(errors[0], 'error');
                return;
            }
            
            // Simulate form submission with better UX
            const submitBtn = contactForm.querySelector('.submit-btn');
            const originalText = submitBtn.innerHTML;
            
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';
            submitBtn.disabled = true;
            
            // Simulate API call delay
            setTimeout(() => {
                showNotification('Merci pour votre message ! Nous vous répondrons rapidement.', 'success');
                contactForm.reset();
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 1500);
        });
    }

    // Enhanced form validation
    function validateForm(data) {
        const errors = [];
        
        if (!data.name || data.name.trim().length < 2) {
            errors.push('Veuillez entrer un nom valide (au moins 2 caractères).');
        }
        
        if (!data.email || !isValidEmail(data.email)) {
            errors.push('Veuillez entrer une adresse email valide.');
        }
        
        if (!data.subject) {
            errors.push('Veuillez sélectionner un sujet.');
        }
        
        if (!data.message || data.message.trim().length < 10) {
            errors.push('Veuillez entrer un message d\'au moins 10 caractères.');
        }
        
        return errors;
    }

    // Enhanced email validation
    function isValidEmail(email) {
        const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
        return emailRegex.test(email);
    }

    // Enhanced notification system with auto-dismiss
    function showNotification(message, type = 'info', duration = 5000) {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => {
            notification.style.animation = 'slideOutRight 0.3s ease forwards';
            setTimeout(() => notification.remove(), 300);
        });
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span>${message}</span>
                <button class="notification-close" aria-label="Fermer la notification">&times;</button>
            </div>
        `;
        
        // Add notification styles
        const colors = {
            success: '#10b981',
            error: '#ef4444',
            info: '#06b6d4',
            warning: '#f59e0b'
        };
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${colors[type] || colors.info};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 12px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
            z-index: 10000;
            animation: slideInRight 0.3s ease;
            max-width: 400px;
            font-weight: 500;
        `;
        
        document.body.appendChild(notification);
        
        // Close button functionality
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            notification.style.animation = 'slideOutRight 0.3s ease forwards';
            setTimeout(() => notification.remove(), 300);
        });
        
        // Auto-dismiss after duration
        setTimeout(() => {
            if (document.body.contains(notification)) {
                notification.style.animation = 'slideOutRight 0.3s ease forwards';
                setTimeout(() => notification.remove(), 300);
            }
        }, duration);
    }

    // Add slideOutRight animation
    const slideOutKeyframes = `
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
    
    const slideOutStyle = document.createElement('style');
    slideOutStyle.textContent = slideOutKeyframes;
    document.head.appendChild(slideOutStyle);

    // Enhanced Video Modal
    const playVideoBtn = document.getElementById('play-video');
    const videoModal = document.getElementById('video-modal');
    const closeModal = videoModal ? videoModal.querySelector('.close') : null;

    if (playVideoBtn && videoModal) {
        playVideoBtn.addEventListener('click', function(e) {
            e.preventDefault();
            videoModal.style.display = 'block';
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        });
    }

    if (closeModal && videoModal) {
        closeModal.addEventListener('click', function() {
            videoModal.style.display = 'none';
            document.body.style.overflow = ''; // Restore scrolling
            
            // Stop video by reloading iframe
            const iframe = videoModal.querySelector('iframe');
            if (iframe) {
                iframe.src = iframe.src;
            }
        });
    }

    // Close modal when clicking outside
    if (videoModal) {
        videoModal.addEventListener('click', function(e) {
            if (e.target === videoModal) {
                videoModal.style.display = 'none';
                document.body.style.overflow = '';
                
                // Stop video
                const iframe = videoModal.querySelector('iframe');
                if (iframe) {
                    iframe.src = iframe.src;
                }
            }
        });
    }

    // Enhanced keyboard navigation
    document.addEventListener('keydown', function(e) {
        // Close modal with Escape key
        if (e.key === 'Escape' && videoModal && videoModal.style.display === 'block') {
            videoModal.style.display = 'none';
            document.body.style.overflow = '';
            
            const iframe = videoModal.querySelector('iframe');
            if (iframe) {
                iframe.src = iframe.src;
            }
        }
        
        // Close notifications with Escape key
        if (e.key === 'Escape') {
            const notifications = document.querySelectorAll('.notification');
            notifications.forEach(notification => {
                notification.style.animation = 'slideOutRight 0.3s ease forwards';
                setTimeout(() => notification.remove(), 300);
            });
        }
    });

    // Performance optimization: Lazy load AOS animations
    if ('IntersectionObserver' in window) {
        const aosElements = document.querySelectorAll('[data-aos]');
        const aosObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('aos-animate');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '50px'
        });

        aosElements.forEach(element => {
            aosObserver.observe(element);
        });
    }

    // Add focus management for accessibility
    function manageFocus() {
        const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
        const modal = document.getElementById('video-modal');
        
        if (modal) {
            const firstFocusableElement = modal.querySelectorAll(focusableElements)[0];
            const focusableContent = modal.querySelectorAll(focusableElements);
            const lastFocusableElement = focusableContent[focusableContent.length - 1];

            document.addEventListener('keydown', function(e) {
                if (modal.style.display === 'block') {
                    if (e.key === 'Tab') {
                        if (e.shiftKey) {
                            if (document.activeElement === firstFocusableElement) {
                                lastFocusableElement.focus();
                                e.preventDefault();
                            }
                        } else {
                            if (document.activeElement === lastFocusableElement) {
                                firstFocusableElement.focus();
                                e.preventDefault();
                            }
                        }
                    }
                }
            });
        }
    }

    manageFocus();

    // Add performance monitoring
    if ('performance' in window) {
        window.addEventListener('load', function() {
            setTimeout(() => {
                const perfData = performance.getEntriesByType('navigation')[0];
                console.log(`Page load time: ${Math.round(perfData.loadEventEnd - perfData.loadEventStart)}ms`);
            }, 0);
        });
    }
});
