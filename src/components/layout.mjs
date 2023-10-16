import erebus from 'erebus-core';
import ErebusComponent, { createElement } from './component.mjs';
import './layout.css';

const $scope = {};

/**
 * Class representing a main page layout.  A layout is the base to organize the content.
 */
class ErebusLayout extends ErebusComponent {
	/** Allows to determine if the component has been rendered or not */
	#rendered;

	constructor() {
		super();
		this.#rendered = false;
	}

	async render() {
		if(this.#rendered) {
			console.warn('erebus.components.layout.already_rendered');
			return;
		}
		this.#rendered = true;
		await erebus.events.documentReady();
		const element = createElement('div', 'erb-layout', 'erbDivLayout');
		element.setParentNode(document.body);
	}
}

export default function() {
	if(!$scope.singleton) {
		$scope.singleton = new ErebusLayout();
	}
	return $scope.singleton;
};