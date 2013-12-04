class Jaff.Fabrication
  constructor: ->
    @fabricators = {}

  fabricator: (classFunc, callback) ->
    @fabricators[classFunc] = callback

  fabricate: ->
    [args, classFunc, attributes] = extract.apply(@, arguments)
    args.unshift(null, attributes)
    new (classFunc.bind.apply(classFunc, args))

  attributes_for: ->
    [args, classFunc, attributes] = extract.apply(@, arguments)
    attributes

  canFabricate: (classFunc) ->
    typeof @fabricators[classFunc] == 'function'

  #* @private
  extract = ->
    args = Array.prototype.slice.call(arguments)
    classFunc = args.shift()
    overrides = args.shift()
    callback = @fabricators[classFunc]
    attributes = callback(args)
    attributes[key] = value for key, value of overrides
    [args, classFunc, attributes]
