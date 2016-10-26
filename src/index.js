import beeCore from 'bee-core/src';

require('./components');

window.beeCore = beeCore;

module.exports = {
    promise: beeCore.promise
};