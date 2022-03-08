import erebus from 'erebus-core';
import ErebusComponent from './component.mjs';
import protect from './protect.mjs';
import utils from './utils.mjs';
import './modal.css';

class ErebusModal extends ErebusComponent {
	#id;

	constructor(content) {
		super();
		this.#id = 'divErbModal_' + erebus.random.tinyId();
		const element = utils.getOrRenderElement(this.#id, 'div', 'erb-modal', () => {
			this.open();
		});
	}

	content(content) {
		if(erebus.isPromise(content)) {

		} else if(erebus instanceof HTMLElement) {

		}
	}

	open() {
		protect().show();
	}
}

export default function () {
	return new ErebusModal();
}