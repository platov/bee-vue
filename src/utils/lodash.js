import _ from "lodash/wrapperLodash";

import camelCase from 'lodash/camelCase';
import chain from 'lodash/chain';
import each from 'lodash/each';
import filter from 'lodash/filter';
import find from 'lodash/find';
import findIndex from 'lodash/findIndex';
import flatten from 'lodash/flatten';
import isNaN from "lodash/isNaN";
import map from 'lodash/map';
import mixin from "lodash/mixin";
import reduce from 'lodash/reduce';
import template from "lodash/template";
import value from "lodash/value";

mixin(_, {camelCase, chain, each, filter, find, findIndex, flatten, isNaN, map, mixin, reduce, template, value});

export default _;