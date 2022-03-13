import ErebusComponent from '../component.mjs';
import './navigation.css';

const $scope = {};
// Variable to hold the reference to the singleton instance
$scope.singleton = null;

/** Internal function to create a child area inside a container */
function addNavigationArea(container, id, className) {
	const element = document.createElement('div');
	element.className = className;
	element.setAttribute('id', id);
	element.innerHTML = id;
	container.appendChild(element);
	return element;
}

class ErebusNavigation extends ErebusComponent {
	constructor() {
		super();
		const element = document.createElement('nav');
		element.className = 'erb-navigation';
		addNavigationArea(element, 'divErbNavStart', 'erb-start');
		addNavigationArea(element, 'divErbNavMiddle', 'erb-middle');
		addNavigationArea(element, 'divErbNavEnd', 'erb-end');
	}

	appendTo(container) {
		if(!container) {
			console.error('erebus.navigation.append_to.invalid_container');
			return;
		}
		if(container instanceof ErebusComponent) {
			container.append();
		}
	}
}

export default function () {
	if (!$scope.navigation) {
		$scope.navigation = new ErebusNavigation();
	}
	return $scope.navigation;
}
