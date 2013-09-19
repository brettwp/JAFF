describe 'Jaff.Module', ->
  afterEach ->
    delete window.specModule

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
      expect(specModule.testFunc1.calls.length).toBe(5)
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
      expect(specModule.testFunc1.calls.length).toBe(3)
      expect(specModule.testFunc2.calls.length).toBe(2)
      expect(specModule.testFunc3.calls.length).toBe(1)
      specModule.define(specModule.testFunc4)
      expect(specModule.testFunc1.calls.length).toBe(7)
      expect(specModule.testFunc2.calls.length).toBe(5)
      expect(specModule.testFunc3.calls.length).toBe(3)
      specModule.define(->)
      expect(specModule.testFunc1.calls.length).toBe(7)
      expect(specModule.testFunc2.calls.length).toBe(5)
      expect(specModule.testFunc3.calls.length).toBe(3)

    it 'should re-throw other errors', ->
      testFunc = -> specModule.define(-> throw('!'))
      expect(testFunc).toThrow()
