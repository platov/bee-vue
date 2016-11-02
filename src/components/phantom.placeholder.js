import Vue from 'vue';
import $ from 'jquery';
import _ from "lodash/wrapperLodash";
import mixin from "lodash/mixin";
import each from 'lodash/each';
import find from 'lodash/find';
import flatten from 'lodash/flatten';
import findIndex from 'lodash/findIndex';
import act from 'bee-vue/src/act';
import PhantomChrome from './phantom.chrome';

mixin(_, {mixin, each, find, flatten, findIndex});

export default Vue.component('phantom-placeholder', PhantomChrome.extend({
    name: 'phantom-placeholder',

    props: ['id'],

    created: function () {
        this.syncMediator({
            namespace: 'placeholder',
            events   : ['insertRendering', 'moveRendering', 'popRendering', 'removeRendering']
        });

        this.$on('before-removeRendering', (placeholderChrome, renderingChrome) => {
            let id = renderingChrome.controlId();

            renderingChrome.__element = renderingChrome.element;
            renderingChrome.element = renderingChrome.element.constructor([]);

            this.removeRendering(id);
        });

        this.$on('before-insertRendering', (placeholderChrome, htmlString, position) => {
            let actPart = act.generate($(`<div>${htmlString}</div>`)[0]);

            this.data.renderings.splice(position, 0, ...actPart.renderings);
        });

        this.$on('insertRendering', (placeholderChrome, renderingChrome) => {
            renderingChrome._openingMarker.remove();
            renderingChrome._closingMarker.remove();
            renderingChrome.element.remove();
        });

        this.$on('moveRendering', (placeholderChrome, renderingChrome, position) => {
            let id = renderingChrome.controlId();

            this.moveRendering(id, position - 1);
        });
    },

    beforeUpdate(){
        this.detachChromeTags();
        this.detachChildChromeTags();
    },

    updated () {
        Vue.nextTick(()=> {
            this.attachChromeTags();
            this.attachChildChromeTags();
            Sitecore.PageModes.ChromeManager.resetChromes();
        })
    },

    mounted () {
        Vue.nextTick(this.attachChromeTags);
    },

    beforeDestroy () {
        this.detachChromeTags();
    },

    methods: {
        resolveData(){
            let parent = this.getParentPhantom();

            this.data = parent.data[this.id]
        },

        removeRendering (id) {
            let arr = this.data.renderings,
                index = _.findIndex(arr, {id});

            arr.splice(index, 1);
        },

        moveRendering(id, positionIndex){
            let arr = this.data.renderings,
                itemIndex = _.findIndex(arr, {id});

            arr.splice(positionIndex, 0, arr.splice(itemIndex, 1)[0]);
        },

        attachChromeTags () {
            let el = $(this.$el);

            el.prepend(this.data.openTag);
            el.append(this.data.closeTag);
        },

        detachChromeTags(){
            $(this.data.openTag).detach();
            $(this.data.closeTag).detach();
        },

        attachChildChromeTags() {
            _.each(this.$refs.renderings, r => r.attachChromeTags());
        },

        detachChildChromeTags (){
            _.each(this.$refs.renderings, r => r.detachChromeTags());
        }
    }
}));
