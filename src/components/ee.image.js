import Vue from 'vue';
import $ from 'jquery';
import Field from './ee.field';

export default Vue.component('ee-image', Field.extend({
    name: 'ImageField',

    events: {
        'setModified' () {
            this.fetchValue();
        }
    },

    methods: {
        fetchValue () {
            this.value = this.normalizeValue(this.getFragmentChild().filter('img')[0]);
        },

        normalizeValue (value) {
            return $(value).attr('src');
        }
    }
}));
