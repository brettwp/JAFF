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
	return create(parentInterface, methods);

	function create(parentInterface, methods) {
		if (methods == undefined) {
			methods = parentInterface;
			parentInterface = null;
		}
		var newInterface = {
			methods: [],
			/** @ignore */
			getMethods: function() {
				return this.methods;
			}
		};
		setupInterfaceFromParent(newInterface, parentInterface);
		extendInterface(newInterface, methods);
		return newInterface;
	}

	function setupInterfaceFromParent(newInterface, parentInterface) {
		if (parentInterface) {
			newInterface.methods = [].concat(parentInterface.methods);
		}
	}

	function extendInterface(newInterface, methods) {
		for (var index = 0; index < methods.length; index++) {
			newInterface.methods.push(methods[index]);
		}
	}
};
