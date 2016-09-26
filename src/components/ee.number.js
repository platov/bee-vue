import _ from 'lodash';
import Vue from 'vue';

import TextField from './ee.text';

export default Vue.component('ee-number', TextField.extend({
    name: 'NumberField',

    methods: {
        fetchValue: function () {
            this.constructor.super.options.methods.fetchValue.apply(this);

            this.value = this.normalizeValue(this.value);
        },
        
        normalizeValue: function (value) {
            value = parseInt(value);

            if (_.isNaN(value)) {
                console.warn('[ee.number] Value is NaN');
                return null;
            }
            
            return value;
        }
    }
}));