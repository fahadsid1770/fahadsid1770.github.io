/**
 * Masonry Layout for project cards
 */

(function() {
  var msnry;
  
  document.addEventListener('DOMContentLoaded', function() {
    // Initialize masonry if grid exists
    var grid = document.querySelector('.grid');
    if (grid && typeof Masonry !== 'undefined') {
      msnry = new Masonry(grid, {
        itemSelector: '.grid-item',
        columnWidth: '.grid-sizer',
        percentPosition: true
      });
    }
  });
})();
