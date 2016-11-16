import Vue from 'vue';
import $ from 'jquery';
import _ from '../utils/lodash';
import Chrome from './ee.chrome';

export default Vue.component('ee-edit-frame', Chrome.extend({
    name: 'EditFrame',

    ready () {
        if (!this._hasChromeTag) {
            return;
        }

        /*this._syncMediator({
            namespace: 'editFrame',
            events   : ['updateStart', 'updateEnd']
        });*/
    },

    methods: {
        getPhantomComponent(){

        },

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