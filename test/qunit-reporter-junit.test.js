(function( module, test ) {

	module('Module 1');

	test('test 1', function(assert) {
		assert.expect(2);
		assert.equal(1, 1, 'Assert 1 = 1');
		assert.equal(1, 2, 'Assert fail 1 = 2');
	});

	test('test 2', function(assert) {
		assert.expect(3);
		assert.equal(1, 1, 'Assert 1 = 1');
		assert.equal(1, 2, 'Assert fail 1 = 2');
		assert.equal(1, 1, 'Assert 1 = 1');
	});


	module('Module 2');

	test('test 3', function(assert) {
		assert.expect(2);
		assert.equal(1, 1, 'Assert 1 = 1');
		assert.equal(1, 2, 'Assert fail 1 = 2');
	});

	test('test 4', function(assert) {
		assert.expect(3);
		assert.equal(1, 1, 'Assert 1 = 1');
		assert.equal(1, 2, 'Assert fail 1 = 2');
		assert.equal(1, 3, 'Assert fail 1 = 3');
	});


})( QUnit.module, QUnit.test );
