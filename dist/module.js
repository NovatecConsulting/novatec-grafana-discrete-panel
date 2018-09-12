///<reference path="../node_modules/grafana-sdk-mocks/app/headers/common.d.ts" />
System.register(['./canvas-metric', './distinct-points', 'lodash', 'jquery', 'moment', 'app/core/utils/kbn', 'app/core/app_events'], function(exports_1) {
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var canvas_metric_1, distinct_points_1, lodash_1, jquery_1, moment_1, kbn_1, app_events_1;
    var grafanaColors, DiscretePanelCtrl;
    return {
        setters:[
            function (canvas_metric_1_1) {
                canvas_metric_1 = canvas_metric_1_1;
            },
            function (distinct_points_1_1) {
                distinct_points_1 = distinct_points_1_1;
            },
            function (lodash_1_1) {
                lodash_1 = lodash_1_1;
            },
            function (jquery_1_1) {
                jquery_1 = jquery_1_1;
            },
            function (moment_1_1) {
                moment_1 = moment_1_1;
            },
            function (kbn_1_1) {
                kbn_1 = kbn_1_1;
            },
            function (app_events_1_1) {
                app_events_1 = app_events_1_1;
            }],
        execute: function() {
            grafanaColors = [
                "#7EB26D", "#EAB839", "#6ED0E0", "#EF843C", "#E24D42", "#1F78C1", "#BA43A9", "#705DA0",
                "#508642", "#CCA300", "#447EBC", "#C15C17", "#890F02", "#0A437C", "#6D1F62", "#584477",
                "#B7DBAB", "#F4D598", "#70DBED", "#F9BA8F", "#F29191", "#82B5D8", "#E5A8E2", "#AEA2E0",
                "#629E51", "#E5AC0E", "#64B0C8", "#E0752D", "#BF1B00", "#0A50A1", "#962D82", "#614D93",
                "#9AC48A", "#F2C96D", "#65C5DB", "#F9934E", "#EA6460", "#5195CE", "#D683CE", "#806EB7",
                "#3F6833", "#967302", "#2F575E", "#99440A", "#58140C", "#052B51", "#511749", "#3F2B5B",
                "#E0F9D7", "#FCEACA", "#CFFAFF", "#F9E2D2", "#FCE2DE", "#BADFF4", "#F9D9F9", "#DEDAF7"
            ]; // copied from public/app/core/utils/colors.ts because of changes in grafana 4.6.0
            //(https://github.com/grafana/grafana/blob/master/PLUGIN_DEV.md)
            DiscretePanelCtrl = (function (_super) {
                __extends(DiscretePanelCtrl, _super);
                function DiscretePanelCtrl($scope, $injector, templateSrv, $sce) {
                    _super.call(this, $scope, $injector);
                    this.$sce = $sce;
                    this.defaults = {
                        display: 'timeline',
                        rowHeight: 50,
                        valueMaps: [
                            { value: 'null', op: '=', text: 'N/A' }
                        ],
                        mappingTypes: [
                            { name: 'value to text', value: 1 },
                            { name: 'range to text', value: 2 },
                        ],
                        rangeMaps: [
                            { from: 'null', to: 'null', text: 'N/A' }
                        ],
                        colorMaps: [
                            { text: 'N/A', color: '#CCC' }
                        ],
                        metricNameColor: '#000000',
                        valueTextColor: '#000000',
                        backgroundColor: 'rgba(128, 128, 128, 0.1)',
                        lineColor: 'rgba(128, 128, 128, 1.0)',
                        textSize: 24,
                        textSizeTime: 12,
                        extendLastValue: true,
                        writeLastValue: true,
                        writeAllValues: false,
                        writeMetricNames: false,
                        showLegend: true,
                        showLegendNames: true,
                        showLegendValues: true,
                        showLegendPercent: true,
                        highlightOnMouseover: true,
                        legendSortBy: '-ms',
                        units: 'short',
                        headerColumnIndent: 100,
                        topOffset: 0,
                        additionalColumns: 0,
                        useLinkOnClick: false,
                        gotoLink: '',
                        gotoLinkToolTip: '',
                        openLinkInNewTab: true,
                        useDisplaySeries: false,
                        valueMappingForDisplaySeries: false,
                        valueMappingForExtraColumns: false,
                        valueMappingForTemplateVars: false,
                        showTimeAxis: true
                    };
                    this.data = null;
                    this.externalPT = false;
                    this.isTimeline = false;
                    this.hoverPoint = null;
                    this.hoverMetric = null;
                    this.colorMap = {};
                    this._colorsPaleteCash = null;
                    this.unitFormats = null; // only used for editor
                    this.formatter = null;
                    this.templateSrv = templateSrv;
                    // defaults configs
                    lodash_1.default.defaultsDeep(this.panel, this.defaults);
                    this.events.on('init-edit-mode', this.onInitEditMode.bind(this));
                    this.events.on('render', this.onRender.bind(this));
                    this.events.on('data-received', this.onDataReceived.bind(this));
                    this.events.on('data-error', this.onDataError.bind(this));
                    this.events.on('refresh', this.onRefresh.bind(this));
                    this.updateColorInfo();
                    this.onConfigChanged();
                }
                DiscretePanelCtrl.prototype.onDataError = function (err) {
                    console.log("onDataError", err);
                };
                DiscretePanelCtrl.prototype.onInitEditMode = function () {
                    this.unitFormats = kbn_1.default.getUnitFormats();
                    this.addEditorTab('Options', 'public/plugins/novatec-discrete-panel/partials/editor.options.html', 1);
                    this.addEditorTab('Legend', 'public/plugins/novatec-discrete-panel/partials/editor.legend.html', 3);
                    this.addEditorTab('Colors', 'public/plugins/novatec-discrete-panel/partials/editor.colors.html', 4);
                    this.addEditorTab('Mappings', 'public/plugins/novatec-discrete-panel/partials/editor.mappings.html', 5);
                    this.editorTabIndex = 1;
                    this.refresh();
                };
                DiscretePanelCtrl.prototype.onRender = function () {
                    var _this = this;
                    if (this.data == null || !(this.context)) {
                        return;
                    }
                    //   console.log( 'render', this.data);
                    var rect = this.wrap.getBoundingClientRect();
                    var rows = this.data.length;
                    var rowHeight = this.panel.rowHeight;
                    var timeAxisYOffset = 0;
                    if (this.panel.showTimeAxis) {
                        timeAxisYOffset = this.panel.textSizeTime + 25;
                    }
                    var height = this.panel.topOffset + rowHeight * rows + timeAxisYOffset;
                    var width = rect.width;
                    this.canvas.width = width * this._devicePixelRatio;
                    this.canvas.height = height * this._devicePixelRatio;
                    jquery_1.default(this.canvas).css('width', width + 'px');
                    jquery_1.default(this.canvas).css('height', height + 'px');
                    var ctx = this.context;
                    ctx.lineWidth = 1;
                    ctx.textBaseline = 'middle';
                    ctx.font = this.panel.textSize + 'px "Open Sans", Helvetica, Arial, sans-serif';
                    ctx.scale(this._devicePixelRatio, this._devicePixelRatio);
                    // ctx.shadowOffsetX = 1;
                    // ctx.shadowOffsetY = 1;
                    // ctx.shadowColor = "rgba(0,0,0,0.3)";
                    // ctx.shadowBlur = 3;
                    var top = this.panel.topOffset;
                    var elapsed = this.range.to - this.range.from - this.panel.headerColumnIndent;
                    var point = null;
                    var metricIndex = 0;
                    lodash_1.default.forEach(this.data, function (metric) {
                        var centerV = top + (rowHeight / 2);
                        // The no-data line
                        ctx.fillStyle = _this.panel.backgroundColor;
                        ctx.fillRect(0, top, width, rowHeight);
                        /*if(!this.panel.writeMetricNames) {
                          ctx.fillStyle = "#111111";
                          ctx.textAlign = 'left';
                          ctx.fillText("No Data", 10, centerV);
                        }*/
                        if (_this.isTimeline) {
                            var lastBS = 0;
                            point = metric.changes[0];
                            for (var i_1 = 0; i_1 < metric.changes.length; i_1++) {
                                point = metric.changes[i_1];
                                point.x = width;
                                if (point.start <= _this.range.to) {
                                    var xt = Math.max(point.start - _this.range.from, 0);
                                    point.x = _this.panel.headerColumnIndent + ((xt / elapsed) * (width - _this.panel.headerColumnIndent));
                                    ctx.fillStyle = _this.getColor(point.val);
                                    ctx.fillRect(point.x, top, width, rowHeight);
                                    if (_this.panel.writeAllValues) {
                                        ctx.fillStyle = _this.panel.valueTextColor;
                                        ctx.textAlign = 'left';
                                        if (_this.panel.useDisplaySeries) {
                                            ctx.fillText(point.dispVal, point.x + 7, centerV);
                                        }
                                        else {
                                            ctx.fillText(point.val, point.x + 7, centerV);
                                        }
                                    }
                                    lastBS = point.x;
                                }
                            }
                        }
                        else if (_this.panel.display === 'stacked') {
                            point = null;
                            var start = _this.range.from;
                            for (var i_2 = 0; i_2 < metric.legendInfo.length; i_2++) {
                                point = metric.legendInfo[i_2];
                                var xt = Math.max(start - _this.range.from, 0);
                                point.x = (xt / elapsed) * width;
                                ctx.fillStyle = _this.getColor(point.val);
                                ctx.fillRect(point.x, top, width, rowHeight);
                                if (_this.panel.writeAllValues) {
                                    ctx.fillStyle = _this.panel.valueTextColor;
                                    ctx.textAlign = 'left';
                                    if (_this.panel.useDisplaySeries) {
                                        ctx.fillText(point.dispVal, point.x + 7, centerV);
                                    }
                                    else {
                                        ctx.fillText(point.val, point.x + 7, centerV);
                                    }
                                }
                                start += point.ms;
                            }
                        }
                        else {
                            console.log("Not supported yet...", _this);
                        }
                        if (top > 0) {
                            ctx.strokeStyle = _this.panel.lineColor;
                            ctx.beginPath();
                            ctx.moveTo(0, top);
                            ctx.lineTo(width, top);
                            ctx.stroke();
                        }
                        ctx.fillStyle = "#000000";
                        if (_this.panel.writeMetricNames &&
                            (!_this.panel.highlightOnMouseover || _this.panel.highlightOnMouseover)) {
                            ctx.fillStyle = _this.panel.metricNameColor;
                            ctx.textAlign = 'left';
                            ctx.fillText(metric.name, 10, centerV);
                        }
                        ctx.textAlign = 'right';
                        if (_this.mouse.down == null) {
                            if (_this.panel.highlightOnMouseover && _this.mouse.position != null) {
                                var next = null;
                                if (_this.isTimeline) {
                                    point = metric.changes[0];
                                    for (var i = 0; i < metric.changes.length; i++) {
                                        if (metric.changes[i].x > _this.mouse.position.x) {
                                            next = metric.changes[i];
                                            break;
                                        }
                                        point = metric.changes[i];
                                    }
                                }
                                else if (_this.panel.display === 'stacked') {
                                    point = metric.legendInfo[0];
                                    for (var i_3 = 0; i_3 < metric.legendInfo.length; i_3++) {
                                        if (metric.legendInfo[i_3].x > _this.mouse.position.x) {
                                            next = metric.legendInfo[i_3];
                                            break;
                                        }
                                        point = metric.legendInfo[i_3];
                                    }
                                }
                                // Fill canvas using 'destination-out' and alpha at 0.05
                                ctx.globalCompositeOperation = 'destination-out';
                                ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
                                ctx.beginPath();
                                var j = Math.floor((_this.mouse.position.y - _this.panel.topOffset) / _this.panel.rowHeight);
                                if (j < 0) {
                                    j = 0;
                                }
                                if (j >= _this.data.length) {
                                    j = _this.data.length - 1;
                                }
                                if (j == metricIndex) {
                                    ctx.fillRect(_this.panel.headerColumnIndent, top, point.x - _this.panel.headerColumnIndent, rowHeight);
                                }
                                else {
                                    ctx.fillRect(0, top, point.x, rowHeight);
                                }
                                ctx.fillRect(0, top, point.x, rowHeight);
                                ctx.fill();
                                if (next != null) {
                                    ctx.beginPath();
                                    ctx.fillRect(next.x, top, width, rowHeight);
                                    ctx.fill();
                                }
                                ctx.globalCompositeOperation = 'source-over';
                                // Now Draw the value
                                ctx.fillStyle = "#000000";
                                ctx.textAlign = 'left';
                                if (_this.panel.useDisplaySeries) {
                                    ctx.fillText(point.dispVal, point.x + 7, centerV);
                                }
                                else {
                                    ctx.fillText(point.val, point.x + 7, centerV);
                                }
                            }
                            else if (_this.panel.writeLastValue) {
                                if (_this.panel.useDisplaySeries) {
                                    ctx.fillText(point.dispVal, point.x - 7, centerV);
                                }
                                else {
                                    ctx.fillText(point.val, point.x - 7, centerV);
                                }
                            }
                        }
                        metricIndex += 1;
                        top += rowHeight;
                    });
                    if (this.isTimeline && this.mouse.position != null) {
                        if (this.mouse.down != null) {
                            var xmin = Math.min(this.mouse.position.x, this.mouse.down.x);
                            var xmax = Math.max(this.mouse.position.x, this.mouse.down.x);
                            // Fill canvas using 'destination-out' and alpha at 0.05
                            ctx.globalCompositeOperation = 'destination-out';
                            ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
                            ctx.beginPath();
                            ctx.fillRect(0, 0, xmin, height);
                            ctx.fill();
                            ctx.beginPath();
                            ctx.fillRect(xmax, 0, width, height);
                            ctx.fill();
                            ctx.globalCompositeOperation = 'source-over';
                        }
                        else {
                            ctx.strokeStyle = '#111';
                            ctx.beginPath();
                            ctx.moveTo(this.mouse.position.x, 0);
                            ctx.lineTo(this.mouse.position.x, height);
                            ctx.lineWidth = 3;
                            ctx.stroke();
                            ctx.beginPath();
                            ctx.moveTo(this.mouse.position.x, 0);
                            ctx.lineTo(this.mouse.position.x, height);
                            ctx.strokeStyle = '#e22c14';
                            ctx.lineWidth = 2;
                            ctx.stroke();
                            if (this.externalPT && rows > 1) {
                                ctx.beginPath();
                                ctx.arc(this.mouse.position.x, this.mouse.position.y, 3, 0, 2 * Math.PI, false);
                                ctx.fillStyle = '#e22c14';
                                ctx.fill();
                                ctx.lineWidth = 1;
                                ctx.strokeStyle = '#111';
                                ctx.stroke();
                            }
                        }
                    }
                    if (this.panel.showTimeAxis) {
                        this.drawTimeAxis(ctx, top);
                    }
                };
                DiscretePanelCtrl.prototype.showLegandTooltip = function (pos, info) {
                    var body = '<div class="graph-tooltip-time">';
                    if (this.panel.useDisplaySeries) {
                        body += info.dispVal;
                    }
                    else {
                        body += info.val;
                    }
                    body += '</div>';
                    body += "<center>";
                    if (info.count > 1) {
                        body += info.count + " times<br/>for<br/>";
                    }
                    body += moment_1.default.duration(info.ms).humanize();
                    if (info.count > 1) {
                        body += "<br/>total";
                    }
                    body += "</center>";
                    this.$tooltip.html(body).place_tt(pos.pageX + 20, pos.pageY);
                };
                DiscretePanelCtrl.prototype.clearTT = function () {
                    this.$tooltip.detach();
                };
                DiscretePanelCtrl.prototype.formatValue = function (val) {
                    if (lodash_1.default.isNumber(val)) {
                        if (this.panel.rangeMaps) {
                            for (var i = 0; i < this.panel.rangeMaps.length; i++) {
                                var map = this.panel.rangeMaps[i];
                                // value/number to range mapping
                                var from = parseFloat(map.from);
                                var to = parseFloat(map.to);
                                if (to >= val && from <= val) {
                                    return map.text;
                                }
                            }
                        }
                    }
                    var isNull = lodash_1.default.isNil(val);
                    if (!isNull && !lodash_1.default.isString(val)) {
                        val = val.toString(); // convert everything to a string
                    }
                    for (var i = 0; i < this.panel.valueMaps.length; i++) {
                        var map_1 = this.panel.valueMaps[i];
                        // special null case
                        if (map_1.value === 'null') {
                            if (isNull) {
                                return map_1.text;
                            }
                            continue;
                        }
                        if (val === map_1.value) {
                            return map_1.text;
                        }
                    }
                    if (isNull) {
                        return "null";
                    }
                    if (this.formatter && lodash_1.default.isNumber(val)) {
                        return this.formatter(val, this.panel.decimals);
                    }
                    return val;
                };
                DiscretePanelCtrl.prototype.formatValueWithoutMapping = function (val) {
                    if (lodash_1.default.isNumber(val)) {
                        if (this.formatter) {
                            return this.formatter(val, this.panel.decimals);
                        }
                    }
                    var isNull = lodash_1.default.isNil(val);
                    if (!isNull && !lodash_1.default.isString(val)) {
                        val = val.toString(); // convert everything to a string
                    }
                    if (isNull) {
                        return "null";
                    }
                    return val;
                };
                DiscretePanelCtrl.prototype.getColor = function (val) {
                    if (lodash_1.default.has(this.colorMap, val)) {
                        return this.colorMap[val];
                    }
                    if (this._colorsPaleteCash[val] === undefined) {
                        var c = grafanaColors[this._colorsPaleteCash.length % grafanaColors.length];
                        this._colorsPaleteCash[val] = c;
                        this._colorsPaleteCash.length++;
                    }
                    return this._colorsPaleteCash[val];
                };
                DiscretePanelCtrl.prototype.randomColor = function () {
                    var letters = 'ABCDE'.split('');
                    var color = '#';
                    for (var i = 0; i < 3; i++) {
                        color += letters[Math.floor(Math.random() * letters.length)];
                    }
                    return color;
                };
                // Override the
                DiscretePanelCtrl.prototype.applyPanelTimeOverrides = function () {
                    _super.prototype.applyPanelTimeOverrides.call(this);
                    if (this.panel.expandFromQueryS > 0) {
                        var from = this.range.from.subtract(this.panel.expandFromQueryS, 's');
                        this.range.from = from;
                        this.range.raw.from = from;
                    }
                };
                DiscretePanelCtrl.prototype.onDataReceived = function (dataList) {
                    var _this = this;
                    jquery_1.default(this.canvas).css('cursor', 'pointer');
                    //    console.log('GOT', dataList);
                    var data = [];
                    if (this.panel.useDisplaySeries) {
                        if (dataList.length % (2 + this.panel.additionalColumns) != 0) {
                            throw new Error('Query result must have (at least) ' + (2 + this.panel.additionalColumns) + ' result columns when using Display Series or additional data columns!');
                        }
                        if (dataList.length != 0 && 'table' === dataList[0].type) {
                            throw new Error('When using Display Series the result format must not be "Table"!');
                        }
                        for (var k = 0; k < dataList.length; k = k + 2 + this.panel.additionalColumns) {
                            var res = new distinct_points_1.DistinctPoints(dataList[k].target);
                            for (var j = 0; j < dataList[k].datapoints.length; j++) {
                                var point = dataList[k].datapoints[j];
                                var point2 = dataList[k + 1].datapoints[j];
                                var additionalValues = new Array();
                                for (var m = 0; m < this.panel.additionalColumns; m++) {
                                    if (this.panel.valueMappingForExtraColumns) {
                                        additionalValues.push(this.formatValue(dataList[k + 2 + m].datapoints[j][0]));
                                    }
                                    else {
                                        additionalValues.push(this.formatValueWithoutMapping(dataList[k + 2 + m].datapoints[j][0]));
                                    }
                                }
                                var dispValue = "";
                                if (this.panel.valueMappingForDisplaySeries) {
                                    dispValue = this.formatValue(point2[0]);
                                }
                                else {
                                    dispValue = this.formatValueWithoutMapping(point2[0]);
                                }
                                res.add(point[1], this.formatValue(point[0]), dispValue, additionalValues);
                            }
                            res.finish(this);
                            data.push(res);
                        }
                    }
                    else if (this.panel.additionalColumns > 0) {
                        if (dataList.length != 0 && 'table' === dataList[0].type) {
                            throw new Error('When using additional data columns the result format must not be "Table"!');
                        }
                        for (var k = 0; k < dataList.length; k = k + 1 + this.panel.additionalColumns) {
                            var res = new distinct_points_1.DistinctPoints(dataList[k].target);
                            for (var j = 0; j < dataList[k].datapoints.length; j++) {
                                var point = dataList[k].datapoints[j];
                                var additionalValues = new Array();
                                for (var m = 0; m < this.panel.additionalColumns; m++) {
                                    if (this.panel.valueMappingForExtraColumns) {
                                        additionalValues.push(this.formatValue(dataList[k + 1 + m].datapoints[j][0]));
                                    }
                                    else {
                                        additionalValues.push(this.formatValueWithoutMapping(dataList[k + 1 + m].datapoints[j][0]));
                                    }
                                }
                                res.add(point[1], this.formatValue(point[0]), null, additionalValues);
                            }
                            res.finish(this);
                            data.push(res);
                        }
                    }
                    else {
                        lodash_1.default.forEach(dataList, function (metric) {
                            if ('table' === metric.type) {
                                if ('time' !== metric.columns[0].type) {
                                    throw new Error('Expected a time column from the table format');
                                }
                                var last = null;
                                for (var i = 1; i < metric.columns.length; i++) {
                                    var res_1 = new distinct_points_1.DistinctPoints(metric.columns[i].text);
                                    for (var j = 0; j < metric.rows.length; j++) {
                                        var row = metric.rows[j];
                                        res_1.add(row[0], _this.formatValue(row[i]), null, null);
                                    }
                                    res_1.finish(_this);
                                    data.push(res_1);
                                }
                            }
                            else {
                                var res_2 = new distinct_points_1.DistinctPoints(metric.target);
                                lodash_1.default.forEach(metric.datapoints, function (point) {
                                    res_2.add(point[1], _this.formatValue(point[0]), null, null);
                                });
                                res_2.finish(_this);
                                data.push(res_2);
                            }
                        });
                    }
                    this.data = data;
                    this.onRender();
                    //console.log( 'data', dataList, this.data);
                };
                DiscretePanelCtrl.prototype.removeColorMap = function (map) {
                    var index = lodash_1.default.indexOf(this.panel.colorMaps, map);
                    this.panel.colorMaps.splice(index, 1);
                    this.updateColorInfo();
                };
                DiscretePanelCtrl.prototype.updateColorInfo = function () {
                    var cm = {};
                    for (var i = 0; i < this.panel.colorMaps.length; i++) {
                        var m = this.panel.colorMaps[i];
                        if (m.text) {
                            cm[m.text] = m.color;
                        }
                    }
                    this._colorsPaleteCash = {};
                    this._colorsPaleteCash.length = 0;
                    this.colorMap = cm;
                    this.render();
                };
                DiscretePanelCtrl.prototype.addColorMap = function (what) {
                    var _this = this;
                    if (what === 'curent') {
                        lodash_1.default.forEach(this.data, function (metric) {
                            if (metric.legendInfo) {
                                lodash_1.default.forEach(metric.legendInfo, function (info) {
                                    if (!lodash_1.default.has(info.val)) {
                                        _this.panel.colorMaps.push({ text: info.val, color: _this.getColor(info.val) });
                                    }
                                });
                            }
                        });
                    }
                    else {
                        this.panel.colorMaps.push({ text: '???', color: this.randomColor() });
                    }
                    this.updateColorInfo();
                };
                DiscretePanelCtrl.prototype.removeValueMap = function (map) {
                    var index = lodash_1.default.indexOf(this.panel.valueMaps, map);
                    this.panel.valueMaps.splice(index, 1);
                    this.render();
                };
                DiscretePanelCtrl.prototype.addValueMap = function () {
                    this.panel.valueMaps.push({ value: '', op: '=', text: '' });
                };
                DiscretePanelCtrl.prototype.removeRangeMap = function (rangeMap) {
                    var index = lodash_1.default.indexOf(this.panel.rangeMaps, rangeMap);
                    this.panel.rangeMaps.splice(index, 1);
                    this.render();
                };
                DiscretePanelCtrl.prototype.addRangeMap = function () {
                    this.panel.rangeMaps.push({ from: '', to: '', text: '' });
                };
                DiscretePanelCtrl.prototype.onConfigChanged = function (update) {
                    if (update === void 0) { update = false; }
                    //console.log( "Config changed...");
                    this.isTimeline = true; //this.panel.display == 'timeline';
                    this.formatter = null;
                    if (this.panel.units && 'none' != this.panel.units) {
                        this.formatter = kbn_1.default.valueFormats[this.panel.units];
                    }
                    if (update) {
                        this.refresh();
                    }
                    else {
                        this.render();
                    }
                };
                DiscretePanelCtrl.prototype.getLegendDisplay = function (info, metric) {
                    var disp = info.val;
                    if (this.panel.showLegendPercent || this.panel.showLegendCounts || this.panel.showLegendTime) {
                        disp += " (";
                        var hassomething = false;
                        if (this.panel.showLegendTime) {
                            disp += moment_1.default.duration(info.ms).humanize();
                            hassomething = true;
                        }
                        if (this.panel.showLegendPercent) {
                            if (hassomething) {
                                disp += ", ";
                            }
                            var dec = this.panel.legendPercentDecimals;
                            if (lodash_1.default.isNil(dec)) {
                                if (info.per > .98 && metric.changes.length > 1) {
                                    dec = 2;
                                }
                                else if (info.per < 0.02) {
                                    dec = 2;
                                }
                                else {
                                    dec = 0;
                                }
                            }
                            disp += kbn_1.default.valueFormats.percentunit(info.per, dec);
                            hassomething = true;
                        }
                        if (this.panel.showLegendCounts) {
                            if (hassomething) {
                                disp += ", ";
                            }
                            disp += info.count + "x";
                        }
                        disp += ")";
                    }
                    return disp;
                };
                //------------------
                // Mouse Events
                //------------------
                DiscretePanelCtrl.prototype.showTooltip = function (evt, point, isExternal) {
                    var from = point.start;
                    var to = point.start + point.ms;
                    var time = point.ms;
                    var val = point.val;
                    if (this.panel.useDisplaySeries) {
                        val = point.dispVal;
                    }
                    if (this.mouse.down != null) {
                        from = Math.min(this.mouse.down.ts, this.mouse.position.ts);
                        to = Math.max(this.mouse.down.ts, this.mouse.position.ts);
                        time = to - from;
                        val = "Zoom To:";
                    }
                    var body = '<div class="graph-tooltip-time">' + val + '</div>';
                    body += "<center>";
                    body += this.dashboard.formatDate(moment_1.default(from)) + "<br/>";
                    body += "to<br/>";
                    body += this.dashboard.formatDate(moment_1.default(to)) + "<br/><br/>";
                    body += moment_1.default.duration(time).humanize() + "<br/>";
                    body += "</center>";
                    if (this.panel.useLinkOnClick && this.panel.gotoLinkToolTip != '') {
                        body += "<br/><br/>";
                        body += "<center>";
                        body += this.transformString(this.panel.gotoLinkToolTip);
                        body += "</center>";
                    }
                    var pageX = 0;
                    var pageY = 0;
                    if (isExternal) {
                        var rect = this.canvas.getBoundingClientRect();
                        pageY = rect.top + (evt.pos.panelRelY * rect.height);
                        if (pageY < 0 || pageY > jquery_1.default(window).innerHeight()) {
                            // Skip Hidden tooltip
                            this.$tooltip.detach();
                            return;
                        }
                        pageY += jquery_1.default(window).scrollTop();
                        var elapsed = this.range.to - this.range.from;
                        var pX = (evt.pos.x - this.range.from) / elapsed;
                        pageX = rect.left + (pX * rect.width);
                    }
                    else {
                        pageX = evt.evt.pageX;
                        pageY = evt.evt.pageY;
                    }
                    this.$tooltip.html(body).place_tt(pageX + 20, pageY + 5);
                };
                DiscretePanelCtrl.prototype.onGraphHover = function (evt, showTT, isExternal) {
                    this.externalPT = false;
                    if (this.data && this.data.length) {
                        var hover = null;
                        var j = Math.floor((this.mouse.position.y - this.panel.topOffset) / this.panel.rowHeight);
                        if (j < 0) {
                            j = 0;
                        }
                        if (j >= this.data.length) {
                            j = this.data.length - 1;
                        }
                        this.hoverMetric = this.data[j];
                        if (this.isTimeline) {
                            hover = this.data[j].changes[0];
                            for (var i = 0; i < this.data[j].changes.length; i++) {
                                if (this.data[j].changes[i].x > this.mouse.position.x) {
                                    break;
                                }
                                hover = this.data[j].changes[i];
                            }
                            this.hoverPoint = hover;
                            if (showTT) {
                                this.externalPT = isExternal;
                                this.showTooltip(evt, hover, isExternal);
                            }
                            this.onRender(); // refresh the view
                        }
                        else if (!isExternal) {
                            if (this.panel.display === 'stacked') {
                                hover = this.data[j].legendInfo[0];
                                for (var i = 0; i < this.data[j].legendInfo.length; i++) {
                                    if (this.data[j].legendInfo[i].x > this.mouse.position.x) {
                                        break;
                                    }
                                    hover = this.data[j].legendInfo[i];
                                }
                                this.hoverPoint = hover;
                                this.onRender(); // refresh the view
                                if (showTT) {
                                    this.externalPT = isExternal;
                                    this.showLegandTooltip(evt.evt, hover);
                                }
                            }
                        }
                    }
                    else {
                        this.$tooltip.detach(); // make sure it is hidden
                    }
                };
                DiscretePanelCtrl.prototype.onMouseClicked = function (where) {
                    if (this.panel.useLinkOnClick) {
                        var url = this.transformString(this.panel.gotoLink);
                        if (this.panel.openLinkInNewTab) {
                            window.open(url, '_blank');
                        }
                        else {
                            window.open(url, '_self');
                        }
                    }
                    else {
                        var pt = this.hoverPoint;
                        if (pt && pt.start) {
                            var range = { from: moment_1.default.utc(pt.start), to: moment_1.default.utc(pt.start + pt.ms) };
                            this.timeSrv.setTime(range);
                            this.clear();
                        }
                    }
                };
                DiscretePanelCtrl.prototype.transformString = function (text) {
                    var indexOffset = 1;
                    if (this.panel.useDisplaySeries) {
                        indexOffset = 2;
                    }
                    for (var i_4 = 0; i_4 <= indexOffset + this.panel.additionalColumns; i_4++) {
                        var tmp = new RegExp("\\$__cell_" + i_4, "g");
                        if (i_4 == 0) {
                            text = text.replace(tmp, this.hoverMetric.name);
                        }
                        if (i_4 == 1) {
                            text = text.replace(tmp, this.hoverPoint.val);
                        }
                        var diff = 2;
                        if (this.panel.useDisplaySeries) {
                            if (i_4 == 2) {
                                text = text.replace(tmp, this.hoverPoint.dispVal);
                            }
                            diff = 3;
                        }
                        if (i_4 >= diff) {
                            text = text.replace(tmp, this.hoverPoint.additionalValues[i_4 - diff]);
                        }
                    }
                    if (this.panel.valueMappingForTemplateVars) {
                        for (var i = 0; i < this.templateSrv.variables.length; i++) {
                            var variable = this.templateSrv.variables[i];
                            if (!variable.current || !variable.current.isNone && !variable.current.value) {
                                continue;
                            }
                            var regex = new RegExp("\\$" + variable.name, "g");
                            var mappedValue = this.formatValue(variable.current.value);
                            text = text.replace(regex, mappedValue);
                        }
                    }
                    else {
                        text = this.templateSrv.replace(text, this.panel.scopedVars);
                    }
                    return text;
                };
                DiscretePanelCtrl.prototype.onMouseSelectedRange = function (range) {
                    this.timeSrv.setTime(range);
                    this.clear();
                };
                DiscretePanelCtrl.prototype.clear = function () {
                    this.mouse.position = null;
                    this.mouse.down = null;
                    this.hoverPoint = null;
                    jquery_1.default(this.canvas).css('cursor', 'wait');
                    app_events_1.default.emit('graph-hover-clear');
                    this.render();
                };
                DiscretePanelCtrl.prototype.drawTimeAxis = function (ctx, currentTop) {
                    ctx.font = this.panel.textSizeTime + 'px "Open Sans", Helvetica, Arial, sans-serif';
                    ctx.fillStyle = this.panel.metricNameColor;
                    ctx.textAlign = 'left';
                    ctx.strokeStyle = this.panel.metricNameColor;
                    ctx.textBaseline = 'top';
                    ctx.setLineDash([7, 5]); /*dashes are 5px and spaces are 3px*/
                    var dataWidth = this.wrap.getBoundingClientRect().width - this.panel.headerColumnIndent;
                    var min = lodash_1.default.isUndefined(this.range.from) ? null : this.range.from.valueOf();
                    var max = lodash_1.default.isUndefined(this.range.to) ? null : this.range.to.valueOf();
                    var minPxInterval = ctx.measureText("12/33 24:59").width * 2;
                    var estNumTicks = dataWidth / minPxInterval;
                    var estTimeInterval = (max - min) / estNumTicks;
                    var timeResolution = this.getTimeResolution(estTimeInterval);
                    var pixelStep = (timeResolution / (max - min)) * dataWidth;
                    var nextPointInTime = this.roundDate(min, timeResolution) + timeResolution;
                    var xPos = this.panel.headerColumnIndent + ((nextPointInTime - min) / (max - min)) * dataWidth;
                    currentTop += 10;
                    var timeFormat = this.time_format(max - min, timeResolution / 1000);
                    while (nextPointInTime < max) {
                        // draw ticks
                        ctx.beginPath();
                        ctx.moveTo(xPos, this.panel.topOffset);
                        ctx.lineTo(xPos, currentTop + 5);
                        ctx.lineWidth = 1;
                        ctx.stroke();
                        // draw time label
                        var date = new Date(nextPointInTime);
                        var dateStr = this.formatDate(date, timeFormat);
                        var xOffset = ctx.measureText(dateStr).width / 2;
                        ctx.fillText(dateStr, xPos - xOffset, currentTop + 10);
                        nextPointInTime += timeResolution;
                        xPos += pixelStep;
                    }
                };
                DiscretePanelCtrl.prototype.time_format = function (range, secPerTick) {
                    var oneDay = 86400000;
                    var oneYear = 31536000000;
                    if (secPerTick <= 45) {
                        return "%H:%M:%S";
                    }
                    if (secPerTick <= 7200 || range <= oneDay) {
                        return "%H:%M";
                    }
                    if (secPerTick <= 80000) {
                        return "%m/%d %H:%M";
                    }
                    if (secPerTick <= 2419200 || range <= oneYear) {
                        return "%m/%d";
                    }
                    return "%Y-%m";
                };
                DiscretePanelCtrl.prototype.getTimeResolution = function (estTimeInterval) {
                    var timeIntInSecs = estTimeInterval / 1000;
                    if (timeIntInSecs <= 30) {
                        return 30 * 1000;
                    }
                    if (timeIntInSecs <= 60) {
                        return 60 * 1000;
                    }
                    if (timeIntInSecs <= (60 * 5)) {
                        return 5 * 60 * 1000;
                    }
                    if (timeIntInSecs <= (60 * 10)) {
                        return 10 * 60 * 1000;
                    }
                    if (timeIntInSecs <= (60 * 30)) {
                        return 30 * 60 * 1000;
                    }
                    if (timeIntInSecs <= (60 * 60)) {
                        return 60 * 60 * 1000;
                    }
                    if (timeIntInSecs <= (60 * 60)) {
                        return 60 * 60 * 1000;
                    }
                    if (timeIntInSecs <= (2 * 60 * 60)) {
                        return 2 * 60 * 60 * 1000;
                    }
                    if (timeIntInSecs <= (6 * 60 * 60)) {
                        return 6 * 60 * 60 * 1000;
                    }
                    if (timeIntInSecs <= (12 * 60 * 60)) {
                        return 12 * 60 * 60 * 1000;
                    }
                    if (timeIntInSecs <= (24 * 60 * 60)) {
                        return 24 * 60 * 60 * 1000;
                    }
                    if (timeIntInSecs <= (2 * 24 * 60 * 60)) {
                        return 2 * 24 * 60 * 60 * 1000;
                    }
                    if (timeIntInSecs <= (7 * 24 * 60 * 60)) {
                        return 7 * 24 * 60 * 60 * 1000;
                    }
                    if (timeIntInSecs <= (30 * 24 * 60 * 60)) {
                        return 30 * 24 * 60 * 60 * 1000;
                    }
                    return 6 * 30 * 24 * 60 * 60 * 1000;
                };
                DiscretePanelCtrl.prototype.roundDate = function (timeStamp, roundee) {
                    timeStamp -= timeStamp % roundee; //subtract amount of time since midnight
                    return timeStamp;
                };
                DiscretePanelCtrl.prototype.formatDate = function (d, fmt) {
                    var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                    var dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
                    if (typeof d.strftime == "function") {
                        return d.strftime(fmt);
                    }
                    var r = [];
                    var escape = false;
                    var hours = d.getHours();
                    var isAM = hours < 12;
                    if (monthNames == null) {
                        monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                    }
                    if (dayNames == null) {
                        dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
                    }
                    var hours12;
                    if (hours > 12) {
                        hours12 = hours - 12;
                    }
                    else if (hours == 0) {
                        hours12 = 12;
                    }
                    else {
                        hours12 = hours;
                    }
                    for (var i = 0; i < fmt.length; ++i) {
                        var c = fmt.charAt(i);
                        if (escape) {
                            switch (c) {
                                case 'a':
                                    c = "" + dayNames[d.getDay()];
                                    break;
                                case 'b':
                                    c = "" + monthNames[d.getMonth()];
                                    break;
                                case 'd':
                                    c = this.leftPad(d.getDate(), "");
                                    break;
                                case 'e':
                                    c = this.leftPad(d.getDate(), " ");
                                    break;
                                case 'h': // For back-compat with 0.7; remove in 1.0
                                case 'H':
                                    c = this.leftPad(hours, null);
                                    break;
                                case 'I':
                                    c = this.leftPad(hours12, null);
                                    break;
                                case 'l':
                                    c = this.leftPad(hours12, " ");
                                    break;
                                case 'm':
                                    c = this.leftPad(d.getMonth() + 1, "");
                                    break;
                                case 'M':
                                    c = this.leftPad(d.getMinutes(), null);
                                    break;
                                // quarters not in Open Group's strftime specification
                                case 'q':
                                    c = "" + (Math.floor(d.getMonth() / 3) + 1);
                                    break;
                                case 'S':
                                    c = this.leftPad(d.getSeconds(), null);
                                    break;
                                case 'y':
                                    c = this.leftPad(d.getFullYear() % 100, null);
                                    break;
                                case 'Y':
                                    c = "" + d.getFullYear();
                                    break;
                                case 'p':
                                    c = (isAM) ? ("" + "am") : ("" + "pm");
                                    break;
                                case 'P':
                                    c = (isAM) ? ("" + "AM") : ("" + "PM");
                                    break;
                                case 'w':
                                    c = "" + d.getDay();
                                    break;
                            }
                            r.push(c);
                            escape = false;
                        }
                        else {
                            if (c == "%") {
                                escape = true;
                            }
                            else {
                                r.push(c);
                            }
                        }
                    }
                    return r.join("");
                };
                DiscretePanelCtrl.prototype.leftPad = function (n, pad) {
                    n = "" + n;
                    pad = "" + (pad == null ? "0" : pad);
                    return n.length == 1 ? pad + n : n;
                };
                ;
                DiscretePanelCtrl.templateUrl = 'partials/module.html';
                return DiscretePanelCtrl;
            })(canvas_metric_1.CanvasPanelCtrl);
            exports_1("PanelCtrl", DiscretePanelCtrl);
        }
    }
});
//# sourceMappingURL=module.js.map