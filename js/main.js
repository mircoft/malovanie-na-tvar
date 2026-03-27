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
    let galleryItems = [];

    const categoryMap = {
        sukromne: 'oslava',
        oslava: 'oslava',
        festival: 'festival',
        firemne: 'firemna',
        firemna: 'firemna'
    };

    const fallbackGalleryItems = [
        { category: 'festival', image: 'images/Gallery/Festivaly/Smolenice/smolenice0.jpg', title: 'Smolenice 0' },
        { category: 'festival', image: 'images/Gallery/Festivaly/Smolenice/smolenice1.jpg', title: 'Smolenice 1' },
        { category: 'festival', image: 'images/Gallery/Festivaly/Smolenice/smolenice2.jpg', title: 'Smolenice 2' },
        { category: 'festival', image: 'images/Gallery/Festivaly/Smolenice/smolenice3.jpg', title: 'Smolenice 3' },
        { category: 'festival', image: 'images/Gallery/Festivaly/Smolenice/smolenice4.jpg', title: 'Smolenice 4' },
        { category: 'firemna', image: 'images/Gallery/Firemne/decathlon-akcia/DSC07560.png', title: 'Decathlon 1' },
        { category: 'firemna', image: 'images/Gallery/Firemne/decathlon-akcia/DSC07562.png', title: 'Decathlon 2' },
        { category: 'firemna', image: 'images/Gallery/Firemne/decathlon-akcia/DSC07563.png', title: 'Decathlon 3' }
    ].map((item) => ({
        ...item,
        description: `Maľovanie na tvár - ${item.category}`
    }));

    function createGalleryItem(item) {
        return `
            <div class="gallery-item" data-category="${item.category}">
                <img src="${item.image}" alt="${item.title}" loading="lazy">
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

    async function initGallery() {
        try {
            const response = await fetch('images/Gallery/gallery-manifest.json', { cache: 'no-store' });
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const manifest = await response.json();
            const items = Array.isArray(manifest?.items) ? manifest.items : [];

            galleryItems = items
                .map((item, index) => {
                    const normalizedCategory = categoryMap[String(item.category || '').toLowerCase()];
                    const image = item.image || item.src || '';
                    if (!normalizedCategory || !image) return null;
                    return {
                        category: normalizedCategory,
                        image,
                        title: item.title || `Galéria ${index + 1}`,
                        description: item.description || `Maľovanie na tvár - ${normalizedCategory}`
                    };
                })
                .filter(Boolean);
        } catch (error) {
            galleryItems = [];
        }

        if (galleryItems.length === 0) {
            galleryItems = fallbackGalleryItems;
        }

        filterGallery();
    }

    initGallery();
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

document.addEventListener('DOMContentLoaded', function() {
  var voucherButtons = document.querySelectorAll('.buy-voucher');
  var voucherSelect = document.getElementById('gift-voucher-type');
  var formSection = document.getElementById('gift-form');

  voucherButtons.forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      // Predvyplniť typ poukazu
      var voucher = btn.getAttribute('data-voucher');
      if (voucherSelect) {
        for (var i = 0; i < voucherSelect.options.length; i++) {
          if (voucherSelect.options[i].text === voucher) {
            voucherSelect.selectedIndex = i;
            break;
          }
        }
      }
      // Plynulý scroll k formuláru
      if (formSection) {
        setTimeout(function() {
          formSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 50);
      }
    });
  });
});

// Instagram horizontal slider (auto-rotate)
document.addEventListener('DOMContentLoaded', () => {
  const slider = document.getElementById('igSlider');
  const viewport = slider ? slider.querySelector('.ig-slider-viewport') : null;
  const track = document.getElementById('igSliderTrack');
  const prevBtn = document.getElementById('igSliderPrev');
  const nextBtn = document.getElementById('igSliderNext');

  if (!slider || !viewport || !track) return;

  const instagramPosts = [
    { code: 'DQhvSJNgDVg', url: 'https://www.instagram.com/p/DQhvSJNgDVg/' },
    { code: 'DQUVZ7djGt1', url: 'https://www.instagram.com/p/DQUVZ7djGt1/' },
    { code: 'DPLg6jKDOsf', url: 'https://www.instagram.com/p/DPLg6jKDOsf/' },
    { code: 'DPGRH3gDOqG', url: 'https://www.instagram.com/p/DPGRH3gDOqG/' },
    { code: 'DMpie-mIAOi', url: 'https://www.instagram.com/p/DMpie-mIAOi/' },
    { code: 'DMlCpaPodFK', url: 'https://www.instagram.com/p/DMlCpaPodFK/' },
    { code: 'DL2npJ_Ifqs', url: 'https://www.instagram.com/p/DL2npJ_Ifqs/' },
    { code: 'DLwwgCttGBV', url: 'https://www.instagram.com/p/DLwwgCttGBV/' }
  ];

  const fallbackImages = [
    'images/Gallery/Festivaly/Smolenice/smolenice0.jpg',
    'images/Gallery/Festivaly/Smolenice/smolenice1.jpg',
    'images/Gallery/Firemne/decathlon-akcia/DSC07560.png',
    'images/hero.jpg'
  ];

  track.innerHTML = instagramPosts.map((post, index) => {
    const primary = `https://www.instagram.com/p/${post.code}/media/?size=l`;
    const secondary = `https://www.instagram.com/p/${post.code}/media/?size=m`;
    const fallback = fallbackImages[index % fallbackImages.length];
    return `
      <a class="ig-slide" href="${post.url}" target="_blank" rel="noopener noreferrer" aria-label="Instagram post ${post.code}">
        <img src="${primary}" data-secondary-src="${secondary}" data-fallback-src="${fallback}" alt="Instagram post ${post.code}" loading="lazy" referrerpolicy="no-referrer">
      </a>
    `;
  }).join('');

  track.querySelectorAll('img').forEach((img) => {
    img.addEventListener('error', () => {
      const triedSecondary = img.dataset.triedSecondary === '1';
      if (!triedSecondary && img.dataset.secondarySrc) {
        img.dataset.triedSecondary = '1';
        img.src = img.dataset.secondarySrc;
        return;
      }
      if (img.dataset.fallbackSrc) {
        img.src = img.dataset.fallbackSrc;
      }
    });
  });

  const slides = Array.from(track.querySelectorAll('.ig-slide'));
  if (slides.length === 0) return;

  let currentIndex = 0;
  const intervalMs = 7000;
  let timer = null;

  function updatePosition() {
    const active = slides[currentIndex];
    if (!active) return;

    slides.forEach((slide, idx) => {
      slide.classList.toggle('is-active', idx === currentIndex);
    });

    const viewportCenter = viewport.clientWidth / 2;
    const activeCenter = active.offsetLeft + (active.offsetWidth / 2);
    const targetTranslate = viewportCenter - activeCenter;
    track.style.transform = `translateX(${targetTranslate}px)`;
  }

  function goTo(index) {
    currentIndex = (index + slides.length) % slides.length;
    updatePosition();
  }

  function next() {
    goTo(currentIndex + 1);
  }

  function startAuto() {
    window.clearInterval(timer);
    timer = window.setInterval(next, intervalMs);
  }

  prevBtn?.addEventListener('click', () => {
    goTo(currentIndex - 1);
    startAuto();
  });

  nextBtn?.addEventListener('click', () => {
    next();
    startAuto();
  });
  window.addEventListener('resize', updatePosition);

  updatePosition();
  startAuto();
});