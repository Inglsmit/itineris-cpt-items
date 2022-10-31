/* eslint-disable jsx-a11y/anchor-is-valid */
import { __ } from '@wordpress/i18n';
import { RawHTML } from '@wordpress/element';
import { useBlockProps } from '@wordpress/block-editor';
import { useSelect } from '@wordpress/data';
import { Spinner, Placeholder } from '@wordpress/components';
import './editor.scss';

export default function Edit () {
	const postsPerPage = 8;
	const allPosts = useSelect( ( select ) => {
		return select( 'core' ).getEntityRecords( 'postType', 'itineris_course', {
			per_page: -1
		} );
	}, [] );

	const posts = useSelect( ( select ) => {
		return select( 'core' ).getEntityRecords( 'postType', 'itineris_course', {
			per_page: postsPerPage,
			_embed: true,
		} );
	}, [] );

	const termsCampus = useSelect( ( select ) => {
		return select( 'core' ).getEntityRecords(
			'taxonomy',
			'itineris_campus',
			{ per_page: -1, orderby: 'name', order: 'asc', _fields: 'id,name,slug' } )
	}, [] );

	const termsType = useSelect( ( select ) => {
		return select( 'core' ).getEntityRecords(
			'taxonomy',
			'itineris_type',
			{ per_page: -1, orderby: 'name', order: 'asc', _fields: 'id,name,slug' } )
	}, [] );

	const maxNumPages =
		allPosts &&
		allPosts.length &&
		Math.ceil( ( allPosts.length ) / postsPerPage );

	return (
		<div { ...useBlockProps() }>
			{ posts && posts.length ? (
				<>
					<div className="wp-block-itinerisblocks-cpt-filters">
						<div className="wp-block-itinerisblocks-cpt-filter">
							<div className="wp-block-itinerisblocks-cpt-filter__header">
								Filter by campus
							</div>
							<ul className="wp-block-itinerisblocks-cpt-filter__list">
								{ termsCampus.map( ( term, i ) => {
									return (
										<li key={ i }>{ term.name }</li>
									)
								} ) }
							</ul>
						</div>
						<div className="wp-block-itinerisblocks-cpt-filter">
							<div className="wp-block-itinerisblocks-cpt-filter__header">
								Filter by course type
							</div>
							<ul className="wp-block-itinerisblocks-cpt-filter__list">
								{ termsType.map( ( term, i ) => {
									return (
										<li key={ i }>{ term.name }</li>
									)
								} ) }
							</ul>
						</div>
					</div>

					<div className="wp-block-itinerisblocks-cpt-items__wrapp">
						<div className="wp-block-itinerisblocks-cpt-items__list">
							{ posts.map( ( post ) => {
								const currType =
									post._embedded &&
									post._embedded[ 'wp:term' ] &&
									post._embedded[ 'wp:term' ].length > 0 &&
									post._embedded[ 'wp:term' ][ 0 ][ 0 ].name;

								const currCampus =
									post._embedded &&
									post._embedded[ 'wp:term' ] &&
									post._embedded[ 'wp:term' ].length > 0 &&
									post._embedded[ 'wp:term' ][ 1 ];

								const featuredImage =
									post._embedded &&
									post._embedded[ 'wp:featuredmedia' ] &&
									post._embedded[ 'wp:featuredmedia' ].length > 0 &&
									post._embedded[ 'wp:featuredmedia' ][ 0 ];

								const duration =
									post.meta &&
									post.meta._itineris_sidebar_opt_duartion_meta;

								return (
									<div
										className="wp-block-itinerisblocks-cpt-items__card"
										key={ post.id }
									>
										<div className="wp-block-itinerisblocks-cpt-items__card-img">
											<a href={ post.link }>
												<>
													{ featuredImage && (
														<img
															className={ featuredImage.id ? `wp-image-${ featuredImage.id }` : null }
															src={
																featuredImage.source_url
															}
															alt={ featuredImage.alt_text }
														/>
													) }
												</>
											</a>
										</div>
										<div className="wp-block-itinerisblocks-cpt-items__card-inner">
											<h2 className="wp-block-itinerisblocks-cpt-items__card-title">
												<a href={ post.link }>
													{ post.title.rendered ? (
														<RawHTML>
															{ post.title.rendered }
														</RawHTML>
													) : (
														__( '(No title)', 'itinerisblocks' )
													) }
												</a>
											</h2>
											<p className="wp-block-itinerisblocks-cpt-items__card-text">
												{ currType }
											</p>
											<p className="wp-block-itinerisblocks-cpt-items__card-text">
												{ duration }
											</p>
										</div>
										<div className="wp-block-itinerisblocks-cpt-items__card-tags">
											{ currCampus &&
												currCampus.map( ( term ) => {
													const campusName = term.name.split( ' ' ).slice( 0, 2 ).join( ' ' );
													const abbr = campusName.match( /\b(\w)/g ).join( '' );
													return (
														<>
															<a
																className="wp-block-itinerisblocks-cpt-items__card-tag"
																href={ term.link }
															>
																{ abbr }
															</a>
														</>
													);
												} ) }
										</div>
									</div>
								);
							} ) }
						</div>


						{ maxNumPages > 4 ? (
							<>
								<div className="wp-block-itinerisblocks-cpt-items__paginator">
									<span
										aria-current="page"
										className="page-numbers current"
									>
										1
									</span>
									<a className="page-numbers" href="#">
										2
									</a>
									<a className="page-numbers" href="#">
										3
									</a>
									<span className="page-numbers dots">…</span>
									<a className="page-numbers" href="#">
										{ maxNumPages }
									</a>
									<a className="next page-numbers" href="#">
										{ __( 'Next »', 'itinerisblocks' ) }
									</a>
								</div>
							</>
						) : (
							<>
								<div className="wp-block-itinerisblocks-cpt-items__paginator">
									<span
										aria-current="page"
										className="page-numbers current"
									>
										1
									</span>
									{ [ ...Array( maxNumPages + 1 ) ].map( ( e, i ) => {
										return (
											i > 1 && (
												<a
													key={ i }
													className="page-numbers"
													href="#"
												>
													{ i }
												</a>
											)
										);
									} ) }
									<a className="next page-numbers" href="#">
										{ __( 'Next »', 'itinerisblocks' ) }
									</a>
								</div>
							</>
						) }
					</div>
				</>
			) : (
				<>
					{ posts === null ? (
						<Placeholder
							icon={ 'admin-generic' }
							// eslint-disable-next-line @wordpress/i18n-ellipsis
							label={ __( 'Courses list is loading...', 'itinerisblocks' ) }
						>
							<Spinner />
						</Placeholder>
					) : (
						<>
							<p>
								{ __( 'Sorry, Courses not found.', 'itinerisblocks' ) }
							</p>
						</>
					) }
				</>
			) }
		</div>
	);
}
