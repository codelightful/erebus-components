'use strict';
import erebus from 'erebus-core';
import dialog from './components/dialog.mjs';
import toast from './components/toast.mjs';
import './erebus-components.css';
import './badge.css';
console.log('Erebus Components v0.0.10');

const langCode = erebus.i18n.getLanguage();
import resources from '../resources/en.mjs';
erebus.i18n.setResourceBundle(resources, langCode);

// declares the erebus components once the document is ready
erebus.components = {};
erebus.dialog = dialog;
erebus.toast = toast;

/**
 * Allows to sync the moment when the components module has been initialized and is ready
 * @returns Promise to be fullfilled once the components engine is ready
 */
erebus.components.onReady = async function () {
	await erebus.onDocumentReady();
};

export default erebus;
