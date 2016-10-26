import Vue from 'vue';
import $ from 'jquery';
import _ from "lodash/wrapperLodash";
import mixin from 'lodash/mixin';
import each from 'lodash/each';
import camelCase from 'lodash/camelCase';
import filter from 'lodash/filter';
import map from 'lodash/map';
import Chrome from './ee.chrome';
import beeCore from 'bee-core/src';

const REGEX = /^(boolean|number|text|image)-(.+?)$/;

mixin(_, {each, mixin, camelCase, filter, map});

export default Vue.component('ee-rendering', Chrome.extend({
    name: 'Rendering',

    data: function () {
        return {
            fields: {}
        }
    },

    created () {
        this._inlineChromeTags = [];

        //this._fetchInlineChromeTags();
    },

    compiled (){
        //this._embedInlineChromeTags();
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
        _fetchInlineChromeTags () {
            let el = this.$options.el,
                attrs;

            attrs = _.filter(el.attributes, attr => REGEX.test(attr.name));

            this._inlineChromeTags = _.map(attrs, attr => {
                let match = attr.name.match(REGEX), type, name;

                [type, name] = [match[1], _.camelCase(match[2])];

                return {
                    type,
                    name,
                    data: decodeURIComponent(attr.value)
                };
            });

            _.each(attrs, attr => el.removeAttributeNode(attr));
        },

        _embedInlineChromeTags () {
            _.each(this._inlineChromeTags, chromeTag => {
                let htmlValue, attrValue;

                if (beeCore.isExperienceEditor) {
                    htmlValue = $(`<div data-name="${chromeTag.name}" style="display: none;">
                                <ee-${chromeTag.type} map="${chromeTag.name}">${chromeTag.data}</ee-${chromeTag.type}>
                            </div>`);

                    if (this._isFragment) {
                        $(this._fragmentStart).after(htmlValue);
                    } else {
                        $(this.$el).append(htmlValue);
                    }

                    this.$compile(htmlValue[0]);
                } else {
                    attrValue = Vue.component(`ee-${chromeTag.type}`).options.methods.normalizeValue(chromeTag.data);

                    Vue.set(this.$data, chromeTag.name, attrValue);
                }
            });

            this._inlineChromeTags = [];
        },

        getChromeTag () {
            let chromeTag = $(this.$el.previousElementSibling);

            if (!chromeTag.is('code[chrometype=rendering][kind=open]')) {
                return null;
            }

            return chromeTag;
        }
    }
}));

