import beeCore from 'bee-core/src';
import act from './act';

require('./components');

window.beeCore = beeCore;

module.exports = {
    act,
    promise: beeCore.promise
};