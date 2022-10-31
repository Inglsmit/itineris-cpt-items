import { registerBlockType } from '@wordpress/blocks';
import './style.scss';
import Edit from './edit';
import save from './save';

registerBlockType( 'itinerisblocks/cpt-items', {
	edit: Edit,
	save,
} );
