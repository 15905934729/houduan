document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.nav-link');
    const contentFrame = document.getElementById('content-frame');

    // Function to set the active link
    function setActiveLink(link) {
        // Remove active class from all links
        navLinks.forEach(el => el.classList.remove('active'));
        // Add active class to the clicked link
        link.classList.add('active');
    }

    // Add click event listener to each nav link
    navLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault(); // Prevent default anchor behavior

            const pageToLoad = link.getAttribute('data-page');

            // Check if contentFrame exists and pageToLoad is valid
            if (contentFrame && pageToLoad) {
                // Change the src of the iframe
                contentFrame.src = pageToLoad;

                // Update the active state in the navigation
                setActiveLink(link);
            } else {
                console.error("Error: Content frame or data-page attribute not found.");
            }
        });
    });

    // Optional: Ensure the initial active link matches the iframe src
    const initialPage = contentFrame.getAttribute('src');
    const initialActiveLink = document.querySelector(`.nav-link[data-page="${initialPage}"]`);
    if (initialActiveLink) {
        setActiveLink(initialActiveLink);
    }
});
// Add this to your script.js file
// (or integrate into your existing DOMContentLoaded listener)

document.addEventListener('DOMContentLoaded', () => {
    const contentFrame = document.getElementById('content-frame');
    const pageLoadingLinks = document.querySelectorAll('.sidebar .nav-menu a.nav-link[data-page]');
    const defaultPageUrl = 'content_first.html'; // Your default page

    // Function to load content into iframe
    function loadContent(pageUrl) {
        if (contentFrame && pageUrl) {
            contentFrame.src = pageUrl;
        }
    }

    // Function to set active link
    function setActiveLink(clickedLink) {
        // Remove 'active' from all page-loading links
        pageLoadingLinks.forEach(link => link.classList.remove('active'));
        
        // Remove 'active-parent' from all submenu toggles
        document.querySelectorAll('.sidebar .nav-menu .has-submenu > a.nav-link').forEach(link => {
            link.classList.remove('active-parent');
        });

        if (clickedLink) {
            clickedLink.classList.add('active');
            // If the clicked link is inside a submenu, mark its parent toggle as 'active-parent'
            const parentSubmenuLi = clickedLink.closest('li.has-submenu');
            if (parentSubmenuLi && clickedLink.closest('.submenu')) {
                 const parentToggleLink = parentSubmenuLi.querySelector('a.nav-link');
                 if(parentToggleLink) parentToggleLink.classList.add('active-parent');
            }
        }
    }

    // Event listener for page loading links (both top-level and submenu)
    pageLoadingLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            const page = this.getAttribute('data-page');
            loadContent(page);
            setActiveLink(this);
        });
    });

    // Event listener for submenu toggles
    const submenuToggles = document.querySelectorAll('.sidebar .nav-menu .has-submenu > a.nav-link');
    submenuToggles.forEach(toggleLink => {
        // Only add toggle functionality if it's not a page-loading link itself
        if (!toggleLink.hasAttribute('data-page')) {
            toggleLink.addEventListener('click', function(event) {
                event.preventDefault();
                const parentLi = this.parentElement; // The li.has-submenu
                const submenu = parentLi.querySelector('.submenu');
                // const arrow = this.querySelector('.submenu-arrow'); // Arrow class handled by .open on parentLi

                if (submenu) {
                    const isOpen = submenu.style.display === 'block';

                    // Optional: Accordion behavior - close other submenus
                    if (!isOpen) { // If we are about to open this one
                        document.querySelectorAll('.sidebar .nav-menu .has-submenu').forEach(otherLi => {
                            if (otherLi !== parentLi) {
                                otherLi.classList.remove('open');
                                const otherSubmenu = otherLi.querySelector('.submenu');
                                if (otherSubmenu) otherSubmenu.style.display = 'none';
                            }
                        });
                    }

                    // Toggle current submenu
                    submenu.style.display = isOpen ? 'none' : 'block';
                    parentLi.classList.toggle('open', !isOpen);
                }
            });
        }
    });

    // Initial page load and active state
    let initialLinkToActivate = document.querySelector('.sidebar .nav-menu a.nav-link.active[data-page]');
    if (!initialLinkToActivate && pageLoadingLinks.length > 0) {
        // If no link is pre-marked as active, try the first page-loading link in the nav
        initialLinkToActivate = pageLoadingLinks[0];
    }

    if (initialLinkToActivate) {
        loadContent(initialLinkToActivate.getAttribute('data-page'));
        setActiveLink(initialLinkToActivate); // Sets active and active-parent if needed

        // If the initial active link is in a submenu, ensure its parent submenu is open
        const parentLiOfActive = initialLinkToActivate.closest('li.has-submenu');
        if (parentLiOfActive && initialLinkToActivate.closest('.submenu')) {
            const submenu = parentLiOfActive.querySelector('.submenu');
            if (submenu) submenu.style.display = 'block';
            parentLiOfActive.classList.add('open');
        }
    } else if (contentFrame) {
        // Fallback if no links found or no active specified
        loadContent(defaultPageUrl);
    }
});