/*==================== custom cursor ====================*/
document.addEventListener('DOMContentLoaded', function() {
    const cursor = document.querySelector('.custom-cursor .pointer');
    
    if (cursor) {
        document.addEventListener('mousemove', function(e) {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });
        
        // Add hover effect for links and buttons
        const interactiveElements = document.querySelectorAll('a, button, .btn, input[type="submit"]');
        
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.style.width = '40px';
                cursor.style.height = '40px';
                cursor.style.opacity = '0.5';
            });
            
            el.addEventListener('mouseleave', () => {
                cursor.style.width = '20px';
                cursor.style.height = '20px';
                cursor.style.opacity = '0.7';
            });
        });
    }
});
