import $ from 'jquery';
import Vue from 'vue';

import Chrome from './ee.chrome';


export default Vue.component('ee-rendering', Chrome.extend({
    name: 'Rendering',
    
    created: function () {
        this.syncMediator({
            namespace: 'rendering',
            events: ['update', 'handleMessage']
        });

        this.getControlId = function () {
            var $openTag;

            $openTag = $(this.$el.previousElementSibling);

            if (!$openTag.is('code[chrometype=rendering][kind=open]')) {
                throw '[bee-vue]: Failed to determine own opening ChromeTag';
            }

            return $openTag.attr('id').replace('_edit', '');
        };

        /**
         * Destroy Vue instance before Placeholder removes Child Rendering
         * */
        this.$parent.$on('before-removeRendering', (placeholderChrome, renderingChrome) => {
            if (renderingChrome !== this._chrome) {
                return;
            }

            this.$destroy();
        });
    }
}));

