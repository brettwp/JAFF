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
