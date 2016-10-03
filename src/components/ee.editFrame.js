import Vue from 'vue';
import $ from 'jquery';
import _ from "lodash/wrapperLodash";
import mixin from 'lodash/mixin';
import find from 'lodash/find';
import Chrome from './ee.chrome';
import beeCore from 'bee-core/src';

mixin(_, {find, mixin});

export default Vue.component('ee-edit-frame', Chrome.extend({
    name: 'EditFrame',

    created: function () {
        if (!beeCore.isExperienceEditor) {
            return;
        }

        this.syncMediator({
            namespace: 'editFrame',
            events   : ['updateStart', 'updateEnd']
        });
    },

    methods: {
        _linkChromeInstance () {
            let chromes, controlId;

            if (this._chrome) {
                return
            }

            chromes = Sitecore.PageModes.ChromeManager.chromes();
            controlId = this.getControlId();

            this._chrome = _.find(chromes, c => c.element[0] === controlId[0]);

            if (!this._chrome) {
                throw `[bee-vue]: can't find chrome`
            }

            this.$options.name = `${this._chrome.data.displayName} [${this._chrome.type.key()}]`;

            this.$emit('chromeAvailable', this._chrome);
        },

        getControlId () {
            return $(this._fragmentStart).next();
        }
    }
}));