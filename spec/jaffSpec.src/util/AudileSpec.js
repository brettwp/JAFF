/**
 * @author Brett
 */
describe('jaff.Audible', function () {
	beforeEach(function() {
		this.testClass = jaff.Class.extend({
			initialize: function() {
				this.v1 = false;
				this.v2 = false;
			},

			f1: function() {
				this.v1 = true;
			},

			f2: function() {
				this.v2 = true;
			}
		});
	});

	it('should call all listeners to an event', function () {
		var objectA = new this.testClass();
		var objectB = new this.testClass();
		var test = (new jaff.util.Audible()).
			addListener('E1', objectA.f1, objectA).
			addListener('E1', objectB.f1, objectB).
			addListener('E2', objectA.f2, objectA);
		test.fireEvent('E1');
		expect(objectA.v1).toBeTruthy();
		expect(objectB.v1).toBeTruthy();
		test.fireEvent('E2');
		expect(objectA.v2).toBeTruthy();
		expect(objectB.v2).toBeFalsy();
	});

	it('should remove a listener', function () {
		var testObject = new this.testClass();
		var test = (new jaff.util.Audible()).
			addListener('E1', testObject.f1, testObject).
			addListener('E2', testObject.f2, testObject);
		test.removeListener('E2', testObject.f2, testObject);
		test.fireEvent('E1');
		test.fireEvent('E2');
		expect(testObject.v1).toBeTruthy();
		expect(testObject.v2).toBeFalsy();
	});

});
