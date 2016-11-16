import Vue from 'vue';
import beeCore from 'bee-core/src';
import Field from './ee.field';

export default Vue.component('ee-text', Field.extend({
    name: 'TextField',

    template: `<div class="__text__"><slot></slot></div>`,

    methods: {
        getRawValue () {
            if (!beeCore.isExperienceEditor) {
                return this.$el.innerHTML;
            }

            return this.$phantom.chromeData.fieldValue;
        },

        setRawValue(value){
            if (!beeCore.isExperienceEditor) {
                return;
            }

            this.$phantom.chromeData.fieldValue = value;
        },

        normalizeValue (value) {
            return value === '[No text in field]' ? '' : value;
        }
    }
}));