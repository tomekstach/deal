<?php

/**
 * Content Width
 * ( WP requires it and LC uses is to figure out the wrapper width )
 */

if ( ! isset( $content_width ) )
	$content_width = 1140;

/**
 * Basic Theme Setup
 */

if ( ! function_exists( 'lct_theme_setup' ) ) {

	function lct_theme_setup() {

		// Add default posts and comments RSS feed links to head
		add_theme_support( 'automatic-feed-links' );

		// Enable Post Thumbnails ( Featured Image )
		add_theme_support( 'post-thumbnails' );

		// Title tag support
		add_theme_support( 'title-tag' );

		// Enable support for HTML5 markup.
		add_theme_support( 'html5', array( 'comment-list', 'search-form', 'comment-form' ) );

	}

} add_action( 'after_setup_theme', 'lct_theme_setup' );

/**
 * Load Scripts
 */

function lct_load_scripts() {

	// CSS
	wp_enqueue_style( 'main-style', get_stylesheet_uri(), array(), '1.0' );

	// JavaScript
	wp_enqueue_script( 'jquery' );

} add_action( 'wp_enqueue_scripts', 'lct_load_scripts' );

/**
 * Menu
 */
// Mark (highlight) custom post type parent as active item in Wordpress Navigation
add_action('nav_menu_css_class', 'add_current_nav_class', 10, 2 );

function add_current_nav_class($classes, $item) {

	// Getting the current post details
	global $post;

	// Getting the URL of the menu item
	$menu_slug	= strtolower(trim($item->url));

	if (($post->post_name == 'program' || $post->post_name == 'historia-zmian') && substr($menu_slug, -10) == '/programy/') {
		$classes[] = 'current-menu-item current_page_item page_item page-item-'.$item->object_id;
	}

	// Return the corrected set of classes to be added to the menu item
	return $classes;
}

/**
 * Include Files
 */

include get_template_directory() . '/live-composer/init.php';
include get_template_directory() . '/inc/importer/init.php';
