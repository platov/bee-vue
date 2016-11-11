import Vue from 'vue';
import $ from 'jquery';
import _ from '../utils/lodash';
import act from 'bee-vue/src/act';
import PhantomChrome from './phantom.chrome';

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

            this.chromeData.renderings.splice(position, 0, ...actPart.renderings);
        });

        this.$on('insertRendering', (placeholderChrome, renderingChrome) => {
            renderingChrome._openingMarker.remove();
            renderingChrome._closingMarker.remove();
            renderingChrome.element.remove();

            this.$once('$updated', ()=> {
                Vue.nextTick(()=> {
                    let r = this.getRendering(renderingChrome.controlId());

                    renderingChrome._originalDOMElement = $sc(r.chromeData.openTag);
                });
            });

        });

        this.$on('moveRendering', (placeholderChrome, renderingChrome, position) => {
            let id = renderingChrome.controlId();

            this.moveRendering(id, position - 1);
        });

        this.$on('rendering:before-update', (rendering, renderingChrome, data) => {
            renderingChrome.element = renderingChrome.element.constructor([]);
            renderingChrome._closingMarker = renderingChrome.element.constructor([]);
        });

        this.$on('rendering:update', (rendering, renderingChrome, data) => {
            let html, tree, $sc;

            $sc = renderingChrome.element.constructor;

            if ('string' === typeof data) {
                html = $(`<div>${data}</div>`)[0];
            } else {
                html = $(`<div></div>`).append(data.html.clone())[0];
            }

            tree = act.generate(html);

            this.replaceRendering(rendering.chromeData.id, tree.renderings[0]);

            this.$once('$updated', ()=> {
                Vue.nextTick(()=> {
                    let r = this.getRendering(rendering.chromeData.id);

                    renderingChrome._originalDOMElement = $sc(r.chromeData.openTag);
                });
            });
        });

        this.$once('chrome-available', ()=> {
            if (!this.chromeData.renderings.length) {
                this.chrome.type.showEmptyLook();
            }
        });

    },

    beforeUpdate(){
        this.detachChromeTags();
        this.detachChildChromeTags();
    },

    updated () {
        // On updated self
        Vue.nextTick(() => {
            this.attachChromeTags();
            this.attachChildChromeTags();

            // On updated child
            Vue.nextTick(()=>{
                Sitecore.PageModes.ChromeManager.resetChromes()
            });
        });
    },

    mounted () {
        this.attachChromeTags();
        this.attachChildChromeTags();
    },

    beforeDestroy () {
        this.detachChromeTags();
    },

    methods: {
        resolveData(){
            let parent = this.getParentPhantom();

            this.chromeData = parent.chromeData[this.id];
        },

        getRendering (id) {
            return _.find(this.$refs.renderings, r => r.chromeData.id === id);
        },

        removeRendering (id) {
            let arr = this.chromeData.renderings,
                index = _.findIndex(arr, {id});

            arr.splice(index, 1);
        },

        moveRendering(id, positionIndex){
            let arr = this.chromeData.renderings,
                itemIndex = _.findIndex(arr, {id});

            arr.splice(positionIndex, 0, arr.splice(itemIndex, 1)[0]);
        },

        replaceRendering(id, data, async){
            let arr = this.chromeData.renderings,
                index = _.findIndex(arr, {id});

            if (async) {
                arr.splice(index, 1);

                Vue.nextTick(()=> {
                    arr.splice(index, 0, data);
                });
            } else {
                arr.splice(index, 1, data);
            }
        },

        attachChromeTags () {
            let el = $(this.$el);

            el.prepend(this.chromeData.openTag);
            el.append(this.chromeData.closeTag);
        },

        detachChromeTags(){
            $(this.chromeData.openTag).detach();
            $(this.chromeData.closeTag).detach();
        },

        attachChildChromeTags() {
            _.each(this.$refs.renderings, r => r.attachChromeTags());
        },

        detachChildChromeTags (){
            _.each(this.$refs.renderings, r => r.detachChromeTags());
        }
    }
}));
