import Vue from 'vue';
import $ from 'jquery';
import Field from './ee.field';

export default Vue.component('ee-image', Field.extend({
    name: 'ImageField',

    created(){
        this.$on('setModified', this.fetchValue)
    },

    methods: {
        fetchValue () {
            this.value = this.normalizeValue($(this.$el).children('img')[0]);
        },

        normalizeValue (value) {
            return $(value).attr('src');
        }
    }
}));
