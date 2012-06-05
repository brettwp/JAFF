/*!
 * Specs for JAFF JavaScript Library
 * Copyright 2012 Brett Pontarelli
 * Licensed under the MIT License.
 */
/** @namespace */
this.unittest = this.unittest || {};

describe('jaff.Interface', function(){
	it('should create an Interface', function() {
		var testInterface = new jaff.Interface(['foo', 'bar', 'baz']);
		expect(testInterface.getMethods()).toEqual(['foo', 'bar', 'baz']);
	});

	it('should be able to extend an Interface', function() {
		var parentInterface = new jaff.Interface(['foo', 'bar']);
		var extendedInterface = new jaff.Interface(parentInterface, ['baz', 'tim']);
		expect(extendedInterface.getMethods()).toEqual(['foo', 'bar', 'baz', 'tim']);
	});

	it('should be an instance of Interface', function() {
		var testInterface = new jaff.Interface(['a', 'b', 'c']);
		expect(testInterface instanceof jaff.Interface).toBeTruthy();
	});
});

