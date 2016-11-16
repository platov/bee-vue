import Vue from 'vue';
import beeCore from 'bee-core/src';

export default Vue.component('ee-chrome', {
    name: 'Chrome',

    created(){
        this.$phantom = void 0;
    },

    mounted(){
        this.linkPhantomComponent();
    },

    methods: {
        getPhantomComponent(){
            throw '[bee-vue] Method should be overridden!';
        },

        linkPhantomComponent(){
            if (!beeCore.isExperienceEditor) {
                return;
            }

            this.$phantom = this.getPhantomComponent();
        },
    }
});