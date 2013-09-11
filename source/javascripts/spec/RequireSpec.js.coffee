describe 'Jaff.Require', ->
  beforeEach ->
    window.jaffSpec = {}

  afterEach ->
    delete window.jaffSpec

  it 'should call the function if the variable exists', ->
    jaffSpec.ensureThis = {}
    testFunction = jasmine.createSpy('testFunction')
    Jaff.Require('jaffSpec.ensureThis', testFunction)
    expect(testFunction).toHaveBeenCalled()

  it 'should call the function if all the variables exist', ->
    jaffSpec.ensureThis = {}
    jaffSpec.andThis = []
    testFunction = jasmine.createSpy('testFunction')
    Jaff.Require(['jaffSpec.ensureThis', 'jaffSpec.andThis'], testFunction)
    expect(testFunction).toHaveBeenCalled()

  it 'should not call the function until all of the variables exist', ->
    testFunction = jasmine.createSpy('testFunction')
    runs ->
      jaffSpec.ensureThis = {}
      Jaff.Require(['jaffSpec.ensureThis', 'jaffSpec.notThis'], testFunction)
      expect(testFunction).not.toHaveBeenCalled()
    runs ->
      jaffSpec.notThis = {}
    waits(200)
    runs ->
      expect(testFunction).toHaveBeenCalled()
