import erebus from 'erebus-core';
import ErebusComponent from './component.mjs';
import utils from './utils.mjs';
import './toast.css';

const $scope = {};
$scope.validTypes = { info: 'info', success: 'success', warn: 'warn', error: 'error' };

/** Extract the default title for a specific toast type */
function getDefaultTitle(type) {
	return erebus.i18n.getLabel('toast.title.' + type, type);
}

/** Obtains the top level element that contains all the toasts */
function getToastHolder() {
	return utils.getOrRenderElement('divErbToastHolder', 'div', 'erb-toast-holder');
}

/** Internal utility function to create the element with the visual representation of the toast */
function createToastElement(specs) {
	const element = utils.createElement('div', 'erb-toast erb-' + specs.type, specs.id);
	element.appendChild('<div class="erb-icon"></div>');
	if (specs.title !== false) {
		const titleText = specs.title ?? getDefaultTitle(specs.type);
		element.appendChild('<div class="erb-header">' + titleText + '</div>');
	}
	if (specs.message) {
		element.appendChild('<div class="erb-body">' + specs.message + '</div>');
	}
	getToastHolder().appendChild(element);
	element.addClass('erb-bouncein');
	element.once('animationend', function() {
		element.removeClass('erb-bouncein');
	});
	return element;
}

/** Class to represent a toast component */
class ErebusToast extends ErebusComponent {
	#rendered; // avoid the render method to be invoked twice
	#specs; // title and message

	constructor(specs) {
		super();
		this.#specs = specs;
		this.#specs.id = 'divErbToast_' + erebus.random.tinyId();
	}

	/* Generates the visual representation of the component */
	render(callback) {
		if (this.#rendered) {
			console.warn('erebus.components.toast.already_rendered');
			erebus.handler.trigger(callback);
			return this;
		}
		this.#rendered = true;
		const element = createToastElement(this.#specs);
		element.once('click', () => {
			this.dismiss(true);
		});
		erebus.handler.trigger(callback);
		return this;
	}

	/**
	 * Closes the toast body
	 * @param {*} value Argument to define if should be close immediately (0 or true), on a specific time
	 * 				expressed with an integer number representing the number of miliseconds to close it or
	 * 				omit the argument to use the default close timer.
	 */
	dismiss(value) {
		if(value === true) {
			value = 0;
		} else if(typeof(value) !== 'number' || value <= 0) {
			value = 10000;
		}
		setTimeout(() => {
			const element = erebus.element('#' + this.#specs.id);
			element.once('animationend', function() {
				element.setParentNode(null);
			});
			element.addClass('erb-bounceout');
		}, value);
	}
}

/** Internal method to consume the call arguments to create a toast and assemble a specification object based on it */
function createSpecs() {
	var specs = {};
	if(arguments.length === 0) {
		throw Error('erebus.components.toast.no_arguments');
	}
	specs.type = arguments[0]; 
	if(arguments.length === 2) {
		specs.message = arguments[1];
	} else if(arguments.length > 2) {
		specs.title = arguments[1];
		specs.message = arguments[2];
	}
	if(!specs.type) {
		specs.type = $scope.validTypes.info;
	} else if(!$scope.validTypes[specs.type]) {
		throw Error('erebus.components.toast.invalid_type[' + specs.type + ']');
	}
	if (!specs.message) {
		throw Error('erebus.components.toast.null_message');
	}
	return specs;
}

/**
 * Generic method to create a toast with a dynamic type. Should receive: 
 * The toast type and the message
 * -or-
 * The toast type, the title and the message
 */
const $module = function () {
	const specs = createSpecs(...arguments);
	return new ErebusToast(specs).render();
};

/**
 * Creates an informational toast. Should receive: the toast message or the toast title and the message
 */
$module.info = function() {
	return $module($scope.validTypes.info, ...arguments);
};

/**
 * Creates a success toast. Should receive: the toast message or the toast title and the message
 */
$module.success = function() {
	return $module($scope.validTypes.success, ...arguments);
};

/**
 * Creates a warning toast. Should receive: the toast message or the toast title and the message
 */
$module.warn = function() {
	return $module($scope.validTypes.warn, ...arguments);
};

/**
 * Creates an error toast. Should receive: the toast message or the toast title and the message
 */
$module.error = function() {
	return $module($scope.validTypes.error, ...arguments);
};

export default $module;
