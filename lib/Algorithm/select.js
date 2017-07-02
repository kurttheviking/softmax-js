const debug = require('debug')('softmax:select');
const Random = require('random-js');

const random = new Random(Random.engines.mt19937().autoSeed());
const sum = require('../utils/sum');

function select() {
  const temp = this.tau === null ? (1 / Math.log(sum(this.counts) + 1 + this.gamma)) : this.tau;
  const values = this.values.map(val => Math.exp(val / temp));

  const last = values.length - 1;
  const r = random.real(0, 1, true);
  const z = sum(values);

  debug('random threshold: %s', r);

  const cumulative = values.reduce((out, val, idx) => {
    const x = val / z;

    if (idx === 0) {
      out.push(x);
    } else if (idx === last) {
      out.push(1);
    } else {
      out.push(out[idx - 1] + x);
    }

    return out;
  }, []);

  debug('scaled cumulative values: %j', cumulative);

  return cumulative.findIndex(x => x >= r);
}

module.exports = select;
