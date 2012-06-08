/*!
 * JAFF JavaScript Library v0.1.0
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
/**
 *  @namespace Contains the core functions <code>Class</code> and <code>Interface</code> along
 *  with all sub-namespaces of the JAFF library.
 */
this.jaff = this.jaff || {};
/** @ignore */
jaff.VERSION = '0.1.0';

jaff.Class = function() {};
jaff.Class.extend = function(interfaceOrObject, extension) {
	var interfaces = null;
	console.log(interfaceOrObject, extension);
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
 * 1) Interface([...]) - An array of strings for the required methods of the interface
 * 2) Interface(parent, [...]) - The parent interface and an array of strings to extend the parent.
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

