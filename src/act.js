import _ from "lodash/wrapperLodash";
import mixin from "lodash/mixin";
import template from "lodash/template";
import ACT from 'bee-core/src/act';

mixin(_, {mixin, template});

export default new ACT({
    placeholderTemplate: _.template('<ee-phantom-placeholder :link="\'${id}\'"></ee-phantom-placeholder>'),
    renderingTemplate  : _.template('<ee-phantom-rendering v-for="rendering in data.renderings" :key="rendering.id" :data="rendering" ref="renderings"></ee-phantom-rendering>')
});