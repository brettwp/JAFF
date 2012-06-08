describe('jaff.Require', function () {
	beforeEach(function() {
		jaffSpec = {};
	});

	afterEach(function() {
		delete jaffSpec;
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
		jaff.Require('jaffSpec.ensureThis', testFunction);
		expect(testFunction).toHaveBeenCalled();
	})
});
