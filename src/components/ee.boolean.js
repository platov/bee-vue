import Vue from 'vue';
import _ from "lodash/wrapperLodash";
import mixin from 'lodash/mixin';
import isNaN from 'lodash/isNaN';
import TextField from './ee.number';
import NumberField from './ee.number';

mixin(_, {isNaN, mixin});

export default Vue.component('ee-boolean', TextField.extend({
    name: 'BooleanField',

    methods: {
        normalizeValue (value) {
            value = NumberField.options.methods.normalizeValue(value);

            return value === 1;
        },

        deNormalizeValue () {
            return this.value ? 1 : 0;
        }
    }
}));