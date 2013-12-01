describe 'Jaff.Module', ->
  afterEach ->
    delete window.specModule

  it 'should extend itself with the passed object', ->
    specModule = new Jaff.Module(
      a: [1, 2, 3],
      o: { k: 'v1' },
      f: ((x) -> x*x),
      k: 'v2'
    );
    expect(specModule.a).toEqual([1,2,3]);
    expect(specModule.o.k).toEqual('v1');
    expect(specModule.f(2)).toEqual(4);
    expect(specModule.k).toEqual('v2');

  describe 'require', ->
    beforeEach ->
      window.specModule = new Jaff.Module()

    it 'should return the object', ->
      specModule.testObject = { subObject: { value: null } }
      localObject = specModule.require('specModule.testObject.subObject')
      localObject.value = 42
      expect(localObject).toBe(specModule.testObject.subObject)
      expect(localObject.value).toBe(42)
      expect(specModule.testObject.subObject.value).toBe(42)

    it 'should accept a function that returns true', ->
      require = -> specModule.require(-> true)
      expect(require).not.toThrow()
      require = -> specModule.require(-> false)
      expect(require).toThrow()

    it 'should pass through if function throws it\'s own error', ->
      require = -> specModule.require(-> throw('!'))
      expect(require).toThrow('!')

  describe 'define', ->
    beforeEach ->
      window.specModule = new Jaff.Module()

    it 'should accept a function', ->
      expect(-> specModule.define(->)).not.toThrow()

    it 'should call the passed function immediately', ->
      spy = jasmine.createSpy()
      specModule.define(spy)
      expect(spy).toHaveBeenCalled()

    it 'should call again on next define if requirements are unmet', ->
      specModule.testRequirement2 = true
      specModule.testFunc1 = ->
        specModule.require('specModule.testRequirement1')
      specModule.testFunc2 = ->
        specModule.require('specModule.testRequirement2')
      spyOn(specModule, 'testFunc1').andCallThrough()
      spyOn(specModule, 'testFunc2').andCallThrough()
      specModule.define(specModule.testFunc1)
      specModule.define(specModule.testFunc2)
      specModule.define(->)
      expect(specModule.testFunc1).toHaveBeenCalled()
      expect(specModule.testFunc1.calls.length).toBe(3)
      expect(specModule.testFunc2).toHaveBeenCalled()
      expect(specModule.testFunc2.calls.length).toBe(1)

    it 'should call all and empty queue on finish', ->
      specModule.testFunc1 = ->
        specModule.require('specModule.testRequirement2')
        specModule.testRequirement1 = true
      specModule.testFunc2 = ->
        specModule.require('specModule.testRequirement3')
        specModule.testRequirement2 = true
      specModule.testFunc3 = ->
        specModule.require('specModule.testRequirement4')
        specModule.testRequirement3 = true
      specModule.testFunc4 = ->
        specModule.testRequirement4 = true
      spyOn(specModule, 'testFunc1').andCallThrough()
      spyOn(specModule, 'testFunc2').andCallThrough()
      spyOn(specModule, 'testFunc3').andCallThrough()
      specModule.define(specModule.testFunc1)
      specModule.define(specModule.testFunc2)
      specModule.define(specModule.testFunc3)
      expect(specModule.testFunc1.calls.length).toBe(1)
      expect(specModule.testFunc2.calls.length).toBe(1)
      expect(specModule.testFunc3.calls.length).toBe(1)
      specModule.define(specModule.testFunc4)
      expect(specModule.testFunc1.calls.length).toBe(4)
      expect(specModule.testFunc2.calls.length).toBe(3)
      expect(specModule.testFunc3.calls.length).toBe(2)
      specModule.define(->)
      expect(specModule.testFunc1.calls.length).toBe(4)
      expect(specModule.testFunc2.calls.length).toBe(3)
      expect(specModule.testFunc3.calls.length).toBe(2)

    it 'should re-throw other errors', ->
      testFunc = -> specModule.define(-> throw('!'))
      expect(testFunc).toThrow()

    it 'should stop calling if other error thrown', ->
      specModule.testFunc1 = -> specModule.define(-> throw('!'))
      specModule.testFunc2 = -> specModule.define(->)
      spyOn(specModule, 'testFunc1').andCallThrough()
      spyOn(specModule, 'testFunc2').andCallThrough()
      expect(specModule.testFunc1).toThrow()
      expect(specModule.testFunc2).not.toThrow()
      expect(specModule.testFunc1).toHaveBeenCalled()
      expect(specModule.testFunc1.calls.length).toBe(1)
      expect(specModule.testFunc2).toHaveBeenCalled()
      expect(specModule.testFunc2.calls.length).toBe(1)
