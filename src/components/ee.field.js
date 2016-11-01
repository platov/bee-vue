import Vue from 'vue';
import Chrome from './ee.chrome';
import beeCore from 'bee-core/src';

export default Vue.component('ee-field', Chrome.extend({
    name: 'Field',

    template: `<div class="__field__"></div>`,

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

    created(){
        this.$on('chromeAvailable', this.transferKeyEvents)
    },

    mounted () {
        if (this._hasChromeTag) {
            this._syncMediator({
                namespace: 'field',
                events   : ['setModified', 'persist']
            });
        }

        this.fetchValue();
        this.mapValueToParent();
    },

    methods: {
        fetchValue () {
            console.warn('[ee.field] `fetchValue` method should be overridden!');
        },

        mapValueToParent () {
            if (!this.map) {
                return;
            }

            if (beeCore.isExperienceEditor) {
                this.$watch('value', value => {
                    Vue.set(this.$parent.$data.fields, this.map, value)
                }, {immediate: true});
                this.$parent.$watch(`fields.${this.map}`, value => this.value = value);
            } else {
                Vue.set(this.$parent.$data.fields, this.map, this.value);
            }
        },

        normalizeValue (value) {
            return value;
        },

        deNormalizeValue (value) {
            return value;
        },
        
        transferKeyEvents () {
            this._chrome.element.bind("blur", () => this.$emit('blur'));
            this._chrome.element.bind("keydown", () => this.$emit('keydown'));
            this._chrome.element.bind("keyup", () => this.$emit('keyup'));
        }
    }
}));