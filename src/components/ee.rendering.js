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

    created () {
        let el = this.$options.el,
            privateAttrs = [];

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

                if (this.$options.template instanceof DocumentFragment) {
                    if ($template.children().length === 1) {
                        $template.children().prepend(htmlValue);
                    } else {
                        $template.prepend(htmlValue);
                    }
                } else {
                    if ($template.length === 1) {
                        $template.prepend(htmlValue);
                    } else {
                        $template = htmlValue.add($template);
                    }

                    this.$options.template = $('<div/>').append($template).html();
                }
            } else {
                attrValue = Vue.component(`ee-${fieldType}`).options.methods.normalizeValue(attrValue);
                Vue.set(this.$data, fieldName, attrValue);
            }
        });

        _.each(privateAttrs, attr => el.removeAttributeNode(attr));
    },

    ready () {
        if (!this._hasChromeTag) {
            return;
        }

        this._syncMediator({
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
    },

    methods: {
        getChromeTag () {
            let chromeTag = $(this.$el.previousElementSibling);

            if (!chromeTag.is('code[chrometype=rendering][kind=open]')) {
                return null;
            }

            return chromeTag;
        }
    }
}));

