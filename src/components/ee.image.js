import Field from './ee.field';

export default Vue.component('ee-image', Field.extend({
    name: 'ImageField',

    events: {
        'setModified': function () {
            this.fetchValue();
        }
    },

    methods: {
        fetchValue: function () {
            this.value = this.getFragmentChild().filter('img').attr('src');
        }
    }
}));
