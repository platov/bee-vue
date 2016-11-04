import Vue from 'vue';
import _ from '../utils/lodash';
import TextField from './ee.text';

export default Vue.component('ee-number', TextField.extend({
    name: 'NumberField',

    methods: {
        normalizeValue (value) {
            value = TextField.options.methods.normalizeValue(value);
            value = parseInt(value);

            if (_.isNaN(value)) {
                return null;
            }
            
            return value;
        }
    }
}));