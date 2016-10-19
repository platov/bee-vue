import Vue from 'vue';
import $ from 'jquery';
import _ from "lodash/wrapperLodash";
import mixin from "lodash/mixin";
import reduce from 'lodash/reduce';
import each from 'lodash/each';
import bind from 'lodash/bind';
import find from 'lodash/find';
import flatten from 'lodash/flatten';
import chain from 'lodash/chain';
import value from "lodash/value";
import beeCore from 'bee-core/src';

let mediator = beeCore.mediator;

mixin(_, {reduce, each, bind, find, flatten, chain, value, mixin});

export default Vue.component('ee-chrome', {
    name: 'Chrome',

    created () {
        this._chrome = void 0;
        this._hasChromeTag = false;
        this._mediatorSubscribers = [];

        this.$once('chromeAvailable', function () {
            this.$options.name = `${this._chrome.data.displayName} [${this._chrome.type.key()}]`;
        });
    },

    ready () {
        let chromeTag = this.getChromeTag();

        this._hasChromeTag = !!(chromeTag && chromeTag.length);

        if (!beeCore.isExperienceEditor || !this._hasChromeTag) {
            return;
        }

        this._syncMediator({
            namespace: 'chromeControls',
            events   : ['renderCommandTag']
        });

        mediator.once('chromeManager:resetChromes', this._linkChromeInstance);
    },

    beforeDestroy () {
        if (!beeCore.isExperienceEditor) {
            return;
        }

        // Unsubscribe before this VM destroy for prevent memory leak
        _.chain(this._mediatorSubscribers).flatten().each(subscriber => mediator.removeListener(subscriber.event, subscriber.handler));
    },

    methods: {
        /**
         * Handle mediator event
         * @private
         * */
        _mediatorHandler (chrome) {
            var args, event, action;

            if (chrome !== this._chrome) {
                return;
            }

            args = [].slice.apply(arguments, [0]);
            event = args.pop();
            action = event.match(/:([^:]+?)$/);

            if (!action) {
                throw 'Chrome._mediatorHandler: wrong event format';
            }

            this.$emit(action[1], ...args);

            if (this.$parent) {
                this.$parent.$dispatch(event, this, ...args);
            }
        },

        /**
         * Link Chrome instance to current VM
         * @private
         * */
        _linkChromeInstance () {
            this._chrome = this.getChromeInstance();

            if (!this._chrome) {
                throw `[bee-vue]: can't find chrome`;
            }

            this.$emit('chromeAvailable', this._chrome);
        },

        /**
         * Listen mediator for provided events and handle, only related to this chrome, events
         * @private
         * @param {Object} data
         * @param {String} data.namespace
         * @param {Array} data.events
         * */
        _syncMediator (data) {
            let self = this, events;

            events = _.reduce(data.events, (result, event) => {
                let evBefore = `${data.namespace}:before-${event}`,
                    ev = `${data.namespace}:${event}`;

                result.push(
                    {
                        event: evBefore, handler: (...args) => self._mediatorHandler(...args, evBefore)
                    },
                    {
                        event: ev, handler: (...args) => self._mediatorHandler(...args, ev)
                    }
                );

                return result;
            }, []);

            this._mediatorSubscribers.push(events);

            _.each(events, subscriber => mediator.on(subscriber.event, subscriber.handler));
        },

        /**
         * Get ID for current Chrome
         * @return {string}
         * */
        getControlId () {
            let chromeTag = this.getChromeTag();

            if (!chromeTag || !chromeTag.length) {
                return null;
            }

            return chromeTag.attr('id').replace('_edit', '');
        },

        /**
         * Get content between start/end fragments (use when VM is `Fragment` type)
         * */
        getFragmentChild () {
            return $(this._fragmentStart).nextUntil(this._fragmentEnd);
        },

        /**
         * Try get chrome tag if it's available
         * */
        getChromeTag () {
            let chromeSelector = '.scWebEditInput, code[type="text/sitecore"][kind="open"]',
                chromeTag;

            chromeTag = this._isFragment
                ? $(this.getFragmentChild()).filter(chromeSelector)
                : $(this.$el).children(chromeSelector);

            if (chromeTag.length !== 1) {
                return null;
            }

            return chromeTag;
        },

        /**
         * Get chrome instance
         * */
        getChromeInstance () {
            var chromes, controlId;

            chromes = Sitecore.PageModes.ChromeManager.chromes();
            controlId = this.getControlId();

            return _.find(chromes, c => c.type.controlId() === controlId);
        }
    }
});