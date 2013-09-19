RequirementNotFoundException = (->)

class Jaff.Module
  constructor: ->
    @modules = []

  require: (nameOrFunction) ->
    if typeof nameOrFunction == 'function'
      @requireFunction(nameOrFunction)
    else
      @requireName(nameOrFunction)

  #* @private
  requireName: (name) ->
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
  requireFunction: (func) ->
    throw new RequirementNotFoundException() if func() != true

  define: (callback) ->
    @modules.push(callback) if typeof callback == 'function'
    @callFulfilledModules()
    @

  #* @private
  callFulfilledModules: ->
    stop = false
    while !stop
      previousLength = @modules.length
      @modules = @modules.filter(@callFunction)
      stop = (previousLength == @modules.length || @modules.length == 0)
    @modules.length == 0

  #* @private
  callFunction: (callback) ->
    callAgain = false
    try
      callback()
    catch error
      if error instanceof RequirementNotFoundException
        callAgain = true
      else
        throw error
    callAgain
