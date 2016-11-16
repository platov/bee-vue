import Vue from 'vue';
import $ from 'jquery';
import Chrome from './ee.chrome';

export default Vue.component('ee-placeholder', Chrome.extend({
    name: 'Placeholder',

    events: {
        'insertRendering' (placeholderChrome, renderingChrome, position) {
            renderingChrome.element.each((i, v) => this.$compile(v));

            Sitecore.PageModes.ChromeManager.resetChromes();
        },

        'rendering:update' (renderingComponent, renderingChrome) {
            renderingComponent.$destroy();

            Vue.nextTick(() => {
                renderingChrome.element.each((i, v) => this.$compile(v));

                Sitecore.PageModes.ChromeManager.resetChromes();
            });
        }
    },

    ready () {
        if (!this._hasChromeTag) {
            return;
        }

        this._syncMediator({
            namespace: 'placeholder',
            events   : ['insertRendering', 'moveRendering', 'popRendering', 'removeRendering']
        });
    },

    methods: {
        getChromeTag(){
            let chromeSelector = 'code[chrometype=placeholder][kind=open]',
                chromeTag;

            chromeTag = this._isFragment
                ? $(this.$el).next(chromeSelector)
                : $(this.$el).children(`${chromeSelector}:first-child`);

            if (chromeTag.length !== 1) {
                return null;
            }

            return chromeTag;
        }
    }
}));
