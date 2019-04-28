var sffw;
(function (sffw) {
    var components;
    (function (components) {
        var ColumnSelector = /** @class */ (function () {
            function ColumnSelector(params, componentInfo) {
                var _this = this;
                // IDataColumnBase arrays
                this.tmpVisibleCols = ko.observableArray();
                this.tmpHiddenCols = ko.observableArray();
                // arrays for selected
                this.selectedVisibleCols = ko.observableArray();
                this.selectedHiddenCols = ko.observableArray();
                this.isEnabled = ko.observable(false);
                this.subscriptions = [];
                this.onBtnVisibleColUp = function (column) {
                    sffw.moveColumn(_this.tmpVisibleCols, column, 'up');
                };
                this.onBtnHiddenColUp = function (column) {
                    sffw.moveColumn(_this.tmpHiddenCols, column, 'up');
                };
                this.onBtnVisibleColDown = function (column) {
                    sffw.moveColumn(_this.tmpVisibleCols, column, 'down');
                };
                this.onBtnHiddenColDown = function (column) {
                    sffw.moveColumn(_this.tmpHiddenCols, column, 'down');
                };
                this.ctrlCore = params.controller.ctrlCore;
                this.isEnabled = params.isEnabled;
                this.subscriptions.push(this.isEnabled.subscribe(function (enabled) {
                    if (enabled) {
                        _this.initializeColumns();
                    }
                }));
            }
            ColumnSelector.prototype.initializeColumns = function () {
                var _this = this;
                this.clearViewConfigArrays();
                _.each(this.ctrlCore.getVisibleColumnsCore(), (function (col) {
                    _this.tmpVisibleCols.push(col);
                }));
                _.each(this.ctrlCore.getHiddenColumnsCore(), (function (col) {
                    _this.tmpHiddenCols.push(col);
                }));
            };
            ColumnSelector.prototype.onBtnSaveViewClick = function () {
                var newVisibleCols = _.map(this.tmpVisibleCols(), function (c) {
                    return c.Name;
                });
                this.ctrlCore.setVisibleColumns(newVisibleCols);
                this.clearViewConfigArrays();
                this.isEnabled(!this.isEnabled());
            };
            ColumnSelector.prototype.onBtnCancelViewClick = function () {
                this.clearViewConfigArrays();
                this.isEnabled(!this.isEnabled());
            };
            ColumnSelector.prototype.clearViewConfigArrays = function () {
                this.selectedVisibleCols.removeAll();
                this.selectedHiddenCols.removeAll();
                this.tmpVisibleCols.removeAll();
                this.tmpHiddenCols.removeAll();
            };
            ColumnSelector.prototype.onBtnColsToRightClick = function () {
                var _this = this;
                var sc = this.selectedVisibleCols();
                var selectedColums = _.filter(this.tmpVisibleCols(), function (col) {
                    return _.indexOf(sc, col) > -1;
                });
                _.each(selectedColums, function (col) {
                    _this.tmpHiddenCols.push(col);
                });
                this.tmpVisibleCols(this.tmpVisibleCols().filter(function (col) {
                    return _.indexOf(sc, col) === -1;
                }));
                this.selectedVisibleCols.removeAll();
            };
            ColumnSelector.prototype.onBtnColsToLeftClick = function () {
                var _this = this;
                var sc = this.selectedHiddenCols();
                var selectedColums = _.filter(this.tmpHiddenCols(), function (col) {
                    return _.indexOf(sc, col) > -1;
                });
                _.each(selectedColums, function (col) {
                    _this.tmpVisibleCols.push(col);
                });
                this.tmpHiddenCols(this.tmpHiddenCols().filter(function (col) {
                    return _.indexOf(sc, col) === -1;
                }));
                this.selectedHiddenCols.removeAll();
            };
            ColumnSelector.prototype.dispose = function () {
                _.each(this.subscriptions, function (sub) {
                    sub.dispose();
                });
            };
            return ColumnSelector;
        }());
        components.ColumnSelector = ColumnSelector;
    })(components = sffw.components || (sffw.components = {}));
})(sffw || (sffw = {}));
var sffw;
(function (sffw) {
    var components;
    (function (components) {
        if (ko && !ko.components.isRegistered('sffw-listcolumn-selector')) {
            ko.components.register('sffw-listcolumn-selector', {
                viewModel: {
                    createViewModel: function (params, componentInfo) { return new sffw.components.ColumnSelector(params, componentInfo); }
                },
                synchronous: true,
                template: "\n<div class=\"sffw-listcolumn-selector\" data-bind=\"visible: isEnabled()\">\n    <!-- left columns list -->\n    <div class=\"sffw-listcolumn-selector-columns\">\n        <ul data-bind=\"foreach: tmpVisibleCols\">\n            <li>\n                <label>\n                    <input type=\"checkbox\" data-bind=\"value: name, checkedValue: $data, checked: $parent.selectedVisibleCols\" />\n                    <span data-bind=\"text: (IsCaptionLocalized === true ? $root.$localize(Caption) : Caption)\" />\n                </label>\n                <div>\n                    <button data-bind=\"click: $parent.onBtnVisibleColUp, attr: { 'aria-label': $root.$localize('ListColumnSelector$$moveUp') }\">&uarr;</button>\n                    <button data-bind=\"click: $parent.onBtnVisibleColDown, attr: { 'aria-label': $root.$localize('ListColumnSelector$$moveDown') }\">&darr;</button>\n                </div>\n            </li>\n        </ul>\n    </div>\n    <!-- buttons -->\n    <div class=\"sffw-listcolumn-selector-buttons\">\n        <ul>\n            <li><button class=\"sffw-listcolumn-selector-button\" data-bind=\"click: onBtnColsToRightClick, attr: { 'aria-label': $root.$localize('ListColumnSelector$$moveRight') }\">--></button></li>\n            <li><button class=\"sffw-listcolumn-selector-button\" data-bind=\"click: onBtnColsToLeftClick, attr: { 'aria-label': $root.$localize('ListColumnSelector$$moveLeft') }\"><--</button></li>\n            <li><button class=\"sffw-listcolumn-selector-button\" data-bind=\"click: onBtnSaveViewClick, text: $root.$localize('ListColumnSelector$$saveAndClose')\"></button></li>\n            <li><button class=\"sffw-listcolumn-selector-button\" data-bind=\"click: onBtnCancelViewClick, text: $root.$localize('ListColumnSelector$$cancelAndClose')\"></button></li>\n        </ul>\n    </div>\n    <!-- right columns list -->\n    <div class=\"sffw-listcolumn-selector-columns\">\n        <ul data-bind=\"foreach: tmpHiddenCols\">\n            <li>\n                <label>\n                    <input type=\"checkbox\" data-bind=\"value: name, checkedValue: $data, checked: $parent.selectedHiddenCols\" />\n                    <span data-bind=\"text: (IsCaptionLocalized === true ? $root.$localize(Caption) : Caption)\" />\n                </label>\n                <div>\n                    <button data-bind=\"click: $parent.onBtnHiddenColUp, attr: { 'aria-label': $root.$localize('ListColumnSelector$$moveUp') }\">&uarr;</button>\n                    <button data-bind=\"click: $parent.onBtnHiddenColDown, attr: { 'aria-label': $root.$localize('ListColumnSelector$$moveDown') }\">&darr;</button>\n                </div>\n            </li>\n        </ul>\n    </div>\n</div>"
            });
        }
    })(components = sffw.components || (sffw.components = {}));
})(sffw || (sffw = {}));
var sffw;
(function (sffw) {
    function assert(condition, message) {
        if (!condition) {
            if (message) {
                console.error('Assertion failed: ' + message);
            }
            else {
                console.error('Assertion failed');
            }
        }
    }
    sffw.assert = assert;
})(sffw || (sffw = {}));
var sffw;
(function (sffw) {
    function moveColumn(array, item, direction) {
        var currentPos = array.indexOf(item);
        if (direction === 'up') {
            if (currentPos > 0) {
                array.splice(currentPos, 1);
                array.splice(currentPos - 1, 0, item);
            }
        }
        if (direction === 'down') {
            if (currentPos < array().length - 1) {
                array.splice(currentPos, 1);
                array.splice(currentPos + 1, 0, item);
            }
        }
    }
    sffw.moveColumn = moveColumn;
})(sffw || (sffw = {}));
