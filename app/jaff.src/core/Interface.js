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
