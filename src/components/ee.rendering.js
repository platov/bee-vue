import Vue from 'vue';
import $ from 'jquery';
import _ from '../utils/lodash';
import Chrome from './ee.chrome';
import beeCore from 'bee-core/src';
import act from 'bee-vue/src/act';

const REGEX = /^(boolean|number|text|image)-(.+?)$/;

export default Vue.component('ee-rendering', Chrome.extend({
    name: 'Rendering',

    data: function () {
        return {
            fields: {}
        }
    },

    mounted () {
        this._fetchInlineChromeTags();

        this._embedInlineChromeTags();
    },

    methods: {
        _fetchInlineChromeTags () {
            let el = this.$el,
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
            let self = this;

            if (beeCore.isExperienceEditor) {
                let inlineComponentsHolder,
                    inlineComponents = [];

                _.each(this._inlineChromeTags, chromeTag => {
                    inlineComponents.push(`<ee-${chromeTag.type} map="${chromeTag.name}">${chromeTag.data}</ee-${chromeTag.type}>`);
                });

                if (inlineComponents.length) {
                    let tree = act.generate($(`<div data-inline-components style="display: none">${inlineComponents.join('')}</div>`)[0]);

                    inlineComponentsHolder = new Vue({
                        name    : 'inline-components',
                        template: tree.template,
                        parent  : this,

                        data: {
                            chromeData: tree,
                            fields    : {}
                        },

                        created (){
                            this.fields = self.fields;
                        }
                    });

                    inlineComponentsHolder.$mount();

                    this.$el.appendChild(inlineComponentsHolder.$el);
                }
            } else {
                _.each(this._inlineChromeTags, chromeTag => {
                    let attrValue;

                    attrValue = Vue.component(`ee-${chromeTag.type}`).options.methods.normalizeValue(chromeTag.data);

                    Vue.set(this.$data, chromeTag.name, attrValue);
                });
            }

            this._inlineChromeTags = [];
        },

        getPhantomComponent(){
            let component = this.$parent;

            if (!component.isPhantomComponent && 'rendering' === component.chromeData.type) {
                console.error(`[bee-vue] Can't find related phantom component.`, this);
                return;
            }

            return component;
        }
    }
}));

