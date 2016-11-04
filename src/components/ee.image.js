import Vue from 'vue';
import _ from '../utils/lodash';
import Field from './ee.field';
import beeCore from 'bee-core/src';

export default Vue.component('ee-image', Field.extend({
    name: 'ImageField',

    computed: {
        value () {
            return this.normalizeValue(this.getRawValue());
        }
    },

    methods: {
        getRawValue () {
            if(beeCore.isExperienceEditor) {
                let phantomField = _.find(this.$children, {isPhantomComponent: true});

                if(!phantomField) {
                    console.warn(`[bee-vue] Can't find phantom component`);
                    return null;
                }

                return phantomField.value;
            }


            return this.$el;
        },

        normalizeValue (img) {
            return img ? img.src : '';
        }
    }
}));
