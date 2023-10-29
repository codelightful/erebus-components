import erebus from 'erebus-core';
import protect from './protect.mjs';
import './dialog.css';

/** Constant with the identifier for the DOM element containing the dialog */
const DIALOG_CONTAINER_ID = 'divErebusDialog';

const $scope = {};
// contains the list of dialogs to be open
$scope.queue = [];
// contains the reference to the current dialog (if there is any dialog open)
$scope.current = null;

/** Extract the default title for a specific dialog type */
function getDefaultTitle(type) {
	return erebus.i18n.getLabel(`dialog.title.${type}`, type);
}

/** Collects and opens the next dialog in the queue */
function nextDialog() {
	const dialog = $scope.queue.shift();
	if (dialog) {
		dialog.open();
	} else {
		$scope.current = null;
	}
}

/**
 * Internal utility method to obtain the reference to the DOM element that represents the dialog top container or 
 * creates it in case it does not exist.
 * @param {string} dialogType String with the dialog type
 * @returns Reference to the dialog container
 */
function getOrCreateDialogContainer(dialogType) {
	var container = document.getElementById(DIALOG_CONTAINER_ID);
	if (!container) {
		container = document.createElement('div');
		container.setAttribute('id', DIALOG_CONTAINER_ID);
	} else {
		container.parentElement.removeChild(container);
		container.innerHTML = '';
	}
	container.setAttribute('class', 'erb-dialog erb-' + dialogType);
	return container;
}

/**
 * Creates the DOM element that renders an X close button inside the dialog
 * @param {HTMLElement} container Reference to the DOM element that represents the dialog top container
 * @returns Reference to the element added to the dialog
 */
function createTopCloseButton(container) {
	const topClosebutton = document.createElement('div');
	topClosebutton.setAttribute('class', 'erb-close');
	container.appendChild(topClosebutton);
	return topClosebutton;
}

/**
 * Creates the DOM element that renders the dialog title
 * @param {HTMLElement} container Reference to the DOM element that represents the dialog top container
 * @param {string} title String with the dialog title (text or HTML)
 */
function createDialogTitle(container, title) {
	const titleArea = document.createElement('div');
	titleArea.setAttribute('class', 'erb-header');
	titleArea.innerHTML = title;
	container.appendChild(titleArea);
}

/**
 * Creates the DOM element that renders the dialog body
 * @param {HTMLElement} container Reference to the DOM element that represents the dialog top container
 * @param {string} title String with the dialog content (text or HTML)
 */
function createDialogBody(container, message) {
	const bodyArea = document.createElement('div');
	bodyArea.setAttribute('class', 'erb-body');
	bodyArea.innerHTML = message;
	container.appendChild(bodyArea);
}

/**
 * Internal utility method to create a dialog button
 * @param {HTMLElement} buttonContainer Reference to the DOM element to append the button into it
 * @param {string} buttonText String with the button text
 * @param {string} buttonClass String with the button CSS class used as modifier
 * @param {Function} listener Reference to a function to be invoked when the button is clicked
 */
function createDialogButton(buttonContainer, buttonText, buttonClass, listener) {
	const closeButton = document.createElement('button');
	closeButton.setAttribute('class', buttonClass);
	closeButton.innerHTML = buttonText;
	closeButton.addEventListener('click', listener);
	buttonContainer.appendChild(closeButton); 
}

/**
 * Cerates the DOM element that renders the dialog footer
 * @param {HTMLElement} container Reference to the DOM element that represents the dialog top container
 */
function createDialogFooter(container, dialogType, dialogReference) {
	const footerArea = document.createElement('div');
	footerArea.setAttribute('class', 'erb-footer');
	if (dialogType === $module.TYPE.confirm) {
		const yesLabel = erebus.i18n.getLabel('button.yes', 'Yes');
		createDialogButton(footerArea, yesLabel, 'erb-button erb-positive', function() {
			dialogReference.close(true);
		});
		const noLabel = erebus.i18n.getLabel('button.no', 'No');
		createDialogButton(footerArea, noLabel, 'erb-button erb-negative', function() {
			dialogReference.close(false);
		});
	} else {
		const closeLabel = erebus.i18n.getLabel('button.close', 'Close');
		createDialogButton(footerArea, closeLabel, 'erb-button', function() {
			dialogReference.close();
		});
	}
	container.appendChild(footerArea);
}

/** Class representing a dialog instance providing methods to interact with the dialog DOM representation */
class ErebusDialog {
	// String with the type of dialog
	#type;
	// String with the dialog message
	#message;
	// String with the dialog title or null to use the default title depending on the dialog type
	#title;
	// Reference to a function used as a handler to be invoked when the dialog is closed
	#onClose;
	
	constructor(dialogType, message, title, onClose) {
		if (!title) {
			title = getDefaultTitle(dialogType);
		}
		this.#type = dialogType;
		this.#message = message;
		this.#title = title;
		this.#onClose = onClose;
	}

	/**
	 * Opens the dialog instance
	 */
	async open() {
		$scope.current = this;
		protect.show();
		const container = getOrCreateDialogContainer(this.#type);
		if (this.#type !== $module.TYPE.confirm) {
			const topCloseButton = createTopCloseButton(container);
			topCloseButton.addEventListener('click', () => {
				this.close();
			});
		}
		createDialogTitle(container, this.#title);
		createDialogBody(container, this.#message);
		createDialogFooter(container, this.#type, this);
		await erebus.events.documentReady();
		document.body.appendChild(container);
	}

	/**
	 * Closes the dialog instance
	 * @param {*} value Optional value pass to the promise fullfilled when the dialog was opened
	 */
	async close(value) {
		var container = document.getElementById(DIALOG_CONTAINER_ID);
		container.classList.add('erb-hidden');
		container.innerHTML = '';
		$scope.current = null;
		protect.hide();
		setTimeout(() => {
			this.#onClose(value);
			nextDialog();
		}, 0);
	}
}

/**
 * Generic method to create a dialog with a dynamic type. Should receive: 
 * @param {string} dialogType String with the type of dialog to create (info, success, warn, error, confirm).
 * 		The following constants can be used: 
 * 			- Erebus.dialog.TYPE.info.
 * 			- Erebus.dialog.TYPE.success.
 * 			- Erebus.dialog.TYPE.warn.
 * 			- Erebus.dialog.TYPE.error.
 * 			- Erebus.dialog.TYPE.confirm.
 * @param {string} message String with the message or HTML content to show in the dialog body
 * @param {string} title Optional string with the title of the dialog or omit to use the default title
 * @returns Promise to be fulfilled when the dialog has been dismiss by the user
 */
const $module = function (dialogType, message, title) {
	return new Promise(function(resolve) {
		const dialog = new ErebusDialog(dialogType, message, title, resolve);
		if ($scope.current) {
			$scope.queue.push(dialog);
		} else {
			dialog.open();
		}
	});
};

/** Contains constants for all the dialog types */
$module.TYPE = { info: 'info', success: 'success', warn: 'warn', error: 'error', confirm: 'confirm' };

/**
 * Creates an informational dialog.
 * @param {string} message String with the message or HTML content to show in the dialog body
 * @param {string} title Optional string with the title of the dialog or omit to use the default title
 * @returns Promise to be fulfilled when the dialog has been dismiss by the user
 */
$module.info = function (message, title) {
	return $module($module.TYPE.info, message, title);
};

/**
 * Creates a success dialog.
 * @param {string} message String with the message or HTML content to show in the dialog body
 * @param {string} title Optional string with the title of the dialog or omit to use the default title
 * @returns Promise to be fulfilled when the dialog has been dismiss by the user
 */
$module.success = function (message, title) {
	return $module($module.TYPE.success, message, title);
};

/**
 * Creates a warning dialog.
 * @param {string} message String with the message or HTML content to show in the dialog body
 * @param {string} title Optional string with the title of the dialog or omit to use the default title
 * @returns Promise to be fulfilled when the dialog has been dismiss by the user
 */
$module.warn = function (message, title) {
	return $module($module.TYPE.warn, message, title);
};

/**
 * Creates an error dialog.
 * @param {string} message String with the message or HTML content to show in the dialog body
 * @param {string} title Optional string with the title of the dialog or omit to use the default title
 * @returns Promise to be fulfilled when the dialog has been dismiss by the user
 */
$module.error = function (message, title) {
	return $module($module.TYPE.error, message, title);
};

/**
 * Creates a confirm dialog.
 * @param {string} message String with the message or HTML content to show in the dialog body
 * @param {string} title Optional string with the title of the dialog or omit to use the default title
 * @returns Promise to be fulfilled with the selection of the user
 */
$module.confirm = function (message, title) {
	return $module($module.TYPE.confirm, message, title);
};

export default $module;
