// ===================================================================================
// GLENAEON WEBSITE SEARCH FUNCTIONALITY
// ===================================================================================
// This script provides comprehensive website search functionality that searches
// through all pages on the Glenaeon website. It includes both header search button
// functionality and footer search input functionality with real-time suggestions.
// The search covers page titles, content, meta descriptions, and navigation items.
// ===================================================================================

(function() {
  'use strict';

  // ===================================================================================
  // CONFIGURATION AND SEARCH DATA
  // ===================================================================================
  
  // Define searchable content across the website
  const searchableContent = [
    {
      title: "Home",
      url: "/",
      path: "index.html",
      description: "Glenaeon Rudolf Steiner School - A place where children flourish",
      keywords: ["home", "main", "school", "education", "steiner", "rudolf", "glenaeon"],
      content: "Welcome to Glenaeon Rudolf Steiner School. We are a vibrant learning community that nurtures the whole child."
    },
    {
      title: "Learning at Glenaeon",
      url: "/learning",
      path: "internal-page.html#learning",
      description: "Discover our unique approach to education",
      keywords: ["learning", "education", "curriculum", "approach", "teaching", "development"],
      content: "Our educational approach is based on Rudolf Steiner's insights into child development, recognizing that children learn differently at different stages."
    },
    {
      title: "Early Childhood (Birth - Age 7)",
      url: "/early-childhood",
      path: "learning-preschool.html#early-childhood",
      description: "Nurturing young children through play-based learning",
      keywords: ["early", "childhood", "young", "children", "play", "development", "kindergarten"],
      content: "In our early childhood programs, we provide a warm, homelike environment where young children can develop through imitation, rhythm, and creative play."
    },
    {
      title: "Playgroups",
      url: "/playgroups",
      path: "learning-preschool.html#playgroups",
      description: "Parent and child programs for the youngest learners",
      keywords: ["playgroups", "toddlers", "parents", "early", "development", "social"],
      content: "Our playgroups offer a gentle introduction to community life for children and parents."
    },
    {
      title: "Preschool",
      url: "/preschool",
      path: "learning-preschool.html#preschool",
      description: "Preparing children for formal learning through creative play",
      keywords: ["preschool", "preparation", "creative", "play", "imagination", "development"],
      content: "Our preschool program honors the developmental needs of young children through storytelling, creative play, and artistic activities."
    },
    {
      title: "Primary School (Kindergarten-Class 6)",
      url: "/primary-school",
      path: "internal-page.html#primary-school",
      description: "Building strong foundations in academics and character",
      keywords: ["primary", "elementary", "kindergarten", "class", "academics", "foundation"],
      content: "Primary school years focus on developing literacy, numeracy, and critical thinking skills through engaging, hands-on learning."
    },
    {
      title: "High School (Year 7-12)",
      url: "/high-school",
      path: "internal-page.html#high-school",
      description: "Preparing students for their future with comprehensive education",
      keywords: ["high", "secondary", "senior", "year", "university", "preparation", "graduation"],
      content: "Our high school program challenges students academically while supporting their personal growth and development."
    },
    {
      title: "Admissions",
      url: "/admissions",
      path: "internal-page.html#admissions",
      description: "Join our school community",
      keywords: ["admissions", "enrolment", "application", "join", "community", "process"],
      content: "Learn about our admissions process and how to become part of the Glenaeon community."
    },
    {
      title: "About Us",
      url: "/about",
      path: "internal-page.html#about",
      description: "Our history, philosophy, and community",
      keywords: ["about", "history", "philosophy", "community", "story", "mission", "values"],
      content: "Discover the history and philosophy behind Glenaeon Rudolf Steiner School."
    },
    {
      title: "News & Events",
      url: "/news",
      path: "internal-page.html#news",
      description: "Stay updated with school news and upcoming events",
      keywords: ["news", "events", "updates", "announcements", "calendar", "happenings"],
      content: "Keep up to date with the latest news, events, and announcements from our school community."
    },
    {
      title: "Contact Us",
      url: "/contact",
      path: "internal-page.html#contact",
      description: "Get in touch with our school",
      keywords: ["contact", "phone", "email", "address", "location", "touch"],
      content: "Find our contact information and location details to get in touch with us."
    },
    {
      title: "Wellbeing",
      url: "/wellbeing",
      path: "internal-page.html#wellbeing",
      description: "Supporting student mental health and wellbeing",
      keywords: ["wellbeing", "mental", "health", "support", "pastoral", "care"],
      content: "We prioritize student wellbeing through comprehensive pastoral care and support programs."
    },
    {
      title: "Student Stories",
      url: "/student-stories",
      path: "internal-page.html#student-stories",
      description: "Hear from our current and former students",
      keywords: ["student", "stories", "experiences", "testimonials", "graduates", "alumni"],
      content: "Read inspiring stories from our students about their learning journey and experiences at Glenaeon."
    },
    {
      title: "Outdoor Education",
      url: "/outdoor-education",
      path: "internal-page.html#outdoor-education",
      description: "Learning beyond the classroom",
      keywords: ["outdoor", "education", "nature", "adventure", "experiential", "learning"],
      content: "Our outdoor education program connects students with nature and provides hands-on learning experiences."
    },
    {
      title: "Sport",
      url: "/sport",
      path: "internal-page.html#sport",
      description: "Physical development and team building",
      keywords: ["sport", "physical", "education", "teams", "fitness", "health", "games"],
      content: "Our sports program promotes physical development, teamwork, and healthy competition."
    }
  ];

  // ===================================================================================
  // SEARCH FUNCTIONALITY
  // ===================================================================================
  
  function performSearch(query) {
    if (!query || query.trim().length < 2) {
      return [];
    }

    const searchTerm = query.trim().toLowerCase();
    const results = [];

    searchableContent.forEach(item => {
      let score = 0;
      let matchType = '';
      const targetUrl = item.path || item.url || 'index.html';

      // Check title match (highest priority)
      if (item.title.toLowerCase().includes(searchTerm)) {
        score += 100;
        matchType = 'title';
      }

      // Check keyword match (high priority)
      const keywordMatch = item.keywords.some(keyword => 
        keyword.toLowerCase().includes(searchTerm) || searchTerm.includes(keyword.toLowerCase())
      );
      if (keywordMatch) {
        score += 80;
        if (!matchType) matchType = 'keyword';
      }

      // Check description match (medium priority)
      if (item.description.toLowerCase().includes(searchTerm)) {
        score += 60;
        if (!matchType) matchType = 'description';
      }

      // Check content match (lower priority)
      if (item.content.toLowerCase().includes(searchTerm)) {
        score += 40;
        if (!matchType) matchType = 'content';
      }

      // Add partial matches for better UX
      const words = searchTerm.split(' ');
      words.forEach(word => {
        if (word.length > 2) {
          if (item.title.toLowerCase().includes(word)) score += 20;
          if (item.keywords.some(k => k.toLowerCase().includes(word))) score += 15;
          if (item.description.toLowerCase().includes(word)) score += 10;
        }
      });

      if (score > 0) {
        results.push({
          ...item,
          targetUrl,
          score,
          matchType,
          snippet: generateSnippet(item, searchTerm)
        });
      }
    });

    // Sort by score (highest first) and limit results
    return results.sort((a, b) => b.score - a.score).slice(0, 8);
  }

  function generateSnippet(item, searchTerm) {
    const text = item.content || item.description;
    const index = text.toLowerCase().indexOf(searchTerm.toLowerCase());
    
    if (index === -1) return item.description;
    
    const start = Math.max(0, index - 50);
    const end = Math.min(text.length, index + searchTerm.length + 50);
    let snippet = text.substring(start, end);
    
    if (start > 0) snippet = '...' + snippet;
    if (end < text.length) snippet = snippet + '...';
    
    // Highlight search term
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    snippet = snippet.replace(regex, '<mark>$1</mark>');
    
    return snippet;
  }

  // ===================================================================================
  // SEARCH UI COMPONENTS
  // ===================================================================================
  
  function createSearchModal() {
    const modal = document.createElement('div');
    modal.className = 'glenaeon-search-modal';
    modal.innerHTML = `
      <div class="search-modal-backdrop"></div>
      <div class="search-modal-content">
        <div class="search-hero-banner">
          <div class="search-hero-content">
            <h1 class="search-hero-title">Search Glenaeon</h1>
            <p class="search-hero-subtitle">Find information about our school, programs, and community</p>
            <div class="search-input-container">
              <div class="search-input-wrapper">
                <svg class="search-input-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M17.5 17.5L13.875 13.875M15.8333 9.16667C15.8333 12.8486 12.8486 15.8333 9.16667 15.8333C5.48477 15.8333 2.5 12.8486 2.5 9.16667C2.5 5.48477 5.48477 2.5 9.16667 2.5C12.8486 2.5 15.8333 5.48477 15.8333 9.16667Z" stroke="currentColor" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <input type="text" class="search-modal-input" placeholder="What are you looking for?" autocomplete="off">
              </div>
              <button class="search-modal-close" aria-label="Close search">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M15 5L5 15M5 5l10 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
        <div class="search-modal-body">
          <div class="search-suggestions-section">
            <h3>Popular Pages</h3>
            <div class="search-suggestions">
              <button type="button" class="btn-primary-blue" data-search="learning">Learning Programs</button>
              <button type="button" class="btn-primary-coral" data-search="admissions">Admissions</button>
              <button type="button" class="btn-primary-blue" data-search="early childhood">Early Childhood</button>
              <button type="button" class="btn-primary-coral" data-search="high school">High School</button>
              <button type="button" class="btn-primary-blue" data-search="contact">Contact Us</button>
            </div>
          </div>
          <div class="search-results" style="display: none;"></div>
          <div class="search-no-results" style="display: none;">
            <div class="no-results-content">
              <h3>No results found</h3>
              <p>Try searching with different keywords or explore these popular pages:</p>
            </div>
          </div>
        </div>
      </div>
    `;
    
    return modal;
  }

  function displayResults(results, container) {
    const modalBody = container.closest('.search-modal-body');
    const noResults = modalBody?.querySelector('.search-no-results');
    const suggestionsSection = modalBody?.querySelector('.search-suggestions-section');
    
    if (results.length === 0) {
      container.innerHTML = '';
      container.style.display = 'none';
      if (suggestionsSection) suggestionsSection.style.display = 'none';
      if (noResults) noResults.style.display = 'block';
      return;
    }

    // Hide suggestions and no results when we have actual results
    if (suggestionsSection) suggestionsSection.style.display = 'none';
    if (noResults) noResults.style.display = 'none';
    container.style.display = 'flex';
    
    container.innerHTML = results.map(result => `
      <div class="search-result-item" data-url="${result.targetUrl}">
        <h3 class="search-result-title">${result.title}</h3>
        <p class="search-result-snippet">${result.snippet}</p>
        <span class="search-result-url">${result.targetUrl}</span>
      </div>
    `).join('');
  }

  // ===================================================================================
  // EVENT HANDLERS AND INITIALIZATION
  // ===================================================================================
  
  function initializeSearch() {
    let searchModal;
    let searchInput;
    let resultsContainer;
    let debounceTimer;

    // Create and append search modal to document
    function createModal() {
      searchModal = createSearchModal();
      document.body.appendChild(searchModal);
      
      searchInput = searchModal.querySelector('.search-modal-input');
      resultsContainer = searchModal.querySelector('.search-results');
      
      // Event listeners for modal
      setupModalEventListeners();
    }

    function setupModalEventListeners() {
      // Close modal events
      const closeButton = searchModal.querySelector('.search-modal-close');
      const backdrop = searchModal.querySelector('.search-modal-backdrop');
      
      closeButton.addEventListener('click', closeModal);
      backdrop.addEventListener('click', closeModal);
      
      // ESC key to close
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && searchModal.classList.contains('active')) {
          closeModal();
        }
      });

      // Search input events
      searchInput.addEventListener('input', (e) => {
        const query = e.target.value.trim();
        const suggestionsSection = searchModal.querySelector('.search-suggestions-section');
        
        if (query.length === 0) {
          // Show suggestions when input is empty
          resultsContainer.style.display = 'none';
          resultsContainer.innerHTML = '';
          if (suggestionsSection) suggestionsSection.style.display = 'block';
        } else {
          // Search when user types
          clearTimeout(debounceTimer);
          debounceTimer = setTimeout(() => {
            const results = performSearch(query);
            displayResults(results, resultsContainer);
          }, 200);
        }
      });

      searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          const firstResult = resultsContainer.querySelector('.search-result-item');
          if (firstResult) {
            window.location.href = firstResult.dataset.url;
          }
        }
      });

      // Result click handlers
      resultsContainer.addEventListener('click', (e) => {
        const resultItem = e.target.closest('.search-result-item');
        if (resultItem) {
          window.location.href = resultItem.dataset.url;
        }
      });

      // Suggestion clicks
      const suggestions = searchModal.querySelectorAll('[data-search]');
      suggestions.forEach(btn => {
        btn.addEventListener('click', (e) => {
          const term = e.target.dataset.search;
          searchInput.value = term;
          const results = performSearch(term);
          displayResults(results, resultsContainer);
        });
      });
    }

    const modalTransitionDuration = 600;
    let currentSearchButton = null;

    function openModal(triggerElement = null) {
      // Check if mobile and prevent modal on mobile devices
      const isMobile = window.innerWidth <= 768 || 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      
      if (isMobile) {
        // On mobile, just return early and let the native search input work
        return;
      }
      
      if (!searchModal) createModal();
      currentSearchButton = triggerElement;
      
      if (!searchModal.classList.contains('active')) {
        searchModal.classList.add('active');
      }

      document.body.style.overflow = 'hidden';
      
      // GSAP Animation: Slide down from header
      if (typeof gsap !== 'undefined') {
        const content = searchModal.querySelector('.search-modal-content');
        const heroTitle = searchModal.querySelector('.search-hero-title');
        const heroSubtitle = searchModal.querySelector('.search-hero-subtitle');
        const inputContainer = searchModal.querySelector('.search-input-container');
        const suggestions = searchModal.querySelector('.search-suggestions-section');
        
        // Check if mobile
        const isMobile = window.innerWidth <= 768;
        const startY = isMobile ? -200 : -220;
        
        // Set initial states immediately to prevent flickering
        gsap.set(searchModal, { opacity: 0, visibility: 'visible' });
        gsap.set(content, { y: startY, opacity: 0, force3D: true });
        gsap.set([heroTitle, heroSubtitle, inputContainer], { y: 30, opacity: 0, force3D: true });
        gsap.set(suggestions, { y: 20, opacity: 0, force3D: true });
        
        // Create timeline with immediate start
        const tl = gsap.timeline();
        
        // Start animations immediately
        tl.to(searchModal, { opacity: 1, duration: 0.4, ease: "power2.out" }, 0)
          // Slide in the banner from header with smooth easing
          .to(content, { y: 0, opacity: 1, duration: 0.7, ease: "power3.out", force3D: true }, 0.1)
          // Animate content elements with smooth stagger
          .to(heroTitle, { y: 0, opacity: 1, duration: 0.5, ease: "power3.out", force3D: true }, 0.3)
          .to(heroSubtitle, { y: 0, opacity: 1, duration: 0.5, ease: "power3.out", force3D: true }, 0.4)
          .to(inputContainer, { y: 0, opacity: 1, duration: 0.5, ease: "power3.out", force3D: true }, 0.5)
          .to(suggestions, { y: 0, opacity: 1, duration: 0.5, ease: "power3.out", force3D: true }, 0.6)
          .call(() => {
            // Focus input after animation completes
            if (searchInput) {
              searchInput.focus();
            }
          });
      } else {
        // Fallback for when GSAP is not available
        requestAnimationFrame(() => {
          searchModal.classList.add('is-visible');
          setTimeout(() => searchInput?.focus(), 400);
        });
      }
    }

    function closeModal() {
      if (!searchModal || !searchModal.classList.contains('active')) return;

      // GSAP Animation: Slide up to header
      if (typeof gsap !== 'undefined') {
        const content = searchModal.querySelector('.search-modal-content');
        const suggestions = searchModal.querySelector('.search-suggestions-section');
        const resultsDiv = searchModal.querySelector('.search-results');
        
        // Check if mobile
        const isMobile = window.innerWidth <= 768;
        const endY = isMobile ? -200 : -220;
        
        // Create close timeline
        const tl = gsap.timeline({
          onComplete: () => {
            searchModal.classList.remove('active');
            document.body.style.overflow = '';
            if (searchInput) {
              searchInput.value = '';
            }
            if (resultsContainer) {
              resultsContainer.innerHTML = '';
              resultsContainer.style.display = 'none';
            }
            const noResults = searchModal.querySelector('.search-no-results');
            if (noResults) {
              noResults.style.display = 'none';
            }
            const suggestionsSection = searchModal.querySelector('.search-suggestions-section');
            if (suggestionsSection) {
              suggestionsSection.style.display = 'block';
            }
            currentSearchButton = null;
          }
        });
        
        // Animate content out and slide up smoothly
        tl.to([suggestions, resultsDiv], { y: -20, opacity: 0, duration: 0.2, ease: "power2.in", force3D: true }, 0)
          .to(content, { y: endY, opacity: 0, duration: 0.5, ease: "power3.in", force3D: true }, 0.1)
          .to(searchModal, { opacity: 0, duration: 0.3, ease: "power2.in" }, 0.3);
      } else {
        // Fallback
        searchModal.classList.remove('is-visible');
        setTimeout(() => {
          searchModal.classList.remove('active');
          document.body.style.overflow = '';
          if (searchInput) {
            searchInput.value = '';
          }
          if (resultsContainer) {
            resultsContainer.innerHTML = '';
          }
          currentSearchButton = null;
        }, modalTransitionDuration);
      }
    }

    // Initialize all search triggers
    function initializeSearchTriggers() {
      // Header search buttons (desktop only)
      const headerSearchButtons = document.querySelectorAll('.header-search');
      headerSearchButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          // Check if mobile before opening modal
          const isMobile = window.innerWidth <= 768 || 'ontouchstart' in window || navigator.maxTouchPoints > 0;
          if (!isMobile) {
            openModal(btn);
          }
        });
      });

      // Footer search inputs
      const footerSearchInputs = document.querySelectorAll('.mega-menu__footer .form-control');
      footerSearchInputs.forEach(input => {
        input.addEventListener('focus', () => {
          // Check if mobile before opening modal
          const isMobile = window.innerWidth <= 768 || 'ontouchstart' in window || navigator.maxTouchPoints > 0;
          if (!isMobile) {
            openModal(input);
          }
        });
        
        input.addEventListener('click', () => {
          // Check if mobile before opening modal
          const isMobile = window.innerWidth <= 768 || 'ontouchstart' in window || navigator.maxTouchPoints > 0;
          if (!isMobile) {
            openModal(input);
          }
        });
        
        // Also handle direct typing in footer input
        input.addEventListener('input', (e) => {
          const isMobile = window.innerWidth <= 768 || 'ontouchstart' in window || navigator.maxTouchPoints > 0;
          
          if (!isMobile) {
            // Desktop: Open modal and sync search
            if (!searchModal || !searchModal.classList.contains('active')) {
              openModal(input);
            }
            if (searchInput && e.target.value) {
              searchInput.value = e.target.value;
              const results = performSearch(e.target.value);
              displayResults(results, resultsContainer);
            }
          }
          // Mobile: Let the native search input work normally (no modal interference)
        });
      });
    }

    // Initialize when DOM is ready
    initializeSearchTriggers();
  }

  // ===================================================================================
  // CSS STYLES FOR SEARCH MODAL
  // ===================================================================================
  
  function addSearchStyles() {
    const styles = `
      .glenaeon-search-modal {
        position: fixed;
        inset: 0;
        z-index: 10000;
        display: flex;
        align-items: flex-start;
        justify-content: center;
        padding-top: 120px;
        background: rgba(15, 23, 42, 0.8);
        backdrop-filter: blur(8px);
        opacity: 0;
        visibility: hidden;
        pointer-events: none;
        transform: translateZ(0);
        will-change: opacity;
      }

      .glenaeon-search-modal.active {
        visibility: visible;
        pointer-events: auto;
      }

      .search-modal-backdrop {
        display: none;
      }

      .search-modal-content {
        position: relative;
        width: min(900px, 100%);
        max-height: 90vh;
        background: #183153;
        border-radius: 16px;
        box-shadow: 
          0 25px 50px rgba(24, 49, 83, 0.25),
          0 10px 30px rgba(24, 49, 83, 0.15);
        overflow: hidden;
        transform: translateZ(0);
        will-change: transform, opacity;
      }

      .search-hero-banner {
        background: #183153;
        padding: 3rem 2rem 2rem;
        text-align: center;
        position: relative;
        overflow: hidden;
        border-radius: 16px 16px 0 0;
      }

      .search-hero-content {
        position: relative;
        z-index: 1;
      }

      .search-hero-title {
        margin: 0 0 0.5rem 0;
        font-size: 2.5rem;
        font-weight: 700;
        color: #ffffff;
        letter-spacing: -0.02em;
      }

      .search-hero-subtitle {
        margin: 0 0 2rem 0;
        font-size: 1.1rem;
        color: rgba(255, 255, 255, 0.8);
        font-weight: 400;
        line-height: 1.5;
      }

      .search-input-container {
        display: flex;
        align-items: center;
        gap: 1rem;
        max-width: 600px;
        margin: 0 auto;
      }

      .search-input-wrapper {
        flex: 1;
        position: relative;
        display: flex;
        align-items: center;
        background: rgba(255, 255, 255, 0.95);
        border-radius: 16px;
        padding: 0 1.5rem;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.2);
        transition: all 0.3s ease;
      }

      .search-input-wrapper:focus-within {
        background: #ffffff;
        box-shadow: 
          0 0 0 3px rgba(219, 87, 78, 0.15),
          0 8px 32px rgba(24, 49, 83, 0.12);
        border-color: rgba(219, 87, 78, 0.3);
      }

      .search-input-icon {
        color: #64748b;
        margin-right: 1rem;
        flex-shrink: 0;
      }

      .search-modal-input {
        flex: 1;
        height: 3.5rem;
        border: none;
        background: transparent;
        font-size: 1.1rem;
        color: #1e293b;
        font-weight: 400;
        outline: none;
      }

      .search-modal-input::placeholder {
        color: #64748b;
        font-weight: 400;
      }

      .search-modal-close {
        width: 3rem;
        height: 3rem;
        border-radius: 12px;
        border: 1px solid rgba(255, 255, 255, 0.2);
        background: rgba(255, 255, 255, 0.1);
        color: rgba(255, 255, 255, 0.9);
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        backdrop-filter: blur(10px);
        transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      }

      .search-modal-close:hover {
        background: rgba(255, 255, 255, 0.2);
        color: #ffffff;
        border-color: rgba(255, 255, 255, 0.3);
        transform: scale(1.05);
      }

      .search-modal-body {
        max-height: 60vh;
        overflow-y: auto;
        padding: 2rem;
        background: #fff;
        border-radius: 0 0 16px 16px;
      }

      .search-suggestions-section {
        margin-bottom: 1rem;
      }

      .search-suggestions-section h3 {
        margin: 0 0 1.5rem 0;
        font-size: 1.25rem;
        font-weight: 600;
        color: #1e293b;
        text-align: center;
      }

      .search-results {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .search-result-item {
        padding: 1.5rem;
        border-radius: 16px;
        border: 1px solid #e2e8f0;
        background: #ffffff;
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        position: relative;
        overflow: hidden;
      }

      .search-result-item:hover {
        border-color: #db574e;
        background: #f8fafc;
        box-shadow: 
          0 8px 24px rgba(219, 87, 78, 0.12),
          0 4px 12px rgba(219, 87, 78, 0.08);
        transform: translateY(-2px);
      }

      .search-result-title {
        margin: 0 0 0.5rem 0;
        font-size: 1.2rem;
        font-weight: 600;
        color: #1e293b;
        position: relative;
        z-index: 1;
      }

      .search-result-snippet {
        margin: 0 0 0.75rem 0;
        font-size: 1rem;
        color: #64748b;
        line-height: 1.6;
        position: relative;
        z-index: 1;
      }

      .search-result-snippet mark {
        background: rgba(219, 87, 78, 0.1);
        color: #183153;
        padding: 0.1rem 0.3rem;
        border-radius: 6px;
        font-weight: 500;
      }

      .search-result-url {
        font-size: 0.9rem;
        color: #94a3b8;
        letter-spacing: 0.025em;
        position: relative;
        z-index: 1;
      }

      .search-no-results {
        text-align: center;
        padding: 3rem 1rem;
      }

      .no-results-content h3 {
        margin: 0 0 1rem 0;
        font-size: 1.5rem;
        font-weight: 600;
        color: #1e293b;
      }

      .no-results-content p {
        margin: 0 0 2rem 0;
        font-size: 1rem;
        color: #64748b;
        line-height: 1.5;
      }

      .search-suggestions {
        display: flex;
        flex-wrap: wrap;
        gap: 0.75rem;
        justify-content: center;
      }

      .search-suggestions .btn-primary-blue,
      .search-suggestions .btn-primary-coral {
        padding: 0.75rem 1.5rem;
        border-radius: 12px;
        cursor: pointer;
        font-size: 0.95rem;
        font-weight: 500;
        transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        border: none;
        text-decoration: none;
      }

      .search-suggestions .btn-primary-blue:hover,
      .search-suggestions .btn-primary-coral:hover {
        transform: translateY(-1px);
      }

      .search-modal-body::-webkit-scrollbar {
        width: 8px;
      }

      .search-modal-body::-webkit-scrollbar-thumb {
        background: rgba(148, 163, 184, 0.3);
        border-radius: 4px;
      }

      .search-modal-body::-webkit-scrollbar-thumb:hover {
        background: rgba(148, 163, 184, 0.5);
      }

      @media (max-width: 768px) {
        .glenaeon-search-modal {
          display: none !important;
          visibility: hidden !important;
        }

        .search-modal-content {
          border-radius: 16px;
          width: 100%;
          max-height: 90vh;
        }

        .search-hero-banner {
          padding: 2rem 1.5rem 1.5rem;
        }

        .search-hero-title {
          font-size: 2rem;
        }

        .search-hero-subtitle {
          font-size: 1rem;
          margin-bottom: 1.5rem;
        }

        .search-input-container {
          flex-direction: column;
          gap: 1rem;
        }

        .search-input-wrapper {
          width: 100%;
        }

        .search-modal-input {
          height: 3.25rem;
          font-size: 1rem;
        }

        .search-modal-close {
          width: 100%;
          height: 3rem;
        }

        .search-modal-body {
          max-height: calc(90vh - 200px);
          padding: 1.5rem;
        }

        .search-result-item {
          padding: 1.25rem;
          border-radius: 12px;
        }

        .search-result-title {
          font-size: 1.1rem;
        }

        .search-result-snippet {
          font-size: 0.95rem;
        }

        .search-suggestions {
          gap: 0.5rem;
        }

        .search-suggestions .btn-primary-blue,
        .search-suggestions .btn-primary-coral {
          padding: 0.75rem 1.25rem;
          font-size: 0.9rem;
        }
      }

      @media (max-width: 480px) {
        .search-hero-title {
          font-size: 1.75rem;
        }

        .search-hero-subtitle {
          font-size: 0.95rem;
        }

        .search-modal-body {
          padding: 1rem;
        }
      }
    `;

    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
  }

  // ===================================================================================
  // INITIALIZE ON DOM READY
  // ===================================================================================
  
  document.addEventListener('DOMContentLoaded', function() {
    addSearchStyles();
    initializeSearch();
  });

})();

// ===================================================================================
// END OF GLENAEON WEBSITE SEARCH FUNCTIONALITY
// ===================================================================================
