import erebus from 'erebus-core';
import './protect.css';

const $scope = {};
// Allows to determine if the protect layer is visible or not
$scope.visible = false;

const $module = {};

/** Displays the protect layer */
$module.show = async function() {
	if ($scope.visible) {
		return;
	}
	var protectElement = document.getElementById('divErebusProtect');
	if (!protectElement) {
		protectElement = document.createElement('div');
		protectElement.setAttribute('id', 'divErebusProtect');
		protectElement.setAttribute('class', 'erb-protect');
		await erebus.events.documentReady();
		document.body.appendChild(protectElement);
	} else if (!$scope.visible) {
		protectElement.classList.remove('erb-hidden');
	}
	$scope.visible = true;
};

/** Hides the protect layer */
$module.hide = async function() {
	if (!$scope.visible) {
		return;
	}
	var protectElement = document.getElementById('divErebusProtect');
	if (protectElement) {
		protectElement.classList.add('erb-hidden');
	}
	$scope.visible = false;
};

export default $module;