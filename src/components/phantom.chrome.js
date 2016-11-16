import Vue from 'vue';
import _ from '../utils/lodash';
import beeCore from 'bee-core/src';

let mediator = beeCore.mediator;

export default Vue.component('phantom-chrome', {
    name: 'phantom-chrome',

    data: function () {
        let props = this.$options.propsData,
            data = {};

        if (!props.hasOwnProperty('chromeData')) {
            data.chromeData = {};
        }

        return data;
    },

    created: function () {
        this.$emit('$created');

        this.isPhantomComponent = true;
        this.chrome = void 0;
        this.mediatorSubscribers = [];

        this.resolveData();

        this.compileTemplate();

        this.syncMediator({
            namespace: 'chromeControls',
            events   : ['renderCommandTag']
        });

        mediator.once('chromeManager:resetChromes', this.linkChromeInstance);
    },

    mounted(){
        this.$emit('$mounted');
    },

    beforeUpdate(){
        this.$emit('$before-update');
    },

    updated(){
        this.$emit('$updated');
    },

    beforeDestroy (){
        this.$emit('$before-destroy');

        _.chain(this.mediatorSubscribers)
            .flatten()
            .each(subscriber => mediator.removeListener(subscriber.event, subscriber.handler))
            .value();
    },

    destroyed(){
        this.$emit('$destroyed');
    },

    methods: {
        resolveData(){
            throw '[bee-vue] Method should be overridden!';
        },

        compileTemplate () {
            let r = Vue.compile(this.chromeData.template);

            this.$options.render = r.render;
            this.$options.staticRenderFns = r.staticRenderFns;
        },

        getParentPhantom () {
            let component = this;

            while (component = component.$parent) if (component.chromeData) {
                return component;
            }

            return null;
        },

        getAncestors (){
            let ancestors = [],
                component = this;

            while (component = component.$parent) {
                ancestors.push(component);
            }

            return ancestors;
        },

        getChromeInstance () {
            var chromes;

            chromes = Sitecore.PageModes.ChromeManager.chromes();

            return _.find(chromes, c => c.type.controlId() === this.chromeData.id);
        },


        linkChromeInstance () {
            let char;

            this.chrome = this.getChromeInstance();

            char = this.chrome.type.key().charAt(0).toUpperCase();

            this.$options.name = `[${char}] ${this.chrome.data.displayName}`;

            this.$emit('chrome-available');
        },

        syncMediator (data) {
            let self = this, events;

            events = _.reduce(data.events, (result, event) => {
                let evBefore = `${data.namespace}:before-${event}`,
                    ev = `${data.namespace}:${event}`;

                result.push(
                    {
                        event  : evBefore,
                        handler: (...args) => self.handleMediatorEvent(...args, evBefore)
                    },
                    {
                        event  : ev,
                        handler: (...args) => self.handleMediatorEvent(...args, ev)
                    }
                );

                return result;
            }, []);

            this.mediatorSubscribers.push(events);

            _.each(events, subscriber => mediator.on(subscriber.event, subscriber.handler));
        },

        handleMediatorEvent (chrome) {
            let args, event, action, ancestors;

            if (this.chromeData.id !== chrome.controlId()) {
                return;
            }

            args = [].slice.apply(arguments, [0]);
            event = args.pop();
            action = event.match(/:([^:]+?)$/);

            if (!action) {
                throw 'Chrome.handleMediatorEvent: wrong event format';
            }

            ancestors = this.getAncestors();

            this.$emit(action[1], ...args);

            _.each(ancestors, c => c.$emit(event, this, ...args))
        },
    }
});
