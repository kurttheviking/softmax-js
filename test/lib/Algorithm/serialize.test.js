/* global describe, it */
/* eslint-disable global-require, import/no-extraneous-dependencies */

const expect = require('chai').expect;

const randomFloat = require('../../utils/randomFloat');
const randomInteger = require('../../utils/randomInteger');

describe('Algorithm#serialize', () => {
  const Algorithm = require('../../../index');

  const arms = randomInteger(2, 20);
  const gamma = randomFloat(0, 1e-5);
  const tau = randomFloat(0, 1e-5, true);
  const config = {
    arms
  };

  const emptyArray = new Array(arms).fill(0);

  it('returns a valid state (gamma)', () => {
    const alg = new Algorithm(Object.assign({ gamma }, config));

    return alg.serialize().then((state) => {
      expect(state).to.have.property('arms', config.arms);
      expect(state).to.have.property('gamma', gamma);
      expect(state).to.have.property('tau', null);

      expect(state).to.have.property('counts');
      expect(state.counts).to.deep.equal(emptyArray);

      expect(state).to.have.property('values');
      expect(state.values).to.deep.equal(emptyArray);
    });
  });

  it('returns a valid state (tau)', () => {
    const alg = new Algorithm(Object.assign({ tau }, config));

    return alg.serialize().then((state) => {
      expect(state).to.have.property('arms', config.arms);
      expect(state).to.have.property('gamma');  // [KE] value is irrelevant
      expect(state).to.have.property('tau', tau);

      expect(state).to.have.property('counts');
      expect(state.counts).to.deep.equal(emptyArray);

      expect(state).to.have.property('values');
      expect(state.values).to.deep.equal(emptyArray);
    });
  });
});
