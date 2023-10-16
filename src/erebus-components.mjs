'use strict';
import erebus from 'erebus-core';
import './erebus-components.css';
import './badge.css';
import layout from './components/layout.mjs';
import toast from './components/toast.mjs';
console.log('Erebus Components v0.0.7');

const $scope = {};
$scope.handlers = {};
$scope.handlers.componentReady = [];

const langCode = erebus.i18n.getLanguage();
import resources from '../resources/en.mjs';
erebus.i18n.setResourceBundle(resources, langCode);

// declares the erebus components once the document is ready
const components = {};
components.layout = layout;
//components.surface = surface();
//components.protect = function() {
//	return protect().render();
//};
components.toast = toast;
//components.dialog = dialog;

erebus.events.documentReady(function () {
	for(var idx=0; idx < $scope.handlers.componentReady.length; idx++) {
		erebus.handler.trigger($scope.handlers.componentReady[idx]);
	}
});

/**
 * Allows to register a callback function to be invoked once the components have been initialized
 * @param {*} callback Handler to execute
 */
components.onReady = function (callback) {
	if (callback && typeof (callback) === 'function') {
		$scope.handlers.componentReady.push(callback);
		
	}
};

erebus.components = components;
export default erebus;
