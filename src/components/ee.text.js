import Vue from 'vue';
import beeCore from 'bee-core/src';
import Field from './ee.field';

export default Vue.component('ee-text', Field.extend({
    name: 'TextField',

    template: `<div class="__text__"><slot></slot></div>`,

    methods: {
        getRawValue () {
            let phantomField;

            if(!beeCore.isExperienceEditor) {
                return this.$el.innerHTML;
            }

            phantomField = this.getPhantomField();

            return phantomField.chromeData.fieldValue;
        },

        setRawValue(value){
            let phantomField;

            if(!beeCore.isExperienceEditor) {
                return;
            }

            phantomField = this.getPhantomField();

            phantomField.chromeData.fieldValue = value;
        },

        normalizeValue (value) {
            return value === '[No text in field]' ? '' : value;
        }
    }
}));