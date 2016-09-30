import Vue from 'vue';
import $ from 'jquery';
import _ from "lodash/wrapperLodash";

import mixin from 'lodash/mixin';
import each from 'lodash/each';
import Chrome from './ee.chrome';

const REGEX = /^(boolean|number|text|image)-(.+?)$/;

mixin(_, {each, mixin});

export default Vue.component('ee-rendering', Chrome.extend({
    name: 'Rendering',

    created: function () {
        var el = this.$options.el,
            privateAttrs = [];

        this.syncMediator({
            namespace: 'rendering',
            events   : ['update', 'handleMessage']
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

        _.each(el.attributes, attr => {
            var match, fieldName, fieldType, htmlValue, $template, attrValue;

            if (!REGEX.test(attr.name)) {
                return;
            }

            privateAttrs.push(attr);

            attrValue = decodeURIComponent(attr.value);
            match = attr.name.match(REGEX);

            [fieldType, fieldName] = [match[1], match[2]];

            if (window.Sitecore && window.Sitecore.WebEditSettings && window.Sitecore.WebEditSettings.editing) {
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
    }
}));

