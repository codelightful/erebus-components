import erebus from 'erebus-core';
import './toast.css';

/** Constant with the identifier used for the DOM element containing all the toasts */
const TOAST_CONTAINER_ID = 'divErebusToastContainer';
/** Constant with the prefix used to generate the toast identifiers */
const TOAST_ID_PREFIX = 'erbToast_';
/** Constant with the default time (in milis) used to dismiss the toasts automatically */
const DEFAULT_TIMEOUT = 8000;
/** Hold a reference to every toast element that is opened */
const openToasts = {};
/** Reference to the event triggered when the toast is closed */
const closeEvent = new CustomEvent('toast-close');

/** Extract the default title for a specific toast type */
function getDefaultTitle(type) {
	return erebus.i18n.getLabel(`toast.title.${type}`, type);
}

/** Obtains (or creates if does not exist) the main container used to position all the toasts */
async function getOrCreateToastContainer() {
	await erebus.events.documentReady();
	var container = document.getElementById(TOAST_CONTAINER_ID);
	if (!container) {
		container = document.createElement('div');
		container.setAttribute('id', TOAST_CONTAINER_ID);
		container.setAttribute('class', 'erb-toast-container');
		document.body.appendChild(container);
	}
	return container;
}

function createToastTitle(container, toastType, title) {
	const titleElement = document.createElement('div');
	titleElement.setAttribute('class', 'erb-header');
	if (!title) {
		title = getDefaultTitle(toastType);
	}
	titleElement.innerHTML = title;
	container.appendChild(titleElement);
}

function createToastBody(container, message) {
	const bodyElement = document.createElement('div');
	bodyElement.setAttribute('class', 'erb-body');
	bodyElement.innerHTML = message;
	container.appendChild(bodyElement);
}

function createToastBox(toastId, toastType, message, title) {
	const toastBox = document.createElement('div');
	toastBox.setAttribute('id', TOAST_ID_PREFIX + toastId);
	toastBox.setAttribute('class', 'erb-toast erb-' + toastType);
	createToastTitle(toastBox, toastType, title);
	createToastBody(toastBox, message);
	return toastBox;
}

class ErebusToast {
	#id;
	#type;
	#message;
	#title;
	#status;

	constructor(toastType, message, title) {
		this.#id = erebus.random.shortId();
		this.#type = toastType;
		this.#message = message;
		this.#title = title;
		// Allows to determine the toast status (-1=Never opened, 1=Opened, 0=Closed)
		this.#status = -1;
	}

	async open() {
		if (this.#status == 1) {
			return;
		}
		this.#status = 1;
		const toastBox = createToastBox(this.#id, this.#type, this.#message, this.#title);
		toastBox.addEventListener('click', () => {
			this.close();
		});
		const container = await getOrCreateToastContainer();
		container.appendChild(toastBox);
		await erebus.events.animate(toastBox, 'erb-open');
		openToasts[this.#id] = this;
		return this;
	}

	autoClose(timing) {
		if (!timing || typeof(timing) !== 'number') {
			timing = DEFAULT_TIMEOUT;
		}
		setTimeout(() => {
			this.close();
		}, timing);
	}

	close() {
		if (this.#status !== 1) {
			console.warn('erebus.components.toast.already_closed');
			return Promise.resolve(false);
		}
		this.#status = 0;
		delete openToasts[this.#id];
		const toastBox = document.getElementById(TOAST_ID_PREFIX + this.#id);
		if (!toastBox) {
			console.warn('erebus.components.toast.toast_element_not_found');
			return Promise.resolve(false);
		}
		return new Promise((resolve) => {
			erebus.events.animate(toastBox, 'erb-closed').then(() => {
				toastBox.classList.remove('erb-open');
				toastBox.parentElement.removeChild(toastBox);
				setTimeout(() => {
					toastBox.dispatchEvent(closeEvent);
					resolve(true);
				});
			});
		});
	}

	/**
     * Adds an event listener triggered after the toast has been closed
     * @param {function} handler Function to be triggered after the toast has been closed
     * @param {object} params Parameters to define the listener behavior. To set the listener to be triggered only once use { once: true }.
     */
	onClose(handler, params) {
		if(typeof(handler) !== 'function') {
			throw Error('erebus.components.toast.on_close.invalid_handler');
		}
		const toastBox = document.getElementById(TOAST_ID_PREFIX + this.#id);
		toastBox.addEventListener('toast-close', handler, params);
	}
}

const $module = async function(toastType, message, title) {
	const toast = new ErebusToast(toastType, message, title);
	return toast.open();
};

/** Contains constants for all the module types */
$module.TYPE = { info: 'info', success: 'success', warn: 'warn', error: 'error' };

/**
 * Create an error toast with specific content on it
 * @param {string} content HTML content to put in the toast
 */
$module.error = function(messsage, title) {
	return $module($module.TYPE.error, messsage, title);
};

/**
 * Create a warning toast with specific content on it
 * @param {string} content HTML content to put in the toast
 */
$module.warn = function(messsage, title) {
	return $module($module.TYPE.warn, messsage, title);
};

/**
 * Create a success toast with specific content on it
 * @param {string} content HTML content to put in the toast
 */
$module.success = function(messsage, title) {
	return $module($module.TYPE.success, messsage, title);
};

/**
 * Create an info toast with specific content on it
 * @param {string} content HTML content to put in the toast
 */
$module.info = function(messsage, title) {
	return $module($module.TYPE.info, messsage, title);
};

/**
 * Closes all the open toasts
 */
$module.closeAll = async function() {
	for(var toastId in openToasts) {
		const toast = openToasts[toastId];
		if (toast) {
			await toast.close();
		}
	}
};

export default $module;
