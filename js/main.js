// Mobile Menu
document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const body = document.body;
    let isMenuAnimating = false;

    function toggleMenu() {
        if (isMenuAnimating) return;
        isMenuAnimating = true;

        menuToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';

        setTimeout(() => {
            isMenuAnimating = false;
        }, 300);
    }

    menuToggle?.addEventListener('click', toggleMenu);

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navMenu?.classList.contains('active') && 
            !navMenu.contains(e.target) && 
            !menuToggle?.contains(e.target)) {
            toggleMenu();
        }
    });

    // Close menu when pressing Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu?.classList.contains('active')) {
            toggleMenu();
        }
    });

    // Close menu when clicking a link
    document.querySelectorAll('.nav-list a').forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu?.classList.contains('active')) {
                toggleMenu();
            }
        });
    });
});

// Back to Top Button
const backToTopButton = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        backToTopButton?.classList.add('visible');
    } else {
        backToTopButton?.classList.remove('visible');
    }
});

backToTopButton?.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Gallery Filtering
const galleryFilters = document.querySelector('.gallery-filters');
const galleryGrid = document.querySelector('.gallery-grid');
const loadMoreButton = document.querySelector('.load-more');

if (galleryFilters && galleryGrid) {
    let currentFilter = 'all';
    let currentPage = 1;
    const itemsPerPage = 6;
    let isLoading = false;

    // Sample gallery items (replace with your actual data)
    const galleryItems = [
        {
            category: 'oslava',
            image: 'images/gallery/oslava1.jpg',
            title: 'Kúzelná víla',
            description: 'Narodeninová oslava'
        },
        {
            category: 'festival',
            image: 'images/gallery/festival1.jpg',
            title: 'Tiger',
            description: 'Festival detí'
        },
        {
            category: 'firemna',
            image: 'images/gallery/firemna1.jpg',
            title: 'Motýlik',
            description: 'Firemná akcia'
        }
        // Add more items as needed
    ];

    function createGalleryItem(item) {
        return `
            <div class="gallery-item" data-category="${item.category}">
                <img src="${item.image}" alt="${item.title}" loading="lazy">
                <div class="gallery-item-overlay">
                    <h3>${item.title}</h3>
                    <p>${item.description}</p>
                </div>
            </div>
        `;
    }

    function filterGallery() {
        const filteredItems = galleryItems.filter(item => 
            currentFilter === 'all' || item.category === currentFilter
        );
        
        const startIndex = 0;
        const endIndex = currentPage * itemsPerPage;
        const itemsToShow = filteredItems.slice(startIndex, endIndex);

        galleryGrid.innerHTML = itemsToShow.map(createGalleryItem).join('');
        
        // Show/hide load more button
        if (loadMoreButton) {
            loadMoreButton.style.display = 
                endIndex < filteredItems.length ? 'inline-flex' : 'none';
        }
    }

    // Filter button click handler
    galleryFilters.addEventListener('click', (e) => {
        if (!e.target.matches('.filter-button')) return;

        // Update active button
        galleryFilters.querySelectorAll('.filter-button').forEach(btn => {
            btn.classList.remove('active');
        });
        e.target.classList.add('active');

        // Update filter and reset page
        currentFilter = e.target.dataset.filter;
        currentPage = 1;
        filterGallery();
    });

    // Load more click handler
    loadMoreButton?.addEventListener('click', () => {
        if (isLoading) return;
        isLoading = true;

        currentPage++;
        filterGallery();

        setTimeout(() => {
            isLoading = false;
        }, 300);
    });

    // Initial load
    filterGallery();
}

// Reviews Slider
const reviewsSlider = document.querySelector('.reviews-slider');
const reviewCards = document.querySelectorAll('.review-card');
const prevButton = document.querySelector('.slider-prev');
const nextButton = document.querySelector('.slider-next');

if (reviewsSlider && reviewCards.length > 0) {
    let currentIndex = 0;
    const totalCards = reviewCards.length;

    function updateSlider() {
        const offset = -currentIndex * 100;
        reviewsSlider.style.transform = `translateX(${offset}%)`;

        // Update active state
        reviewCards.forEach((card, index) => {
            card.classList.toggle('active', index === currentIndex);
        });

        // Update button states
        if (prevButton) {
            prevButton.style.display = currentIndex === 0 ? 'none' : 'flex';
        }
        if (nextButton) {
            nextButton.style.display = currentIndex === totalCards - 1 ? 'none' : 'flex';
        }
    }

    prevButton?.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateSlider();
        }
    });

    nextButton?.addEventListener('click', () => {
        if (currentIndex < totalCards - 1) {
            currentIndex++;
            updateSlider();
        }
    });

    // Initialize slider
    updateSlider();
}

// Contact Form
const contactForm = document.getElementById('contactForm');

contactForm?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitButton = contactForm.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.innerHTML;

    try {
        // Disable button and show loading state
        submitButton.disabled = true;
        submitButton.innerHTML = `
            <svg class="loading-spinner" viewBox="0 0 24 24">
                <circle class="spinner-circle" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
            </svg>
            Odosielam...
        `;

        // Collect form data
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData.entries());

        // Here you would typically send the data to your server
        // For now, we'll just simulate a successful submission
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Show success message
        alert('Ďakujeme za vašu správu! Čoskoro vás budeme kontaktovať.');
        contactForm.reset();

    } catch (error) {
        // Show error message
        alert('Prepáčte, nastala chyba pri odosielaní správy. Prosím, skúste to znova neskôr.');
        console.error('Form submission error:', error);

    } finally {
        // Reset button state
        submitButton.disabled = false;
        submitButton.innerHTML = originalButtonText;
    }
});

// Cookie Banner
const cookieBanner = document.getElementById('cookieBanner');
const acceptCookiesButton = document.getElementById('acceptCookies');
const cookieConsentKey = 'cookiesAccepted';

if (cookieBanner && acceptCookiesButton) {
    const hasAcceptedCookies = localStorage.getItem(cookieConsentKey);

    if (!hasAcceptedCookies) {
        // Show the banner after a short delay
        setTimeout(() => {
            cookieBanner.classList.add('visible');
        }, 1000);
    }

    acceptCookiesButton.addEventListener('click', () => {
        cookieBanner.classList.remove('visible');
        localStorage.setItem(cookieConsentKey, 'true');
    });
}

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 80; // Adjust based on your header height
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Intersection Observer for Animations
const animateOnScroll = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            animateOnScroll.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

// Observe elements that should animate on scroll
document.querySelectorAll('.service-card, .pricing-card, .review-card, .faq-item').forEach(element => {
    animateOnScroll.observe(element);
});

// Gift Certificate Form
const giftCertificateForm = document.getElementById('giftCertificateForm');

giftCertificateForm?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitButton = giftCertificateForm.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.innerHTML;

    try {
        // Disable button and show loading state
        submitButton.disabled = true;
        submitButton.innerHTML = `
            <svg class="loading-spinner" viewBox="0 0 24 24">
                <circle class="spinner-circle" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
            </svg>
            Odosielam...
        `;

        // Collect form data
        const formData = new FormData(giftCertificateForm);
        const data = Object.fromEntries(formData.entries());

        // Here you would typically send the data to your server
        // For now, we'll just simulate a successful submission
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Show success message
        alert('Ďakujeme za váš záujem o darčekový poukaz! Čoskoro vás budeme kontaktovať.');
        giftCertificateForm.reset();

    } catch (error) {
        // Show error message
        alert('Prepáčte, nastala chyba pri odosielaní záujmu. Prosím, skúste to znova neskôr.');
        console.error('Gift certificate form submission error:', error);

    } finally {
        // Reset button state
        submitButton.disabled = false;
        submitButton.innerHTML = originalButtonText;
    }
}); 