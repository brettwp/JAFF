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

