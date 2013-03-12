QUnit.jUnitReport = function(data) {
	var console = window.console;
	if (console) {
		console.log(data.xml);
	}
};

QUnit.module('Module 1');

QUnit.test('test 1', 2, function (assert) {
	assert.equal(1, 1, 'Assert 1 = 1');
	assert.equal(1, 2, 'Assert fail 1 = 2');
});

QUnit.test('test 2', 3, function (assert) {
	assert.equal(1, 1, 'Assert 1 = 1');
	assert.equal(1, 2, 'Assert fail 1 = 2');
	assert.equal(1, 1, 'Assert 1 = 1');
});

QUnit.module('Module 2');

QUnit.test('test 3', 2, function (assert) {
	assert.equal(1, 1, 'Assert 1 = 1');
	assert.equal(1, 2, 'Assert fail 1 = 2');
});

QUnit.test('test 4', 3, function (assert) {
	assert.equal(1, 1, 'Assert 1 = 1');
	assert.equal(1, 2, 'Assert fail 1 = 2');
	assert.equal(1, 3, 'Assert fail 1 = 3');
});
