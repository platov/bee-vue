import Vue from 'vue';
import _ from "lodash/wrapperLodash";
import mixin from 'lodash/mixin';
import isNaN from 'lodash/isNaN';
import TextField from './ee.text';

mixin(_, {isNaN, mixin});

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