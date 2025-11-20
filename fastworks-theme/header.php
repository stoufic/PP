<!DOCTYPE html>
<html <?php language_attributes(); ?>>

<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <?php wp_head(); ?>
</head>

<body <?php body_class(); ?>>
    <?php wp_body_open(); ?>
    
    <div class="custom-cursor site-wide">
        <div class="pointer"></div>
    </div>

    <!-- header design -->
    <header class="header">
        <a href="<?php echo home_url(); ?>" class="logo">FastWorks.AI</a>

        <div class='bx bx-menu' id="menu-icon"></div>

        <nav class="navbar">
            <a href="#home" class="active">Home</a>
            <a href="#about">About</a>
            <a href="#services">Five Pillars</a>
            <a href="#portfolio">Who We Serve</a>
            <a href="#vision">Vision 2030</a>
            <a href="#contact">Book a Strategy Session</a>
        </nav>
    </header>
