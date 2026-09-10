/**
 * Kranti Furnitures & Electronics - Product Catalog & Filtering JS
 */

document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  let currentCategory = urlParams.get('category') || 'all';
  let searchQuery = urlParams.get('q') || '';
  let currentSort = 'popularity';
  let selectedBrands = [];
  let minRating = 0;
  let currentPage = 1;
  const itemsPerPage = 6;

  // DOM elements
  const productGrid = document.getElementById('products-grid');
  const productCountEl = document.getElementById('product-count-display');
  const categoryTitleEl = document.getElementById('category-title-heading');
  const breadcrumbCurrentEl = document.getElementById('breadcrumb-current');
  const sortSelect = document.getElementById('sort-select');
  const brandCheckboxes = document.querySelectorAll('.brand-filter-cb');
  const ratingCheckboxes = document.querySelectorAll('.rating-filter-cb');
  const paginationContainer = document.getElementById('pagination-container');
  const clearFiltersBtn = document.getElementById('clear-filters-btn');
  const mobileFilterToggle = document.getElementById('mobile-filter-toggle');
  const filterSidebar = document.getElementById('filter-sidebar');
  const closeFilterSidebar = document.getElementById('close-filter-sidebar');

  // Sort changes
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      currentSort = e.target.value;
      currentPage = 1;
      render();
    });
  }

  // Brand Checkboxes
  brandCheckboxes.forEach(cb => {
    cb.addEventListener('change', () => {
      selectedBrands = Array.from(brandCheckboxes)
        .filter(c => c.checked)
        .map(c => c.value);
      currentPage = 1;
      render();
    });
  });

  // Rating Checkboxes
  ratingCheckboxes.forEach(cb => {
    cb.addEventListener('change', () => {
      const checked = Array.from(ratingCheckboxes).filter(c => c.checked).map(c => parseFloat(c.value));
      minRating = checked.length > 0 ? Math.min(...checked) : 0;
      currentPage = 1;
      render();
    });
  });

  // Clear Filters
  if (clearFiltersBtn) {
    clearFiltersBtn.addEventListener('click', () => {
      selectedBrands = [];
      brandCheckboxes.forEach(c => c.checked = false);
      ratingCheckboxes.forEach(c => c.checked = false);
      minRating = 0;
      currentPage = 1;
      render();
    });
  }

  // Mobile Filter Drawer
  if (mobileFilterToggle && filterSidebar) {
    mobileFilterToggle.addEventListener('click', () => {
      filterSidebar.classList.remove('hidden');
    });
  }
  if (closeFilterSidebar && filterSidebar) {
    closeFilterSidebar.addEventListener('click', () => {
      filterSidebar.classList.add('hidden');
    });
  }

  // Category Pill switcher
  document.querySelectorAll('[data-category-pill]').forEach(pill => {
    pill.addEventListener('click', (e) => {
      e.preventDefault();
      document.querySelectorAll('[data-category-pill]').forEach(p => {
        p.classList.remove('bg-primary', 'text-on-primary');
        p.classList.add('bg-surface-container-lowest', 'text-on-surface-variant', 'border', 'border-outline-variant');
      });
      pill.classList.remove('bg-surface-container-lowest', 'text-on-surface-variant', 'border', 'border-outline-variant');
      pill.classList.add('bg-primary', 'text-on-primary');

      currentCategory = pill.getAttribute('data-category-pill');
      currentPage = 1;
      render();
    });
  });

  function getFilteredProducts() {
    let list = Store.getProducts();

    // Category filter
    if (currentCategory && currentCategory !== 'all') {
      list = list.filter(p => p.category === currentCategory || p.subCategory.toLowerCase() === currentCategory.toLowerCase());
    }

    // Search query filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(p => 
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.categoryLabel.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    }

    // Brand filter
    if (selectedBrands.length > 0) {
      list = list.filter(p => selectedBrands.includes(p.brand));
    }

    // Rating filter
    if (minRating > 0) {
      list = list.filter(p => p.rating >= minRating);
    }

    // Sorting
    if (currentSort === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    } else if (currentSort === 'newest') {
      list.reverse();
    } else {
      // Popularity (default)
      list.sort((a, b) => b.reviewsCount - a.reviewsCount);
    }

    return list;
  }

  function render() {
    const filtered = getFilteredProducts();
    const total = filtered.length;

    // Update Titles
    let titleText = 'All Products';
    if (searchQuery) {
      titleText = `Search Results for "${searchQuery}"`;
    } else if (currentCategory === 'sofas') {
      titleText = 'Sofas & Recliners';
    } else if (currentCategory === 'electronics') {
      titleText = 'Televisions & Electronics';
    } else if (currentCategory === 'dining') {
      titleText = 'Dining Sets & Chairs';
    } else if (currentCategory === 'beds') {
      titleText = 'Beds & Mattresses';
    } else if (currentCategory === 'appliances') {
      titleText = 'Refrigerators & Appliances';
    }

    if (categoryTitleEl) categoryTitleEl.textContent = titleText;
    if (breadcrumbCurrentEl) breadcrumbCurrentEl.textContent = titleText;
    if (productCountEl) {
      productCountEl.textContent = `Showing ${Math.min(total, 1 + (currentPage - 1) * itemsPerPage)}-${Math.min(total, currentPage * itemsPerPage)} of ${total} products`;
    }

    // Render Product Cards
    if (total === 0) {
      productGrid.innerHTML = `
        <div class="col-span-full py-16 text-center bg-surface-container-lowest rounded-xl border border-outline-variant p-8">
          <span class="material-symbols-outlined text-[56px] text-outline mb-3">search_off</span>
          <h3 class="font-headline-md text-primary font-bold mb-2">No matching products found</h3>
          <p class="text-on-surface-variant max-w-md mx-auto mb-6 text-sm">We couldn't find any products matching your selected filters. Try broadening your criteria or reset filters.</p>
          <button id="reset-empty-filters" class="bg-primary text-on-primary px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-primary-container transition-colors">
            Reset All Filters
          </button>
        </div>
      `;
      const resetBtn = document.getElementById('reset-empty-filters');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          if (clearFiltersBtn) clearFiltersBtn.click();
        });
      }
      if (paginationContainer) paginationContainer.innerHTML = '';
      return;
    }

    // Pagination Slice
    const totalPages = Math.ceil(total / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedItems = filtered.slice(startIndex, startIndex + itemsPerPage);

    productGrid.innerHTML = paginatedItems.map(p => {
      const isWish = Store.isInWishlist(p.id);
      return `
        <div class="product-card bg-surface-container-lowest rounded-xl p-4 shadow-sm border border-outline-variant/30 flex flex-col group relative">
          <!-- Image Box -->
          <div class="relative aspect-[4/3] rounded-lg overflow-hidden mb-4 bg-surface-container-high flex items-center justify-center">
            <a href="product-detail.html?id=${p.id}" class="w-full h-full block">
              <img src="${p.image}" alt="${p.name}" class="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" loading="lazy" />
            </a>
            
            <div class="absolute top-2.5 right-2.5 bg-primary/10 text-primary px-2 py-0.5 rounded font-bold text-xs shadow-sm border border-primary/20">
              In Showroom
            </div>

            <button data-wishlist-btn data-product-id="${p.id}" aria-label="Add to Wishlist" class="absolute top-2.5 left-2.5 p-1.5 rounded-full bg-surface/90 text-on-surface hover:text-error hover:bg-surface transition-colors shadow-sm">
              <span class="material-symbols-outlined text-[18px] ${isWish ? 'filled text-error' : ''}">favorite</span>
            </button>
          </div>

          <!-- Info Box -->
          <div class="flex-grow flex flex-col">
            <div class="text-xs uppercase tracking-wider text-outline font-semibold mb-1">${p.brand}</div>
            <a href="product-detail.html?id=${p.id}" class="font-headline-md text-base md:text-lg font-bold text-on-surface mb-2 line-clamp-2 hover:text-primary transition-colors">
              ${p.name}
            </a>

            <!-- Ratings -->
            <div class="flex items-center gap-1 mb-3">
              <div class="flex text-[#c6955e] text-sm">
                ${Array.from({ length: 5 }, (_, i) => {
                  if (i < Math.floor(p.rating)) {
                    return '<span class="material-symbols-outlined filled text-[16px]">star</span>';
                  } else if (i < p.rating) {
                    return '<span class="material-symbols-outlined text-[16px]">star_half</span>';
                  } else {
                    return '<span class="material-symbols-outlined text-[16px] text-outline-variant">star</span>';
                  }
                }).join('')}
              </div>
              <span class="text-xs text-on-surface-variant font-medium">(${p.reviewsCount})</span>
            </div>

            <!-- Action -->
            <div class="mt-auto pt-3 border-t border-outline-variant/30 flex items-center justify-between gap-2">
              <span class="text-xs text-discount font-bold flex items-center gap-1">
                <span class="material-symbols-outlined text-sm filled">check_circle</span> Available
              </span>

              <button data-inquire-btn data-product-id="${p.id}" class="bg-primary text-on-primary hover:bg-primary-container px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm active:scale-95">
                <span class="material-symbols-outlined text-[16px]">contact_support</span>
                <span>Inquire Now</span>
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');

    // Render Pagination Buttons
    if (paginationContainer) {
      if (totalPages <= 1) {
        paginationContainer.innerHTML = '';
      } else {
        let pagesHtml = `
          <button class="p-2 rounded-lg border border-outline-variant text-on-surface-variant hover:bg-surface-container-high transition-colors ${currentPage === 1 ? 'opacity-40 cursor-not-allowed' : ''}" ${currentPage === 1 ? 'disabled' : ''} data-page="${currentPage - 1}">
            <span class="material-symbols-outlined text-sm">chevron_left</span>
          </button>
        `;

        for (let i = 1; i <= totalPages; i++) {
          pagesHtml += `
            <button class="w-9 h-9 rounded-lg font-semibold text-sm flex items-center justify-center transition-colors ${i === currentPage ? 'bg-primary text-on-primary' : 'border border-outline-variant text-on-surface-variant hover:bg-surface-container-high'}" data-page="${i}">
              ${i}
            </button>
          `;
        }

        pagesHtml += `
          <button class="p-2 rounded-lg border border-outline-variant text-on-surface-variant hover:bg-surface-container-high transition-colors ${currentPage === totalPages ? 'opacity-40 cursor-not-allowed' : ''}" ${currentPage === totalPages ? 'disabled' : ''} data-page="${currentPage + 1}">
            <span class="material-symbols-outlined text-sm">chevron_right</span>
          </button>
        `;

        paginationContainer.innerHTML = pagesHtml;

        paginationContainer.querySelectorAll('[data-page]').forEach(btn => {
          btn.addEventListener('click', () => {
            const page = parseInt(btn.getAttribute('data-page'), 10);
            if (page >= 1 && page <= totalPages) {
              currentPage = page;
              render();
              window.scrollTo({ top: 180, behavior: 'smooth' });
            }
          });
        });
      }
    }
  }

  // Listen for dynamic admin product updates
  window.addEventListener('products-updated', () => render());

  // Initial render
  render();
});
