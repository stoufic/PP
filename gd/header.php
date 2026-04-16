<head>
  <meta charset="UTF-8" />
  <title>FASTWORKS.AI – Saudi-Born Sovereign AI & Digital Transformation</title>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta
    name="description"
    content="FASTWORKS.AI is a Saudi-born AI and digital transformation company dedicated to accelerating Vision 2030 and building the Kingdom’s sovereign AI capabilities."
  />

  <!-- Google Font -->
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link
    href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
    rel="stylesheet"
  />

  <style>
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap');

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    text-decoration: none;
    border: none;
    outline: none;
    scroll-behavior: smooth;
    font-family: 'Poppins', sans-serif;
}

:root {
    --bg-color: #1f242d;
    --second-bg-color: #323946;
    --text-color: #fff;
    --main-color: #0ef;
}

*::selection {
    background: var(--main-color);
    color: var(--bg-color);
}

html {
    font-size: 62.5%;
    overflow-x: hidden;
}

body {
    background: var(--bg-color);
    color: var(--text-color);
}

section {
    min-height: 100vh;
    padding: 10rem 9% 2rem;
}

.header {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    padding: 2rem 9%;
    background: var(--bg-color);
    display: flex;
    justify-content: space-between;
    align-items: center;
    z-index: 100;
}

.header.sticky {
    border-bottom: .1rem solid rgba(0, 0, 0, .2);
}

.logo {
    font-size: 2.5rem;
    color: var(--text-color);
    font-weight: 600;
}

.navbar a {
    font-size: 1.7rem;
    color: var(--text-color);
    margin-left: 4rem;
    transition: .3s;
}

.navbar a:hover,
.navbar a.active {
    color: var(--main-color);
}

#menu-icon {
    font-size: 3.6rem;
    color: var(--text-color);
    display: none;
}

.home {
    display: flex;
    justify-content: center;
    align-items: center;
}

.home-img img {
    width: 35vw;
    animation: floatImage 4s ease-in-out infinite;
}

@keyframes floatImage {
    0% {
        transform: translateY(0);
    }

    50% {
        transform: translateY(-2.4rem);
    }

    100% {
        transform: translateY(0);
    }
}

.home-content h3 {
    font-size: 3.2rem;
    font-weight: 700;
}

.home-content h3:nth-of-type(2) {
    margin-bottom: 2rem;
}

span {
    color: var(--main-color);
}

.home-content h1 {
    font-size: 5.6rem;
    font-weight: 700;
    line-height: 1.3;
}

.home-content p {
    font-size: 1.6rem;
}

.social-media a {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    width: 4rem;
    height: 4rem;
    background: transparent;
    border: .2rem solid var(--main-color);
    border-radius: 50%;
    font-size: 2rem;
    color: var(--main-color);
    margin: 3rem 1.5rem 3rem 0;
    transition: .5s ease;
}

.social-media a:hover {
    background: var(--main-color);
    color: var(--second-bg-color);
    box-shadow: 0 0 1rem var(--main-color);
}

.btn {
    display: inline-block;
    padding: 1rem 2.8rem;
    background: var(--main-color);
    border-radius: 4rem;
    box-shadow: 0 0 1rem var(--main-color);
    font-size: 1.6rem;
    color: var(--second-bg-color);
    letter-spacing: .1rem;
    font-weight: 600;
    transition: .5s ease;
}

.btn:hover {
    box-shadow: none;
}

.about {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 2rem;
    background: var(--second-bg-color);
}

.about-img img {
    width: 35vw;
    animation: floatImage 4s ease-in-out infinite;
}
.about-grid {
      display: grid;
      grid-template-columns: minmax(0, 1.25fr) minmax(0, 1fr);
      gap: 2.4rem;
    }

.about-card {
      background: var(--bg-soft);
      border-radius: var(--radius-lg);
      padding: 1.6rem 1.5rem;
      border: 1px solid var(--border-subtle);
      box-shadow: 0 20px 45px rgba(0, 0, 0, 0.35);
    }
.badge-inline {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      font-size: 0.74rem;
      text-transform: uppercase;
      letter-spacing: 0.16em;
      color: var(--text-muted);
      margin-bottom: 0.5rem;
    }

.badge-inline span {
      width: 7px;
      height: 7px;
      border-radius: 999px;
      background: var(--accent-green);
    }

.about-card h3 {
      margin: 0 0 0.5rem;
      font-size: 1.1rem;
    }

.about-card p {
      font-size: 0.9rem;
      color: var(--text-muted);
      margin: 0.25rem 0;
    }

.about-list {
      list-style: none;
      padding: 0;
      margin: 0.8rem 0 0;
      font-size: 0.88rem;
      color: var(--text-muted);
    }

.about-list li {
      display: flex;
      align-items: flex-start;
      gap: 0.5rem;
      margin-bottom: 0.45rem;
    }

.about-list li::before {
      content: '';
      margin-top: 0.35rem;
      width: 6px;
      height: 6px;
      border-radius: 999px;
      background: var(--accent-gold);
      flex-shrink: 0;
    }


.heading {
    text-align: center;
    font-size: 4.5rem;
}

.about-content h2 {
    text-align: left;
    line-height: 1.2;
}

.about-content h3 {
    font-size: 2.6rem;
}

.about-content p {
    font-size: 1.6rem;
    margin: 2rem 0 3rem;
}

.services {
    min-height: auto;
    padding-bottom: 10rem;
}

.services h2 {
    margin-bottom: 5rem;
}

.services-container {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    gap: 2rem;
}

.services-container .services-box {
    flex: 1 1 30rem;
    background: var(--second-bg-color);
    padding: 3rem 2rem 4rem;
    border-radius: 2rem;
    text-align: center;
    border: .2rem solid var(--bg-color);
    transition: .5s ease;
}

.services-container .services-box:hover {
    border-color: var(--main-color);
    transform: scale(1.02);
}

.services-box i {
    font-size: 7rem;
    color: var(--main-color);
}

.services-box h3 {
    font-size: 2.6rem;
}

.services-box p {
    font-size: 1.6rem;
    margin: 1rem 0 3rem;
}

.portfolio {
    background: var(--second-bg-color);
    min-height: auto;
    padding-bottom: 10rem;
}

.portfolio h2 {
    margin-bottom: 4rem;
}

.portfolio-container {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    align-items: center;
    gap: 2.5rem;
}

.portfolio-container .portfolio-box {
    position: relative;
    border-radius: 2rem;
    box-shadow: 0 0 1rem var(--bg-color);
    overflow: hidden;
    display: flex;
}

.portfolio-box img {
    width: 100%;
    transition: .5s ease;
}

.portfolio-box:hover img {
    transform: scale(1.1);
}

.portfolio-box .portfolio-layer {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(rgba(0, 0, 0, .1), var(--main-color));
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    text-align: center;
    padding: 0 4rem;
    transform: translateY(100%);
    transition: .5s ease;
}

.portfolio-box:hover .portfolio-layer {
    transform: translateY(0);
}

.portfolio-layer h4 {
    font-size: 3rem;
}

.portfolio-layer p {
    font-size: 1.6rem;
    margin: .3rem 0 1rem;
}

.portfolio-layer a {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    width: 5rem;
    height: 5rem;
    background: var(--text-color);
    border-radius: 50%;
}

.portfolio-layer a i {
    font-size: 2rem;
    color: var(--second-bg-color);
}

.contact {
    background-color: #1f242d;
    min-height: auto;
    padding-bottom: 7rem;
}

.contact h2 {
    margin-bottom: 3rem;
}

.contact form {
    max-width: 70rem;
    margin: 1rem auto;
    text-align: center;
    margin-bottom: 3rem;
}

.contact form .input-box {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
}

.contact form .input-box input,
.contact form textarea {
    width: 100%;
    padding: 1.5rem;
    font-size: 1.6rem;
    color: var(--text-color);
    background: var(--second-bg-color);
    border-radius: .8rem;
    margin: .7rem 0;
}

.contact form .input-box input {
    width: 49%;
}

.contact form textarea {
    resize: none;
}

.contact form .btn {
    margin-top: 2rem;
    cursor: pointer;
}

.footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    padding: 2rem 9%;
    background: var(--second-bg-color);
}

.footer-text p {
    font-size: 1.6rem;
}

.footer-iconTop a {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    padding: .8rem;
    background: var(--main-color);
    border-radius: .8rem;
    transition: .5s ease;
}

.footer-iconTop a:hover {
    box-shadow: 0 0 1rem var(--main-color);
}

.footer-iconTop a i {
    font-size: 2.4rem;
    color: var(--second-bg-color);
}


/* BREAKPOINTS */
@media (max-width: 1200px) {
    html {
        font-size: 55%;
    }
}

@media (max-width: 991px) {
    .header {
        padding: 2rem 3%;
    }

    section {
        padding: 10rem 3% 2rem;
    }

    .footer {
        padding: 2rem 3%;
    }
}

@media (max-width: 879px) {
    .portfolio-container {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (max-width: 768px) {
    #menu-icon {
        display: block;
    }

    .navbar {
        position: absolute;
        top: 100%;
        left: 0;
        width: 100%;
        padding: 1rem 3%;
        background: var(--bg-color);
        border-top: .1rem solid rgba(0, 0, 0, .2);
        box-shadow: 0 .5rem 1rem rgba(0, 0, 0, .2);
        display: none;
    }

    .navbar.active {
        display: block;
    }

    .navbar a {
        display: block;
        font-size: 2rem;
        margin: 3rem 0;
    }

    .home {
        flex-direction: column;
    }

    .home-content h3 {
        font-size: 2.6rem;
    }

    .home-content h1 {
        font-size: 5rem;
    }

    .home-img img {
        width: 70vw;
        margin-top: 4rem;
    }

    .about {
        flex-direction: column-reverse;
    }

    .about img {
        width: 70vw;
        margin-top: 4rem;
    }
}

@media (max-width: 580px) {
    .portfolio-container {
        grid-template-columns: 1fr;
    }
}

@media (max-width: 450px) {
    html {
        font-size: 50%;
    }

    .contact form .input-box input {
        width: 100%;
    }

    .footer {
        flex-direction: column-reverse;
    }

    .footer p {
        text-align: center;
        margin-top: 2rem;
    }
}

@media (max-width: 365px) {

    .home-img img,
    .about-img img {
        width: 90vw;
    }
}
.process-grid {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.process-steps {
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
}

.process-step {
  flex: 1;
  min-width: 200px;
  background: #ffffff;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  padding: 30px 20px;
  position: relative;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.process-step:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 12px rgba(0, 0, 0, 0.15);
}

/* Arrow between steps */
.process-step:not(:last-child)::after {
  content: '→';
  position: absolute;
  right: -30px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 32px;
  color: #666;
  font-weight: bold;
}

.process-step-label {
  display: inline-block;
  background: #007bff;
  color: white;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 15px;
}

.process-step h3 {
  margin: 15px 0 10px 0;
  font-size: 20px;
  color: #333;
  font-weight: 700;
}

.process-step p {
  margin: 0;
  font-size: 15px;
  color: #666;
  line-height: 1.6;
}

/* Responsive design */
@media (max-width: 1024px) {
  .process-steps {
    flex-wrap: wrap;
    gap: 40px 20px;
  }
  
  .process-step {
    flex: 1 1 calc(50% - 20px);
  }
  
  .process-step:nth-child(odd)::after {
    content: '→';
  }
  
  .process-step:nth-child(2)::after {
    content: '↓';
    right: 50%;
/* css/custom-cursor.css */
  }
}
.custom-cursor {
    position: fixed;
    top: 0;
    left: 0;
    pointer-events: none;
    z-index: 9999;
}

.pointer {
    position: absolute;
    width: 20px;
    height: 20px;
    /* Specify the URL of your custom cursor image */
    cursor: url(images/cusor.png), auto;
}


/* Example styling for hover effect */
.pointer:hover {
    background-color: #323946;
    border-color: rgb(0, 0, 0);
}

.companies {
    color: var(--text-color);
    background-color: #1f242d;
    padding: 20px 0;
    text-align: center;
}

.company-slider {
    overflow: hidden;
    white-space: nowrap;
    position: relative;
    width: 100%;
}

.company-slide {
    display: inline-flex;
    animation: slide 60s linear infinite;
}

.company-slide img {
    width: 120px; /* Adjust based on actual logo sizes */
    height: auto;
    margin: 0 20px;
    display: inline-block;
    animation: rotate-in 5s linear infinite;
    animation-delay: inherit; /* This ensures rotation timing matches slide positioning */
}

/* Keyframes for sliding */
@keyframes slide {
    0% {
        transform: translateX(100%);
    }
    100% {
        transform: translateX(-100%);
    }
}

/* Keyframes for rotating as logos re-enter */


/* This will stagger the animation of each logo so they don't all rotate at the same time */

/* Continue the pattern for more logos */.company-data {
    background-color: #323946;
    padding: 20px;
    text-align: center;
}

.data-container {
    display: flex;
    justify-content: space-around;
    align-items: center;
    flex-wrap: wrap;
}

.data-box {
    flex: 1;
    min-width: 200px;
    margin: 10px;
    padding: 20px;
    background: rgb(36, 23, 80);
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.data-box h3 {
    color: #333;
    font-size: 2em;
}

.data-box p {
    color: #666;
    font-weight: bold;
}

/* Engagement Model Section */
.container {
    max-width: 120rem;
    margin: 0 auto;
    padding: 0 2rem;
}

.section-header {
    text-align: center;
    margin-bottom: 6rem;
}

.section-kicker {
    font-size: 1.4rem;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    color: var(--main-color);
    margin-bottom: 1rem;
    font-weight: 600;
}

.section-title {
    font-size: 4.5rem;
    font-weight: 700;
    color: var(--text-color);
    margin-bottom: 2rem;
    line-height: 1.2;
}

.section-subtitle {
    font-size: 1.8rem;
    color: rgba(255, 255, 255, 0.7);
    max-width: 80rem;
    margin: 0 auto;
    line-height: 1.6;
}

/* Process Steps */
.process-grid {
    max-width: 140rem;
    margin: 0 auto;
    padding: 4rem 2rem;
}

.process-steps {
    display: flex;
    align-items: stretch;
    gap: 3rem;
    flex-wrap: nowrap;
}

.process-step {
    flex: 1;
    min-width: 200px;
    background: var(--second-bg-color);
    border: .2rem solid rgba(14, 239, 255, 0.3);
    border-radius: 2rem;
    padding: 3rem 2.5rem;
    position: relative;
    box-shadow: 0 0 2rem rgba(0, 0, 0, 0.3);
    transition: all 0.5s ease;
}

.process-step:hover {
    transform: translateY(-1rem);
    border-color: var(--main-color);
    box-shadow: 0 0 3rem rgba(14, 239, 255, 0.4);
}

/* Arrow between steps */
.process-step:not(:last-child)::after {
    content: '→';
    position: absolute;
    right: -3.5rem;
    top: 50%;
    transform: translateY(-50%);
    font-size: 4rem;
    color: var(--main-color);
    font-weight: bold;
    text-shadow: 0 0 1rem var(--main-color);
}

.process-step-label {
    display: inline-block;
    background: var(--main-color);
    color: var(--bg-color);
    padding: 0.8rem 2rem;
    border-radius: 4rem;
    font-size: 1.4rem;
    font-weight: 600;
    margin-bottom: 2rem;
    box-shadow: 0 0 1rem var(--main-color);
}

.process-step h3 {
    margin: 1.5rem 0 1.5rem 0;
    font-size: 2.4rem;
    color: var(--text-color);
    font-weight: 700;
}

.process-step p {
    margin: 0;
    font-size: 1.6rem;
    color: rgba(255, 255, 255, 0.7);
    line-height: 1.6;
}

/* Why Section (Vision 2030) */
#vision {
    background: var(--second-bg-color);
}

.why-grid {
    display: grid;
    grid-template-columns: 1.2fr 1fr;
    gap: 4rem;
    align-items: start;
}

.why-list {
    list-style: none;
    padding: 0;
    margin: 0;
}

.why-list li {
    display: flex;
    align-items: flex-start;
    gap: 2rem;
    margin-bottom: 3rem;
    font-size: 1.6rem;
    color: rgba(255, 255, 255, 0.8);
    line-height: 1.6;
}

.why-icon {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    width: 4rem;
    height: 4rem;
    background: var(--main-color);
    color: var(--bg-color);
    border-radius: 50%;
    font-size: 2rem;
    font-weight: 700;
    flex-shrink: 0;
    box-shadow: 0 0 1rem var(--main-color);
}

.why-list strong {
    color: var(--main-color);
    font-weight: 600;
}

.why-card {
    background: var(--bg-color);
    border: .2rem solid rgba(14, 239, 255, 0.3);
    border-radius: 2rem;
    padding: 3rem;
    box-shadow: 0 0 2rem rgba(0, 0, 0, 0.3);
}

.why-card strong {
    display: block;
    font-size: 2.2rem;
    color: var(--main-color);
    margin-bottom: 1.5rem;
}

.why-card > p {
    font-size: 1.6rem;
    color: rgba(255, 255, 255, 0.7);
    margin-bottom: 2.5rem;
    line-height: 1.6;
}

.why-card-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
    margin-bottom: 2rem;
}

.why-card-row:last-child {
    margin-bottom: 0;
}

.why-card-col {
    background: var(--second-bg-color);
    padding: 2rem;
    border-radius: 1rem;
    border: .1rem solid rgba(14, 239, 255, 0.2);
}

.why-card-col strong {
    display: block;
    font-size: 1.6rem;
    color: var(--text-color);
    margin-bottom: 0.8rem;
    font-weight: 600;
}

.why-card-col span {
    display: block;
    font-size: 1.4rem;
    color: rgba(255, 255, 255, 0.6);
    line-height: 1.5;
}

/* Responsive Design */
@media (max-width: 1200px) {
    .process-steps {
        gap: 2rem;
    }
    
    .process-step:not(:last-child)::after {
        right: -2.5rem;
        font-size: 3rem;
    }
}

@media (max-width: 991px) {
    .section-title {
        font-size: 3.5rem;
    }
    
    .why-grid {
        grid-template-columns: 1fr;
        gap: 3rem;
    }
    
    .process-steps {
        flex-wrap: wrap;
        gap: 4rem 2rem;
    }
    
    .process-step {
        flex: 1 1 calc(50% - 2rem);
    }
    
    .process-step:nth-child(2)::after {
        content: '↓';
        right: 50%;
        top: auto;
        bottom: -5rem;
        transform: translateX(50%);
    }
    
    .process-step:nth-child(3)::after {
        display: none;
    }
}

@media (max-width: 768px) {
    .section-title {
        font-size: 3rem;
    }
    
    .section-subtitle {
        font-size: 1.6rem;
    }
    
    .why-card-row {
        grid-template-columns: 1fr;
        gap: 1.5rem;
    }
}

@media (max-width: 580px) {
    .process-steps {
        flex-direction: column;
        gap: 3rem;
    }
    
    .process-step {
        flex: 1 1 100%;
    }
    
    .process-step::after {
        content: '↓' !important;
        right: 50% !important;
        top: auto !important;
        bottom: -4rem !important;
        transform: translateX(50%) !important;
    }
    
    .process-step:last-child::after {
        display: none;
    }
}

@media (max-width: 450px) {
    .section-title {
        font-size: 2.5rem;
    }
}
.about {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 4rem;
    background: var(--second-bg-color);
    padding: 10rem 9% 10rem;
}

.about-img img {
    width: 35vw;
    animation: floatImage 4s ease-in-out infinite;
    filter: drop-shadow(0 0 2rem var(--main-color));
}

.about-content {
    max-width: 70rem;
}

.about-content h2 {
    text-align: left;
    line-height: 1.2;
    margin-bottom: 3rem;
}

.about-content > p {
    font-size: 1.6rem;
    margin: 2rem 0 4rem;
    color: rgba(255, 255, 255, 0.8);
    line-height: 1.8;
}

/* About Grid */
.about-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2.5rem;
    margin-bottom: 4rem;
}

.about-card {
    background: var(--bg-color);
    border-radius: 2rem;
    padding: 3rem 2.5rem;
    border: .2rem solid rgba(14, 239, 255, 0.2);
    box-shadow: 0 0 2rem rgba(0, 0, 0, 0.3);
    transition: all 0.5s ease;
}

.about-card:hover {
    border-color: var(--main-color);
    transform: translateY(-1rem);
    box-shadow: 0 0 3rem rgba(14, 239, 255, 0.3);
}

.badge-inline {
    display: inline-flex;
    align-items: center;
    gap: 0.8rem;
    font-size: 1.2rem;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    color: var(--main-color);
    margin-bottom: 1.5rem;
    font-weight: 600;
}

.badge-inline span {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--main-color);
    box-shadow: 0 0 0.5rem var(--main-color);
}

.about-card h3 {
    margin: 0 0 1.5rem;
    font-size: 2rem;
    color: var(--text-color);
    font-weight: 700;
    line-height: 1.3;
}

.about-card > p {
    font-size: 1.5rem;
    color: rgba(255, 255, 255, 0.7);
    margin: 1.5rem 0;
    line-height: 1.6;
}

.about-list {
    list-style: none;
    padding: 0;
    margin: 2rem 0 0;
    font-size: 1.5rem;
    color: rgba(255, 255, 255, 0.75);
}

.about-list li {
    display: flex;
    align-items: flex-start;
    gap: 1.2rem;
    margin-bottom: 1.2rem;
    line-height: 1.6;
}

.about-list li::before {
    content: '';
    margin-top: 0.6rem;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--main-color);
    box-shadow: 0 0 0.5rem var(--main-color);
    flex-shrink: 0;
}

/* Responsive Design */
@media (max-width: 991px) {
    .about {
        gap: 3rem;
        padding: 10rem 3% 10rem;
    }
    
    .about-grid {
        grid-template-columns: 1fr;
        gap: 2rem;
    }
}

@media (max-width: 768px) {
    .about {
        flex-direction: column-reverse;
        padding: 8rem 3% 8rem;
    }

    .about-img img {
        width: 70vw;
        margin-top: 4rem;
    }
    
    .about-content h2 {
        text-align: center;
        margin-bottom: 2rem;
    }
    
    .about-content > p {
        text-align: center;
        margin: 2rem 0 3rem;
    }
    
    .about-grid {
        gap: 2rem;
    }
    
    .about-card {
        padding: 2.5rem 2rem;
    }
    
    .about-card h3 {
        font-size: 1.8rem;
    }
    
    .about-list {
        font-size: 1.4rem;
    }
}

@media (max-width: 450px) {
    .about-card {
        padding: 2rem 1.5rem;
    }
    
    .about-card h3 {
        font-size: 1.6rem;
    }
    
    .badge-inline {
        font-size: 1rem;
    }
    
    .about-list li {
        gap: 1rem;
    }
}

@media (max-width: 365px) {
    .about-img img {
        width: 90vw;
    }
}
  </style>
</head><header>
    <div class="container nav">
      <div class="nav-left">
        <div class="logo-mark">FW</div>
        <div class="nav-title">
          <div class="nav-title-main">FASTWORKS.AI</div>
          <div class="nav-title-sub">Saudi-Born Sovereign AI</div>
        </div>
      </div>

      <button class="nav-toggle" aria-label="Toggle navigation">
        ☰
      </button>

      <nav class="nav-links" id="nav-links">
        <a href="#about">About</a>
        <a href="#pillars">Five Pillars</a>
        <a href="#audiences">Who We Serve</a>
        <a href="#vision">Vision 2030</a>
        <a href="#contact">Contact</a>
        <button class="nav-cta" onclick="document.getElementById('contact').scrollIntoView({behavior:'smooth'})">
          <span class="dot"></span>
          Book a strategy session
        </button>
      </nav>
    </div>
  </header><main>
