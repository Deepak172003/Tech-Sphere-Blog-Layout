document.addEventListener('DOMContentLoaded', () => {
  const blogPostsContainer = document.getElementById('blogPostsContainer');
  const blogPosts = document.querySelectorAll('.blog-post');
  const tagLinks = document.querySelectorAll('.tag-link');
  const searchInputNav = document.getElementById('searchInput');
  const searchButtonNav = document.getElementById('searchButton');
  const searchInputSidebar = document.getElementById('sidebarSearchInput');
  const scrollToTopBtn = document.getElementById('scrollToTopBtn');
  const featuredPostsContainer = document.getElementById('featuredPosts');

  // Create "no results" message element
  const noResultsMessage = document.createElement('div');
  noResultsMessage.className = 'no-results';
  noResultsMessage.textContent = 'No articles found. Try a different search or tag.';
  blogPostsContainer.parentNode.appendChild(noResultsMessage); // Append to the parent of blog posts container
  noResultsMessage.style.display = 'none'; // Initially hide it

  /**
   * Filters blog posts based on a search term and/or a selected tag.
   * @param {string} searchTerm - The text to search for in post titles, descriptions, meta, or categories.
   * @param {string} selectedTag - The tag to filter by.
   */
  function filterPosts(searchTerm = '', selectedTag = '') {
    const lowerSearch = searchTerm.trim().toLowerCase();
    let visibleCount = 0;

    blogPosts.forEach(post => {
      const postTitle = post.querySelector('h4')?.textContent.toLowerCase() || '';
      const postDescription = post.querySelector('p')?.textContent.toLowerCase() || '';
      const postMeta = post.querySelector('.blog-meta')?.textContent.toLowerCase() || '';
      // Get categories from data-categories attribute and convert to lowercase array
      const categories = post.dataset.categories
        ? post.dataset.categories.toLowerCase().split(',').map(s => s.trim())
        : [];

      // Check if the post matches the search term
      const matchesSearch =
        postTitle.includes(lowerSearch) ||
        postDescription.includes(lowerSearch) ||
        postMeta.includes(lowerSearch) ||
        categories.some(cat => cat.includes(lowerSearch)); // Check if any category includes the search term

      // Check if the post matches the selected tag
      const matchesTag = selectedTag === '' || categories.includes(selectedTag.toLowerCase());

      // Show or hide the post based on combined filter results
      if (matchesSearch && matchesTag) {
        post.style.display = ''; // Show the post
        visibleCount++;
      } else {
        post.style.display = 'none'; // Hide the post
      }
    });

    // Display or hide the "no results" message
    noResultsMessage.style.display = visibleCount === 0 ? 'block' : 'none';
  }

  /**
   * Handles click events on tag links.
   * Clears search inputs and toggles the active state of tags.
   */
  tagLinks.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault(); // Prevent default link behavior
      const tag = e.target.dataset.tag;

      // Clear both search inputs when a tag is clicked
      searchInputNav.value = '';
      searchInputSidebar.value = '';

      // Determine if the clicked tag is already active
      const isActive = e.target.classList.contains('active-tag');
      // Remove 'active-tag' class from all tags
      tagLinks.forEach(t => t.classList.remove('active-tag'));

      // If the tag was not active, activate it and filter by tag
      if (!isActive) {
        e.target.classList.add('active-tag');
        filterPosts('', tag); // Filter by tag, clear search term
      } else {
        // If the tag was active, deactivate it and show all posts
        filterPosts(); // Show all posts (no search term, no selected tag)
      }
    });
  });

  /**
   * Debounces the search input to improve performance.
   * The filter function will only run after a short delay without further input.
   */
  let searchTimeout;
  const applySearchFilter = () => {
    clearTimeout(searchTimeout); // Clear any existing timeout
    searchTimeout = setTimeout(() => {
      const term = searchInputNav.value || searchInputSidebar.value; // Get search term from either input
      tagLinks.forEach(t => t.classList.remove('active-tag')); // Deactivate any active tags when searching
      filterPosts(term); // Apply filter with the search term
    }, 300); // 300ms delay
  };

  // Event listeners for search inputs and button
  searchInputNav.addEventListener('input', applySearchFilter);
  searchButtonNav.addEventListener('click', e => {
    e.preventDefault(); // Prevent page reload on button click
    applySearchFilter();
  });
  searchInputSidebar.addEventListener('input', applySearchFilter);

  // Scroll-to-top button functionality
  window.addEventListener('scroll', () => {
    if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
      scrollToTopBtn.style.display = 'block';
    } else {
      scrollToTopBtn.style.display = 'none';
    }
  });

  scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth' // Smooth scroll
    });
  });

  /**
   * Function to load featured posts dynamically.
   * For now, it populates with static data, but can be extended to fetch from an API.
   */
  function loadFeaturedPosts() {
    const featuredPostsData = [
      { title: 'The Future of Quantum Computing', category: 'AI', date: 'Aug 20, 2025' },
      { title: 'Building RESTful APIs with Node.js', category: 'Web Development', date: 'Aug 18, 2025' },
      { title: 'Understanding Blockchain Technology', category: 'Cybersecurity', date: 'Aug 10, 2025' },
    ];

    featuredPostsContainer.innerHTML = ''; // Clear existing content

    featuredPostsData.forEach(post => {
      const listItem = document.createElement('a');
      listItem.href = '#'; // Link to the post
      listItem.className = 'list-group-item list-group-item-action';
      listItem.innerHTML = `
        <div class="d-flex w-100 justify-content-between">
          <h6 class="mb-1">${post.title}</h6>
        </div>
        <small class="text-muted">${post.category} | ${post.date}</small>
      `;
      featuredPostsContainer.appendChild(listItem);
    });
  }


  // Initial load: filter posts to show all by default and load featured posts
  filterPosts();
  loadFeaturedPosts();
});
