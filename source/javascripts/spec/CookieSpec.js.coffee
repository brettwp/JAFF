describe 'Jaff.Cookie', ->
  describe 'with mock Date and Cookie', ->
    mockDocumentCookie = null
    testCookie = null
    origDateGetTime = null

    class MockCookie extends Jaff.Cookie
      setDocumentCookie: (cookieDef) -> mockDocumentCookie = cookieDef
      getDocumentCookie: () -> mockDocumentCookie

    beforeEach ->
      testCookie = new MockCookie()
      origDateGetTime = Date.prototype.getTime
      Date.prototype.getTime = () -> 0

    afterEach ->
      testCookie = null
      Date.prototype.getTime = origDateGetTime

    it 'should set a (mock) cookie', ->
      testCookie.setCookie('CookieSet', 'Monster', {
        path: 'path', domain: 'domain', secure: false
      })
      expRegEx = new RegExp('CookieSet=Monster;expires=Thu, 0*1 Jan 1970 00:00:00[ A-z]*;path=path;domain=domain')
      expect(expRegEx.test(mockDocumentCookie)).toBe(true)

    it 'should set a secure (mock) cookie', ->
      testCookie.setCookie('CookieSetSecure', 'Monster', {
        path: 'path', domain: 'domain', secure: true
      })
      expRegEx = new RegExp('CookieSetSecure=Monster;expires=Thu, 0*1 Jan 1970 00:00:00[ A-z]*;path=path;domain=domain;secure')
      expect(expRegEx.test(mockDocumentCookie)).toBe(true)

    it 'should get a (mock) cookie', () ->
      mockDocumentCookie = 'CookieGet=Monster'
      expect(testCookie.getCookie('CookieGet')).toBe('Monster')

    it 'should test if cookie is set', ->
      mockDocumentCookie = 'Cookie=Monster'
      expect(testCookie.isCookieSet('Brownie')).toBe(false)
      expect(testCookie.isCookieSet('Cookie')).toBe(true)

    it 'should set cookie by days till expire', ->
      testCookie.setCookie('Test', 'Monster', 15)
      expStr = 'Test=Monster;expires=Fri, 16 Jan 1970 00:00:00'
      expect(mockDocumentCookie.substr(0,expStr.length)).toEqual(expStr)

    it 'should set cookie by UTC', ->
      testCookie.setCookie('Test', 'Monster', { utc: 9*24*60*60*1000 + 1000 })
      expStr = 'Test=Monster;expires=Sat, 10 Jan 1970 00:00:01'
      expect(mockDocumentCookie.substr(0,expStr.length)).toEqual(expStr)

    it 'should set cookie by time units', ->
      testCookie.setCookie('Test', 'Monster', {
        days: 11, hours: 1, minutes: 1, seconds: 1
      })
      expStr = 'Test=Monster;expires=Mon, 12 Jan 1970 01:01:01'
      expect(mockDocumentCookie.substr(0,expStr.length)).toEqual(expStr)

  describe 'with browser cookie and date', ->
    it 'should set and clear', ->
      cookieAdapter = new Jaff.Cookie()
      cookieAdapter.setCookie('Temp', 'Short', 1)
      cookieAdapter.clearCookie('Temp')
      expect(cookieAdapter.isCookieSet('Temp')).toBe(false)
