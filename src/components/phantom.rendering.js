import Vue from 'vue';
import $ from 'jquery';
import PhantomChrome from './phantom.chrome'

export default Vue.component('phantom-rendering', PhantomChrome.extend({
    name: 'phantom-rendering',

    props: ['data'],

    data() {
        return {
            fields: {}
        }
    },

    mounted () {
        Vue.nextTick(this.attachChromeTags);
    },

    beforeDestroy () {
        this.detachChromeTags();
    },

    methods: {
        attachChromeTags () {
            let el = $(this.$el);

            el.before(this.data.openTag);
            el.after(this.data.closeTag);
        },

        detachChromeTags(){
            $(this.data.openTag).detach();
            $(this.data.closeTag).detach();
        }
    }
}));
