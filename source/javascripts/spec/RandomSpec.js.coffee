describe 'Jaff.Random', ->
  max = Math.pow(2, 32)

  mult = (a, b) ->
    ah = a >>> 16
    al = a & 0xffff
    bh = b >>> 16
    bl = b & 0xffff
    (((((ah * bl) + (al * bh)) & 0xffff) << 16) >>> 0) + (al * bl)

  rotl = (value, r) ->
    ((value << r) | (value >>> (32 - r))) >>> 0

  it 'should seed', ->
    seed = 1234567890
    x = (seed >>> 16) + 4125832013
    y = (seed & 0xffff) + 814584116
    z = 542
    current = (x ^ y ^ z) >>> 0
    r = new Jaff.Random()
    r.seed(seed)
    expect(r.current()).toEqual(current / max)

  it 'should seed on instantiation', ->
    seed = 1234567890
    x = (seed >>> 16) + 4125832013
    y = (seed & 0xffff) + 814584116
    z = 542
    current = (x ^ y ^ z) >>> 0
    r = new Jaff.Random(seed)
    expect(r.current()).toEqual(current / max)

  it 'should advance to next number', ->
    seed = 2345678901
    x = (seed >>> 16) + 4125832013
    x = rotl(mult(x, 255519323), 13)
    y = (seed & 0xffff) + 814584116
    y = rotl(mult(y, 3166389663), 17)
    z0 = 0b00000000000000000000001000011110
    z1 = 0b00000000000100001111000000000000
    z2 = 0b11111111111011110001000000000000
    z3 = 0b11111111111011110001001000011110
    expect(z0).toEqual(542)
    expect(z1).toEqual(rotl(z0, 11))
    expect(z2).toEqual(-z1 >>> 0)
    expect(z3).toEqual((z0 - z1) >>> 0)
    z = rotl(z3, 27)
    next = (x ^ y ^ z) >>> 0
    r = new Jaff.Random()
    r.seed(seed)
    expect(r.next()).toEqual(next / max)

  it 'should advance again for good measure', ->
    seed = 3456789012
    x = (seed >>> 16) + 4125832013
    x = rotl(mult(x, 255519323), 13)
    x = rotl(mult(x, 255519323), 13)
    y = (seed & 0xffff) + 814584116
    y = rotl(mult(y, 3166389663), 17)
    y = rotl(mult(y, 3166389663), 17)
    z0 = 0b00000000000000000000001000011110
    z1 = 0b00000000000100001111000000000000
    z2 = 0b11111111111011110001000000000000
    z3 = 0b11111111111011110001001000011110
    z4 = 0b11110111111111110111100010010000
    z5 = 0b11111011110001001000011110111111
    z6 = 0b00000100001110110111100001000001
    z7 = 0b11111100001110101111000011010001
    expect(z0).toEqual(542)
    expect(z1).toEqual(rotl(z0, 11))
    expect(z2).toEqual(-z1 >>> 0)
    expect(z3).toEqual((z0 - z1) >>> 0)
    z = rotl(z3, 27)
    expect(z4).toEqual(z)
    expect(z5).toEqual(rotl(z, 11))
    expect(z6).toEqual(-z5 >>> 0)
    expect(z7).toEqual((z4 - z5) >>> 0)
    z = rotl(z7, 27)
    next = (x ^ y ^ z) >>> 0
    r = new Jaff.Random()
    r.seed(seed)
    r.next()
    expect(r.next()).toEqual(next / max)

  it 'should get and set state', ->
    r = new Jaff.Random()
    r.seed(42)
    initialState = r.getState()
    numbers = [r.current(), r.next(), r.next()]
    expect(r.getState()).not.toEqual(initialState)
    r.setState(initialState)
    expect(r.current()).toEqual(numbers[0])
    expect(r.next()).toEqual(numbers[1])
    expect(r.next()).toEqual(numbers[2])

  it 'should random seed if not passed a seed', ->
    r = new Jaff.Random()
    r.seed(0)
    v0 = r.next()
    r.seed()
    expect(r.next()).not.toEqual(v0)

  it 'should seed 0 the same each time', ->
    r = new Jaff.Random()
    r.seed(0)
    v0 = r.next()
    r.seed(0)
    expect(r.next()).toEqual(v0)
