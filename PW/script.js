particlesJS('particles-js', {
    particles: {
      number: {
        value: 100, // Total number of particles
        density: {
          enable: true,
          value_area: 800 // Denser = more particles within this area
        }
      },
      color: {
        value: '#ffffff' // Particle color
      },
      shape: {
        type: 'circle', // Shape of the particles
        stroke: {
          width: 0,
          color: '#000000'
        }
      },
      opacity: {
        value: 0.5, // Opacity of the particles
        random: false,
        anim: {
          enable: false,
          speed: 1,
          opacity_min: 0.1,
          sync: false
        }
      },
      size: {
        value: 3, // Size of the particles
        random: true,
        anim: {
          enable: false,
          speed: 40,
          size_min: 0.1,
          sync: false
        }
      },
      line_linked: {
        enable: true,
        distance: 150, // The radius before a line is drawn between particles
        color: '#ffffff',
        opacity: 0.4,
        width: 1
      },
      move: {
        enable: true,
        speed: 5, // Speed of particle movement
        direction: 'none',
        random: false,
        straight: false,
        out_mode: 'out', // Particles move out of the canvas and come back from the other side
        bounce: false,
        attract: {
          enable: true, // Enables particles to be attracted to or repelled from the cursor
          rotateX: 3000,
          rotateY: 3000
        }
      }
    },
    interactivity: {
      detect_on: 'canvas',
      events: {
        onhover: {
          enable: true,
          mode: 'repulse' // Particles will repulse away from the cursor on hover
        },
        onclick: {
          enable: true,
          mode: 'push' // New particles will be "pushed" on click
        },
        resize: true
      },
      modes: {
        grab: {
          distance: 400,
          line_linked: {
            opacity: 1
          }
        },
        bubble: {
          distance: 400,
          size: 40,
          duration: 2,
          opacity: 8
        },
        repulse: {
          distance: 200 // How far away the particles repel from the cursor
        },
        push: {
          particles_nb: 4
        },
        remove: {
          particles_nb: 2
        }
      }
    },
    retina_detect: true // Enables retina display support
  });
  document.addEventListener('scroll', function() {
    const title = document.getElementById('dynamic-title');
    const windowHeight = window.innerHeight;
    const scrollY = window.scrollY;

    // Calculate the scale of the title, starting at 1 and reducing as the page is scrolled
    let scale = Math.max(0.5, 1 - scrollY / windowHeight);

    // Calculate new position based on scroll, moving towards the top left corner
    let posX = Math.max(0, 50 - scrollY / 20); // Adjust this value to control the speed of horizontal movement
    let posY = Math.max(0, 50 - scrollY / 20); // Adjust this value to control the speed of vertical movement

    // Apply the transformation
    title.style.transform = `translate(-${posX}%, -${posY}%) scale(${scale})`;
});

