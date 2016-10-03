import Vue from 'vue';
import $ from 'jquery';
import _ from "lodash/wrapperLodash";
import mixin from 'lodash/mixin';
import isNaN from 'lodash/isNaN';
import Field from './ee.field';
import beeCore from 'bee-core/src';

mixin(_, {isNaN, mixin});

export default Vue.component('ee-boolean', Field.extend({
    name: 'BooleanField',

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

            this._chrome.type.fieldValue.val(this.value ? 1 : 0);
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

            this.value = this.normalizeValue(value);
        },

        normalizeValue: function (value) {
            value = parseInt(value);

            if (_.isNaN(value)) {
                value = false;
            }

            return !!value;
        }
    }
}));