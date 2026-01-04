// ===================================================================================
// VIDEO POPUP FUNCTIONALITY
// ===================================================================================
// This script handles the video popup modal for the hero section video button
// ===================================================================================

(function() {
  'use strict';

  // Video configuration - update with your actual video URL
  const VIDEO_CONFIG = {
    url: 'assets/videos/3.mp4', // Local video file
    title: 'Glenaeon School - See the magic in action'
  };

  function createVideoModal() {
    const modal = document.createElement('div');
    modal.className = 'elegant-video-modal';
    modal.innerHTML = `
      <div class="video-modal-wrapper">
        <button class="glass-close-btn" aria-label="Close video">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
        <div class="glass-video-container">
          <video 
            controls 
            autoplay
            preload="metadata"
            width="100%" 
            height="100%"
            style="outline: none;">
            <source src="" type="video/mp4">
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    `;
    
    return modal;
  }

  function addVideoModalStyles() {
    const styles = `
      .elegant-video-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.6);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        opacity: 0;
        visibility: hidden;
      }

      .elegant-video-modal.active {
        opacity: 1;
        visibility: visible;
      }


      .video-modal-wrapper {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        max-width: 95vw;
        max-height: 95vh;
      }


      .glass-close-btn {
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 50%;
        width: 50px;
        height: 50px;
        color: rgba(255, 255, 255, 0.9);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 20px;
        box-shadow: 
          0 8px 32px rgba(0, 0, 0, 0.3),
          inset 0 1px 0 rgba(255, 255, 255, 0.2);
        z-index: 10001;
      }

      .glass-close-btn:hover {
        background: rgba(255, 255, 255, 0.2);
        border-color: rgba(255, 255, 255, 0.4);
        color: #ffffff;
        transform: scale(1.1);
        box-shadow: 
          0 12px 40px rgba(0, 0, 0, 0.4),
          inset 0 1px 0 rgba(255, 255, 255, 0.3);
      }

      .glass-video-container {
        background: transparent;
        backdrop-filter: none;
        -webkit-backdrop-filter: none;
        border: 1px solid black;
        border-radius: 10px;
        padding: 0;
        max-width: 90vw;
        max-height: 80vh;
        width: 900px;
        position: relative;
        overflow: hidden;
      }


      .glass-video-container video {
        width: 100%;
        height: 100%;
        border-radius: 10px;
        display: block;
        background: transparent;
        object-fit: contain;
      }

      

      /* Ensure video controls are visible */
      .glass-video-container video {
        background: transparent;
      }
      
      .glass-video-container video::-webkit-media-controls-panel {
        background: rgba(255, 255, 255, 0.1);
      }

      @media (max-width: 768px) {
        .glass-video-container {
          width: 95vw;
          max-height: 70vh;
          border-radius: 10px;
          padding: 0;
        }
        
        .glass-video-container video {
          border-radius: 10px;
        }
        
        .glass-close-btn {
          width: 45px;
          height: 45px;
          margin-bottom: 15px;
        }
      }

      @media (max-width: 480px) {
        .glass-video-container {
          width: 98vw;
          max-height: 60vh;
          border-radius: 10px;
          padding: 0;
        }
        
        .glass-video-container video {
          border-radius: 10px;
        }
        
        .glass-close-btn {
          width: 40px;
          height: 40px;
          margin-bottom: 12px;
        }
      }
    `;

    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
  }

  function initVideoPopup() {
    let videoModal;
    let video;

    function createModal() {
      videoModal = createVideoModal();
      document.body.appendChild(videoModal);
      video = videoModal.querySelector('video');
      setupEventListeners();
    }

    function setupEventListeners() {
      const closeButton = videoModal.querySelector('.glass-close-btn');
      
      closeButton.addEventListener('click', closeVideo);
      
      // Click outside video container to close
      videoModal.addEventListener('click', (e) => {
        if (e.target === videoModal) {
          closeVideo();
        }
      });
      
      // ESC key to close
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && videoModal.classList.contains('active')) {
          closeVideo();
        }
      });
    }

    function openVideo() {
      if (!videoModal) createModal();
      
      // Set video source and load
      const source = video.querySelector('source');
      if (source) {
        source.src = VIDEO_CONFIG.url;
        video.load();
        console.log('Video source set to:', VIDEO_CONFIG.url);
        
        // Add error handling
        video.addEventListener('error', (e) => {
          console.error('Video error:', e);
          console.error('Video error details:', video.error);
        });
        
        video.addEventListener('loadeddata', () => {
          console.log('Video loaded successfully');
          // Autoplay video when loaded
          video.play().catch(e => console.warn('Autoplay prevented:', e));
        });
      }
      
      // Ensure video shows controls
      video.controls = true;
      video.setAttribute('controls', 'controls');
      video.style.display = 'block';
      
      // GSAP smooth animations
      if (typeof gsap !== 'undefined') {
        const wrapper = videoModal.querySelector('.video-modal-wrapper');
        const closeBtn = videoModal.querySelector('.glass-close-btn');
        const videoContainer = videoModal.querySelector('.glass-video-container');
        
        // Set initial states BEFORE adding active class to prevent flickering
        gsap.set(videoModal, { opacity: 0 });
        gsap.set(wrapper, { scale: 0.7, y: 50, opacity: 0 });
        gsap.set(closeBtn, { scale: 0, opacity: 0 });
        gsap.set(videoContainer, { scale: 0.8, y: 30, opacity: 0 });
        
        // Now add the active class and set overflow
        videoModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Animate in with stagger
        const tl = gsap.timeline();
        tl.to(videoModal, { opacity: 1, duration: 0.4, ease: "power2.out" }, 0)
          .to(wrapper, { scale: 1, y: 0, opacity: 1, duration: 0.6, ease: "back.out(1.2)" }, 0.1)
          .to(closeBtn, { scale: 1, rotation: 0, opacity: 1, duration: 0.4, ease: "back.out(1.5)" }, 0.3)
          .to(videoContainer, { scale: 1, y: 0, opacity: 1, duration: 0.5, ease: "power3.out" }, 0.4);
      } else {
        // Fallback: add active class for non-GSAP users
        videoModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    }

    function closeVideo() {
      if (!videoModal || !videoModal.classList.contains('active')) return;
      
      // GSAP smooth close animations
      if (typeof gsap !== 'undefined') {
        const wrapper = videoModal.querySelector('.video-modal-wrapper');
        const closeBtn = videoModal.querySelector('.glass-close-btn');
        const videoContainer = videoModal.querySelector('.glass-video-container');
        
        const tl = gsap.timeline({
          onComplete: () => {
            videoModal.classList.remove('active');
            document.body.style.overflow = '';
            // Stop and reset video
            video.pause();
            video.currentTime = 0;
          }
        });
        
        // Animate out with reverse stagger
        tl.to(closeBtn, { scale: 0, rotation: 180, opacity: 0, duration: 0.3, ease: "back.in(1.5)" }, 0)
          .to(videoContainer, { scale: 0.8, y: 30, opacity: 0, duration: 0.4, ease: "power3.in" }, 0.1)
          .to(wrapper, { scale: 0.7, y: -30, opacity: 0, duration: 0.4, ease: "back.in(1.2)" }, 0.2)
          .to(videoModal, { opacity: 0, duration: 0.3, ease: "power2.in" }, 0.3);
      } else {
        // Fallback without GSAP
        videoModal.classList.remove('active');
        document.body.style.overflow = '';
        video.pause();
        video.currentTime = 0;
      }
    }

    // Initialize video button click handler
    function initVideoButton() {
      // Handle both mobile video button and desktop play button
      const videoButtons = document.querySelectorAll('.hero__video-btn, .play-button');
      videoButtons.forEach(button => {
        button.addEventListener('click', (e) => {
          e.preventDefault();
          openVideo();
        });
      });
    }

    // Initialize when DOM is ready
    initVideoButton();
  }

  // Initialize everything
  document.addEventListener('DOMContentLoaded', function() {
    addVideoModalStyles();
    initVideoPopup();
  });

})();