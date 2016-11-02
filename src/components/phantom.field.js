import Vue from 'vue';
import PhantomChrome from './phantom.chrome';

export default Vue.component('phantom-field', PhantomChrome.extend({
    name : 'phantom-field',
    props: ['id'],

    data () {
        return {
            value: void 0
        }
    },

    created (){
        this.syncMediator({
            namespace: 'field',
            events   : ['setModified', 'persist']
        });

        this.$on('setModified', this.fetchValue);
    },

    mounted(){
        this.fetchValue();
    },

    methods: {
        resolveData(){
            let parent = this.getParentPhantom();

            this.data = parent.data[this.link]
        },

        fetchValue () {
            this.value = this.$el.innerHTML;
        }
    }
}));
