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
