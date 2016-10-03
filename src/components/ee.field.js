import Vue from 'vue';
import Chrome from './ee.chrome';
import beeCore from 'bee-core/src';

export default Vue.component('ee-field', Chrome.extend({
    name: 'Field',

    props: {
        map: {
            type: String
        }
    },

    data: function () {
        return {
            value: void 0
        }
    },

    events: {
        'chromeAvailable': function () {
            this._chrome.element.bind("blur", () => this.$emit('blur'));
            this._chrome.element.bind("keydown", () => this.$emit('keydown'));
            this._chrome.element.bind("keyup", () => this.$emit('keyup'));
        }
    },

    created: function () {
        if (!beeCore.isExperienceEditor) {
            return;
        }

        this.syncMediator({
            namespace: 'field',
            events   : ['setModified', 'persist']
        });
    },

    compiled: function () {
        this.fetchValue();

        if (this.map) {
            if (this.$parent.hasOwnProperty(this.map)) {
                console.warn(`[ee field mapping] Parent component already has field "${this.map}"`);
            }

            if (beeCore.isExperienceEditor) {
                this.$watch('value', (value) => {
                    Vue.set(this.$parent.$data, this.map, value);
                }, {immediate: true});

                this.$parent.$watch(this.map, (value)=> {
                    this.value = value;
                });
            } else {
                Vue.set(this.$parent.$data, this.map, this.value);
            }
        }
    },

    methods: {
        fetchValue: function () {
            console.warn('[ee.field] `fetchValue` method should be overridden!');
        },

        normalizeValue: function (value) {
            return value;
        }
    }
}));