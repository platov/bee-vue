import Vue from 'vue';
import $ from 'jquery';
import _ from "lodash/wrapperLodash";
import mixin from "lodash/mixin";
import each from 'lodash/each';
import find from 'lodash/find';
import flatten from 'lodash/flatten';
import findIndex from 'lodash/findIndex';
import beeCore from 'bee-core/src';
import act from 'bee-vue/src/act';

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
            let id = renderingChrome.controlId();

            this.removeRendering(id);
        });

        this.$on('before-insertRendering', (placeholderChrome, htmlString, position) => {
            let actPart = act.generate($(`<div>${htmlString}</div>`)[0]);

            this.data.renderings.splice(position, 0, ...actPart.renderings);
        });

        this.$on('insertRendering', (placeholderChrome, renderingChrome) => {
            renderingChrome._openingMarker.remove();
            renderingChrome._closingMarker.remove();
            renderingChrome.element.remove();
        });

        this.$on('moveRendering', (placeholderChrome, renderingChrome, position) => {
            let id = renderingChrome.controlId();

            this.moveRendering(id, position - 1);
        });
    },

    beforeUpdate(){
        this.detachChromeTags();
        this.detachChildChromeTags();
    },

    updated () {
        Vue.nextTick(()=>{
            this.attachChromeTags();
            this.attachChildChromeTags();
            Sitecore.PageModes.ChromeManager.resetChromes();
        })
    },

    mounted () {
        Vue.nextTick(this.attachChromeTags);
    },

    beforeDestroy () {
        this.detachChromeTags();

        _.chain(this.mediatorSubscribers)
            .flatten()
            .each(subscriber => mediator.removeListener(subscriber.event, subscriber.handler));
    },

    methods: {
        removeRendering (id) {
            let arr = this.data.renderings,
                index = _.findIndex(arr, {id});

            arr.splice(index, 1);
        },

        moveRendering(id, positionIndex){
            let arr = this.data.renderings,
                itemIndex = _.findIndex(arr, {id});

            arr.splice(positionIndex, 0, arr.splice(itemIndex, 1)[0]);
        },

        attachChromeTags () {
            let el = $(this.$el);

            el.prepend(this.data.openTag);
            el.append(this.data.closeTag);
        },

        detachChromeTags(){
            $(this.data.openTag).detach();
            $(this.data.closeTag).detach();
        },

        attachChildChromeTags() {
            _.each(this.$refs.renderings, r => r.attachChromeTags());
        },

        detachChildChromeTags (){
            _.each(this.$refs.renderings, r => r.detachChromeTags());
        },

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
