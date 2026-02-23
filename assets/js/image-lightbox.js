(function () {
  function createLightbox() {
    var existing = document.querySelector('.image-lightbox');
    if (existing) return existing;

    var overlay = document.createElement('div');
    overlay.className = 'image-lightbox';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Expanded image');

    var img = document.createElement('img');
    img.alt = '';

    var close = document.createElement('button');
    close.type = 'button';
    close.className = 'image-lightbox-close';
    close.setAttribute('aria-label', 'Close image');
    close.textContent = '×';

    overlay.appendChild(img);
    overlay.appendChild(close);
    document.body.appendChild(overlay);

    function closeLightbox() {
      overlay.classList.remove('is-open');
      document.body.classList.remove('image-lightbox-open');
      img.removeAttribute('src');
    }

    close.addEventListener('click', closeLightbox);
    overlay.addEventListener('click', function (event) {
      if (event.target === overlay) closeLightbox();
    });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && overlay.classList.contains('is-open')) {
        closeLightbox();
      }
    });

    overlay.openWith = function (targetImg) {
      img.src = targetImg.currentSrc || targetImg.src;
      img.alt = targetImg.alt || '';
      overlay.classList.add('is-open');
      document.body.classList.add('image-lightbox-open');
    };

    return overlay;
  }

  function isEligibleImage(img) {
    if (!img || !img.src) return false;
    if (!img.classList.contains('lightbox-enabled')) return false;
    if (img.closest('.navbar, .social-icons, .avatar, .mathjax-loader')) return false;
    if (img.closest('.inline-figure-expression')) return false;
    if (img.classList.contains('no-lightbox')) return false;
    return !!img.closest('.post-content, .gallery-item-content, .wrapper section, main');
  }

  function attachZoomButton(img, lightbox) {
    if (!isEligibleImage(img)) return;

    var parent = img.parentElement;
    var anchor;
    if (parent && parent.tagName === 'A' && parent.children.length === 1) {
      anchor = parent;
      anchor.classList.add('image-zoom-anchor');
    } else if (parent && parent.classList.contains('image-zoom-anchor')) {
      anchor = parent;
    } else {
      anchor = document.createElement('span');
      anchor.className = 'image-zoom-anchor';
      img.parentNode.insertBefore(anchor, img);
      anchor.appendChild(img);
    }

    anchor.classList.remove('image-zoom-anchor-float-left', 'image-zoom-anchor-float-right');
    if (img.classList.contains('float-left')) {
      anchor.classList.add('image-zoom-anchor-float-left');
    } else if (img.classList.contains('float-right')) {
      anchor.classList.add('image-zoom-anchor-float-right');
    }

    if (anchor.querySelector('.image-zoom-btn')) return;

    var button = document.createElement('button');
    button.type = 'button';
    button.className = 'image-zoom-btn';
    button.setAttribute('aria-label', 'Expand image');
    button.title = 'Expand image';
    button.innerHTML =
      '<svg viewBox="0 0 24 24" aria-hidden="true">' +
      '<circle cx="11" cy="11" r="6"></circle>' +
      '<line x1="16" y1="16" x2="21" y2="21"></line>' +
      '</svg>';

    button.addEventListener('click', function (event) {
      event.preventDefault();
      event.stopPropagation();
      lightbox.openWith(img);
    });

    anchor.appendChild(button);
  }

  document.addEventListener('DOMContentLoaded', function () {
    var lightbox = createLightbox();
    var images = document.querySelectorAll('img');
    Array.prototype.forEach.call(images, function (img) {
      attachZoomButton(img, lightbox);
    });
  });
})();
