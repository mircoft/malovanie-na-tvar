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
                <img src="${item.image}" alt="${item.title}" loading="lazy" decoding="async">
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

        const renderedItems = Array.from(galleryGrid.querySelectorAll('.gallery-item'));
        const renderedImages = Array.from(galleryGrid.querySelectorAll('.gallery-item img'));

        renderedImages.forEach((img) => {
            if (img.complete) {
                img.classList.add('is-loaded');
                return;
            }
            img.addEventListener('load', () => img.classList.add('is-loaded'), { once: true });
        });

        window.requestAnimationFrame(() => {
            renderedItems.forEach((item, idx) => {
                window.setTimeout(() => {
                    item.classList.add('is-visible');
                }, idx * 24);
            });
        });
        
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

// Contact form is handled by EmailJS inline script in index.html.

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

// Gift certificate email handling is configured directly on the page where needed.

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

// Instagram: oficiálne embedy v horizontálnom carouseli (auto-posun + zvýraznenie aktívneho slidu)
document.addEventListener('DOMContentLoaded', () => {
  const slider = document.getElementById('igSlider');
  const viewport = slider ? slider.querySelector('.ig-slider-viewport') : null;
  const track = document.getElementById('igSliderTrack');
  const prevBtn = document.getElementById('igSliderPrev');
  const nextBtn = document.getElementById('igSliderNext');

  if (!slider || !viewport || !track) return;

  const instagramPosts = [
    { url: 'https://www.instagram.com/p/DQhvSJNgDVg/' },
    { url: 'https://www.instagram.com/p/DQUVZ7djGt1/' },
    { url: 'https://www.instagram.com/p/DPLg6jKDOsf/' },
    { url: 'https://www.instagram.com/p/DPGRH3gDOqG/' },
    { url: 'https://www.instagram.com/p/DMpie-mIAOi/' },
    { url: 'https://www.instagram.com/p/DMlCpaPodFK/' },
    { url: 'https://www.instagram.com/p/DL2npJ_Ifqs/' },
    { url: 'https://www.instagram.com/p/DLwwgCttGBV/' }
  ];

  track.innerHTML = instagramPosts
    .map(
      (post) => `
    <div class="ig-slide">
      <div class="ig-slide-embed">
        <blockquote class="instagram-media" data-instgrm-permalink="${post.url}" data-instgrm-version="14">
          <a href="${post.url}" target="_blank" rel="noopener noreferrer">Zobraziť príspevok na Instagrame</a>
        </blockquote>
      </div>
    </div>`
    )
    .join('');

  function processEmbeds() {
    if (window.instgrm && window.instgrm.Embeds) {
      window.instgrm.Embeds.process();
    }
  }

  /** Instagram nastavuje na iframe vlastné inline štýly – orez z css/style.css sa inak na desktope neuplatní. */
  function applyIgIframeCrop() {
    track.querySelectorAll('.ig-slide-embed').forEach((embed) => {
      const cs = getComputedStyle(embed);
      const cropTop = parseFloat(cs.getPropertyValue('--ig-crop-top')) || 0;
      const cropBottom = parseFloat(cs.getPropertyValue('--ig-crop-bottom')) || 0;
      const vh = parseFloat(cs.getPropertyValue('--ig-viewport-height')) || 430;
      const totalH = Math.round(vh + cropTop + cropBottom);
      embed.querySelectorAll('iframe').forEach((frame) => {
        frame.style.setProperty('position', 'absolute', 'important');
        frame.style.setProperty('left', '50%', 'important');
        frame.style.setProperty('top', '0', 'important');
        frame.style.setProperty(
          'transform',
          `translate(-50%, -${cropTop}px)`,
          'important'
        );
        frame.style.setProperty('height', `${totalH}px`, 'important');
        frame.style.setProperty('min-height', `${totalH}px`, 'important');
        frame.style.setProperty('width', '108%', 'important');
        frame.style.setProperty('max-width', '380px', 'important');
        frame.style.setProperty('border', '0', 'important');
        frame.style.setProperty('box-shadow', 'none', 'important');
      });
    });
  }

  const slides = () => Array.from(track.querySelectorAll('.ig-slide'));
  /* Začať na 3. príspevku – v strede sú viditeľné aj slidy vľavo/vpravo, prázdnejší okraj */
  let currentIndex = Math.min(2, Math.max(0, instagramPosts.length - 1));
  const intervalMs = 7000;
  let timer = null;

  function updatePosition() {
    const list = slides();
    const active = list[currentIndex];
    if (!active) return;

    list.forEach((slide, idx) => {
      slide.classList.toggle('is-active', idx === currentIndex);
    });

    const viewportCenter = viewport.clientWidth / 2;
    const activeCenter = active.offsetLeft + active.offsetWidth / 2;
    track.style.transform = `translateX(${viewportCenter - activeCenter}px)`;
  }

  function goTo(index) {
    const list = slides();
    if (list.length === 0) return;
    currentIndex = (index + list.length) % list.length;
    updatePosition();
  }

  function next() {
    goTo(currentIndex + 1);
  }

  function startAuto() {
    window.clearInterval(timer);
    timer = window.setInterval(next, intervalMs);
  }

  function wireCarousel() {
    prevBtn?.addEventListener('click', () => {
      goTo(currentIndex - 1);
      startAuto();
    });
    nextBtn?.addEventListener('click', () => {
      next();
      startAuto();
    });
    window.addEventListener('resize', () => {
      applyIgIframeCrop();
      updatePosition();
    });

    let moDebounce = null;
    const mo = new MutationObserver(() => {
      window.clearTimeout(moDebounce);
      moDebounce = window.setTimeout(() => {
        applyIgIframeCrop();
        window.requestAnimationFrame(updatePosition);
      }, 100);
    });
    mo.observe(track, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['style', 'class']
    });

    updatePosition();
    startAuto();
    applyIgIframeCrop();
    [200, 400, 1200, 2500, 4000].forEach((ms) => {
      window.setTimeout(() => {
        applyIgIframeCrop();
        updatePosition();
      }, ms);
    });
  }

  function afterEmbedsReady() {
    processEmbeds();
    wireCarousel();
  }

  const existing = document.querySelector('script[src="https://www.instagram.com/embed.js"]');
  if (existing) {
    afterEmbedsReady();
    return;
  }

  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://www.instagram.com/embed.js';
  script.onload = afterEmbedsReady;
  document.body.appendChild(script);
});

document.querySelectorAll('.copyright-year').forEach((el) => {
  el.textContent = String(new Date().getFullYear());
});