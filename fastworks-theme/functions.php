<?php
/**
 * FastWorks.AI Theme Functions
 */

// Theme setup
function fastworks_theme_setup() {
    // Add theme support
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    add_theme_support('custom-logo');
    add_theme_support('html5', array('search-form', 'comment-form', 'comment-list', 'gallery', 'caption'));
    
    // Register menus
    register_nav_menus(array(
        'primary' => __('Primary Menu', 'fastworks-ai'),
    ));
}
add_action('after_setup_theme', 'fastworks_theme_setup');

// Enqueue scripts and styles
function fastworks_enqueue_scripts() {
    // Main stylesheet
    wp_enqueue_style('fastworks-style', get_stylesheet_uri(), array(), '1.0');
    
    // Box Icons
    wp_enqueue_style('boxicons', 'https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css', array(), '2.1.4');
    
    // ScrollReveal
    wp_enqueue_script('scrollreveal', 'https://unpkg.com/scrollreveal', array(), '4.0.0', true);
    
    // Typed.js
    wp_enqueue_script('typed-js', 'https://cdn.jsdelivr.net/npm/typed.js@2.0.12', array(), '2.0.12', true);
    
    // Chart.js (if needed)
    wp_enqueue_script('chart-js', 'https://cdn.jsdelivr.net/npm/chart.js', array(), '3.0.0', true);
    
    // Custom script
    wp_enqueue_script('fastworks-script', get_template_directory_uri() . '/js/script.js', array('jquery'), '1.0', true);
    
    // Custom cursor script
    wp_enqueue_script('fastworks-cursor', get_template_directory_uri() . '/js/custom-cursor.js', array(), '1.0', true);
}
add_action('wp_enqueue_scripts', 'fastworks_enqueue_scripts');

// Add custom image sizes
add_image_size('portfolio-thumb', 600, 400, true);

// Custom walker for navigation menu
class Fastworks_Walker_Nav_Menu extends Walker_Nav_Menu {
    function start_el(&$output, $item, $depth = 0, $args = null, $id = 0) {
        $classes = empty($item->classes) ? array() : (array) $item->classes;
        $class_names = join(' ', apply_filters('nav_menu_css_class', array_filter($classes), $item));
        
        $active = in_array('current-menu-item', $classes) ? ' active' : '';
        
        $output .= '<a href="' . esc_attr($item->url) . '" class="' . $active . '">' . apply_filters('the_title', $item->title, $item->ID) . '</a>';
    }
    
    function end_el(&$output, $item, $depth = 0, $args = null) {
        // No closing tag needed
    }
}

// Theme customizer options
function fastworks_customize_register($wp_customize) {
    // Hero Section
    $wp_customize->add_section('fastworks_hero', array(
        'title' => __('Hero Section', 'fastworks-ai'),
        'priority' => 30,
    ));
    
    // Contact Email
    $wp_customize->add_setting('contact_email', array(
        'default' => 'contact@fastworks.ai',
        'sanitize_callback' => 'sanitize_email',
    ));
    
    $wp_customize->add_control('contact_email', array(
        'label' => __('Contact Email', 'fastworks-ai'),
        'section' => 'fastworks_hero',
        'type' => 'email',
    ));
}
add_action('customize_register', 'fastworks_customize_register');

// Handle contact form submission
function fastworks_handle_contact_form() {
    if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['fastworks_contact_nonce'])) {
        if (!wp_verify_nonce($_POST['fastworks_contact_nonce'], 'fastworks_contact_submit')) {
            return;
        }
        
        $name = sanitize_text_field($_POST['full_name']);
        $email = sanitize_email($_POST['email']);
        $phone = sanitize_text_field($_POST['phone']);
        $subject = sanitize_text_field($_POST['subject']);
        $message = sanitize_textarea_field($_POST['message']);
        
        $to = get_option('admin_email');
        $email_subject = 'Contact Form: ' . $subject;
        $body = "Name: $name\nEmail: $email\nPhone: $phone\n\nMessage:\n$message";
        $headers = array('Content-Type: text/plain; charset=UTF-8', 'Reply-To: ' . $email);
        
        wp_mail($to, $email_subject, $body, $headers);
    }
}
add_action('init', 'fastworks_handle_contact_form');

// Shortcode for typed text
function fastworks_typed_text_shortcode($atts) {
    $atts = shortcode_atts(array(
        'text' => 'Saudi-born AI and digital transformation company dedicated to accelerating Vision 2030 and building the Kingdom\'s sovereign AI capabilities. Through five integrated pillars, we empower ministries, giga projects, enterprises, and citizens to adopt and scale next-generation AI.',
    ), $atts);
    
    return '<span class="multiple-text" data-typed-text="' . esc_attr($atts['text']) . '"></span>';
}
add_shortcode('typed_text', 'fastworks_typed_text_shortcode');
?>
