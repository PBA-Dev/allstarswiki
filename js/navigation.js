document.addEventListener('DOMContentLoaded', () => {
    const nav = document.querySelector('.quick-links');
    if (!nav) return; // Exit if navigation element doesn't exist
    
    const currentPath = window.location.pathname;

    // Highlight current page in navigation
    const navLinks = nav.querySelectorAll('a');
    if (navLinks) {
        navLinks.forEach(link => {
            if (link.getAttribute('href') === currentPath.split('/').pop()) {
                link.classList.add('active');
            }
        });
    }

    // Mobile navigation toggle
    const createMobileNav = () => {
        if (!nav.querySelector('.mobile-nav-toggle')) {  // Only create if it doesn't exist
            const mobileNav = document.createElement('button');
            mobileNav.className = 'mobile-nav-toggle';
            mobileNav.innerHTML = '☰';
            nav.prepend(mobileNav);

            const navList = nav.querySelector('ul');
            if (navList) {
                mobileNav.addEventListener('click', () => {
                    navList.classList.toggle('show');
                });
            }
        }
    };

    // Create mobile navigation if screen width is below 768px
    if (window.innerWidth < 768) {
        createMobileNav();
    }

    // Update navigation on window resize
    window.addEventListener('resize', () => {
        if (window.innerWidth < 768) {
            createMobileNav();
        } else {
            const mobileNav = nav.querySelector('.mobile-nav-toggle');
            if (mobileNav) {
                mobileNav.remove();
            }
            const navList = nav.querySelector('ul');
            if (navList) {
                navList.classList.remove('show');
            }
        }
    });
});
