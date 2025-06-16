// Obfuscate your API key
const API_KEY = 'AIzaSyDYPsGTQS5KnpWWzJLpU2ETxs4KN9UPYeI';

// Function to fetch a single post
async function fetchPost(blogId, postId) {
    const response = await fetch(`https://www.googleapis.com/blogger/v3/blogs/${blogId}/posts/${postId}?key=${API_KEY}`);
    const post = await response.json();
    return post;
}

// Function to display a single post
function displayPost(post) {
    const postContainer = document.getElementById('content');
    const postTitle = document.getElementById('blogTitle');
    postContainer.innerHTML = `${post.content}`;
    postTitle.innerText = `${post.title}`;
}

// Main function to handle the logic
async function main() {
    const BlogId = '884789198213275419';
    const urlParamsB = new URLSearchParams(window.location.search);
    const singleBlogId = urlParamsB.get('postId');

    if (singleBlogId) {
        const post = await fetchPost(BlogId, singleBlogId);
        displayPost(post);
    } else {
        const posts = await fetchPosts(BlogId);
        displayBPosts(posts);
    }


    const article = document.getElementById('article-content');
    const sections = [...article.querySelectorAll('.section')];
    const sideNav = document.getElementById('side-nav');
    const scrollProgress = document.getElementById('scroll-progress');

    // Generate side nav links dynamically for desktop/tablet
    function createNavLinks() {
      sideNav.innerHTML = '<h3 class="text-lg font-semibold text-orange-700 mb-2 select-none">Sections</h3>';
      sections.forEach((section) => {
        const link = document.createElement('a');
        link.href = `#${section.id}`;
        link.textContent = section.querySelector('h2')?.textContent || 'Section';
        link.className = 'cursor-pointer hover:text-orange-500 transition';
        link.setAttribute('data-section-id', section.id);
        link.addEventListener('click', e => {
          e.preventDefault();
          section.scrollIntoView({ behavior: 'smooth', block: 'start' });
          // Focus section for accessibility
          section.focus();
        });
        sideNav.appendChild(link);
      });
    }

    // Small screen - floating bottom nav bar
    function createFloatingNav() {
        // sideNav.classList.add = hidden;
      // Only create if not exists
      if(document.getElementById('floating-nav')) return;
      const floatingNav = document.createElement('nav');
      floatingNav.id = 'side-nav';
      // Tailwind classes for mobile floating nav
      floatingNav.className = 'flex md:hidden fixed bottom-0 left-1/2 transform -translate-x-1/2 bg-white bg-opacity-95 border-t border-gray-200 shadow-lg rounded-t-xl gap-6 p-3 overflow-x-auto z-40 w-full';
      floatingNav.setAttribute('aria-label', 'Article section navigation');
      sections.forEach(section => {
        const link = document.createElement('a');
        link.href = `#${section.id}`;
        link.textContent = section.querySelector('h2')?.textContent || 'Section';
        link.className = 'whitespace-nowrap text-sm text-gray-700 hover:text-orange-500 focus:text-orange-700 focus:outline-none';
        link.setAttribute('data-section-id', section.id);
        link.addEventListener('click', e => {
          e.preventDefault();
          section.scrollIntoView({ behavior: 'smooth', block: 'start' });
          // Focus section for accessibility
          section.focus();
        });
        floatingNav.appendChild(link);
      });
      document.body.appendChild(floatingNav);
    }

    // Update scroll progress bar
    function updateScrollProgress() {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = (scrollTop / docHeight) * 100;
      scrollProgress.style.width = `${scrolled}%`;
    }

    // Highlight active section in nav and handle section heading highlighting
    function highlightActiveSection() {
      let fromTop = window.scrollY + window.innerHeight / 5;
      let currentSection = sections[0];

      for (const section of sections) {
        if (section.offsetTop <= fromTop) {
          currentSection = section;
        }
      }

      // Highlight links
      updateNavHighlight(currentSection.id);

      // Focus management not needed here to avoid excessive focus shifts
    }

    // Updates the nav links to highlight the active section
    function updateNavHighlight(activeId) {
      const navLinks = document.querySelectorAll('#side-nav a[data-section-id]');
      navLinks.forEach(link => {
        if (link.getAttribute('data-section-id') === activeId) {
          link.setAttribute('data-active', 'true');
        } else {
          link.removeAttribute('data-active');
        }
      });
    }

    // Font size adjustment logic
    let currentFontSize = 18; // base font size in px
    const minFontSize = 14;
    const maxFontSize = 28;
    const fontStep = 2;

    const articleEl = document.getElementById('article-content');
    const btnIncrease = document.getElementById('font-increase');
    const btnDecrease = document.getElementById('font-decrease');
    const btnReset = document.getElementById('font-reset');

    function updateFontSize(size) {
      currentFontSize = size;
      if (currentFontSize < minFontSize) currentFontSize = minFontSize;
      if (currentFontSize > maxFontSize) currentFontSize = maxFontSize;
      articleEl.style.fontSize = `${currentFontSize}px`;
    }

    btnIncrease.addEventListener('click', () => {
      updateFontSize(currentFontSize + fontStep);
    });

    btnDecrease.addEventListener('click', () => {
      updateFontSize(currentFontSize - fontStep);
    });

    btnReset.addEventListener('click', () => {
      updateFontSize(18);
    });

    // Text to Speech (TTS) implementation
    const ttsPlay = document.getElementById('tts-play');
    const ttsPause = document.getElementById('tts-pause');
    const ttsStop = document.getElementById('tts-stop');

    let utterance = null;
    let speechSynthesis = window.speechSynthesis;
    let readingIndex = 0;
    let paragraphs = [];

    function highlightParagraph(idx) {
      paragraphs.forEach((p, i) => {
        if (i === idx) {
          p.classList.add('tts-highlight');
          // Scroll to keep in view
          p.scrollIntoView({behavior: 'smooth', block: 'center'});
        } else {
          p.classList.remove('tts-highlight');
        }
      });
    }
    function clearHighlight() {
      paragraphs.forEach(p => p.classList.remove('tts-highlight'));
    }

    function speakParagraph(idx) {
      if (!paragraphs[idx]) {
        stopTTS();
        return;
      }
      const text = paragraphs[idx].textContent.trim();
      if (!text) {
        readingIndex++;
        speakParagraph(readingIndex);
        return;
      }
      utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 1; // normal speed
      utterance.onstart = () => {
        highlightParagraph(idx);
      };
      utterance.onend = () => {
        readingIndex++;
        if (readingIndex < paragraphs.length) {
          speakParagraph(readingIndex);
        } else {
          stopTTS();
        }
      };
      utterance.onerror = e => {
        console.error('Speech synthesis error:', e);
        stopTTS();
      };
      speechSynthesis.speak(utterance);
    }

    function stopTTS() {
      speechSynthesis.cancel();
      readingIndex = 0;
      clearHighlight();
      ttsPlay.classList.remove('hidden');
      ttsPause.classList.add('hidden');
    }

    function pauseTTS() {
      if (speechSynthesis.speaking && !speechSynthesis.paused) {
        speechSynthesis.pause();
        ttsPlay.classList.remove('hidden');
        ttsPause.classList.add('hidden');
      }
    }

    function resumeTTS() {
      if (speechSynthesis.paused) {
        speechSynthesis.resume();
        ttsPlay.classList.add('hidden');
        ttsPause.classList.remove('hidden');
      }
    }

    ttsPlay.addEventListener('click', () => {
      if (speechSynthesis.paused) {
        resumeTTS();
        return;
      }
      paragraphs = [...article.querySelectorAll('p')];
      if(paragraphs.length === 0) return;
      readingIndex = 0;
      speakParagraph(readingIndex);
      ttsPlay.classList.add('hidden');
      ttsPause.classList.remove('hidden');
    });
    ttsPause.addEventListener('click', () => {
      pauseTTS();
    });

    ttsStop.addEventListener('click', () => {
      stopTTS();
    });

    // Detect touch or narrow screen to toggle nav mode
    function handleResponsiveNav() {
      if(window.innerWidth < 768) {
        sideNav.classList.add('hidden');
        createFloatingNav();
      } else {
        sideNav.classList.remove('hidden');
        const floating = document.getElementById('side-nav');
        if(floating && floating !== sideNav) {
          floating.remove();
        }
      }
    }

    // Initial setup
    createNavLinks();
    handleResponsiveNav();
    updateScrollProgress();
    highlightActiveSection();

    window.addEventListener('scroll', () => {
      updateScrollProgress();
      highlightActiveSection();
    });

    window.addEventListener('resize', () => {
      handleResponsiveNav();
    });
}



// Call the main function on page load
window.onload = main;
