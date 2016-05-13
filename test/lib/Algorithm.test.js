/* global describe, it */
/* eslint func-names: 0*/
var _ = require('lodash');
var chai = require('chai');

var expect = chai.expect;

describe('Algorithm', function () {
  var Algorithm = require('../../index');

  var arms = _.random(1, 10);
  var gamma = _.random(0, 1e-5, true);
  var tau = _.random(0, 1e-5, true);
  var state = {
    arms: arms,
    counts: _.times(arms, function () { return _.random(0, 10); }),
    values: _.times(arms, function () { return _.random(0, 1, true); })
  };

  it('does not require new keyword', function () {
    function test() {
      return require('../../index')();
    }

    expect(test).to.not.throw(Error);
  });

  it('restores instance properties (with gamma)', function () {
    var alg = new Algorithm(_.extend({ gamma: gamma }, state));

    expect(alg.arms).to.equal(state.arms);
    expect(alg.gamma).to.equal(gamma);
    expect(alg.tau).to.equal(null);
    expect(alg.counts).to.deep.equal(state.counts);
    expect(alg.values).to.deep.equal(state.values);
  });

  it('restores instance properties (with tau)', function () {
    var alg = new Algorithm(_.extend({ tau: tau }, state));

    expect(alg.arms).to.equal(state.arms);
    expect(alg.tau).to.equal(tau);
    expect(alg.counts).to.deep.equal(state.counts);
    expect(alg.values).to.deep.equal(state.values);
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

  it('throws if counts is not an array', function () {
    var stateLocal;

    stateLocal = _.cloneDeep(state);
    stateLocal.counts = Date.now.toString(36);

    function test() {
      return new Algorithm(stateLocal);
    }

    expect(test).to.throw(TypeError);

    try {
      test();
    } catch (err) {
      expect(err).to.match(/counts must be an array/);
    }
  });

  it('throws if values is not an array', function () {
    var stateLocal;

    stateLocal = _.cloneDeep(state);
    stateLocal.values = Date.now.toString(36);

    function test() {
      return new Algorithm(stateLocal);
    }

    expect(test).to.throw(TypeError);

    try {
      test();
    } catch (err) {
      expect(err).to.match(/values must be an array/);
    }
  });

  it('throws if counter length does not equal arm count', function () {
    var stateLocal;

    stateLocal = _.cloneDeep(state);
    stateLocal.counts.pop();

    function test() {
      return new Algorithm(stateLocal);
    }

    expect(test).to.throw(Error);

    try {
      test();
    } catch (err) {
      expect(err).to.match(/arms and counts.length must be identical/);
    }
  });

  it('throws if values length does not equal arm count', function () {
    var stateLocal;

    stateLocal = _.cloneDeep(state);
    stateLocal.values.pop();

    function test() {
      return new Algorithm(stateLocal);
    }

    expect(test).to.throw(Error);

    try {
      test();
    } catch (err) {
      expect(err).to.match(/arms and values.length must be identical/);
    }
  });
});
