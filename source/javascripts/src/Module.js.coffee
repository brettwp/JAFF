RequirementNotFoundException = (->)

class Jaff.Module
  constructor: ->
    @modules = []

  require: (name) ->
    start = window
    parts = name.split('.')
    for part, index in parts
      if (start.hasOwnProperty(part))
        start = start[part]
      else
        break
    throw new RequirementNotFoundException() if index != parts.length
    start

  define: (callback) ->
    @modules.push(callback) if typeof callback == 'function'
    @callFulfilledModules()
    @

  finish: ->
    stop = false
    while !stop
      previousLength = @modules.length
      @callFulfilledModules()
      stop = (previousLength == @modules.length || @modules.length == 0)
    @modules.length == 0

  #* @private
  callFulfilledModules: ->
    @modules = @modules.filter(@callFunction)

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
