/*!
 * JAFF JavaScript Library v0.1.1
 * http://www.github.com/brettwp/JAFF
 * Copyright (c) 2012 Brett Pontarelli
 *
 * Licensed under The MIT License.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
(function(window) {
	/**
	 *  @namespace Contains the core functions <code>Class</code> and <code>Interface</code> along
	 *  with all sub-namespaces of the JAFF library.
	 */
	window.jaff = window.jaff || {};
	/** @ignore */
	jaff.VERSION = '0.1.1';

/**
 * @description Creates a new class
 *
 * To create a new class you can either extend the base <code>jaff.Class</code> or extend a parent class:
 * <pre>
 *     var vehicle = jaff.Class.extend({...})
 *     var car = vehicle.extend({...})
 * <pre>
 *
 * The <code>extend</code> function is available in all classes and takes one or two parameters.  If only
 * one then this is an object of static variables and methods.  If two the first is a
 * <code>jaff.Interface</code> or and array of interfaces and the second an object of static variables and
 * methods.
 *
 * The new class is built from the extension object by attaching all variables to the new class; all the
 * functions to the new class' prototype; and adding links to overloaded methods prefixing them with
 * <code>$</code>.
 *
 * @returns {jaff.Class} A new class
 */
jaff.Class = function() {};
jaff.Class.extend = function(interfaceOrObject, extension) {
	var interfaces = null;
	if (extension == undefined) {
		extension = interfaceOrObject;
	} else if (interfaceOrObject instanceof Array || interfaceOrObject instanceof jaff.Interface) {
		interfaces = interfaceOrObject;
	} else {
		throw new Error('Interface undefined.');
	}

	var newClass = function () {
		if (this.initialize) this.initialize.apply(this, arguments);
	};

	setupFromParent(newClass, this);
	extendDefinition(newClass, extension);
	extendInterfaces(newClass, interfaces);
	ensureImplementsInterfaces(newClass);
	return newClass;

	function setupFromParent(newClass, parent) {
		jaff.Class.prototype = parent.prototype;
		newClass.prototype = new jaff.Class();
		for (var key in parent) {
			if (parent.hasOwnProperty(key)) newClass[key] = parent[key];
		}
		newClass.__superclass = parent;
		if (parent.__interfaces) newClass.__interfaces = [].concat(parent.__interfaces);
	}

	function extendDefinition(newClass, extension) {
		for (var key in extension) {
			var value = extension[key];
			if (typeof value == 'function') {
				if (newClass.prototype[key]) {
					overloadMethod(newClass, key);
				}
				newClass.prototype[key] = value;
			} else {
				newClass[key] = value;
			}
		}
	}

	function overloadMethod(newClass, methodName) {
		var superMethod = '$'+methodName;
		if (newClass.prototype[superMethod]) {
			overloadMethod(newClass, superMethod);
		} else {
			newClass.prototype[superMethod] = newClass.prototype[methodName];
		}
	}

	function extendInterfaces(newClass, interfaceOrArray) {
		if (interfaceOrArray) {
			var interfaces = makeInterfaceArray(interfaceOrArray);
			newClass.__interfaces = newClass.__interfaces || [];
			newClass.__interfaces = newClass.__interfaces.concat(interfaces);
		}
	}

	function makeInterfaceArray(interfaceOrArray) {
		var interfaces = null;
		if (interfaceOrArray instanceof Array) {
			interfaces = [].concat(interfaceOrArray);
		} else {
			interfaces = [interfaceOrArray];
		}
		for (var index = 0; index < interfaces.length; index++) {
			if (!(interfaces[index] instanceof jaff.Interface)) {
				throw 'Can only implement an Interface';
			}
		}
		return interfaces;
	}

	function ensureImplementsInterfaces(testClass) {
		if (testClass.__interfaces) {
			var index;
			var interfaces = testClass.__interfaces;
			for (index = 0; index < interfaces.length; index++) {
				if (!interfaces[index].isImplementedBy(testClass)) {
					throw 'Class does not implement interface(s).';
				}
			}
		}
	}
};

/**
 * @description Creates a new interface
 * @param parentInterface {jaff.Interface|Array} A parent interface or an array of methods.
 * @param methods {Array} An array of methods when inheriting from a parent interface.
 *
 * There are two basic ways to create and interface:
 * 1) new Interface([...]) - An array of strings for the required methods of the interface
 * 2) new Interface(parent, [...]) - The parent interface and an array of strings to extend the parent.
 *
 * @returns {jaff.Interface} A new interface
 */
jaff.Interface = function(parentInterface, methods) {
	this.initialize(parentInterface, methods);
};
jaff.Interface.prototype = {
	initialize: function(parentInterface, methods) {
		if (methods == undefined) {
			methods = parentInterface;
			parentInterface = null;
		}
		this.methods = [];
		this.setupInterfaceFromParent(parentInterface);
		this.extendInterface(methods);
	},

	/** @private */
	setupInterfaceFromParent: function(parentInterface) {
		if (parentInterface) {
			if (parentInterface instanceof jaff.Interface) {
				this.methods = [].concat(parentInterface.methods);
			} else {
				throw 'Invalid parent Interface.';
			}
		}
	},

	/** @private */
	extendInterface: function(methods) {
		if (methods instanceof Array && methods.length > 0) {
			this.methods = this.methods.concat(methods);
		} else {
			throw 'Not array of Interface methods.';
		}
	},

	getMethods: function() {
		return [].concat(this.methods);
	},

	isImplementedBy: function(testClass) {
		var isImplemented = true;
		for (var index = 0; index < this.methods.length; index++) {
			if (typeof testClass.prototype[this.methods[index]] != 'function') {
				isImplemented = false;
			}
		}
		return isImplemented;
	}
};

(function() {
	var timeout = null;
	var recheckDuration = 50;
	var maxRecheck = 40;
	var timesChecked = 0;
	var allRequirements = [];

	jaff.Require = function(requirements, callFunction) {
		if (typeof requirements == 'string') {
			requirements = [requirements];
		}
		allRequirements.push({
			require: requirements,
			func: callFunction
		});
		timesChecked = 0;
		callFulfilled();
	}

	function callFulfilled() {
		if (timeout) clearTimeout(timeout);
		allRequirements = allRequirements.filter(callFunction);
		timesChecked++;
		if (timesChecked > maxRecheck) {
			alert('Unmet requirements!');
			console.log(allRequirements);
		} else if (allRequirements.length > 0) {
			setTimeout(function() {
				callFulfilled();
			}, recheckDuration);
		}
	}

	function callFunction(testObject) {
		var allExist = allRequirementsExist(testObject.require);
		if (allExist) testObject.func();
		return !allExist;
	}

	function allRequirementsExist(requirements) {
		var i, len = requirements.length;
		for (i=0; i < len; i++) {
			if (doesNotExist(requirements[i])) break;
		}
		return (i == len);
	}

	function doesNotExist(name) {
		var start = window;
		var parts = name.split('.');
		var len = parts.length;
		for (var i=0; i < len; i++) {
			if (start.hasOwnProperty(parts[i])) {
				start = start[parts[i]];
			} else {
				break;
			}
		}
		return (i != len);
	}
})();

/**
 * @namespace jaff.object
 * @description A collection of functions for extending or inspecting Objects.  Adopted from
 * Underscore (http://underscorejs.org/).
 */
(function() {
	var isArray = Array.isArray;
	var isObject = function(obj) {
		return obj === Object(obj);
	};
	var toString = Object.prototype.toString;
	var isEqual = function(a, b, stack) {
		if (a === b) return a !== 0 || 1 / a == 1 / b;
		if (a == null || b == null) return a === b;
		if (a.isEqual && isFunction(a.isEqual)) return a.isEqual(b);
		if (b.isEqual && isFunction(b.isEqual)) return b.isEqual(a);
		var className = toString.call(a);
		if (className != toString.call(b)) return false;
		switch (className) {
			case '[object String]':
				return a == String(b);
			case '[object Number]':
				return a != +a ? b != +b : (a == 0 ? 1 / a == 1 / b : a == +b);
			case '[object Date]':
			case '[object Boolean]':
				return +a == +b;
			case '[object RegExp]':
				return a.source == b.source &&
					a.global == b.global &&
					a.multiline == b.multiline &&
					a.ignoreCase == b.ignoreCase;
		}
		if (typeof a != 'object' || typeof b != 'object') return false;
		var length = stack.length;
		while (length--) {
			if (stack[length] == a) return true;
		}
		stack.push(a);
		var size = 0, result = true;
		if (className == '[object Array]') {
			size = a.length;
			result = size == b.length;
			if (result) {
				while (size--) {
					if (!(result = size in a == size in b && isEqual(a[size], b[size], stack))) break;
				}
			}
		} else {
			if ('constructor' in a != 'constructor' in b || a.constructor != b.constructor) return false;
			for (var key in a) {
				if (a.hasOwnProperty(key)) {
					size++;
					if (!(result = b.hasOwnProperty(key) && isEqual(a[key], b[key], stack))) break;
				}
			}
			if (result) {
				for (key in b) {
					if (b.hasOwnProperty(key) && !(size--)) break;
				}
				result = !size;
			}
		}
		stack.pop();
		return result;
	};
	var isFunction = function(obj) {
		return toString.call(obj) == '[object Function]';
	};

	jaff.object = {
		extend: function(obj) {
			var args = Array.prototype.slice.call(arguments, 1);
			args.forEach(function(argObject) {
				console.log(obj, argObject);
				for (var key in argObject) obj[key] = argObject[key];
			});
			return obj;
		},

		deepExtend: function(obj) {
			var args = Array.prototype.slice.call(arguments);
			var deepCopy = function(objIn) {
				var objOut;
				if (isArray(objIn)) {
					objOut = [];
					for (var i = 0, len = objIn.length; i < len; i++) {
						objOut[i] = deepCopy(objIn[i]);
					}
				} else if (isObject) {
					var objOut = {};
					for(var key in objIn) {
						objOut[key] = deepCopy(objIn[key]);
					}
				} else {
					objOut = objIn;
				}
				return objOut;
			};
			args.forEach(function(arjObject) {
				for (var key in arjObject) obj[key] = deepCopy(arjObject[key]);
			});
			return obj;
		},

		isArray: isArray || function(obj) {
			return toString.call(obj) == '[object Array]';
		},

		isBoolean: function(obj) {
			return obj === true || obj === false || toString.call(obj) == '[object Boolean]';
		},

		isDate: function(obj) {
			return toString.call(obj) == '[object Date]';
		},

		isElement: function(obj) {
			return !!(obj && obj.nodeType == 1);
		},

		isEqual: isEqual,

		isFunction: isFunction,

		isNaN: function(obj) {
			return obj !== obj;
		},

		isNull: function(obj) {
			return obj === null;
		},

		isNumber: function(obj) {
			return toString.call(obj) == '[object Number]';
		},

		isObject: isObject,

		isRegExp: function(obj) {
			return toString.call(obj) == '[object RegExp]';
		},

		isString: function(obj) {
			return toString.call(obj) == '[object String]';
		},

		isUndefined: function(obj) {
			return obj === void 0;
		},

		keys: function(obj, sorted) {
			var objKeys = Object.keys(obj);
			if (!sorted) objKeys = objKeys.sort();
			return objKeys;
		}
	}
})();

jaff.util = jaff.util || {};
jaff.Require('jaff.util.IAudible', function() {
	jaff.util.Audible = jaff.Class.extend(jaff.util.IAudible, {
		initialize: function() {
			this.listeners = {};
		},

		addListener: function(event, listener, scope) {
			if (!this.listeners.hasOwnProperty(event)) {
				this.listeners[event] = [];
			}
			this.listeners[event].push({
				listener: listener,
				scope: scope
			});
			return this;
		},

		removeListener: function(event, listener, scope) {
			if (this.listeners.hasOwnProperty(event)) {
				this.listeners[event] = this.listeners[event].filter(function(item) {
					var match = (item.listener == listener && item.scope == scope);
					return !match;
				});
			}
			return this;
		},

		fireEvent: function(event) {
			console.log(event, this);
			if (this.listeners.hasOwnProperty(event)) {
				this.listeners[event].filter(function(obj) {
					var keep = jaff.object.isFunction(obj.listener);
					if (keep) {
						obj.listener.call(obj.scope, this);
					}
					return keep;
				});
			}
		}
	});
});

jaff.util = jaff.util || {};
jaff.util.IAudible = new jaff.Interface([
	'addListener',
	'removeListener',
	'fireEvent'
]);

})(window);

