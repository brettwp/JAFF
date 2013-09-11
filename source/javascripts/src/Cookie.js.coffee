class Jaff.Cookie
  setCookie: (cookieName, cookieValue, daysOrObject) ->
    expireDate = @buildExpireDate(daysOrObject)
    cookie = cookieName + '=' + escape(cookieValue) +
      ';expires=' + expireDate +
      (';path=' + daysOrObject.path if daysOrObject.path) +
      (';domain=' + daysOrObject.domain if daysOrObject.domain) +
      (';secure' if daysOrObject.secure)
    @setDocumentCookie cookie
    @

  buildExpireDate: (daysOrObject) ->
    msTillExpire = 0
    utcExpire = null
    if typeof daysOrObject == 'object'
      if daysOrObject.utc
        utcExpire = daysOrObject.utc
      else
        msTillExpire = @getMsTillExpire(daysOrObject)
    else
      msPerDay = 60 * 60 * 24 * 1000
      msTillExpire = daysOrObject * msPerDay
    expireDate = new Date()
    time = utcExpire || (expireDate.getTime() + msTillExpire)
    expireDate.setTime(time)
    expireDate.toUTCString()

  getMsTillExpire: (daysOrObject) ->
    seconds = daysOrObject.seconds || 0
    minutes = daysOrObject.minutes || 0
    hours = daysOrObject.hours || 0
    days = daysOrObject.days || 0
    ((((((days*24) + hours)*60) + minutes)*60) + seconds)*1000

  getCookie: (cookieName) ->
    documentCookie = @getDocumentCookie()
    cookieValue = ''
    if documentCookie.length > 0
      cookieStart = documentCookie.indexOf(cookieName + '=')
      if cookieStart != -1
        cookieStart = cookieStart + cookieName.length + 1
        cookieStop = documentCookie.indexOf(';', cookieStart)
        cookieStop = documentCookie.length if cookieStop == -1
        cookieValue = unescape(documentCookie.substring(cookieStart, cookieStop))
    cookieValue

  isCookieSet: (cookieName) ->
    cookieValue = @getCookie(cookieName)
    (cookieValue != null && cookieValue != '')

  clearCookie: (cookieName) ->
    @setCookie(cookieName, null, -1)
    @

  setDocumentCookie: (cookieDef) ->
    document.cookie = cookieDef
    @

  getDocumentCookie: () ->
    document.cookie
