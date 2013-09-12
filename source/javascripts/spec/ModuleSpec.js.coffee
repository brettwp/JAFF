describe 'Jaff.Module', ->
  describe 'require', ->
    it 'should return the object', ->
      window.specModule = new Jaff.Module()
      specModule.testObject = { subObject: { value: null } }
      localObject = specModule.require('specModule.testObject.subObject')
      localObject.value = 42
      expect(localObject).toBe(specModule.testObject.subObject)
      expect(localObject.value).toBe(42)
      expect(specModule.testObject.subObject.value).toBe(42)

  describe 'define', ->
    beforeEach ->
      window.specModule = new Jaff.Module()

    it 'should accept a function', ->
      expect(-> specModule.define(->)).not.toThrow()

    it 'should call the passed function immediately', ->
      spy = jasmine.createSpy()
      specModule.define(spy)
      expect(spy).toHaveBeenCalled()

    it 'should call (not) again on next define if requirements are unmet', ->
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
      expect(specModule.testFunc1.calls.length).toBe(3)
      expect(specModule.testFunc2.calls.length).toBe(2)
      expect(specModule.testFunc3.calls.length).toBe(1)
      expect(specModule.finish()).toBe(false)
      specModule.define(specModule.testFunc4)
      expect(specModule.finish()).toBe(true)
      expect(specModule.testFunc1.calls.length).toBe(8)
      expect(specModule.testFunc2.calls.length).toBe(6)
      expect(specModule.testFunc3.calls.length).toBe(4)
