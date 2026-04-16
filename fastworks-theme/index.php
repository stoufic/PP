<?php
/**
 * The main template file
 */
get_header();
?>

<!-- home section design -->
<section class="home" id="home">
    <div class="home-content">
        <h1>FASTWORKS.AI</h1>
        <h3>We are a <span class="multiple-text"></span></h3>

        <div class="services-box">
            <a href="#contact" class="btn">Book Vision 2030 AI Workshop →</a>
            <a href="<?php echo get_template_directory_uri(); ?>/FASTWORKS_profile.pdf" download="FASTWORKS_profile.pdf" class="btn">
                Download our portfolio
            </a>
        </div>
    </div>

    <div class="home-img">
        <img src="<?php echo get_template_directory_uri(); ?>/images/logo.png" alt="FastWorks.AI Logo">
    </div>
</section>

<!-- about section design -->
<section class="about" id="about">
    <div class="about-img">
        <img src="<?php echo get_template_directory_uri(); ?>/images/jlogo.png" alt="FastWorks.AI">
    </div>

    <div class="about-content">
        <h2 class="heading">About <span>Us</span></h2>
        <p>FASTWORKS.AI is built from the ground up for the Kingdom of Saudi Arabia. Our purpose is not just to deploy AI tools, but to build a national AI capability that is owned, governed, and shaped by the Kingdom.</p>
        <div class="about-grid">
            <div class="about-card">
                <div class="badge-inline">
                    <span></span>
                    Mission
                </div>
                <h3>Making world-class AI accessible to everyone in Saudi Arabia.</h3>
                <p>
                    Our mission is to make world-class AI accessible to every ministry, enterprise, and citizen in Saudi Arabia by delivering an integrated ecosystem of training, engineering, and digital platforms.
                </p>
                <ul class="about-list">
                    <li>Enable national talent to learn, innovate, and lead in the new era of intelligence.</li>
                    <li>Deliver sovereign, trusted AI that respects Saudi values, culture, and regulations.</li>
                    <li>Translate AI potential into real outcomes: faster services, smarter cities, stronger industries.</li>
                </ul>
            </div>

            <div class="about-card">
                <div class="badge-inline">
                    <span></span>
                    Vision
                </div>
                <h3>Positioning Saudi Arabia as a global leader in sovereign AI.</h3>
                <p>
                    We unify AI aggregation, national talent development, and digital platforms into one ecosystem that powers Saudi Arabia's innovation and growth.
                </p>
                <ul class="about-list">
                    <li>Anchor AI innovation in sovereign cloud, national data, and local engineering.</li>
                    <li>Support ministries, giga projects, and enterprises with an end-to-end AI journey.</li>
                    <li>Build an AI ecosystem that is exportable, yet uniquely Saudi-first.</li>
                </ul>
            </div>
        </div>
        <a href="#" class="btn">Why Choose Us?</a>
    </div>
</section>

<!-- services section design -->
<section class="services" id="services">
    <h2 class="heading">The <span>Five Pillars</span></h2>

    <div class="services-container">
        <div class="services-box">
            <i class='bx bx-code-alt'></i>
            <h3>AI Aggregator & Intelligence Layer</h3>
            <p>Sovereign AI backbone that unifies LLMs, real-time data, APIs, and digital twins into one national intelligence platform with strong governance and observability.</p>
            <a href="#" class="btn">Read More</a>
        </div>

        <div class="services-box">
            <i class='bx bxs-paint'></i>
            <h3>Engineering & Applied AI Services</h3>
            <p>Hands-on engineering teams that design, build, integrate, and operate AI solutions across ministries, giga projects, and enterprises using modern ML Ops & automation.</p>
            <a href="#" class="btn">Read More</a>
        </div>

        <div class="services-box">
            <i class='bx bx-bar-chart-alt'></i>
            <h3>AI Academy & Workforce Uplift</h3>
            <p>National upskilling programs that turn employees, students, and innovators into AI builders through bootcamps, labs, and real-world projects.</p>
            <a href="#" class="btn">Read More</a>
        </div>
        
        <div class="services-box">
            <i class='bx bx-bar-chart-alt'></i>
            <h3>Digital Platforms & Strategic Advisory</h3>
            <p>Smart-city command systems, Super Apps, and strategic AI advisory that ensure AI is deployed safely, responsibly, and at scale.</p>
            <a href="#" class="btn">Read More</a>
        </div>
    </div>
</section>

<!-- portfolio section design -->
<section class="portfolio" id="portfolio">
    <h2 class="heading">Who <span>we serve</span></h2>

    <div class="portfolio-container">
        <div class="portfolio-box">
            <img src="<?php echo get_template_directory_uri(); ?>/images/portfolio1.jpg" alt="Ministries & Government">
            <div class="portfolio-layer">
                <h4>Ministries & Government</h4>
                <p>AI-first digital government, trusted citizen services, and real-time national intelligence.

                    AI strategy, governance, and operating models
                    AI copilots for civil servants & citizens
                    Smart government service orchestration</p>
                <a href="#"><i class='bx bx-link-external'></i></a>
            </div>
        </div>

        <div class="portfolio-box">
            <img src="<?php echo get_template_directory_uri(); ?>/images/smart.jpg" alt="Giga Projects & Smart Cities">
            <div class="portfolio-layer">
                <h4>Giga Projects & Smart Cities</h4>
                <p>Command centers and digital twins that power the next generation of Saudi mega projects.

                    Smart city digital twin & monitoring
                    Mobility, safety, and sustainability AI
                    Autonomous infrastructure integration</p>
                <a href="#"><i class='bx bx-link-external'></i></a>
            </div>
        </div>

        <div class="portfolio-box">
            <img src="<?php echo get_template_directory_uri(); ?>/images/talent.jpg" alt="Enterprises & Regulators">
            <div class="portfolio-layer">
                <h4>Enterprises & Regulators</h4>
                <p>Operational AI and automation for banking, energy, healthcare, and logistics.

                    Intelligent automation & AI copilots
                    Risk, compliance, and fraud AI
                    Sovereign data governance frameworks</p>
                <a href="#"><i class='bx bx-link-external'></i></a>
            </div>
        </div>
    </div>
</section>

<!-- Process Section -->
<section class="process-section" id="process">
    <div class="container">
        <div class="section-header">
            <div class="section-kicker">How We Work</div>
            <h2 class="section-title">From Strategy to Scale</h2>
            <p class="section-subtitle">
                FASTWORKS.AI works with clients through a structured, milestone-driven engagement model designed to deliver rapid results and sustainable national impact.
            </p>
        </div>

        <div class="process-steps">
            <div class="process-step">
                <div class="process-step-label">Stage 1</div>
                <h3>Discover & Assess</h3>
                <p>
                    Deep-dive assessment of your current AI readiness, opportunities, risks, and strategic priorities.
                </p>
            </div>
            <div class="process-step">
                <div class="process-step-label">Stage 2</div>
                <h3>Design & Roadmap</h3>
                <p>
                    Target architecture, data strategy, and governance models tailored to your sector, regulatory environment, and sovereign requirements.
                </p>
            </div>
            <div class="process-step">
                <div class="process-step-label">Stage 3</div>
                <h3>Build & Pilot</h3>
                <p>
                    Rapid development of pilots and early platforms, paired with AI Academy programs for your internal teams.
                </p>
            </div>
            <div class="process-step">
                <div class="process-step-label">Stage 4</div>
                <h3>Scale & Operate</h3>
                <p>
                    Production rollout, operations, optimization, and continuous innovation using the FASTWORKS.AI ecosystem.
                </p>
            </div>
        </div>
    </div>
</section>

<!-- Vision 2030 Section -->
<section id="vision">
    <div class="container">
        <div class="section-header">
            <div class="section-kicker">Why Fastworks.ai</div>
            <h2 class="section-title">Sovereign. Integrated. Built for Vision 2030.</h2>
            <p class="section-subtitle">
                FASTWORKS.AI is more than a vendor. We operate as a strategic partner and ecosystem builder, aligned with Saudi Arabia's digital, economic, and societal ambitions.
            </p>
        </div>

        <div class="why-grid">
            <div>
                <ul class="why-list">
                    <li>
                        <div class="why-icon">✓</div>
                        <div>
                            <strong>Saudi-born and Saudi-first.</strong>
                            Architected for national priorities: security, sovereignty, talent development, and long-term capability building.
                        </div>
                    </li>
                    <li>
                        <div class="why-icon">✓</div>
                        <div>
                            <strong>End-to-end coverage.</strong>
                            Strategy, engineering, training, and digital platforms delivered as one integrated offering.
                        </div>
                    </li>
                    <li>
                        <div class="why-icon">✓</div>
                        <div>
                            <strong>Designed for regulated, high-trust environments.</strong>
                            Government, financial services, healthcare, energy, and giga projects where reliability and governance are non-negotiable.
                        </div>
                    </li>
                    <li>
                        <div class="why-icon">✓</div>
                        <div>
                            <strong>Talent-centric approach.</strong>
                            Every project includes a talent uplift path, ensuring that Saudi professionals become owners and operators of AI systems.
                        </div>
                    </li>
                    <li>
                        <div class="why-icon">✓</div>
                        <div>
                            <strong>Vision 2030 acceleration.</strong>
                            Direct alignment with digital government, smart city, economic diversification, and human capability development programs.
                        </div>
                    </li>
                </ul>
            </div>

            <aside class="why-card">
                <strong>Vision 2030 Alignment</strong>
                <p>
                    FASTWORKS.AI contributes to multiple Vision 2030 pillars: a vibrant society, a thriving economy, and an ambitious nation. We do this by:
                </p>
                <div class="why-card-row">
                    <div class="why-card-col">
                        <strong>Government & Cities</strong>
                        <span>AI-first public services, data-driven policymaking, and smart-city ecosystems.</span>
                    </div>
                    <div class="why-card-col">
                        <strong>Economy & Jobs</strong>
                        <span>New AI sectors, higher-value jobs, and competitive national capabilities.</span>
                    </div>
                </div>
                <div class="why-card-row">
                    <div class="why-card-col">
                        <strong>People & Talent</strong>
                        <span>Upskilling Saudi citizens to become AI creators, not just AI users.</span>
                    </div>
                    <div class="why-card-col">
                        <strong>Sovereignty & Security</strong>
                        <span>AI built on sovereign cloud, national data, and trusted governance.</span>
                    </div>
                </div>
            </aside>
        </div>
    </div>
</section>

<!-- contact section design -->
<section class="contact" id="contact">
    <h2 class="heading">Let's <span>design your sovereign AI roadmap.</span></h2>
    <center>
        <h3>Whether you are a ministry, giga project, regulator, or enterprise, FASTWORKS.AI can help you move from experimentation to impact—safely, responsibly, and at national scale.</h3>
    </center>

    <form id="contactForm" action="<?php echo esc_url(admin_url('admin-post.php')); ?>" method="post">
        <?php wp_nonce_field('fastworks_contact_submit', 'fastworks_contact_nonce'); ?>
        <input type="hidden" name="action" value="fastworks_contact">
        <div class="input-box">
            <input type="text" name="full_name" placeholder="Full Name" required>
            <input type="email" name="email" placeholder="Email Address" required>
        </div>
        <div class="input-box">
            <input type="number" name="phone" placeholder="Mobile Number" required>
            <input type="text" name="subject" placeholder="Email Subject" required>
        </div>
        <textarea name="message" cols="30" rows="10" placeholder="Your Message" required></textarea>
        <input type="submit" value="Send Message" class="btn">
    </form>
</section>

<script>
    document.getElementById('contactForm').addEventListener('submit', function(event) {
        event.preventDefault();
        alert('Your message has been sent!');
        this.reset();
    });
</script>

<?php get_footer(); ?>
