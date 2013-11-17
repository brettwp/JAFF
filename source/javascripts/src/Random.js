srng = function(){ this.seed(1); };
srng.prototype = {
    seed: function(seed) {
        seed = (seed & 0xffffffff) >>> 0;
        this.x = (seed >>> 16) + 4125832013;
        this.y = ((seed & 0xffff) >>> 0) + 814584116;
        this.z = 542;
    },

    random: function() {
        this.x = this.rotl(this.multiply(this.x, 255519323), 13);
        this.y = this.rotl(this.multiply(this.y, 3166389663), 17);
        this.z = this.rotl(this.z - this.rotl(this.z, 11), 27);
        return (this.x ^ this.y ^ this.z) >>> 0;
    },

    multiply: function(a, b) {
        var ah = (a >> 16) & 0xffff, al = a & 0xffff;
        var bh = (b >> 16) & 0xffff, bl = b & 0xffff;
        return (((((ah * bl) + (al * bh)) & 0xffff) << 16) >>> 0) + (al * bl);
    },

    rotl: function(value, r) {
        return ((value << r) | (value >>> (32 - r))) >>> 0;
    }
}

r = new srng();
min = max = r.random();
sum = 0;
for (i = 0; i < 10000000; i++) {
    n = r.random();
    sum += n;
    min = Math.min(min, n);
    max = Math.max(max, n);
}
console.log(min, max, sum / 10000000);

