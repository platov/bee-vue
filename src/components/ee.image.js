import Vue from 'vue';
import $ from 'jquery';
import _ from '../utils/lodash';
import Field from './ee.field';
import beeCore from 'bee-core/src';

export default Vue.component('ee-image', Field.extend({
    name: 'ImageField',

    methods: {
        getRawValue () {
            let phantomField;

            if (!beeCore.isExperienceEditor) {
                return this.$el;
            }

            phantomField = this.getPhantomField();

            return $(phantomField.chromeData.fieldValue)[0];
        },

        setRawValue(imageString){
            let phantomField, el;

            el = $(this.$el);

            if (!beeCore.isExperienceEditor) {
                el.find('img').replaceWith(imageString);
                return;
            }

            phantomField = this.getPhantomField();

            phantomField.chromeData.fieldValue = imageString;
        },

        normalizeValue (img) {
            return img ? img.src : '';
        },

        deNormalizeValue(value){
            let el = this.$el.cloneNode();

            el.src = value;

            return this.$el.outerHTML;
        }
    }
}));
