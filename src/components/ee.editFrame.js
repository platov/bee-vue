import Vue from 'vue';
import $ from 'jquery';
import _ from "lodash/wrapperLodash";
import mixin from 'lodash/mixin';
import find from 'lodash/find';
import Chrome from './ee.chrome';

mixin(_, {find, mixin});

export default Vue.component('ee-edit-frame', Chrome.extend({
    name: 'EditFrame',

    ready () {
        if (!this._hasChromeTag) {
            return;
        }

        this._syncMediator({
            namespace: 'editFrame',
            events   : ['updateStart', 'updateEnd']
        });
    },

    methods: {
        getControlId () {
            return null;
        },

        getChromeTag () {
            return $(this._fragmentStart).next();
        },

        getChromeInstance () {
            let chromes, identifierTag;

            chromes = Sitecore.PageModes.ChromeManager.chromes();
            identifierTag = this.getChromeTag();

            return _.find(chromes, c => c.element[0] === identifierTag[0]);
        }
    }
}));