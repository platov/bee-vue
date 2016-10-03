import Vue from 'vue';
import $ from 'jquery';
import Chrome from './ee.chrome';

export default Vue.component('ee-placeholder', Chrome.extend({
    name: 'Placeholder',

    events: {
        'insertRendering': function () {
            this.$compile(this.$el.parentNode);

            Sitecore.PageModes.ChromeManager.resetChromes();
        },

        'rendering:update': function (vm) {
            vm.$destroy();

            Vue.nextTick(() => {
                this.$compile(this.$el.parentNode);

                Sitecore.PageModes.ChromeManager.resetChromes();
            });
        }
    },

    created: function () {
        this.syncMediator({
            namespace: 'placeholder',
            events   : ['insertRendering', 'moveRendering', 'popRendering', 'removeRendering']
        });
    },

    methods: {
        getControlId () {
            let $openTag;

            if (this._isFragment) {
                $openTag = $(this.$el.nextElementSibling);
            } else {
                $openTag = $(this.$el).children(':first');
            }

            if (!$openTag.is('code[chrometype=placeholder][kind=open]')) {
                throw '[bee-vue]: Failed to determine own opening Chrome Tag';
            }

            return $openTag.attr('id').replace('_edit', '');
        }
    }
}));
