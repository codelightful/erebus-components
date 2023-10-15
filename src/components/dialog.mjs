import erebus from 'erebus-core';
import ErebusComponent from './components/component.mjs';
import protect from './protect.mjs';
import './dialog.css';

const $scope = {};
$scope.validTypes = { info: 'info', success: 'success', warn: 'warn', error: 'error', confirm: 'confirm' };
// contains the list of dialogs to be open
$scope.queue = [];
// contains the reference to the current dialog (if there is any dialog open)
$scope.current = null;
// reference to the singleton top level element representing the dialog
$scope.element = null;

/** Extract the default title for a specific dialog type */
function getDefaultTitle(type) {
	return erebus.i18n.getLabel('dialog.title.' + type, type);
}

/** Removes a dialog instance from the queue */
function removeFromQueue(dialog) {
	if ($scope.queue.length === 0) {
		console.log('Queue is empty. Nothing to remove. id=' + dialog.id);
		return;
	}
	const index = $scope.queue.findIndex(item => item.id === dialog.id);
	console.log('Searching dialog id=' + dialog.id + ' size=' + $scope.queue.length + ' index=' + index);
	if (index >= 0) {
		console.log('Removing dialog ' + dialog.id);
		$scope.queue.splice(index, 1);
	}
}

/** Process the next queued dialog (if there is any) */
function nextDialog() {
	console.log('Extracting next dialog. size=' + $scope.queue.length);
	const next = $scope.queue.shift();
	if (next) {
		next.render();
		return true;
	}
	return false;
}

/** Class to represent a dialog component */
class ErebusDialog extends ErebusComponent {
	#rendered; // avoid the render method to be invoked twice
	#afterCloseListeners; // contains all the close listeners registered for this innstance
	#specs; // type, title, message, closeValue

	constructor(specs) {
		super();
		this.#rendered = false;
		this.#afterCloseListeners = [];
		this.#specs = specs;
		this.#specs.id = erebus.random.tinyId();
		console.log('Creating dialog id=' + this.#specs.id);
	}

	/** Dialog unique identifier */
	get id() {
		return this.#specs.id;
	}

	/** Internal method to create elements that represents different parts of the dialog */
	#renderDialogPart(style, content, init) {
		const dialogPart = utils.createElement('div', style);
		if (content) {
			dialogPart.content(content);
		}
		if (init === true) {
			$scope.element.content(dialogPart);
		} else {
			$scope.element.appendChild(dialogPart);
		}
		return dialogPart;
	}

	/** Internal method to render the dialog footer */
	#renderFooter() {
		const footer = this.#renderDialogPart('erb-footer');
		if(this.#specs.type === 'confirm') {
			const yessButton = utils.createHTMLElement('button', 'erb-button erb-positive');
			yessButton.innerHTML = erebus.i18n.getLabel('button.yes', 'Yes');
			yessButton.addEventListener('click', () => { 
				this.#specs.closeValue = true;
				this.close(); 
			});
			footer.appendChild(yessButton);

			const noButton = utils.createHTMLElement('button', 'erb-button erb-negative');
			noButton.innerHTML = erebus.i18n.getLabel('button.no', 'No');
			noButton.addEventListener('click', () => { 
				this.#specs.closeValue = false;
				this.close(); 
			});
			footer.appendChild(noButton);
		} else {
			const closeButton = utils.createHTMLElement('button', 'erb-button erb-primary');
			closeButton.innerHTML = erebus.i18n.getLabel('button.close', 'Close');
			closeButton.addEventListener('click', () => { 
				this.close(); 
			});
			footer.appendChild(closeButton);
		}
	}

	/** Internal method to render all the dialog elements */
	#renderDialogElements() {
		const className = 'erb-dialog erb-' + this.#specs.type;
		if (!$scope.element) {
			$scope.element = utils.getOrCreateElement('divErbDialog', 'div', className);
		} else {
			$scope.element.className = className;
		}
		this.#renderDialogPart('erb-header', this.#specs.title, true);
		this.#renderDialogPart('erb-body', this.#specs.message);
		const topClose = this.#renderDialogPart('erb-close');
		topClose.once('click', () => { this.close(); });
		this.#renderFooter();
	}

	/** Queue a dialog instance to be the next to be opened */
	_queue() {
		if ($scope.current && $scope.current.id === this.id) {
			console.log('Returning dialog to the queue id=' + this.id);
			$scope.queue.unshift(this);
			this.#rendered = false;
		} else {
			console.log('Queuing dialog id=' + this.id);
			$scope.queue.push(this);
		}
	}

	/* Generates the visual representation of the component */
	render(callback) {
		if (this.#rendered) {
			erebus.handler.trigger(callback);
			return this;
		}
		console.log('Rendering dialog id=' + this.id);
		this.#rendered = true;
		removeFromQueue(this);
		// if there is any open dialog then move it back to the queue
		if ($scope.current && $scope.current.id !== this.id) {
			$scope.current._queue();
		}
		$scope.current = this;
		this.#renderDialogElements();
		protect().show();
		$scope.element.addClass('erb-fadein');
		utils.appendToBody($scope.element, () => {
			$scope.element.once('animationend', () => {
				$scope.element.removeClass('erb-fadein');
				erebus.handler.trigger(callback, this.#specs.closeValue);
			});
		});
		return this;
	}

	/**
	 * Closes the dialog
	 * @param {int} timer Optional numeric value to close the dialog after a specific period expressed in miliseconds
	 * @param {function} callback Optional function to be invoked after the dialog has been closed
	 */
	close() {
		var timer = 0;
		var callback = null;
		if (arguments.length === 1) {
			if (typeof (arguments[0]) === 'number') {
				timer = arguments[0];
			} else if (typeof (arguments[0]) === 'function') {
				callback = arguments[0];
			}
		} else if (arguments.length === 2) {
			timer = arguments[0];
			callback = arguments[1];
		}
		if (timer < 0) {
			timer = 0;
		}
		setTimeout(() => {
			if ($scope.current.id !== this.id) {
				console.log('Closing queued dialog id=' + this.id);
				removeFromQueue(this);
				erebus.handler.trigger(callback);
			} else {
				console.log('Closing current dialog id=' + this.id);
				$scope.element.addClass('erb-fadeout');
				$scope.element.once('animationend', () => {
					$scope.current = null;
					$scope.element.setParentNode(null);
					$scope.element.removeClass('erb-fadeout');
					// adds the subsequent actions to the event loop to allow the refresh of the UI
					setTimeout(() => {
						erebus.handler.trigger(callback);
						this.#triggerAfterClose();
						if(!nextDialog()) {
							protect().hide();
						}
					}, 0);
				});
			}
		}, timer);
	}

	/**
	 * Allows to register a handler invoked once the dialog has been closed
	 * @param {function} listener Function invoked when the dialog has been closed.  In the case of the confirmation dialogs
	 * 			the handler function will receive a boolean value to determine the user selection.
	 * @returns Dialog instance to write fluent expressions
	 */
	then(listener) {
		if(typeof(listener) === 'function') {
			this.#afterCloseListeners.push(listener);
		}
		return this;
	}

	/** Internal method to trigger the action handlers registered to be executed when the dialog is closed */
	#triggerAfterClose() {
		for(let idx=0; idx < this.#afterCloseListeners.length; idx++) {
			erebus.handler.trigger(this.#afterCloseListeners[idx], this.#specs.closeValue);
		}
	}
}

/** Internal method to consume the call arguments to create a dialog and assemble a specification object based on it */
function createSpecs() {
	var specs = {};
	if (arguments.length === 0) {
		throw Error('erebus.components.dialog.no_arguments');
	}
	specs.type = arguments[0];
	if (arguments.length === 2) {
		specs.message = arguments[1];
	} else if (arguments.length > 2) {
		specs.title = arguments[1];
		specs.message = arguments[2];
	}
	if (!specs.type) {
		specs.type = $scope.validTypes.info;
	} else if (!$scope.validTypes[specs.type]) {
		throw Error('erebus.components.dialog.invalid_type[' + specs.type + ']');
	}
	if (!specs.title) {
		specs.title = getDefaultTitle(specs.type);
	}
	if (!specs.message) {
		throw Error('erebus.components.dialog.null_message');
	}
	return specs;
}

/**
 * Generic method to create a dialog with a dynamic type. Should receive: 
 * The dialog type and the message
 * -or-
 * The dialog type, the title and the message
 */
const $module = function () {
	const specs = createSpecs(...arguments);
	const dialog = new ErebusDialog(specs);
	if (!$scope.current) {
		return dialog.render();
	}
	dialog._queue();
	return dialog;
};

/**
 * Creates an informational dialog. Should receive: the dialog message or the dialog title and the message
 */
$module.info = function () {
	return $module($scope.validTypes.info, ...arguments);
};

/**
 * Creates a success dialog. Should receive: the dialog message or the dialog title and the message
 */
$module.success = function () {
	return $module($scope.validTypes.success, ...arguments);
};

/**
 * Creates a warning dialog. Should receive: the dialog message or the dialog title and the message
 */
$module.warn = function () {
	return $module($scope.validTypes.warn, ...arguments);
};

/**
 * Creates an error dialog. Should receive: the dialog message or the dialog title and the message
 */
$module.error = function () {
	return $module($scope.validTypes.error, ...arguments);
};

/**
 * Creates a confirm dialog. Should receive: the dialog message or the dialog title and the message
 */
$module.confirm = function () {
	return $module($scope.validTypes.confirm, ...arguments);
};

export default $module;
