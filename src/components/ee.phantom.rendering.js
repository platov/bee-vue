import Vue from 'vue';
import $ from 'jquery';
import Field from './ee.field';

export default Vue.component('ee-phantom-rendering', {
    props: ['data'],

    data() {
        return {
            fields: {}
        }
    },

    created () {
        let r = Vue.compile(this.data.template);
        this.$options.render = r.render;
        this.$options.staticRenderFns = r.staticRenderFns;
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
        },

        dispose () {
            this.$parent.$forceUpdate();
        }
    }
});
