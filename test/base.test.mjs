import { strict as assert } from 'assert';
await import('./setup/dom.mjs');
import erebus from '../dist/erebus-components.min.js';

describe('Base Test', function() {
	it('Environment Test', function() {
		assert.ok(window);
		assert.ok(document);
		assert.ok(HTMLElement);
		assert.ok(erebus);
		assert.ok(erebus.components);
	});

	it('English bundle', function() {
		const result = erebus.i18n.getLabel("erebus");
		assert.strictEqual(result, 'Erebus framework');
	});
});
