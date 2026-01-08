/**
 * Dark Mode Toggle functionality
 */

function initDarkMode() {
  const toggleButton = document.getElementById('light-toggle');
  if (!toggleButton) return;
  
  toggleButton.addEventListener('click', function() {
    document.body.classList.toggle('dark-mode');
    
    // Save preference to localStorage
    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDarkMode);
  });
  
  // Check for saved preference
  const savedDarkMode = localStorage.getItem('darkMode');
  if (savedDarkMode === 'true') {
    document.body.classList.add('dark-mode');
  }
  
  // Check system preference
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    if (!localStorage.getItem('darkMode')) {
      document.body.classList.add('dark-mode');
    }
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initDarkMode);
