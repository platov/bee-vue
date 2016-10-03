import Vue from 'vue';
import $ from 'jquery';
import Field from './ee.field';
import beeCore from 'bee-core/src';

export default Vue.component('ee-text', Field.extend({
    name: 'TextField',

    events: {
        'blur': function () {
            this.fetchValue();
        }
    },

    created: function () {
        this.$watch('value', function () {
            if (!this._chrome) {
                return;
            }

            this._chrome.type.fieldValue.val(this.value);
            this._chrome.type.refreshValue();
        });
    },

    methods: {
        fetchValue: function () {
            let fragmentChildNodes = [].slice.call(this._fragment.childNodes),
                value;

            if (beeCore.isExperienceEditor) {
                value = $(fragmentChildNodes).filter('.scWebEditInput').text();
            } else {
                value = $(fragmentChildNodes).text().trim();
            }

            this.value = value === '[No text in field]' ? '' : value;
        }
    }
}));