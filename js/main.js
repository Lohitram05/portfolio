document.addEventListener('DOMContentLoaded', () => {
    console.log('HR Portfolio initialized successfully.');

    // Navbar Scroll Effect & Progress Bar
    const header = document.getElementById('header');
    const scrollProgress = document.getElementById('scrollProgress');

    window.addEventListener('scroll', () => {
        // Background transition
        if (window.scrollY > 20) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Progress bar width calculation
        const scrollTotal = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollPercentage = (window.scrollY / scrollTotal) * 100;
        if (scrollProgress) {
            scrollProgress.style.width = `${scrollPercentage}%`;
        }
    });

    // Mobile Menu Toggle
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const navLinksList = document.querySelectorAll('.nav-link');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close mobile menu when a link is clicked
        navLinksList.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    // Active Link Tracking using Intersection Observer
    const sections = document.querySelectorAll('section[id]');
    const navObserverOptions = {
        root: null,
        rootMargin: '-70px 0px -60% 0px', // Trigger when section is in top half of screen
        threshold: 0
    };

    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                // Remove active class from all links
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.classList.remove('active');
                });
                // Add active class to corresponding link
                const activeLink = document.querySelector(`.nav-link[href="#${id}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }, navObserverOptions);

    sections.forEach(section => {
        navObserver.observe(section);
    });

    // Intersection Observer for Stats Counter
    const stats = document.querySelectorAll('.stat-number');
    let hasCounted = false;

    const animateStats = () => {
        stats.forEach(stat => {
            const target = +stat.getAttribute('data-target');
            const duration = 2000; // Total duration of animation in ms
            const increment = target / (duration / 16); // 16ms per frame (approx 60fps)

            let current = 0;
            const updateStat = () => {
                current += increment;
                if (current < target) {
                    stat.innerText = Math.ceil(current);
                    requestAnimationFrame(updateStat);
                } else {
                    stat.innerText = target;
                }
            };
            updateStat();
        });
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasCounted) {
                animateStats();
                hasCounted = true;
            }
        });
    }, { threshold: 0.5 }); // Trigger when 50% of the section is visible

    const aboutSection = document.getElementById('about');
    if (aboutSection) {
        observer.observe(aboutSection);
    }

    // Scroll-Triggered Animations (reusable system)
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const delay = el.getAttribute('data-delay') || 0;
                el.style.animationDelay = `${delay}ms`;
                el.classList.add('animated');
                animationObserver.unobserve(el);
            }
        });
    }, { threshold: 0.1 });

    animateElements.forEach(el => animationObserver.observe(el));

    // Smooth Scroll with Navbar Offset
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const headerOffset = 64; // Navbar height
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    // Page Transition
    const pageTransition = document.getElementById('page-transition');
    if (pageTransition) {
        setTimeout(() => {
            pageTransition.classList.add('loaded');
        }, 100);
    }

    // Custom Cursor
    const cursor = document.getElementById('custom-cursor');
    if (cursor) {
        document.addEventListener('mousemove', e => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });

        const clickables = document.querySelectorAll('a, button, input, textarea, .contact-card, .skill-card, .edu-card, .timeline-card');
        clickables.forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
        });
    }

    // Contact Form Validation & Submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        // Prevent default form submission
        contactForm.addEventListener('submit', (e) => e.preventDefault());

        function validateForm() {
            let isValid = true;

            // Full Name validation
            const nameInput = document.getElementById('fullName');
            if (!nameInput.value.trim()) {
                nameInput.parentElement.classList.add('has-error');
                isValid = false;
            } else {
                nameInput.parentElement.classList.remove('has-error');
            }

            // Email validation
            const emailInput = document.getElementById('email');
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailInput.value.trim() || !emailPattern.test(emailInput.value.trim())) {
                emailInput.parentElement.classList.add('has-error');
                isValid = false;
            } else {
                emailInput.parentElement.classList.remove('has-error');
            }

            // Subject validation
            const subjectInput = document.getElementById('subject');
            if (!subjectInput.value.trim()) {
                subjectInput.parentElement.classList.add('has-error');
                isValid = false;
            } else {
                subjectInput.parentElement.classList.remove('has-error');
            }

            // Message validation
            const messageInput = document.getElementById('message');
            if (!messageInput.value.trim()) {
                messageInput.parentElement.classList.add('has-error');
                isValid = false;
            } else {
                messageInput.parentElement.classList.remove('has-error');
            }

            return isValid;
        }

        function handleSubmission(method) {
            if (!validateForm()) return;
            
            const fullName = document.getElementById('fullName').value.trim();
            const email = document.getElementById('email').value.trim();
            const subject = document.getElementById('subject').value.trim();
            const message = document.getElementById('message').value.trim();
            const phoneNumber = '918121650111'; // Country code (91) + phone number

            const successMsg = document.getElementById('formSuccess');
            successMsg.style.display = 'block';
            successMsg.style.color = ''; 
            
            let url = '';
            
            if (method === 'whatsapp') {
                const waMessage = `Hello Lohith!\n\nMy name is ${fullName} (${email}).\n\n*Subject:* ${subject}\n*Message:* ${message}`;
                url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(waMessage)}`;
                successMsg.innerHTML = '✅ Redirecting to WhatsApp...';
                window.open(url, '_blank');
            } else if (method === 'email') {
                const emailBody = `Hi Lohith,\n\n${message}\n\nFrom: ${fullName}\nEmail: ${email}`;
                url = `https://mail.google.com/mail/?view=cm&fs=1&to=lohithram8121@gmail.com&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;
                successMsg.innerHTML = '✅ Opening Gmail...';
                window.open(url, '_blank');
            } else if (method === 'sms') {
                const smsBody = `Hi Lohith! I'm ${fullName}. Subject: ${subject}. Message: ${message}. My email: ${email}`;
                // Detect iOS vs Android formatting for SMS body, but standard is ?body=
                const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
                const separator = isIOS ? '&' : '?';
                url = `sms:+${phoneNumber}${separator}body=${encodeURIComponent(smsBody)}`;
                successMsg.innerHTML = '✅ Opening SMS App...';
                window.location.href = url;
            }

            // Reset form
            contactForm.reset();
            
            setTimeout(() => {
                successMsg.style.display = 'none';
            }, 5000);
        }

        // Attach listeners to buttons
        const btnEmail = document.getElementById('btn-email');
        const btnWhatsapp = document.getElementById('btn-whatsapp');
        const btnSms = document.getElementById('btn-sms');

        if(btnEmail) btnEmail.addEventListener('click', () => handleSubmission('email'));
        if(btnWhatsapp) btnWhatsapp.addEventListener('click', () => handleSubmission('whatsapp'));
        if(btnSms) btnSms.addEventListener('click', () => handleSubmission('sms'));

        // Remove error on input
        const inputs = contactForm.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                input.parentElement.classList.remove('has-error');
            });
        });
    }
});
