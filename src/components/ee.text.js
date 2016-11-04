import Vue from 'vue';
import $ from 'jquery';
import _ from '../utils/lodash';
import Field from './ee.field';

export default Vue.component('ee-text', Field.extend({
    name: 'TextField',

    template: `<div class="__text__"><slot></slot></div>`,

    computed: {
        value () {
            return this.normalizeValue(this.getRawValue());
        }
    },

    mounted () {
        /*if (!this._hasChromeTag) {
            return;
        }

        this.$watch('value', function () {
            let value;

            if (!this._chrome) {
                return;
            }

            value = this.deNormalizeValue(this.value);

            this._chrome.type.fieldValue.val(value);
            this._chrome.type.refreshValue();
        });*/
    },

    methods: {
        fetchValue () {
            let el = $(this.$el),
                value;

            value = this._hasChromeTag
                ? el.find('.scWebEditInput').text()
                : el.text().trim();

            this.value = this.normalizeValue(value);
        },

        getRawValue () {
            let phantomField = _.find(this.$children, item => item.isPhantomComponent);

            return phantomField ? phantomField.value : this.$el.innerHTML;
        },

        normalizeValue (value) {
            return value === '[No text in field]' ? '' : value;
        }
    }
}));