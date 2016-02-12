/* global describe, it */
/* eslint func-names: 0*/
var chai = require('chai');

var expect = chai.expect;

describe('Algorithm', function () {
  var Algorithm = require('../index');

  it('does not require new keyword', function () {
    function test() {
      return require('../index')();
    }

    expect(test).to.not.throw(Error);
  });

  it('throws TypeError when passed arms=0', function () {
    function test() {
      var alg = new Algorithm({ arms: 0 });
      return alg;
    }

    expect(test).to.throw(TypeError);

    try {
      test();
    } catch (err) {
      expect(err).to.match(/invalid arms: cannot be less than 1/);
    }
  });

  it('throws TypeError when passed arms<0', function () {
    function test() {
      var alg = new Algorithm({ arms: -1 });
      return alg;
    }

    expect(test).to.throw(TypeError);

    try {
      test();
    } catch (err) {
      expect(err).to.match(/invalid arms: cannot be less than 1/);
    }
  });

  it('throws TypeError when passed gamma<0', function () {
    function test() {
      var alg = new Algorithm({ gamma: -1 });
      return alg;
    }

    expect(test).to.throw(TypeError);

    try {
      test();
    } catch (err) {
      expect(err).to.match(/invalid gamma: cannot be less than 0/);
    }
  });

  it('throws TypeError when passed tau<0', function () {
    function test() {
      var alg = new Algorithm({ tau: -1 });
      return alg;
    }

    expect(test).to.throw(TypeError);

    try {
      test();
    } catch (err) {
      expect(err).to.match(/invalid tau: cannot be less than 0/);
    }
  });
});
