import Vue from 'vue';
import _ from "lodash/wrapperLodash";
import mixin from 'lodash/mixin';
import isNaN from 'lodash/isNaN';
import TextField from './ee.text';

mixin(_, {isNaN, mixin});

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