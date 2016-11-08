import Vue from 'vue';
import TextField from './ee.number';
import NumberField from './ee.number';

export default Vue.component('ee-boolean', TextField.extend({
    name: 'BooleanField',

    methods: {
        normalizeValue (value) {
            value = NumberField.options.methods.normalizeValue(value);

            return value === 1;
        },

        deNormalizeValue (value) {
            return value ? 1 : 0;
        }
    }
}));