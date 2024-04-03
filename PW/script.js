let stars = document.getElementById('stars');
            let moon = document.getElementById('moon');
            let mountains_behind = document.getElementById('mountains_behind');
            let text = document.getElementById('text');
            let btn = document.getElementById('btn');
            let mountains_front = document.getElementById('mountains_front');
            let header = document.querySelector('header');

            window.addEventListener('scroll', function() {
                let value = window.scrollY;
                stars.style.left = value * 0.25 + 'px';
                moon.style.top = value * 1.05 + 'px';
                mountains_behind.style.top = value * 0.5 + 'px';
                mountains_front.style.top = value * 0 + 'px';
                text.style.marginRight = value * 4 + 'px';
                text.style.marginTop = value * 1.5 + 'px';
                header.style.top = value * 0.5 + 'px';
            
            });
            let aboutBox = document.getElementById("about");
            let projectsBox = document.getElementById("projects");
            let educationBox = document.getElementById("education");
            
            window.addEventListener('scroll', function() {
                let scrollTop = window.scrollY;
                if (isElementInViewport(aboutBox)) {
                    aboutBox.classList.add("visible", "animated");
                } else {
                    aboutBox.classList.remove("visible", "animated");
                }
                if (isElementInViewport(projectsBox)) {
                    projectsBox.classList.add("visible", "animated");
                } else {
                    projectsBox.classList.remove("visible", "animated");
                }
                if (isElementInViewport(educationBox)) {
                    educationBox.classList.add("visible", "animated");
                } else {
                    educationBox.classList.remove("visible", "animated");
                }
            });
            
            function isElementInViewport(el) {
                var rect = el.getBoundingClientRect();
                return (
                    rect.top >= 0 &&
                    rect.left >= 0 &&
                    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
                );
            }
            