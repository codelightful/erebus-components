import erebus from 'erebus-core';

/**
 * Internal method to capture the validation result for a field and adjust the view
 * accordingly
 * @param {HTMLElement} field Reference to the field element being validated
 * @param {boolean} result Boolean value with the result of the validation
 * @param {Array} failures Array containing the failures (in case the result is false)
 */
function handleValidation(field, result, failures) {
	var fieldContainer = (field) ? field.parentNode : null;
	if (!fieldContainer || fieldContainer.className.indexOf('erb-field') < 0) {
		return;
	}
	// Resets the visual status of the field
	var pillContainer = fieldContainer.querySelector('.erb-pills');
	if (pillContainer) {
		fieldContainer.removeChild(pillContainer);
	}
	if (result) {
		fieldContainer.classList.remove('erb-error');
		return;
	}
	// Marks the field as failed
	fieldContainer.classList.add('erb-error');
	if (pillContainer) {
		pillContainer.innerHTML = '';
	} else {
		pillContainer = document.createElement('div');
		pillContainer.setAttribute('class', 'erb-pills');
	}
	// Sets the validation error pills
	for (var fdx=0; fdx < failures.length; fdx++) {
		const failure = failures[fdx];
		var message = erebus.i18n.getLabel(`validation.pill.${failure.name}`, failure.name);
		if (message.indexOf('@@') >= 0) {
			var params = failure.params;
			if (typeof(params) === 'object' && typeof(params.tag) === 'string') {
				params = params.value;
			}
			if (params instanceof Date) {
				params = erebus.formats('date').format(params);
			}
			message = message.replace('@@', params);
		}
		const pill = document.createElement('div');
		pill.innerHTML = message;
		pillContainer.appendChild(pill);
	}
	fieldContainer.appendChild(pillContainer);
}

const $module = function(field, result, failures) {
	handleValidation(field, result, failures);
	// Register the events to validate the field according to the user interactions
	// this should be registered only once per field
	if (!field.getAttribute('erb-validation-handler')) {
		field.setAttribute('erb-validation-handler', 'true');
		field.addEventListener('blur', function() {
			erebus.form.validateField(this, handleValidation);
		});
	}
};

export default $module;
