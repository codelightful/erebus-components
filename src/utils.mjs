import erebus from 'erebus-core';

/**
 * Appends an element to the document body.  If the document body is not ready yet
 * then schedules a handler to add it to the document once it is ready
 * @param {HTMLElement} element Element to add
 * @param {function} callback Optional method to invoke once the element has been appended to the body
 */
function appendToBody(element, callback) {
	if (!element) {
		throw Error('erebus.utils.append_to_body.null_element');
	}
	if (document.body) {
		erebus.element(document.body).appendChild(element);
		erebus.handler.trigger(callback, element);
		return;
	}
	erebus.events.onReady(() => {
		erebus.element(document.body).appendChild(element);
		erebus.handler.trigger(callback, element);
	});
}

/**
 * Extracts or creates an HTMLElement
 * @param {string} tagName Tag name of the element to create if does not exist
 * @param {string} className CSS class name to asign to the element if does not exist
 * @param {string} id Identifier of the element to extract or create
 * @returns HTMLElement instance
 */
 function createHTMLElement(tagName, className, id) {
	const element = document.createElement(tagName);
	if (id) {
		element.setAttribute('id', id);
	}
	if (className) {
		element.className = className;
	}
	return element;
}

/**
 * Extracts or creates an ErebusElement
 * @param {string} tagName Tag name of the element to create if does not exist
 * @param {string} className CSS class name to asign to the element if does not exist
 * @param {string} id Identifier of the element to extract or create
 * @returns HTMLElement instance
 */
function createElement(tagName, className, id) {
	const element = createHTMLElement(tagName, className, id);
	return erebus.element(element);
}

/**
 * Extracts or creates an HTMLElement
 * @param {string} id Identifier of the element to extract or create
 * @param {string} tagName Tag name of the element to create if does not exist
 * @param {string} className CSS class name to asign to the element if does not exist
 * @returns HTMLElement instance
 */
function getOrCreateElement(id, tagName, className) {
	var element = document.getElementById(id);
	if (!element) {
		return createElement(tagName, className, id);
	}
	return erebus.element(element);
}

/**
 * Extracts or creates/render an HTMLElement
 * @param {string} tagName Tag name of the element to create if does not exist
 * @param {string} id Identifier of the element to extract or create
 * @param {string} className CSS class name to asign to the element if does not exist
 * @param {function} callback Optional function to be invoked after the element has been rendered
 * @returns HTMLElement instance
 */
function getOrRenderElement(id, tagName, className, callback) {
	const element = getOrCreateElement(id, tagName, className);
	appendToBody(element, callback);
	return element;
}

/**
 * Copy an attribute from an object to another
 * @param {object} target Target object
 * @param {object} source Source object
 * @param {string} attribute Name of the attribute to copy
 * @param {*} defaultValue Optional value to assign if the source object does not contain a value for the attribute
 * @returns Boolean value to determine if the source has a valid attribute and was assigned
 */
function copyAttribute(target, source, attribute, defaultValue) {
	if (!target || !source || !attribute) {
		return false;
	}
	if (Array.isArray(source)) {
		for (var idx = 0; idx < source.length; idx++) {
			if (copyAttribute(target, source[idx], attribute, defaultValue)) {
				return true;
			}
		}
		return false;
	}
	const sourceValue = source[attribute];
	if (sourceValue !== undefined && sourceValue !== null) {
		target[attribute] = sourceValue;
		return true;
	} else if (defaultValue) {
		target[attribute] = defaultValue;
	}
	return false;
}

export default { appendToBody, createHTMLElement, createElement, getOrCreateElement, getOrRenderElement, copyAttribute };
