import Vue from 'vue';
import $ from 'jquery';
import PhantomChrome from './phantom.chrome'

export default Vue.component('phantom-rendering', PhantomChrome.extend({
    name: 'phantom-rendering',

    props: ['chromeData'],

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
        resolveData(){

        },

        attachChromeTags () {
            let el = $(this.$el);

            el.before(this.chromeData.openTag);
            el.after(this.chromeData.closeTag);
        },

        detachChromeTags(){
            $(this.chromeData.openTag).detach();
            $(this.chromeData.closeTag).detach();
        }
    }
}));
