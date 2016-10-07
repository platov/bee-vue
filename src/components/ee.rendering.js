import Vue from 'vue';
import $ from 'jquery';
import _ from "lodash/wrapperLodash";
import mixin from 'lodash/mixin';
import each from 'lodash/each';
import camelCase from 'lodash/camelCase';
import Chrome from './ee.chrome';
import beeCore from 'bee-core/src';

const REGEX = /^(boolean|number|text|image)-(.+?)$/;

mixin(_, {each, mixin, camelCase});

export default Vue.component('ee-rendering', Chrome.extend({
    name: 'Rendering',

    created: function () {
        let el = this.$options.el,
            privateAttrs = [];

        this.syncMediator({
            namespace: 'rendering',
            events   : ['update', 'handleMessage']
        });

        /**
         * Destroy Vue instance before Placeholder removes Child Rendering
         * */
        this.$parent.$on('before-removeRendering', (placeholderChrome, renderingChrome) => {
            if (renderingChrome !== this._chrome) {
                return;
            }

            this.$destroy();
        });

        _.each(el.attributes, attr => {
            let match, fieldName, fieldType, htmlValue, $template, attrValue;

            if (!REGEX.test(attr.name)) {
                return;
            }

            privateAttrs.push(attr);

            attrValue = decodeURIComponent(attr.value);
            match = attr.name.match(REGEX);

            [fieldType, fieldName] = [match[1], _.camelCase(match[2])];

            if (beeCore.isExperienceEditor) {
                $template = $(this.$options.template);
                htmlValue = $(`<div style="display: none;"><ee-${fieldType} map="${fieldName}">${attrValue}</ee-${fieldType}></div>`);

                if ($template.children().length === 1) {
                    $template.children().first().prepend(htmlValue);
                } else {
                    $template.append(htmlValue);
                }
            } else {
                attrValue = Vue.component(`ee-${fieldType}`).options.methods.normalizeValue(attrValue);
                Vue.set(this.$data, fieldName, attrValue);
            }
        });

        _.each(privateAttrs, attr => el.removeAttributeNode(attr));
    },

    methods: {
        getControlId () {
            let $openTag;

            $openTag = $(this.$el.previousElementSibling);

            if (!$openTag.is('code[chrometype=rendering][kind=open]')) {
                throw '[bee-vue]: Failed to determine own opening ChromeTag';
            }

            return $openTag.attr('id').replace('_edit', '');
        }
    }
}))
;

