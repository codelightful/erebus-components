import { strict as assert } from 'assert';
await import('./setup/dom.mjs');
const erebus = (await import('../dist/erebus-components.min.js')).default;

describe('Base Test', function() {
	it('Environment Test', function() {
		assert.ok(window);
		assert.ok(document);
		assert.ok(navigator);
		assert.ok(HTMLElement);
		assert.ok(erebus);
		assert.ok(erebus.components);
	});

	it('Resource bundle loading', function() {
		const result = erebus.i18n.getLabel("erebus");
		assert.strictEqual(result, 'Erebus framework');
	});

	it('Base components', function() {
		assert.ok(erebus.dialog);
		assert.ok(erebus.toast);
	});
});
