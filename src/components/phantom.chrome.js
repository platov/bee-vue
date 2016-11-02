import Vue from 'vue';
import _ from "lodash/wrapperLodash";
import mixin from "lodash/mixin";
import find from 'lodash/find';
import chain from 'lodash/chain';
import flatten from 'lodash/flatten';
import each from 'lodash/each';
import beeCore from 'bee-core/src';

let mediator = beeCore.mediator;

mixin(_, {mixin, find, chain, flatten, each});

export default Vue.component('phantom-chrome', {
    name: 'phantom-chrome',

    data: function () {
        return {
            data: {}
        }
    },

    created: function () {
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

    beforeDestroy (){
        _.chain(this.mediatorSubscribers)
            .flatten()
            .each(subscriber => mediator.removeListener(subscriber.event, subscriber.handler));
    },

    methods: {
        resolveData(){
            throw '[bee-vue] Method should be overriden!';
        },

        compileTemplate () {
            let r = Vue.compile(this.data.template);

            this.$options.render = r.render;
            this.$options.staticRenderFns = r.staticRenderFns;
        },

        getParentPhantom () {
            let component = this;

            while (component = component.$parent) if (component.data) {
                return component;
            }

            return null;
        },

        getChromeInstance () {
            var chromes;

            chromes = Sitecore.PageModes.ChromeManager.chromes();

            return _.find(chromes, c => c.type.controlId() === this.data.id);
        },

        linkChromeInstance () {
            this.chrome = this.getChromeInstance();
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
            let args, event, action;

            if (chrome !== this.chrome) {
                return;
            }

            args = [].slice.apply(arguments, [0]);
            event = args.pop();
            action = event.match(/:([^:]+?)$/);

            if (!action) {
                throw 'Chrome.handleMediatorEvent: wrong event format';
            }

            this.$emit(action[1], ...args);
        },
    }
});
