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

	it('should be able to test Class implementation', function() {
		var testInterface = new jaff.Interface(['f1', 'f2', 'f3']);
		var testClass1 = function(){};
		testClass1.prototype = {
			f1: function() {},
			f2: function() {},
			f3: function() {}
		};
		var testClass2 = function(){};
		testClass2.prototype = {
			f1: function() {}
		}
		expect(testInterface.isImplementedBy(testClass1)).toBeTruthy();
		expect(testInterface.isImplementedBy(testClass2)).toBeFalsy();
	})
});
