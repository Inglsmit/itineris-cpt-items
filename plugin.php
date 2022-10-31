<?php
/**
 * Plugin Name:       Itineris CPT items
 * Description:       Dynamic block which display the most recent custom post type (CPT) items.
 * Requires at least: 5.7
 * Requires PHP:      7.0
 * Version:           0.1.0
 * Author:            Paul Inglsmit
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       cpt-items
 *
 * @package           itinerisblocks
 */

/**
 * Registers the block using the metadata loaded from the `block.json` file.
 * Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://developer.wordpress.org/block-editor/tutorials/block-tutorial/writing-your-first-block-type/
 */

function itineris_cpt_items_render_latest_posts_block($attributes) {
	$page = get_query_var( 'paged', 1 );

	$args = array(
		'posts_per_page' => 8,
		'paged' => $page,
		'post_status' => 'publish',
		'post_type'   => 'itineris_course',
	);

	$all_terms_campus = get_terms( 'itineris_campus', [
		'hide_empty' => false,
	] );

	$all_terms_type = get_terms( 'itineris_type', [
		'hide_empty' => false,
	] );

	$latest_posts = new WP_Query($args);
	ob_start();
	?>



	<div class="wp-block-itinerisblocks-cpt-items">
		<div class="wp-block-itinerisblocks-cpt-filters">
			<div class="wp-block-itinerisblocks-cpt-filter">
				<div class="wp-block-itinerisblocks-cpt-filter__header">
					Filter by campus
				</div>
				<ul class="wp-block-itinerisblocks-cpt-filter__list">
					<?php
						foreach($all_terms_campus as $term){
							?>
							<li><?php echo $term->name ?></li>
							<?php
						}
					?>
				</ul>
			</div>
			<div class="wp-block-itinerisblocks-cpt-filter">
				<div class="wp-block-itinerisblocks-cpt-filter__header">
					Filter by course type
				</div>
				<ul class="wp-block-itinerisblocks-cpt-filter__list">
					<?php
						foreach($all_terms_type as $term){
							?>
							<li><?php echo $term->name ?></li>
							<?php
						}
					?>
				</ul>
			</div>
		</div>

		<div class="wp-block-itinerisblocks-cpt-items__wrapp">
			<?php if ( $latest_posts->have_posts() ): ?>
				<div class="wp-block-itinerisblocks-cpt-items__list">				
					<?php
					while($latest_posts->have_posts() ): $latest_posts->the_post();
						$post_id = $latest_posts->post->ID;
						$title = get_the_title();
						$title = $title ? $title : __('(No title)','itinerisblocks');
						$permalink = get_permalink();
						$thumb = get_the_post_thumbnail( $post_id, 'full' );
						$terms_campus = get_the_terms( $post_id, 'itineris_campus' );
						$terms_type = get_the_terms( $post_id, 'itineris_type' );

						$meta_duration = get_post_meta( $post_id, '_itineris_sidebar_opt_duartion_meta', true );
						$meta_code_url = get_post_meta( $post_id, '_itineris_sidebar_opt_code_url_meta', true );
					?>
						<div class="wp-block-itinerisblocks-cpt-items__card">
							<div class="wp-block-itinerisblocks-cpt-items__card-img">
								<a href="<?php echo esc_url( $permalink ) ?>">
									<?php echo $thumb; ?>
								</a>
							</div>
							<div class="wp-block-itinerisblocks-cpt-items__card-inner">
								<h2 class="wp-block-itinerisblocks-cpt-items__card-title">
									<a href="<?php echo esc_url( $permalink ) ?>"><?php echo esc_html( $title ) ?></a>
								</h2>
								<p class="wp-block-itinerisblocks-cpt-items__card-text"><?php echo esc_html( $terms_type[0]->name ) ?></p>
								<p class="wp-block-itinerisblocks-cpt-items__card-text"><?php echo esc_html( $meta_duration ) ?></p>
							</div>
							<div class="wp-block-itinerisblocks-cpt-items__card-tags">
								<?php if(is_array( $terms_campus )): ?>
									<?php foreach( $terms_campus as $cur_term ): ?>
										<?php
											$words = explode(" ", $cur_term->name);
											$abbr = "";
											foreach ($words as $key => $w) {
												if($key > 1 ) break;
												$abbr .= mb_substr($w, 0, 1);
											}
										?>
										<a class="wp-block-itinerisblocks-cpt-items__card-tag" href="<?php echo esc_url(get_term_link( $cur_term->term_id, $cur_term->taxonomy )) ?>"><?php echo esc_html($abbr) ?></a>
									<?php endforeach; ?>
								<?php endif; ?>
							</div>
						</div>
					<?php endwhile; ?>
				</div>
				<div class="wp-block-itinerisblocks-cpt-items__paginator">
					<?php
						$big = 999999999; 

						$args = array(
							'base'    => str_replace( $big, '%#%', get_pagenum_link( $big ) ),
							'format'  => '',
							'current' => max( 1, get_query_var('paged') ),
							'total'   => $latest_posts->max_num_pages,
						);

						$result = paginate_links( $args );

						$result = preg_replace( '~page/1/~', '', $result );
						echo $result;
						wp_reset_postdata();
					?>
				</div>
			<?php else:	?>
				<p><?php echo esc_html__( 'Sorry, courses not found.', 'itinerisblocks' ) ?></p>
			<?php endif; ?>
		</div>
	</div>

	<?php
	$content = ob_get_contents();
	ob_end_clean();

	return $content;
}

function itineris_cpt_items_block_init() {
	register_block_type_from_metadata( __DIR__,  array(
		'render_callback' => 'itineris_cpt_items_render_latest_posts_block'
	) );
}
add_action( 'init', 'itineris_cpt_items_block_init' );