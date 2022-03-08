import erebus from 'erebus-core';
import ErebusComponent from './component.mjs';
import utils from './utils.mjs';
import './surface.css';

const $scope = {};
// Variable to hold the reference to the singleton instance
$scope.singleton = null;

/** Class implementing the surface */
class ErebusSurface extends ErebusComponent {
	#rendered; // avoid the render method to be invoked twice

	constructor() {
		super();
		this.#rendered = false;
	}

	/** Generates the visual representation of the surface component */
	render(callback) {
		if(this.#rendered) {
			console.warn('erebus.components.surface.already_rendered');
			erebus.handler.trigger(callback);
			return this;
		}
		this.#rendered = true;
		const element = utils.getOrCreateElement('divErbSurface', 'div', 'erb-surface');
		utils.appendToBody(element, callback);
		return this;
	}
}

export default function() {
	if(!$scope.singleton) {
		$scope.singleton = new ErebusSurface();
	}
	return $scope.singleton;
};