RequirementNotFoundException = (->)

class Jaff.Module
  constructor: (source) ->
    @__modules = []
    extend(@, source)

  #* @private
  extend = (destination, source) ->
    for property of source
      if (typeof source[property] == 'object' && source[property] != null)
        destination[property] = destination[property] || {}
        arguments.callee(destination[property], source[property])
      else
        destination[property] = source[property]

  require: (nameOrFunction) ->
    if typeof nameOrFunction == 'function'
      requireFunction(nameOrFunction)
    else
      requireName(nameOrFunction)

  #* @private
  requireName = (name) ->
    start = window
    parts = name.split('.')
    for part, index in parts
      if (start.hasOwnProperty(part))
        start = start[part]
      else
        break
    throw new RequirementNotFoundException() if index != parts.length
    start

  #* @private
  requireFunction = (func) ->
    throw new RequirementNotFoundException() if func() != true

  define: (callback) ->
    if typeof callback == 'function'
      if callFunction(callback)
        @__modules.push(callback)
      else
        callFulfilledModules.call(@)
    @

  #* @private
  callFulfilledModules = ->
    stop = false
    while !stop
      previousLength = @__modules.length
      @__modules = @__modules.filter(callFunction)
      stop = (previousLength == @__modules.length || @__modules.length == 0)
    @__modules.length == 0

  #* @private
  callFunction = (callback) ->
    callAgain = false
    try
      callback()
    catch error
      if error instanceof RequirementNotFoundException
        callAgain = true
      else
        throw error
    callAgain
