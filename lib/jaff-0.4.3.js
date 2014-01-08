/*!
 * JAFF JavaScript Library v0.4.3
 * http://www.github.com/brettwp/JAFF
 * Copyright (c) 2013 Brett Pontarelli
 *
 * Licensed under The MIT License.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */




/**
 *  @namespace Main namespace for JAFF library.
 */

window.Jaff = {};

/** @ignore */
Jaff.VERSION = '0.4.3';
(function() {
  Jaff.Cookie = (function() {
    function Cookie() {}

    Cookie.prototype.setCookie = function(cookieName, cookieValue, daysOrObject) {
      var cookie, expireDate;
      expireDate = this.buildExpireDate(daysOrObject);
      cookie = cookieName + '=' + escape(cookieValue) + ';expires=' + expireDate + (daysOrObject.path ? ';path=' + daysOrObject.path : void 0) + (daysOrObject.domain ? ';domain=' + daysOrObject.domain : void 0) + (daysOrObject.secure ? ';secure' : void 0);
      this.setDocumentCookie(cookie);
      return this;
    };

    Cookie.prototype.buildExpireDate = function(daysOrObject) {
      var expireDate, msPerDay, msTillExpire, time, utcExpire;
      msTillExpire = 0;
      utcExpire = null;
      if (typeof daysOrObject === 'object') {
        if (daysOrObject.utc) {
          utcExpire = daysOrObject.utc;
        } else {
          msTillExpire = this.getMsTillExpire(daysOrObject);
        }
      } else {
        msPerDay = 60 * 60 * 24 * 1000;
        msTillExpire = daysOrObject * msPerDay;
      }
      expireDate = new Date();
      time = utcExpire || (expireDate.getTime() + msTillExpire);
      expireDate.setTime(time);
      return expireDate.toUTCString();
    };

    Cookie.prototype.getMsTillExpire = function(daysOrObject) {
      var days, hours, minutes, seconds;
      seconds = daysOrObject.seconds || 0;
      minutes = daysOrObject.minutes || 0;
      hours = daysOrObject.hours || 0;
      days = daysOrObject.days || 0;
      return ((((((days * 24) + hours) * 60) + minutes) * 60) + seconds) * 1000;
    };

    Cookie.prototype.getCookie = function(cookieName) {
      var cookieStart, cookieStop, cookieValue, documentCookie;
      documentCookie = this.getDocumentCookie();
      cookieValue = '';
      if (documentCookie.length > 0) {
        cookieStart = documentCookie.indexOf(cookieName + '=');
        if (cookieStart !== -1) {
          cookieStart = cookieStart + cookieName.length + 1;
          cookieStop = documentCookie.indexOf(';', cookieStart);
          if (cookieStop === -1) {
            cookieStop = documentCookie.length;
          }
          cookieValue = unescape(documentCookie.substring(cookieStart, cookieStop));
        }
      }
      return cookieValue;
    };

    Cookie.prototype.isCookieSet = function(cookieName) {
      var cookieValue;
      cookieValue = this.getCookie(cookieName);
      return cookieValue !== null && cookieValue !== '';
    };

    Cookie.prototype.clearCookie = function(cookieName) {
      this.setCookie(cookieName, null, -1);
      return this;
    };

    Cookie.prototype.setDocumentCookie = function(cookieDef) {
      document.cookie = cookieDef;
      return this;
    };

    Cookie.prototype.getDocumentCookie = function() {
      return document.cookie;
    };

    return Cookie;

  })();

}).call(this);
(function() {
  Jaff.Fabrication = (function() {
    var extract;

    function Fabrication() {
      this.fabricators = {};
    }

    Fabrication.prototype.fabricator = function(classFunc, callback) {
      return this.fabricators[classFunc] = callback;
    };

    Fabrication.prototype.fabricate = function() {
      var args, attributes, classFunc, _ref;
      _ref = extract.apply(this, arguments), args = _ref[0], classFunc = _ref[1], attributes = _ref[2];
      args.unshift(null, attributes);
      return new (classFunc.bind.apply(classFunc, args));
    };

    Fabrication.prototype.attributes_for = function() {
      var args, attributes, classFunc, _ref;
      _ref = extract.apply(this, arguments), args = _ref[0], classFunc = _ref[1], attributes = _ref[2];
      return attributes;
    };

    Fabrication.prototype.canFabricate = function(classFunc) {
      return typeof this.fabricators[classFunc] === 'function';
    };

    extract = function() {
      var args, attributes, callback, classFunc, key, overrides, value;
      args = Array.prototype.slice.call(arguments);
      classFunc = args.shift();
      overrides = args.shift();
      callback = this.fabricators[classFunc];
      attributes = callback(args);
      for (key in overrides) {
        value = overrides[key];
        attributes[key] = value;
      }
      return [args, classFunc, attributes];
    };

    return Fabrication;

  })();

}).call(this);
(function() {
  var RequirementNotFoundException;

  RequirementNotFoundException = (function() {});

  Jaff.Module = (function() {
    var callFulfilledModules, callFunction, extend, requireFunction, requireName;

    function Module(source) {
      this.__modules = [];
      extend(this, source);
    }

    extend = function(destination, source) {
      var property, _results;
      _results = [];
      for (property in source) {
        if (typeof source[property] === 'object' && source[property] !== null) {
          destination[property] = destination[property] || {};
          _results.push(arguments.callee(destination[property], source[property]));
        } else {
          _results.push(destination[property] = source[property]);
        }
      }
      return _results;
    };

    Module.prototype.require = function(nameOrFunction) {
      if (typeof nameOrFunction === 'function') {
        return requireFunction(nameOrFunction);
      } else {
        return requireName(nameOrFunction);
      }
    };

    requireName = function(name) {
      var index, part, parts, start, _i, _len;
      start = window;
      parts = name.split('.');
      for (index = _i = 0, _len = parts.length; _i < _len; index = ++_i) {
        part = parts[index];
        if (start.hasOwnProperty(part)) {
          start = start[part];
        } else {
          break;
        }
      }
      if (index !== parts.length) {
        throw new RequirementNotFoundException();
      }
      return start;
    };

    requireFunction = function(func) {
      if (func() !== true) {
        throw new RequirementNotFoundException();
      }
    };

    Module.prototype.define = function(callback) {
      if (typeof callback === 'function') {
        if (callFunction(callback)) {
          this.__modules.push(callback);
        } else {
          callFulfilledModules.call(this);
        }
      }
      return this;
    };

    callFulfilledModules = function() {
      var previousLength, stop;
      stop = false;
      while (!stop) {
        previousLength = this.__modules.length;
        this.__modules = this.__modules.filter(callFunction);
        stop = previousLength === this.__modules.length || this.__modules.length === 0;
      }
      return this.__modules.length === 0;
    };

    callFunction = function(callback) {
      var callAgain, error;
      callAgain = false;
      try {
        callback();
      } catch (_error) {
        error = _error;
        if (error instanceof RequirementNotFoundException) {
          callAgain = true;
        } else {
          throw error;
        }
      }
      return callAgain;
    };

    return Module;

  })();

}).call(this);
(function() {
  Jaff.Random = (function() {
    function Random(seed) {
      this.seed(seed || 1);
    }

    Random.prototype.seed = function(seed) {
      var max;
      max = Math.pow(2, 32);
      if (!(seed >= 0 && seed < max)) {
        seed = Math.floor(Math.random() * max);
      }
      seed = seed >>> 0;
      this.x = (seed >>> 16) + 4125832013;
      this.y = (seed & 0xffff) + 814584116;
      this.z = 542;
      return this;
    };

    Random.prototype.next = function() {
      this.x = this.rotl(this.mult(this.x, 255519323), 13);
      this.y = this.rotl(this.mult(this.y, 3166389663), 17);
      this.z = this.rotl((this.z - this.rotl(this.z, 11)) >>> 0, 27);
      return this.current();
    };

    Random.prototype.current = function() {
      return ((this.x ^ this.y ^ this.z) >>> 0) / 4294967296;
    };

    Random.prototype.getState = function() {
      var toHex;
      toHex = function(value) {
        return ('00000000' + value.toString(16)).substr(-8);
      };
      return toHex(this.x) + toHex(this.y) + toHex(this.z);
    };

    Random.prototype.setState = function(state) {
      this.x = parseInt(state.substr(0, 8), 16);
      this.y = parseInt(state.substr(8, 8), 16);
      this.z = parseInt(state.substr(16, 8), 16);
      return this;
    };

    Random.prototype.rotl = function(value, r) {
      return ((value << r) | (value >>> (32 - r))) >>> 0;
    };

    Random.prototype.mult = function(a, b) {
      var ah, al, bh, bl;
      ah = a >>> 16;
      al = a & 0xffff;
      bh = b >>> 16;
      bl = b & 0xffff;
      return (((((ah * bl) + (al * bh)) & 0xffff) << 16) >>> 0) + (al * bl);
    };

    return Random;

  })();

}).call(this);
