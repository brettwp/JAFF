class Jaff.Fabrication
  constructor: ->
    @fabricators = {}

  fabricator: (key, callback) ->
    @fabricators[key] = callback

  fabricate: ->
    [args, classFunc, attributes] = @extract.apply(@, arguments)
    args.unshift(null, attributes)
    new (classFunc.bind.apply(classFunc, args))

  attributes_for: ->
    [args, classFunc, attributes] = @extract.apply(@, arguments)
    attributes

  extract: ->
    args = Array.prototype.slice.call(arguments)
    classFunc = args.shift()
    overrides = args.shift()
    callback = @fabricators[classFunc]
    attributes = callback(args)
    attributes[key] = value for key, value of overrides
    [args, classFunc, attributes]
