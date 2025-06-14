// Obfuscate your API key
const API_KEY = 'AIzaSyBzYC473sbzrK4QQG3zcRp_kPl_moqvEdo';

// Function to fetch all posts
async function fetchPosts(blogId) {
    const response = await fetch(`https://www.googleapis.com/blogger/v3/blogs/${blogId}/posts?key=${API_KEY}`);
    const data = await response.json();
    return data.items;
}

// Function to display posts in a list
function displayPPosts(posts) {
    const postList = document.getElementById('galwrap');
    posts.forEach(post => {
        const imgRegex = /<img[^>]*src="([^">]+)"/;
        const urlRegex = /<a[^>]*href="([^">]+)"/;

        const match = post.content.match(imgRegex);
        const umatch = post.content.match(urlRegex);
        let firstImageUrl = '';
        let firstUrl = umatch ? umatch[1] : '';
        if (match) {
            firstImageUrl = match[1];
        }
        const listItem = document.createElement('div');
        listItem.classList.add('mix', 'portfolio', 'picture-item');
        listItem.setAttribute('data-target', 'p' + post.id);
        listItem.setAttribute('data-title', post.title);
        listItem.setAttribute('data-image', firstImageUrl);
        listItem.setAttribute('data-description', post.content);
        listItem.innerHTML = `
                    <div class="portfolio-img truncate rounded-2xl relative">
                        <img src="${firstImageUrl}" alt="design"
                            class="w-full transform hover:bg-blue-600 transition duration-500 hover:-rotate-12 hover:scale-125">
                        <h3 class="top-contain absolute top-[15px] right-[15px]">
                            <span
                                class="bg-black rounded-full font-normal text-white text-[12px] px-2 py-1">Portfolio</span>
                        </h3>
                        <div class="bottom-contain absolute bottom-4 left-4 right-4">
                            <div
                                class="overlay-info px-4 py-2 bg-black bg-opacity-60 rounded-xl grid grid-cols-2 gap-[30px] place-content-between">
                                <a href="#" class="text-white text-sm flex items-center">${post.title}</a>
                                <a href="${firstImageUrl}" data-fancybox="gallery"
                                    class="text-white text-sm grid justify-items-end">
                                    <p class="hidden" data-description="">.</p>
                                    <span
                                        class="bg-[#ed7d31] h-8 w-8 flex justify-center items-center rounded-md">
                                        <i class="fa fa-arrow-right"></i>
                                    </span>
                                </a>
                            </div>
                        </div>
                    </div>`;
        postList.appendChild(listItem);
    });
}

// Function to display posts in a list
// function displayBPosts(posts) {
//     const postList = document.getElementById('blogwrap');
//     posts.forEach(post => {
//         const imgRegex = /<img[^>]*src="([^">]+)"/;
//         const match = post.content.match(imgRegex);
//         let firstImageUrl = match ? match[1] : '';

//         const listItem = document.createElement('div');
//         listItem.classList.add('col-xxl-4', 'col-xl-4', 'col-lg-4', 'col-md-4')
//         listItem.innerHTML = `
//                     <a class="text-uppercase text-dark" href="blog/?postId=${post.id}">
//                     <div class="blog-box">
//                         <div class="blog-images">
//                             <img src="${firstImageUrl ? firstImageUrl : 'images/blog/13.jpg'}" class="img-fluid rounded" alt="blog image">
//                         </div>
//                         <div class="blog-content">
//                             <h6 class="blog-title mt-4">
//                                 <a href="blog/?postId=${post.id}">${post.title}</a>
//                             </h6>
//                             <div class="read-link mt-4">
//                                 <a class="text-uppercase text-dark" href="blog/?postId=${post.id}">Read More</a>
//                             </div>
//                         </div>
//                     </div></a>`;
//         postList.appendChild(listItem);
//     });
// }


// Main function to handle the logic
async function main() {
    const portfolioId = '3754457232408122297';
    const BlogId = '3642558814134041603';
    const urlParamsP = new URLSearchParams(window.location.search);
    const urlParamsB = new URLSearchParams(window.location.search);
    const singlePortfolioId = urlParamsP.get('singlePortfolioId');
    const singleBlogId = urlParamsB.get('singleBlogId');

    if (singlePortfolioId) {
        const post = await fetchPost(portfolioId, singlePortfolioId);
        displayPost(post);
    } else {
        const posts = await fetchPosts(portfolioId);
        console.log(posts)
        displayPPosts(posts);
    }

    if (singleBlogId) {
        const post = await fetchPost(BlogId, singleBlogId);
        displayPost(post);
    } else {
        const posts = await fetchPosts(BlogId);
        // displayBPosts(posts);
    }


// Call the main function on page load

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
}
window.onload = main;