import _ from './utils/lodash';
import ACT from 'bee-core/src/act';

const PLACEHOLDER_TEMPLATE = `<phantom-placeholder :id="'<%= id %>'"></phantom-placeholder>`;
const RENDERING_TEMPLATE = `<phantom-rendering v-for="rendering in chromeData.renderings" :key="rendering.id" :chrome-data="rendering" ref="renderings"></phantom-rendering>`;
const FIELD_TEMPLATE = `<phantom-field :id="'<%= id %>'"></phantom-field>`;

export default new ACT({
    placeholderTemplate: _.template(PLACEHOLDER_TEMPLATE),
    renderingTemplate  : _.template(RENDERING_TEMPLATE),
    fieldTemplate      : _.template(FIELD_TEMPLATE)
});