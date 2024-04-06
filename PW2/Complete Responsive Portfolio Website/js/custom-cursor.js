document.addEventListener('DOMContentLoaded', function () {
    const cursor = document.querySelector('.custom-cursor');
    const pointer = document.querySelector('.pointer');

    document.addEventListener('mousemove', e => {
        cursor.style.top = e.clientY + 'px';
        cursor.style.left = e.clientX + 'px';
    });

    document.querySelectorAll('a, button').forEach(element => {
        element.addEventListener('mouseenter', () => {
            pointer.classList.add('hover');
        });
        element.addEventListener('mouseleave', () => {
            pointer.classList.remove('hover');
        });
    });
});
