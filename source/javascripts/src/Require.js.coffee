timeout = null
recheckDuration = 50
maxRecheck = 40
timesChecked = 0
allRequirements = []

Jaff.Require = (requirements, callFunction) ->
  if typeof requirements == 'string'
    requirements = [requirements]
  allRequirements.push
    require: requirements
    func: callFunction
  timesChecked = 0
  callFulfilled()

callFulfilled = ->
  clearTimeout(timeout) if timeout
  allRequirements = allRequirements.filter(callFunction)
  timesChecked++
  if timesChecked > maxRecheck
    # TODO: Call Require.unmetCallback
    alert('Unmet requirements!')
    console.log(allRequirements)
  else if allRequirements.length > 0
    setTimeout (-> callFulfilled()), recheckDuration

callFunction = (testObject) ->
  allExist = allRequirementsExist(testObject.require)
  testObject.func() if allExist
  !allExist

allRequirementsExist = (requirements) ->
  for requirement, i in requirements
    break if doesNotExist(requirement)
  i == requirements.length

doesNotExist = (name) ->
  start = window
  parts = name.split('.')
  for part, i in parts
    if (start.hasOwnProperty(part))
      start = start[part]
    else
      break
  i != parts.length
