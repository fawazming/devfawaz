// This script dynamically handles the portfolio modal functionality
//   (() => {
 async function mian() {
    console.log('Dynamic Portfolio Modal Script Loaded');
    const pictureItems = document.querySelectorAll('.picture-item');
    const modal = document.getElementById('portfolio-modal');
    const modalTitleElem = modal.querySelector('.modal-title');
    const modalBodyParagraph = modal.querySelector('.modal-body p');
    const closeBtn = modal.querySelector('#closePortfolioModal');

    // Save last focused element for accessibility
    let lastFocusedElement = null;

    // Function to open modal with dynamic content
    function openModal(title, description) {
      lastFocusedElement = document.activeElement;
      modalTitleElem.textContent = title;
      modalBodyParagraph.innerHTML = description;
      modal.classList.remove('hidden');
      modal.setAttribute('tabindex', '0');
      modal.focus();
      document.body.style.overflow = 'hidden';

      // Add event listener for Escape key
      window.addEventListener('keydown', handleEscape);
      // Add event listener for clicking outside modal content
      modal.addEventListener('click', handleOverlayClick);
    }

    // Function to close modal and restore state
    function closeModal() {
      modal.classList.add('hidden');
      modal.removeAttribute('tabindex');
      document.body.style.overflow = '';
      if (lastFocusedElement) {
        lastFocusedElement.focus();
      }
      window.removeEventListener('keydown', handleEscape);
      modal.removeEventListener('click', handleOverlayClick);
    }

    // Close modal on Escape key
    function handleEscape(event) {
      if (event.key === 'Escape') {
        closeModal();
      }
    }

    // Close modal on overlay click (outside modal content)
    function handleOverlayClick(event) {
      if (event.target === modal) {
        closeModal();
      }
    }

    // Add click listeners on all portfolio items
    pictureItems.forEach(item => {
      item.addEventListener('click', () => {
        console.log('Picture item clicked:', item);
        const title = item.getAttribute('data-title') || 'No Title';
        const description = item.getAttribute('data-description') || 'No Description';
        openModal(title, description);
      });

      // Also support keyboard "Enter" and "Space" key to open modal for accessibility
      item.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const title = item.getAttribute('data-title') || 'No Title';
          const description = item.getAttribute('data-description') || 'No Description';
          openModal(title, description);
        }
      });
    });

    // Close button listener
    closeBtn.addEventListener('click', closeModal);
  };

  window.onload = mian;