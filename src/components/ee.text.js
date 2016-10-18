import Vue from 'vue';
import $ from 'jquery';
import Field from './ee.field';
import beeCore from 'bee-core/src';

export default Vue.component('ee-text', Field.extend({
    name: 'TextField',

    events: {
        'blur' () {
            this.fetchValue();
        }
    },

    ready () {
        if (!this._hasChromeTag) {
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
        });
    },

    methods: {
        fetchValue () {
            let fragmentChildNodes = this.getFragmentChild(),
                value;

            if (this._hasChromeTag) {
                value = $(fragmentChildNodes).filter('.scWebEditInput').text();
            } else {
                value = $(fragmentChildNodes).text().trim();
            }

            this.value = this.normalizeValue(value);
        },

        normalizeValue (value) {
            return value === '[No text in field]' ? '' : value;
        }
    }
}));