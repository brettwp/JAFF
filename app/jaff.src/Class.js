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
