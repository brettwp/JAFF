describe 'Jaff.Fabrication', ->
  factory = null
  callback = null

  class TestClass
    constructor: ->
      @args = arguments

  describe 'fabricator', ->
    it 'should accept a key and a function', ->
      factory = new Jaff.Fabrication()
      factory.fabricator(TestClass, ->)

  describe 'fabricate', ->
    beforeEach ->
      factory = new Jaff.Fabrication()
      callback = ->
        a: 'a'
        b: 'b'
      factory.fabricator(TestClass, callback)

    it 'should call the function for a key', ->
      spy = jasmine.createSpy()
      factory.fabricator(TestClass, spy)
      factory.fabricate(TestClass)
      expect(spy).toHaveBeenCalled()

    it 'should be an instance of the TestClass', ->
      newClass = factory.fabricate(TestClass)
      expect(newClass instanceof TestClass).toBe(true)

    it 'should create a new Key with callback results', ->
      newClass = factory.fabricate(TestClass)
      expect(newClass.args).toEqual([a:'a', b:'b'])

    it 'should merge second arg with callback to overwrite results', ->
      newClass = factory.fabricate(TestClass, b:'c', opt:'opt')
      expect(newClass.args).toEqual([a:'a', b:'c', opt:'opt'])

    it 'should pass additional args on to class constructor', ->
      newClass = factory.fabricate(TestClass, {b:'c', opt:'opt'}, {x:1, y:2}, true)
      expect(newClass.args).toEqual([{a:'a', b:'c', opt:'opt'}, {x:1, y:2}, true])

    it 'should accept null override object', ->
      newClass = factory.fabricate(TestClass, null, {x:1, y:2}, 1, 2, false)
      expect(newClass.args).toEqual([{a:'a', b:'b'}, {x:1, y:2}, 1, 2, false])

  describe 'attributes_for', ->
    beforeEach ->
      factory = new Jaff.Fabrication()
      callback = ->
        a: 'a'
        b: 'b'
      factory.fabricator(TestClass, callback)

    it 'should only return the callback results', ->
      attrs = factory.attributes_for(TestClass)
      expect(attrs).toEqual({a:'a', b:'b'})

    it 'should merge second arg with callback results', ->
      attrs = factory.attributes_for(TestClass, {a:'x', opt:'opt'})
      expect(attrs).toEqual({a:'x', b:'b', opt:'opt'})

    it 'should ignore additional arguments', ->
      attrs = factory.attributes_for(TestClass, {a:'x', opt:'opt'}, 1, 2, false)
      expect(attrs).toEqual({a:'x', b:'b', opt:'opt'})

  describe 'canFabricate', ->
    beforeEach ->
      factory = new Jaff.Fabrication()

    it 'should return true for key + function', ->
      factory.fabricator(TestClass, ->)
      expect(factory.canFabricate(TestClass)).toBe(true)
      factory.fabricator(TestClass, 'nope')
      expect(factory.canFabricate('fail')).toBe(false)
