import { ChartInternal } from './core';
import { isDefined } from './util';

ChartInternal.prototype.getDefaultConfig = function () {
    var config = {
        bindto: '#chart',
        svg_classname: undefined,
        svg_relativeClipPath: undefined,
        size_width: undefined,
        size_height: undefined,
        /*
        * If set to true, enables caching of chart parent rect in ChartInternal.prototype.getParentRectValue.
        * Cache invalidates on every window resized event.
        * MS Edge performance optimization.
        */
        size_cacheContainerSize: false,
        padding_left: undefined,
        padding_right: undefined,
        padding_top: undefined,
        padding_bottom: undefined,
        resize_auto: true,
        zoom_enabled: false,
        zoom_initialRange: undefined,
        zoom_type: 'scroll',
        zoom_disableDefaultBehavior: false,
        zoom_privileged: false,
        zoom_rescale: false,
        zoom_onzoom: function () {},
        zoom_onzoomstart: function () {},
        zoom_onzoomend: function () {},
        zoom_x_min: undefined,
        zoom_x_max: undefined,
        interaction_brighten: true,
        interaction_enabled: true,
        onmouseover: function () {},
        onmouseout: function () {},
        onresize: function () {},
        onresized: function () {},
        oninit: function () {},
        onrendered: function () {},
        transition_duration: 350,
        data_epochs: 'epochs',
        data_x: undefined,
        data_xs: {},
        data_xFormat: '%Y-%m-%d',
        data_xLocaltime: true,
        data_xSort: true,
        data_idConverter: function (id) { return id; },
        data_names: {},
        data_classes: {},
        data_groups: [],
        data_axes: {},
        data_type: undefined,
        data_types: {},
        data_labels: {},
        data_order: 'desc',
        data_regions: {},
        data_color: undefined,
        data_colors: {},
        data_hide: false,
        data_filter: undefined,
        data_selection_enabled: false,
        data_selection_grouped: false,
        data_selection_isselectable: function () { return true; },
        data_selection_multiple: true,
        data_selection_draggable: false,
        data_onclick: function () {},
        data_onmouseover: function () {},
        data_onmouseout: function () {},
        data_onselected: function () {},
        data_onunselected: function () {},
        data_url: undefined,
        data_headers: undefined,
        data_json: undefined,
        data_rows: undefined,
        data_columns: undefined,
        data_mimeType: undefined,
        data_keys: undefined,
        // configuration for no plot-able data supplied.
        data_empty_label_text: "",
        // subchart
        subchart_show: false,
        subchart_size_height: 60,
        subchart_axis_x_show: true,
        subchart_onbrush: function () {},
        /*
        * IF set to false, prevents subchart d3 brush from initialization and rendering
        */
        subchart_brushEnabled: true,
        // color
        color_pattern: [],
        color_threshold: {},
        // legend
        legend_show: true,
        legend_hide: false,
        legend_position: 'bottom',
        legend_inset_anchor: 'top-left',
        legend_inset_x: 10,
        legend_inset_y: 0,
        legend_inset_step: undefined,
        legend_item_onclick: undefined,
        legend_item_onmouseover: undefined,
        legend_item_onmouseout: undefined,
        legend_equally: false,
        legend_padding: 0,
        legend_item_tile_width: 10,
        legend_item_tile_height: 10,
        /*
        * If set to true, makes any resize/redraw operations carried over chart legend ignored.
        * MS Edge performance optimization, use it if the chart doesn't have legend.
        */
        legend_ignore: false,
        // axis
        axis_rotated: false,
        /*
        * If not empty, prevents recalculating of text ticks rect sizes in AxisInternal.prototype.updateTickTextCharSize.
        * MS Edge performance optimization, use it if text ticks of the chart do not change dynamically.
        * Example:
        * bottom: {
        *     h: 13,
        *     w: 5.6
        * },
        * left: {
        *     h: 11.5,
        *     w: 5.5
        * },
        * right: {
        *     h: 11.5,
        *     w: 5.5
        * },
        * top: {
        *     h: 11.5,
        *     w: 5.5
        * }
        */
        axis_predefinedTextCharSize: null,

        /*
        * If set to false, prevent "text-anchor" class from appending to text ticks of the chart axis.
        * Used in AxisInternal.prototype.generateAxis.
        * MS Edge performance optimization.
        * In most of the cases, you can replace "text-anchor" class with your own CSS.
        * For example:
        * .c3-axis-y {
        *     text {
        *         text-anchor: end;
        *     }
        * }
        *
        * .c3-axis-x {
        *     text {
        *         text-anchor: middle;
        *     }
        * }
        * MS Edge permormance optimization.
        */
        axis_appendTextAnchor: true,

        /*
        * If set to true, forces taking text tick widths from cache, instead of recalculating them every time the chart is redrawn.
        * Used in Axis.prototype.getMaxTickWidth.
        * MS Edge performance optimization.
        * Use it if width of text ticks is not changed during chart lifecycle.
        */
        axis_cacheTickWidths: false,
        /*
        * If set to true, makes taking max text ticks width depending on their inner html, instead of recalculating box size for each text tick.
        * Used in Axis.prototype.getMaxTickWidth.
        * MS Edge performance optimization.
        * Use it if width of text ticks depends on their inner html only.
        */
        axis_optimizeMaxTickWidthCalculation: false,
        axis_x_show: true,
        axis_x_type: 'indexed',
        axis_x_localtime: true,
        axis_x_categories: [],
        axis_x_tick_centered: false,
        axis_x_tick_format: undefined,
        axis_x_tick_culling: {},
        axis_x_tick_culling_max: 10,
        axis_x_tick_count: undefined,
        axis_x_tick_fit: true,
        axis_x_tick_values: null,
        axis_x_tick_rotate: 0,
        /*
        * If set to true, forces Axis.prototype.getMaxTickWidth use getBBox instead of getBoundingClientRect
        * for text tick width calculation on x axis.
        * MS Edge performance optimization.
        */
        axis_x_tick_optimizeWidthCalculation: false,
        axis_x_tick_outer: true,
        axis_x_tick_multiline: true,
        axis_x_tick_multilineMax: 0,
        axis_x_tick_width: null,
        axis_x_max: undefined,
        axis_x_min: undefined,
        axis_x_padding: {},
        axis_x_height: undefined,
        axis_x_selection: undefined,
        axis_x_label: {},
        axis_x_inner: undefined,
        axis_y_show: true,
        axis_y_type: undefined,
        axis_y_max: undefined,
        axis_y_min: undefined,
        axis_y_inverted: false,
        axis_y_center: undefined,
        axis_y_inner: undefined,
        axis_y_label: {},
        axis_y_tick_format: undefined,
        /*
        * If set to true, forces Axis.prototype.getMaxTickWidth use getBBox instead of getBoundingClientRect
        * for text tick width calculation on y axis.
        * MS Edge performance optimization.
        */
        axis_y_tick_optimizeWidthCalculation: false,
        axis_y_tick_outer: true,
        axis_y_tick_values: null,
        axis_y_tick_rotate: 0,
        axis_y_tick_count: undefined,
        axis_y_tick_time_type: undefined,
        axis_y_tick_time_interval: undefined,
        axis_y_padding: {},
        axis_y_default: undefined,
        axis_y2_show: false,
        axis_y2_max: undefined,
        axis_y2_min: undefined,
        axis_y2_inverted: false,
        axis_y2_center: undefined,
        axis_y2_inner: undefined,
        axis_y2_label: {},
        axis_y2_tick_format: undefined,
        /*
        * If set to true, forces Axis.prototype.getMaxTickWidth use getBBox instead of getBoundingClientRect
        * for text tick width calculation on y2 axis.
        * MS Edge performance optimization.
        */
        axis_y2_tick_optimizeWidthCalculation: false,
        axis_y2_tick_outer: true,
        axis_y2_tick_values: null,
        axis_y2_tick_count: undefined,
        axis_y2_padding: {},
        axis_y2_default: undefined,
        // grid
        grid_x_show: false,
        grid_x_type: 'tick',
        grid_x_lines: [],
        grid_y_show: false,
        // not used
        // grid_y_type: 'tick',
        grid_y_lines: [],
        grid_y_ticks: 10,
        grid_focus_show: true,
        grid_lines_front: true,
        // point - point of each data
        point_show: true,
        point_r: 2.5,
        point_sensitivity: 10,
        point_focus_expand_enabled: true,
        point_focus_expand_r: undefined,
        point_select_r: undefined,
        // line
        line_connectNull: false,
        line_step_type: 'step',
        // bar
        bar_width: undefined,
        bar_width_ratio: 0.6,
        bar_width_max: undefined,
        bar_zerobased: true,
        bar_space: 0,
        bar_syncScale: undefined,
        // area
        area_zerobased: true,
        area_above: false,
        // pie
        pie_label_show: true,
        pie_label_format: undefined,
        pie_label_threshold: 0.05,
        pie_label_ratio: undefined,
        pie_expand: {},
        pie_expand_duration: 50,
        // gauge
        gauge_fullCircle: false,
        gauge_label_show: true,
        gauge_labelLine_show: true,
        gauge_label_format: undefined,
        gauge_min: 0,
        gauge_max: 100,
        gauge_startingAngle: -1 * Math.PI/2,
        gauge_label_extents: undefined,
        gauge_units: undefined,
        gauge_width: undefined,
        gauge_arcs_minWidth: 5,
        gauge_expand: {},
        gauge_expand_duration: 50,
        // donut
        donut_label_show: true,
        donut_label_format: undefined,
        donut_label_threshold: 0.05,
        donut_label_ratio: undefined,
        donut_width: undefined,
        donut_title: "",
        donut_expand: {},
        donut_expand_duration: 50,
        donut_subtitles: [],
        donut_showArcTitle: true,
        donut_midTextY: 0,
        donut_midTextDY: 0,
        // spline
        spline_interpolation_type: 'cardinal',
        // stanford
        stanford_lines: [],
        stanford_regions: [],
        stanford_texts: [],
        stanford_scaleMin: undefined,
        stanford_scaleMax: undefined,
        stanford_scaleWidth: undefined,
        stanford_scaleFormat: undefined,
        stanford_colors: undefined,
        stanford_padding: {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
        },
        // region - region to change style
        regions: [],
        // tooltip - show when mouseover on each data
        tooltip_show: true,
        tooltip_grouped: true,
        tooltip_order: undefined,
        tooltip_format_title: undefined,
        tooltip_format_name: undefined,
        tooltip_format_value: undefined,
        tooltip_horizontal: undefined,
        tooltip_position: undefined,
        tooltip_contents: function (d, defaultTitleFormat, defaultValueFormat, color) {
            return this.getTooltipContent ? this.getTooltipContent(d, defaultTitleFormat, defaultValueFormat, color) : '';
        },
        tooltip_init_show: false,
        tooltip_init_x: 0,
        tooltip_init_position: {top: '0px', left: '50px'},
        tooltip_onshow: function () {},
        tooltip_onhide: function () {},
        // title
        title_text: undefined,
        /*
        * If set to true, makes any resize/redraw operations carried over chart title ignored.
        * MS Edge performance optimization, use it if the chart doesn't have title.
        */
        title_ignore: false,
        title_padding: {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
        },
        title_position: 'top-center',
      context: {}
    };

    Object.keys(this.additionalConfig).forEach(function (key) {
        config[key] = this.additionalConfig[key];
    }, this);

    return config;
};
ChartInternal.prototype.additionalConfig = {};

ChartInternal.prototype.loadConfig = function (config) {
    var this_config = this.config, target, keys, read;
    function find() {
        var key = keys.shift();
//        console.log("key =>", key, ", target =>", target);
        if (key && target && typeof target === 'object' && key in target) {
            target = target[key];
            return find();
        }
        else if (!key) {
            return target;
        }
        else {
            return undefined;
        }
    }
    Object.keys(this_config).forEach(function (key) {
        target = config;
        keys = key.split('_');
        read = find();
//        console.log("CONFIG : ", key, read);
        if (isDefined(read)) {
            this_config[key] = read;
        }
    });
    if (config.context) {
      this_config.context = config.context || {};
    }
};

ChartInternal.prototype.isSelectByClickDisabled = function (d) {
  const config = this.config;
  return !!(config.context.isSelectByClickDisabled && config.context.isSelectByClickDisabled(d));
};

ChartInternal.prototype.isHideXLabelIfNotVisibleDisabled = function (id) {
  const config = this.config;
  return !!(config.context.isHideXLabelIfNotVisibleDisabled && config.context.isHideXLabelIfNotVisibleDisabled(id));
};

ChartInternal.prototype.isMouseOverDisabled = function (d) {
  const config = this.config;
  return !!(config.context.isMouseOverDisabled && config.context.isMouseOverDisabled(d));
};

ChartInternal.prototype.isDataDisabled = function (id) {
  const config = this.config;
  return !!(config.context.isDataDisabled && config.context.isDataDisabled(id));
};

ChartInternal.prototype.isShowXGridFocusDisabled = function (d) {
  const config = this.config;
  return !!(config.context.isShowXGridFocusDisabled && config.context.isShowXGridFocusDisabled(d));
};

ChartInternal.prototype.limitAxisMaxLength = function (x) {
  const config = this.config;
  return !!(config.context.limitAxisMaxLength && config.context.limitAxisMaxLength(x));
};

ChartInternal.prototype.onShowXGridFocus = function (d) {
  const config = this.config;
  return !!(config.context.onShowXGridFocus && config.context.onShowXGridFocus(d));
};

ChartInternal.prototype.onHideXGridFocus = function () {
  const config = this.config;
  return !!(config.context.onHideXGridFocus && config.context.onHideXGridFocus());
};
