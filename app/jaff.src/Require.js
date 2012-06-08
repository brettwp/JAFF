(function() {
	var timeout = null;
	var allRequirements = [];

	jaff.Require = function(requirements, callFunction) {
		if (typeof requirements == 'string') {
			requirements = [requirements];
		}
		allRequirements.push({
			require: requirements,
			func: callFunction
		});
		callFulfilled();
	}

	function callFulfilled() {
		if (timeout) clearTimeout(timeout);
		for (var i=0; i < allRequirements.length; i++) {
			checkAndCall(i);
		}
	}

	function checkAndCall(index) {
		var job = allRequirements[index];
		var len = job.require.length;
		for (var i=0; i < len; i++) {
			if (doesNotExist(job.require[i])) break;
		}
		if (i == len) {
			job.func();
		}
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
