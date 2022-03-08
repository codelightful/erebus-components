import erebus from "erebus-core";
import ErebusComponent from './component.mjs';
import utils from "./utils.mjs";
import './protect.css';

const $scope = {};
// Variable to hold the reference to the singleton instance
$scope.singleton = null;

/** Class implementing the protection layer */
class ErebusProtect extends ErebusComponent {
	#rendered; // avoid the render method to be invoked twice
	#visible; // allows to determine if the protect layer is visible or not

	constructor() {
		super();
		this.#visible = false;
	}

	#getElement() {
		return utils.getOrCreateElement('divErbProtect', 'div', 'erb-protect erb-hidden');
	}

	/** Generates the visual representation of the surface component */
	render(callback) {
		if(this.#rendered) {
			console.warn('erebus.components.protect.already_rendered');
			erebus.handler.trigger(callback);
			return this;
		}
		this.#rendered = true;
		const element = this.#getElement();
		utils.appendToBody(element, callback);
		return this;
	}

	/** Makes visible the protection layer */
	show() {
		if(!this.#rendered) {
			this.render();
		} else if(this.#visible) {
			return;
		}
		this.#visible = true;
		this.#getElement().removeClass('erb-hidden');
	}

	/** Hides the protection layer */
	hide() {
		if(!this.#rendered) {
			this.render();
		} else if(!this.#visible) {
			return;
		}
		this.#visible = false;
		this.#getElement().addClass('erb-hidden');
	}
}

export default function () {
	if (!$scope.singleton) {
		$scope.singleton = new ErebusProtect();
	}
	return $scope.singleton;
}