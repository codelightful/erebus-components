import './layout.css';
import events from './events.mjs';
const $scope = {};

class ErebusLayout {
	#container;

	constructor() {
		this.#container = document.createElement('div');
		this.#container.className = 'erebus-layout';
	}

	render() {
		events.documentReady(() => {
			document.body.appendChild(this.#container);
		});
	}
}

export default {
	render: function() {
		if(!$scope.singleton) {
			$scope.singleton = new ErebusLayout();
		}
		$scope.singleton.render();
	}
};