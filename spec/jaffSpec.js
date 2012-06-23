/*!
 * Specs for JAFF JavaScript Library
 * Copyright 2012 Brett Pontarelli
 * Licensed under the MIT License.
 */

describe('jaff.Class', function () {
	it('should call the Constructor', function () {
		var testClass = jaff.Class.extend({
			initialize:function (y) {
				this.x = y;
			}
		});
		spyOn(testClass.prototype, 'initialize').andCallThrough();
		var testObj = new testClass('abc');
		expect(testClass.prototype.initialize).toHaveBeenCalledWith('abc');
		expect(testObj.x).toEqual('abc');
	});

	it('should allow simple inheritance', function () {
		var parentClass = jaff.Class.extend({
			initialize:function () {
				this.name = 'Brett';
			},

			sayName:function () {
				return this.name;
			}
		});
		var childClass = parentClass.extend({
			sayNameAndNumber:function () {
				return this.sayName() + '007';
			}
		});
		var testObj = new childClass();
		expect(testObj.sayName()).toEqual('Brett');
		expect(testObj.sayNameAndNumber()).toEqual('Brett007');
		expect(testObj instanceof jaff.Class).toBe(true);
		expect(testObj instanceof childClass).toBe(true);
		expect(testObj instanceof parentClass).toBe(true);
	});

	it('should have function overloading', function () {
		var parentClass = jaff.Class.extend({
			initialize:function () {
				this.name = 'Brett';
			},
			sayName:function () {
				return this.name;
			}
		});
		var childClass = parentClass.extend({
			sayName:function () {
				return 'Name=' + this.name;
			}
		});
		var testObj = new childClass();
		expect(testObj.sayName()).toEqual('Name=Brett');
	});

	it('should call parent constructor and functions', function () {
		var parentClass = jaff.Class.extend({
			initialize:function (name) {
				this.name = 'Brett';
				if (name) this.name = name;
			},
			sayName:function () {
				return this.name;
			}
		});
		var childClass = parentClass.extend({
			sayName:function () {
				return 'Name=' + this.name;
			},
			saySimpleName:function () {
				return this.$sayName();
			}
		});
		var testObj = new childClass('Tim');
		expect(testObj.sayName()).toEqual('Name=Tim');
		expect(testObj.saySimpleName()).toEqual('Tim');
	});

	it('implements single Interface', function () {
		var testInterface = new jaff.Interface(['foo', 'bar', 'baz']);
		var testClass = jaff.Class.extend(
			testInterface,
			{
				foo:function () {
					return 'foo';
				},
				bar:function () {
					return 'bar';
				},
				baz:function () {
					return 'baz';
				}
			}
		);
		var testObj = new testClass();
		expect(testInterface.isImplementedBy(testClass)).toBe(true);
		expect(testObj.foo()).toEqual('foo');
		expect(testObj.bar()).toEqual('bar');
		expect(testObj.baz()).toEqual('baz');
	});

	it('implements array of Interfaces', function () {
		var testInterface1 = new jaff.Interface(['foo', 'bar']);
		var testInterface2 = new jaff.Interface(['baz', 'tim']);
		var testClass = jaff.Class.extend(
			[testInterface1, testInterface2],
			{
				foo:function () {
					return 'foo';
				},
				bar:function () {
					return 'bar';
				},
				baz:function () {
					return 'baz';
				},
				tim:function () {
					return 'tim';
				}
			}
		);
		var testObj = new testClass();
		expect(testObj.foo()).toEqual('foo');
		expect(testObj.bar()).toEqual('bar');
		expect(testObj.baz()).toEqual('baz');
		expect(testObj.tim()).toEqual('tim');
	});

	it('throws error if Interface not implemented', function () {
		var testInterface = new jaff.Interface(['foo', 'bar', 'baz']);
		var classCreator = function() {
			var testClass = jaff.Class.extend(
				testInterface,
				{
					foo:function () {
						return 'foo';
					},
					bar:function () {
						return 'bar';
					}
				}
			);
		}
		expect(classCreator).toThrow();
	});

	it('Class constants', function () {
		var testClass = jaff.Class.extend({
			BACKWARD:-1,
			DONTMOVE:0,
			FORWARD:1,
			testConst:function () {
				return (testClass.BACKWARD == -1) &&
					(testClass.DONTMOVE == 0) && (testClass.FORWARD == 1);
			}
		});
		var testObj = new testClass();
		expect(testClass.BACKWARD).toBe(-1);
		expect(testClass.DONTMOVE).toBe(0);
		expect(testClass.FORWARD).toBe(1);
		expect(testObj.testConst()).toBe(true)
	});

	it('Class constants and inheritance', function () {
		var testClass1 = jaff.Class.extend({
			BACKWARD:-1,
			DONTMOVE:0,
			FORWARD:1,
			testFunc:function () {
				return 1;
			}
		});
		var testClass2 = testClass1.extend({
			UP:2,
			DOWN:-2,
			testConst:function () {
				return (testClass2.BACKWARD == -1) &&
					(testClass2.DONTMOVE == 0) && (testClass2.FORWARD == 1) &&
					(testClass2.UP == 2) && (testClass2.DOWN == -2);
			}
		});
		var testObj = new testClass2();
		expect(testClass2.BACKWARD).toBe(-1);
		expect(testClass2.DONTMOVE).toBe(0);
		expect(testClass2.FORWARD).toBe(1);
		expect(testClass2.UP).toBe(2);
		expect(testClass2.DOWN).toBe(-2);
		expect(testObj.testFunc()).toBe(1);
		expect(testObj.testConst()).toBe(true);
	});

	it('Throws error if interface doesn\'t exists (e.g. is declared after)', function () {
		var classCreator = function() {
			var testClass = jaff.Class(
				testInterface,
				{
					foo:function () {
						return 'foo';
					},
					bar:function () {
						return 'bar';
					}
				}
			);
		}
		expect(classCreator).toThrow();
	});

	it('Inheritance of multiple functions calls parent function with proper this', function () {
		var parentA = jaff.Class.extend({
			setValue:function (value) {
				this.value = value;
			},
			getValue:function () {
				return this.value;
			},
			setOther:function (value) {
				this.other = value;
			},
			getOther:function () {
				return this.other;
			}
		});
		var childA = parentA.extend({
			setValue:function (v) {
				this.$setValue(v);
			},
			getValue:function () {
				return this.value;
			},
			setOther:function (v) {
				this.$setOther(v);
			},
			getOther:function () {
				return this.other;
			},
			getValueNew:function () {
				return this.$getValue();
			},
			getOtherNew:function () {
				return this.$getOther();
			}
		});
		var object1 = new childA();
		var object2 = new childA();
		var object3 = new childA();
		var object4 = new childA();
		object1.setValue(1);
		object2.setValue({a:2});
		object3.setOther([1, 2]);
		object4.setOther(9);
		expect(object1.getValue()).toEqual(object1.getValueNew());
		expect(object2.getValue()).toEqual(object2.getValueNew());
		expect(object3.getOther()).toEqual(object3.getOtherNew());
		expect(object4.getOther()).toEqual(object4.getOtherNew());
	});
});

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

describe('jaff.Require', function () {
	beforeEach(function() {
		window.jaffSpec = {};
	});

	afterEach(function() {
		delete window.jaffSpec;
	});

	it('should call the function if the variable exists', function() {
		jaffSpec.ensureThis = {};
		var testFunction = jasmine.createSpy('testFunction');
		jaff.Require('jaffSpec.ensureThis', testFunction);
		expect(testFunction).toHaveBeenCalled();
	});

	it('should call the function if all the variables exist', function() {
		jaffSpec.ensureThis = {};
		jaffSpec.andThis = [];
		var testFunction = jasmine.createSpy('testFunction');
		jaff.Require(['jaffSpec.ensureThis', 'jaffSpec.andThis'], testFunction);
		expect(testFunction).toHaveBeenCalled();
	});

	it('should not call the function until all of the variables exist', function() {
		var testFunction = jasmine.createSpy('testFunction');
		runs(function() {
			jaffSpec.ensureThis = {};
			jaff.Require(['jaffSpec.ensureThis', 'jaffSpec.notThis'], testFunction);
			expect(testFunction).not.toHaveBeenCalled();
		});
		runs(function() {
			jaffSpec.notThis = {};
		});
		waits(200);
		runs(function() {
			expect(testFunction).toHaveBeenCalled();
		});
	});
});

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

/**
 * @author Brett
 */
describe('jaff.Audible', function () {
	beforeEach(function() {
		this.testClass = jaff.Class.extend({
			initialize: function() {
				this.v1 = false;
				this.v2 = false;
			},

			f1: function() {
				this.v1 = true;
			},

			f2: function() {
				this.v2 = true;
			}
		});
	});

	it('should call all listeners to an event', function () {
		var objectA = new this.testClass();
		var objectB = new this.testClass();
		var test = (new jaff.util.Audible()).
			addListener('E1', objectA.f1, objectA).
			addListener('E1', objectB.f1, objectB).
			addListener('E2', objectA.f2, objectA);
		test.fireEvent('E1');
		expect(objectA.v1).toBeTruthy();
		expect(objectB.v1).toBeTruthy();
		test.fireEvent('E2');
		expect(objectA.v2).toBeTruthy();
		expect(objectB.v2).toBeFalsy();
	});

	it('should remove a listener', function () {
		var testObject = new this.testClass();
		var test = (new jaff.util.Audible()).
			addListener('E1', testObject.f1, testObject).
			addListener('E2', testObject.f2, testObject);
		test.removeListener('E2', testObject.f2, testObject);
		test.fireEvent('E1');
		test.fireEvent('E2');
		expect(testObject.v1).toBeTruthy();
		expect(testObject.v2).toBeFalsy();
	});

});

