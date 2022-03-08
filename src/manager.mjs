import surface from './surface.mjs';
import protect from './protect.mjs';

const $scope = {};
$scope.components = {};

class ComponentManager {
	register(name, component) {
		if(!component) {
			console.warn('erebus.components.manager.register.null_component');
			return;
		} else if(!name) {
			console.warn('erebus.components.manager.register.no_component_name');
			return;
		} else if(typeof(component) !== 'function') {
			console.warn('erebus.components.manager.register.no_component_builder[' + name + ']');
			return;
		}
		$scope.components[name] = component;
	}

	get(name, specs) {
		if(!name) {
			throw Error('erebus.components.manager.get.no_component_name');
		} else if (!$scope.components[name]) {
			throw Error('erebus.components.manager.get.unknown_component[' + name + ']');
		}
		return $scope.components[name](specs);
	}
}

$scope.singleton = new ComponentManager();
$scope.singleton.register('surface', surface);
$scope.singleton.register('protect', protect);

export default $scope.singleton;