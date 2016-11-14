import Vue from 'vue';
import $ from 'jquery';
import PhantomChrome from './phantom.chrome';

export default Vue.component('phantom-field', PhantomChrome.extend({
    name : 'phantom-field',
    props: ['id'],

    created (){
        this._userInput = false;

        this.syncMediator({
            namespace: 'field',
            events   : ['setModified', 'persist']
        });

        this.$on('setModified', ()=> {
            this._userInput = true;

            this.fetchValue();

            Vue.nextTick(()=> this._userInput = false);
        });
    },

    mounted(){
        Vue.nextTick(()=>{
            this.applyValue();
            this.attachChromeTags();
        });

        this.$watch('chromeData.fieldValue', (value)=>{
            this.applyValue();

            // Trigger Experience Editor
            if(!this._userInput) {
                this.chrome.type.fieldValue.val(value);
                this.chrome.type.refreshValue();
            }
        });
    },

    beforeDestroy () {
        this.detachChromeTags();
    },

    methods: {
        resolveData(){
            let parent = this.getParentPhantom();

            this.chromeData = parent.chromeData[this.id];
        },

        fetchValue () {
            this.chromeData.fieldValue = this.chromeData.isFragment
                ? this.chromeData.openTag.nextElementSibling.outerHTML
                : this.$el.innerHTML;
        },

        applyValue () {
            let value = this.chromeData.fieldValue;

            /*
             * If changes came from user - do not trigger experience editor
             * */
            if (this._userInput) {
                if (this.chromeData.isFragment) {
                    // Just update the link to changed image
                    this.$el = this.chromeData.openTag.nextElementSibling;
                }

                return;
            }

            if (this.chromeData.isFragment) {
                let newImage = $(value);

                $(this.$el).replaceWith(newImage);

                this.$el = newImage[0];
            } else {
                this.$el.innerHTML = value;
            }
        },

        attachChromeTags () {
            let el = $(this.$el);

            el.before(this.chromeData.openTag);
            el.after(this.chromeData.closeTag);
        },

        detachChromeTags(){
            $(this.chromeData.openTag).detach();
            $(this.chromeData.closeTag).detach();
        }
    }
}));
