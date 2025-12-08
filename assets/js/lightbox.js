/**
 * Simple Lightbox for Hugo Markdown Images
 * Only targets images rendered from standard Markdown ![alt](image) syntax
 */

class SimpleLightbox {
  constructor() {
    this.isOpen = false;
    this.currentImage = null;
    this.overlay = null;
    this.init();
  }

  init() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setupLightbox());
    } else {
      this.setupLightbox();
    }
  }

  setupLightbox() {
    // Create lightbox overlay (hidden by default)
    this.createOverlay();
    
    // Target images from standard Markdown ![alt](image) syntax
    // These can be in paragraphs OR list items depending on context
    const markdownImages = document.querySelectorAll('.content p > img, .content li > img');
    
    markdownImages.forEach((img, index) => {
      // Verify this is a standard markdown image (has src and alt)
      if (img.src && img.hasAttribute('alt')) {
        img.style.cursor = 'pointer';
        img.addEventListener('click', (e) => this.openLightbox(e.target));
        
        // Add a subtle visual indicator that the image is clickable
        img.title = `Click to view ${img.alt} in full size`;
      }
    });
  }

  createOverlay() {
    this.overlay = document.createElement('div');
    this.overlay.className = 'lightbox-overlay';
    this.overlay.innerHTML = `
      <div class="lightbox-content">
        <img class="lightbox-image" src="" alt="">
        <button class="lightbox-close" aria-label="Close lightbox">&times;</button>
      </div>
    `;
    
    document.body.appendChild(this.overlay);

    // Event listeners
    this.overlay.addEventListener('click', (e) => {
      if (e.target === this.overlay || e.target.classList.contains('lightbox-close')) {
        this.closeLightbox();
      }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (this.isOpen && e.key === 'Escape') {
        this.closeLightbox();
      }
    });
  }

  openLightbox(img) {
    const lightboxImg = this.overlay.querySelector('.lightbox-image');
    
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    
    this.overlay.classList.add('active');
    document.body.classList.add('lightbox-open');
    this.isOpen = true;
    this.currentImage = img;

    // Focus management for accessibility
    this.overlay.focus();
  }

  closeLightbox() {
    this.overlay.classList.remove('active');
    document.body.classList.remove('lightbox-open');
    this.isOpen = false;
    this.currentImage = null;

    // Return focus to the original image
    if (this.currentImage) {
      this.currentImage.focus();
    }
  }
}

// Initialize lightbox when script loads
new SimpleLightbox();
