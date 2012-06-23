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
