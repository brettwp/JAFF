describe('jaff.Require', function () {
	beforeEach(function() {
		window.jaffSpec = {};
	});

	afterEach(function() {
		delete window.jaffSpec;
	});

	it('should call the function if the variable exists', function() {
		jaffSpec.ensureThis = {};
		var testFunction = jasmine.createSpy('testFunction');
		jaff.Require('jaffSpec.ensureThis', testFunction);
		expect(testFunction).toHaveBeenCalled();
	});

	it('should call the function if all the variables exist', function() {
		jaffSpec.ensureThis = {};
		jaffSpec.andThis = [];
		var testFunction = jasmine.createSpy('testFunction');
		jaff.Require(['jaffSpec.ensureThis', 'jaffSpec.andThis'], testFunction);
		expect(testFunction).toHaveBeenCalled();
	});

	it('should not call the function until all of the variables exist', function() {
		var testFunction = jasmine.createSpy('testFunction');
		runs(function() {
			jaffSpec.ensureThis = {};
			jaff.Require(['jaffSpec.ensureThis', 'jaffSpec.notThis'], testFunction);
			expect(testFunction).not.toHaveBeenCalled();
		});
		runs(function() {
			jaffSpec.notThis = {};
		});
		waits(200);
		runs(function() {
			expect(testFunction).toHaveBeenCalled();
		});
	});
});
