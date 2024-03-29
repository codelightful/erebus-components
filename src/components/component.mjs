import erebus from 'erebus-core';

/**
 * Extracts or creates an HTMLElement
 * @param {string} tagName Tag name of the element to create if does not exist
 * @param {string} className CSS class name to asign to the element if does not exist
 * @param {string} id Identifier of the element to extract or create
 * @returns HTMLElement instance
 */
export function createHTMLElement(tagName, className, id) {
	const target = document.createElement(tagName);
	if (id) {
		target.setAttribute('id', id);
	}
	if (className) {
		target.className = className;
	}
	return target;
}

/**
 * Extracts or creates an ErebusElement
 * @param {string} tagName Tag name of the element to create if does not exist
 * @param {string} className CSS class name to asign to the element if does not exist
 * @param {string} id Identifier of the element to extract or create
 * @returns HTMLElement instance
 */
export function createElement(tagName, className, id) {
	const target = createHTMLElement(tagName, className, id);
	return erebus.$(target);
}

/**
 * Extracts or creates an HTMLElement
 * @param {string} id Identifier of the element to extract or create
 * @param {string} tagName Tag name of the element to create if does not exist
 * @param {string} className CSS class name to asign to the element if does not exist
 * @returns HTMLElement instance
 */
export function getOrCreateElement(id, tagName, className) {
	var target = document.getElementById(id);
	if (!target) {
		return createElement(tagName, className, id);
	}
	return erebus.$(target);
}

/**
 * Appends an element to the document body.  If the document body is not ready yet
 * then schedules a handler to add it to the document once it is ready
 * @param {*} element HTMLElement or ErebusElementI'm  to add
 */
export function appendToBody(target) {
	if (!target) {
		return Promise.reject(Error('erebus.components.append_to_body.null_element'));
	}
	if (document.body) {
		erebus.$(document.body).appendChild(target);
		return Promise.resolve(target);
	}
	return new Promise(function(resolve) {
		erebus.events.documentReady(() => {
			erebus.$(document.body).appendChild(target);
			resolve(target);
		});
	});
}

/**
 * Extracts or creates/render an HTMLElement
 * @param {string} tagName Tag name of the element to create if does not exist
 * @param {string} id Identifier of the element to extract or create
 * @param {string} className CSS class name to asign to the element if does not exist
 * @returns Promise invoked after the element has been created and appended to the body
 */
export function getOrRenderElement(id, tagName, className) {
	const target = getOrCreateElement(id, tagName, className);
	return appendToBody(target);
}

/**
 * Copy an attribute from an object to another
 * @param {object} target Target object
 * @param {object} source Source object
 * @param {string} attribute Name of the attribute to copy
 * @param {*} defaultValue Optional value to assign if the source object does not contain a value for the attribute
 * @returns Boolean value to determine if the source has a valid attribute and was assigned
 */
export function copyAttribute(target, source, attribute, defaultValue) {
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

/** Base class from which all visual components extends */
export default class ErebusComponent {
}
