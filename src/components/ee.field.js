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

    data () {
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

    ready () {
        if (this._hasChromeTag) {
            this._syncMediator({
                namespace: 'field',
                events   : ['setModified', 'persist']
            });
        }

        this.fetchValue();

        if (this.map) {
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
        fetchValue () {
            console.warn('[ee.field] `fetchValue` method should be overridden!');
        },

        normalizeValue (value) {
            return value;
        },

        deNormalizeValue (value) {
            return value;
        },
    }
}));