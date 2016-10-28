import Vue from 'vue';
import $ from 'jquery';
import _ from "lodash/wrapperLodash";
import mixin from "lodash/mixin";
import each from 'lodash/each';
import find from 'lodash/find';
import flatten from 'lodash/flatten';
import findIndex from 'lodash/findIndex';
import beeCore from 'bee-core/src';
import beeVue from 'bee-vue/src';

let mediator = beeCore.mediator;

mixin(_, {mixin, each, find, flatten, findIndex});

export default Vue.component('ee-phantom-placeholder', {
    props: ['link'],

    data: function () {
        return {
            data: {}
        }
    },

    created: function () {
        this.data = this.resolveLinkData(this.link);

        this.mediatorSubscribers = [];
        this.chrome = void 0;

        this.compileTemplate();

        this.syncMediator({
            namespace: 'placeholder',
            events   : ['insertRendering', 'moveRendering', 'popRendering', 'removeRendering']
        });

        mediator.once('chromeManager:resetChromes', this.linkChromeInstance);

        this.$on('before-removeRendering', (placeholderChrome, renderingChrome) => {
            let id = renderingChrome.controlId(),
                arr = this.data.renderings,
                index = _.findIndex(arr, {id});

            arr.splice(index, 1);
        });

        this.$on('before-insertRendering', (placeholderChrome, renderingChrome, position, htmlString) => {
            let a = beeVue.generate(`<div>${htmlString}</div>`);
            debugger
        });
    },

    beforeDestroy () {
        _.chain(this.mediatorSubscribers)
            .flatten()
            .each(subscriber => mediator.removeListener(subscriber.event, subscriber.handler));
    },

    methods: {

        compileTemplate () {
            let r = Vue.compile(this.data.template);

            this.$options.render = r.render;
            this.$options.staticRenderFns = r.staticRenderFns;
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

        resolveLinkData (id) {
            let component = this;

            while (component = component.$parent) if (component.data && component.data[id]) {
                return component.data[id];
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
        }

    }
});
