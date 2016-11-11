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
        this._preventTwoWayAssignment = false;
    },

    mounted () {
        this.mapValueToParent();
    },

    methods: {
        getRawValue() {
            // Should be overriden by field type component
        },

        setRawValue() {
            // Should be overriden by field type component
        },

        getPhantomField(){
            let phantomField = _.find(this.$children, item => item.isPhantomComponent);

            if (!phantomField) {
                throw `[bee-vue] Can't find Phantom field.`;
            }

            return phantomField;
        },

        mapValueToParent () {
            if (!this.map) {
                return;
            }

            if (!beeCore.isExperienceEditor) {
                Vue.set(this.$parent.$data.fields, this.map, this.value);

                return;
            }

            this.$watch('value', value => {
                this._preventTwoWayAssignment = true;

                Vue.set(this.$parent.$data.fields, this.map, value);

                Vue.nextTick(() => this._preventTwoWayAssignment = false);
            }, {immediate: true});

            this.$parent.$watch(`fields.${this.map}`, value => {
                if (!this._preventTwoWayAssignment) {
                    this.value = value;
                }
            });
        },

        normalizeValue (value) {
            return value;
        },

        deNormalizeValue (value) {
            return value;
        }
    }
}));