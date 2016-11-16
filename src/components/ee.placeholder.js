import Vue from 'vue';
import $ from 'jquery';
import _ from '../utils/lodash';
import Chrome from './ee.chrome';
import beeCore from 'bee-core/src';
import act from 'bee-vue/src/act';


export default Vue.component('ee-placeholder', Chrome.extend({
    name: 'Placeholder',

    methods: {
        getPhantomComponent(){
            let component = _.find(this.$children, {isPhantomComponent: true});

            if (!component || 'placeholder' !== component.chromeData.type) {
                console.error(`[bee-vue] Can't find related phantom component.`);
                return;
            }

            return component;
        }
    }
}));

