import Vue from 'vue';
import $ from 'jquery';
import _ from '../utils/lodash';
import Field from './ee.field';
import beeCore from 'bee-core/src';

export default Vue.component('ee-image', Field.extend({
    name: 'ImageField',

    methods: {
        getRawValue () {
            if (!beeCore.isExperienceEditor) {
                return this.$el;
            }

            return $(this.$phantom.chromeData.fieldValue)[0];
        },

        setRawValue(imageString){
            let el;

            el = $(this.$el);

            if (!beeCore.isExperienceEditor) {
                el.find('img').replaceWith(imageString);
                return;
            }

            this.$phantom.chromeData.fieldValue = imageString;
        },

        normalizeValue (img) {
            return img ? img.src : '';
        },

        deNormalizeValue(value){
            let el = this.$phantom.$el.cloneNode();

            el.src = value;

            return el.outerHTML;
        }
    }
}));
