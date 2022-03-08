'use strict';
import erebus from 'erebus-core';
import manager from './manager.mjs';
import surface from './surface.mjs';
import protect from './protect.mjs';
import toast from './toast.mjs';
import dialog from './dialog.mjs';
import modal from './modal.mjs';
import './erebus-components.css';
console.log('Erebus Components v0.0.1 0100');

const $scope = {};
$scope.onInit = [];

erebus.components = {};
erebus.components.get = manager.get;

const langCode = erebus.i18n.getLanguage();
import resources from '../resources/en.json';
erebus.i18n.setResourceBundle(resources, langCode);

// initialize the erebus main components once the document is ready
erebus.events.onReady(function () {
	window.surface = surface();
	window.protect = protect().render();
	window.toast = toast;
	window.dialog = dialog;
	window.modal = modal;
	for(var idx=0; idx < $scope.onInit.length; idx++) {
		erebus.handler.trigger($scope.onInit[idx]);
	}
});

/**
 * Allows to register a callback function to be invoked once the components have been initialized
 * @param {*} callback Handler to execute
 */
erebus.components.onReady = function (callback) {
	if (typeof (callback) === 'function') {
		$scope.onInit.push(callback)
	}
};

export default erebus;
