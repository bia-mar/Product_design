// ===========================
// Mobile Navigation Toggle
// ===========================

document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            
            // Animate hamburger menu
            const spans = navToggle.querySelectorAll('span');
            if (navMenu.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(7px, 7px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(7px, -7px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!navToggle.contains(event.target) && !navMenu.contains(event.target)) {
                navMenu.classList.remove('active');
                const spans = navToggle.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
    }
    
    // ===========================
    // Project Filtering
    // ===========================
    
    const filterChips = document.querySelectorAll('.filter-chip');
    const projectCards = document.querySelectorAll('.project-card');
    
    if (filterChips.length > 0 && projectCards.length > 0) {
        filterChips.forEach(chip => {
            chip.addEventListener('click', function() {
                const filter = this.getAttribute('data-filter');
                
                // Update active state
                filterChips.forEach(c => c.classList.remove('active'));
                this.classList.add('active');
                
                // Filter projects
                projectCards.forEach(card => {
                    const categories = card.getAttribute('data-category');
                    
                    if (filter === 'all') {
                        card.classList.remove('hidden');
                        setTimeout(() => {
                            card.style.display = '';
                        }, 300);
                    } else {
                        if (categories && categories.includes(filter)) {
                            card.classList.remove('hidden');
                            setTimeout(() => {
                                card.style.display = '';
                            }, 300);
                        } else {
                            card.classList.add('hidden');
                            setTimeout(() => {
                                card.style.display = 'none';
                            }, 300);
                        }
                    }
                });
            });
        });
    }
    
    // ===========================
    // Active Page Indicator
    // ===========================
    
    // Get current page filename
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    // Update active nav link based on current page
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        if (linkHref === currentPage || 
            (currentPage === '' && linkHref === 'index.html') ||
            (currentPage === 'index.html' && linkHref === 'index.html')) {
            // Don't add active to external links (LinkedIn)
            if (!link.hasAttribute('target')) {
                link.classList.add('active');
            }
        }
    });
    
    // ===========================
    // Grid Layout Controls
    // ===========================
    
    const gridButtons = document.querySelectorAll('.grid-btn');
    
    if (gridButtons.length > 0) {
        gridButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                // Get the grid value from the button
                const gridValue = this.getAttribute('data-grid-value');
                
                // Find the parent project card
                const projectCard = this.closest('.project-card');
                
                if (projectCard && gridValue) {
                    // Update the data-grid attribute on the project card
                    projectCard.setAttribute('data-grid', gridValue);
                    
                    // Update active state for buttons in this card only
                    const siblingButtons = projectCard.querySelectorAll('.grid-btn');
                    siblingButtons.forEach(btn => btn.classList.remove('active'));
                    this.classList.add('active');
                }
            });
        });
    }
    
    // ===========================
    // Responsive Grid Defaults
    // ===========================
    
    function setResponsiveGridDefaults() {
        const isMobile = window.innerWidth <= 768;
        const projectCards = document.querySelectorAll('.project-card');
        
        projectCards.forEach(card => {
            const gridControls = card.querySelector('.grid-controls');
            if (!gridControls) return;
            
            const buttons = gridControls.querySelectorAll('.grid-btn');
            const defaultValue = isMobile ? '2' : '4';
            
            // Set default grid layout
            card.setAttribute('data-grid', defaultValue);
            
            // Update active button state
            buttons.forEach(btn => {
                const btnValue = btn.getAttribute('data-grid-value');
                if (btnValue === defaultValue) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });
        });
    }
    
    // Set initial defaults on page load
    setResponsiveGridDefaults();
    
    // Update on window resize (with debounce)
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(setResponsiveGridDefaults, 250);
    });
    
    // ===========================
    // Smooth Scroll for Back Links
    // ===========================
    
    const backLinks = document.querySelectorAll('a[href*="#"]');
    backLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href.includes('#')) {
                e.preventDefault();
                const targetId = href.split('#')[1];
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    // ===========================
    // Password Protected Projects
    // ===========================
    
    const passwordInput = document.getElementById('passwordInput');
    const passwordError = document.getElementById('passwordError');
    const passwordInline = document.querySelector('.password-inline');
    const lockedProject = document.querySelector('.project-locked');
    const lockedProjectHeader = lockedProject ? lockedProject.querySelector('.project-header') : null;
    
    // Handle clicks on locked project header to toggle password input
    if (lockedProjectHeader && passwordInline) {
        lockedProjectHeader.addEventListener('click', function(e) {
            // Don't toggle if clicking on grid buttons
            if (e.target.closest('.grid-controls')) return;
            
            // Toggle password input visibility
            if (passwordInline.style.display === 'none' || passwordInline.style.display === '') {
                passwordInline.style.display = 'flex';
                setTimeout(() => passwordInput.focus(), 100);
            } else {
                passwordInline.style.display = 'none';
                if (passwordError) {
                    passwordError.textContent = '';
                }
            }
        });
    }
    
    // Handle Enter key in password input
    if (passwordInput) {
        passwordInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                validatePassword();
            }
        });
        
        // Clear error on typing
        passwordInput.addEventListener('input', function() {
            if (passwordError) {
                passwordError.textContent = '';
            }
        });
    }
    
    // Validate password function
    function validatePassword() {
        if (!lockedProject || !passwordInput) return;
        
        const enteredPassword = passwordInput.value.trim();
        const correctPassword = lockedProject.getAttribute('data-password');
        const projectUrl = lockedProject.getAttribute('data-project-url');
        
        if (enteredPassword === correctPassword) {
            // Password correct - redirect to project page
            if (projectUrl) {
                window.location.href = projectUrl;
            }
        } else {
            // Password incorrect - show error
            if (passwordError) {
                passwordError.textContent = 'Incorrect password';
            }
            passwordInput.value = '';
            passwordInput.focus();
        }
    }
});