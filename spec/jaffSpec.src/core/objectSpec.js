describe('jaff.object', function () {
	it('should return object keys', function () {
		var testObject = { z: 1, g: 2, n: 3, k: 4 };
		var keys = jaff.object.keys(testObject);
		expect(keys).toEqual(['g', 'k', 'n', 'z']);
	});


	it('should do shallow extension', function () {
		var object1 = { a: 'a' };
		var object2 = { b: 'b', c: [1,2,3] };
		jaff.object.extend(object1, object2);
		expect(jaff.object.keys(object1)).toEqual(['a', 'b', 'c']);
		expect(object1.c).toBe(object2.c);
	});

	it('should do deep extension', function() {
		var object1 = { a: 'a' };
		var object2 = { b: 'b', c: [1,2,3] };
		jaff.object.extend(object1, object2);
		expect(jaff.object.keys(object1)).toEqual(['a', 'b', 'c']);
		expect(object1.c).toBe(object2.c);
		expect(jaff.object.isEqual(object1.c, object2.c)).toBeTruthy();
	});

	it('should recognize object types', function () {
		expect(jaff.object.isArray([])).toBeTruthy();
		expect(jaff.object.isDate(new Date())).toBeTruthy();
		expect(jaff.object.isFunction(function() {})).toBeTruthy();
		expect(jaff.object.isNaN(NaN)).toBeTruthy();
		expect(jaff.object.isNull(null)).toBeTruthy();
		expect(jaff.object.isNumber(0)).toBeTruthy();
		expect(jaff.object.isObject({})).toBeTruthy();
		expect(jaff.object.isString('')).toBeTruthy();
		expect(jaff.object.isUndefined(undefined)).toBeTruthy();
		expect(jaff.object.isUndefined()).toBeTruthy();
	});

});
