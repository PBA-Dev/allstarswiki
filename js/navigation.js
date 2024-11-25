document.addEventListener('DOMContentLoaded', () => {
    const nav = document.querySelector('.wiki-nav');
    const currentPath = window.location.pathname;

    // Highlight current page in navigation
    const navLinks = nav.querySelectorAll('a');
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPath.split('/').pop()) {
            link.classList.add('active');
        }
    });

    // Mobile navigation toggle
    const createMobileNav = () => {
        const mobileNav = document.createElement('button');
        mobileNav.className = 'mobile-nav-toggle';
        mobileNav.innerHTML = '☰';
        nav.prepend(mobileNav);

        const navList = nav.querySelector('ul');
        mobileNav.addEventListener('click', () => {
            navList.classList.toggle('show');
        });
    };

    // Create mobile navigation if screen width is below 768px
    if (window.innerWidth < 768) {
        createMobileNav();
    }

    // Handle window resize
    window.addEventListener('resize', () => {
        if (window.innerWidth < 768) {
            if (!document.querySelector('.mobile-nav-toggle')) {
                createMobileNav();
            }
        } else {
            const mobileNav = document.querySelector('.mobile-nav-toggle');
            if (mobileNav) {
                mobileNav.remove();
            }
            nav.querySelector('ul').classList.remove('show');
        }
    });
});
