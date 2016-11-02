import _ from "lodash/wrapperLodash";
import mixin from "lodash/mixin";
import template from "lodash/template";
import ACT from 'bee-core/src/act';

mixin(_, {mixin, template});

export default new ACT({
    placeholderTemplate: _.template(`<phantom-placeholder :id="'<%= id %>'"></phantom-placeholder>`),
    renderingTemplate  : _.template(`<phantom-rendering v-for="rendering in data.renderings" :key="rendering.id" :data="rendering" ref="renderings"></phantom-rendering>`),
    fieldTemplate      : _.template(`<phantom-field :id="'<%= id %>'"></phantom-field>`)
});