import Vue from 'vue';
import $ from 'jquery';
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
        Vue.nextTick(this.attachChromeTags);

        this.fetchValue();
    },

    beforeDestroy () {
        this.detachChromeTags();
    },

    methods: {
        resolveData(){
            let parent = this.getParentPhantom();

            this.chromeData = parent.chromeData[this.id];
        },

        fetchValue (chrome) {
            if ('image' === this.chromeData.fieldType) {
                this.value = chrome ? chrome.element[0] : this.$el;
            } else {
                this.value = this.$el.innerHTML;
            }

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
