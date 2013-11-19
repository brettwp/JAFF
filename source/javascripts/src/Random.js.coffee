class Jaff.Random
  constructor: ->
    @seed(1)

  seed: (seed) ->
    seed = seed >>> 0
    @x = (seed >>> 16) + 4125832013
    @y = (seed & 0xffff) + 814584116
    @z = 542
    @

  next: ->
    @x = @rotl(@mult(@x, 255519323), 13)
    @y = @rotl(@mult(@y, 3166389663), 17)
    @z = @rotl((@z - @rotl(@z, 11)) >>> 0, 27)
    @current()

  current: ->
    (@x ^ @y ^ @z) >>> 0

  getState: ->
    toHex = (value) -> ('00000000' + value.toString(16)).substr(-8)
    toHex(@x) + toHex(@y) + toHex(@z)

  setState: (state) ->
    @x = parseInt(state.substr(0,8), 16)
    @y = parseInt(state.substr(8,8), 16)
    @z = parseInt(state.substr(16,8), 16)
    @

  #* @private
  rotl: (value, r) ->
    ((value << r) | (value >>> (32 - r))) >>> 0

  #* @private
  mult: (a, b) ->
    ah = a >>> 16
    al = a & 0xffff
    bh = b >>> 16
    bl = b & 0xffff
    (((((ah * bl) + (al * bh)) & 0xffff) << 16) >>> 0) + (al * bl)


