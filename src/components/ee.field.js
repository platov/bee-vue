import Vue from 'vue';
import _ from '../utils/lodash';
import Chrome from './ee.chrome';
import beeCore from 'bee-core/src';

export default Vue.component('ee-field', Chrome.extend({
    name: 'Field',

    template: `<div class="__field__"><slot></slot></div>`,

    props: {
        map: {
            type: String
        }
    },

    computed: {
        value: {
            get() {
                return this.normalizeValue(this.getRawValue());
            },

            set(value){
                this.setRawValue(this.deNormalizeValue(value));
            }
        }
    },

    created(){
        this.$on('chromeAvailable', this.transferKeyEvents)
    },

    mounted () {
        this.mapValueToParent();
    },

    methods: {
        getRawValue() {

        },

        setRawValue() {

        },

        getPhantomField(){
            let phantomField = _.find(this.$children, item => item.isPhantomComponent);

            if(!phantomField) {
                throw `[bee-vue] Can't find Phantom field.`;
            }

            return phantomField;
        },

        mapValueToParent () {
            if (!this.map) {
                return;
            }

            if (beeCore.isExperienceEditor) {
                this.$watch('value', value => Vue.set(this.$parent.$data.fields, this.map, value), {immediate: true});

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