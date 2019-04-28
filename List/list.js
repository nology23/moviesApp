var fp = window.flatpickr;
var sffw;
(function (sffw) {
    var components;
    (function (components) {
        var list;
        (function (list) {
            'use strict';
            var handlers = ko.bindingHandlers;
            var fpChangeHandler = function (par, selectedDates, dateStr, instance) {
                if (par.att && par.element) {
                    par.att(selectedDates[0]);
                }
            };
            handlers.filterDatePicker = handlers.filterDatePicker || {
                init: function (element, valueAccessor) {
                    $(element).attr('autocomplete', 'off');
                    var att = valueAccessor();
                    var onChangePar = {
                        att: att,
                        element: element
                    };
                    var config = {
                        allowInput: true,
                        enableTime: false,
                        onChange: fpChangeHandler.bind(null, onChangePar)
                    };
                    if (window.sf.localization.currentCulture() && typeof (window.sf.localization.currentCulture().strToDate) === 'function') {
                        config.parseDate = window.sf.localization.currentCulture().strToDate;
                    }
                    var prepareFlatPickrCulture = function () {
                        if (currentCultureCode()) {
                            _.forOwn(window.sf.localization.currentCulture().flatpickrConfig, function (value, key) {
                                if (key !== 'dateFormat') {
                                    config[key] = value;
                                }
                                else {
                                    // remove time from dateFormat
                                    config[key] = value.toString().replace(' H:i', '');
                                }
                            });
                            var cultureConfig = config.l10ns;
                            fp.l10ns[currentCultureCode()] = cultureConfig;
                        }
                    };
                    var currentCultureCode = window.sf.localization.currentCultureCode;
                    if (currentCultureCode()) {
                        prepareFlatPickrCulture();
                        config.locale = currentCultureCode();
                    }
                    var flatpickr = new window.flatpickr(element, config);
                    var subscription = att.subscribe(function () {
                        if (att()) {
                            flatpickr.setDate(att());
                        }
                        else {
                            flatpickr.clear();
                        }
                    });
                    // set value to current attribute value
                    flatpickr.setDate(att() || null, true);
                    element.value = att();
                    ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
                        subscription.dispose();
                        cultureChangeSubscription.dispose();
                        flatpickr.destroy();
                        att = null;
                        config = null;
                        flatpickr = null;
                    });
                    var cultureChangeSubscription = currentCultureCode.subscribe(function () {
                        prepareFlatPickrCulture();
                        flatpickr.set('locale', currentCultureCode());
                        flatpickr.set('dateFormat', config.dateFormat);
                        if (typeof (window.sf.localization.currentCulture().strToDate) === 'function') {
                            flatpickr.set('parseDate', window.sf.localization.currentCulture().strToDate);
                        }
                        flatpickr.setDate(att() || null, false);
                    });
                }
            };
            handlers.filterOptionHasFocus = handlers.filterOptionHasFocus || {
                init: function (element, valueAccessor) {
                    var att = valueAccessor();
                    $(element).on('focusin', function () {
                        att(true);
                    });
                    $(element).on('focusout', function () {
                        att(false);
                    });
                }
            };
            handlers.winsize = handlers.winsize || {
                init: function (element, valueAccessor) {
                    var resizeHandler = function () {
                        var value = valueAccessor();
                        value({ width: $(window).width(), height: $(window).height() });
                    };
                    $(window).on('resize', resizeHandler);
                    ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
                        $(window).off('resize', resizeHandler);
                    });
                }
            };
        })(list = components.list || (components.list = {}));
    })(components = sffw.components || (sffw.components = {}));
})(sffw || (sffw = {}));
var sffw;
(function (sffw) {
    var components;
    (function (components) {
        var list;
        (function (list) {
            var SelectOption = /** @class */ (function () {
                function SelectOption(value, text) {
                    this.value = value;
                    this.text = text;
                }
                return SelectOption;
            }());
            list.SelectOption = SelectOption;
            var hasFocusPropName = 'hasFocus';
            var ListColumnModel = /** @class */ (function () {
                function ListColumnModel(column, dc, maxVisibleFilterOptions, colDefIndex) {
                    var _this = this;
                    this.colDefIndex = colDefIndex;
                    this.localization = window.sf.localization;
                    this.filterText = ko.observable('');
                    this.isFilterActive = ko.observable(false);
                    this.width = ko.observable('');
                    this.hasEnumFilter = ko.observable(false);
                    this.formatAsAmount = false;
                    this.formatAsCurrency = false;
                    this.filterEnumOptions = ko.observableArray([]);
                    this.filterEnumSelectedValue = ko.observableArray([]);
                    this.filterBoolSelectedValue = ko.observable();
                    // filter date range (type Date)
                    this.filterDateRangeFrom = ko.observable();
                    this.filterDateRangeTo = ko.observable();
                    // displayed filter date according to culture info (type String)
                    this.filterDisplayFrom = ko.observable('');
                    this.filterDisplayTo = ko.observable('');
                    this.ddFilterFocus = ko.observable();
                    this.ddFocus = ko.observable();
                    this.boolOptions = ko.observableArray();
                    // helper observable for handling windows resize and re-setting position in filterDropDownLeft()
                    this.windowSize = ko.observable();
                    this.filterDropDownVisible = ko.pureComputed(function () {
                        var item = _.find(_this.filterEnumOptions(), function (ddItem) {
                            return ko.unwrap(ddItem[hasFocusPropName]) === true;
                        });
                        return (item != null || _this.ddFilterFocus() === true || _this.ddFocus() === true);
                    }).extend({ throttle: 200 });
                    this.filterDropDownHeight = ko.pureComputed(function () {
                        if (_this.filterDropDownVisible() === true && _.isNumber(ko.unwrap(_this.maxVisibleFilterOptions))) {
                            var ddElem = $("#" + _this.ddFilterUniqueId);
                            var itmHeight = ddElem.find('label > div').first().outerHeight();
                            var borderHeight = ddElem.outerHeight() - ddElem.innerHeight();
                            return ((ko.unwrap(_this.maxVisibleFilterOptions) * itmHeight) + borderHeight).toString() + 'px';
                        }
                        return null;
                    });
                    this.filterDropDownLeft = ko.pureComputed(function () {
                        if (_this.filterDropDownVisible() === true) {
                            // dummy read to force recalc when windowSize changed
                            _this.windowSize();
                            var posLeft = null;
                            var input = $("#" + _this.filterUniqueId);
                            var dd = $("#" + _this.ddFilterUniqueId);
                            var ddWidth = dd.outerWidth();
                            var inputPos = input.position().left;
                            var inputWidth = input.outerWidth();
                            var winWidth = $(window).innerWidth();
                            if (inputPos + ddWidth >= winWidth) {
                                posLeft = inputPos + inputWidth - ddWidth;
                            }
                            else {
                                posLeft = input.position().left;
                            }
                            return posLeft + "px";
                        }
                        return 0;
                    });
                    this.filterDropDownMinWidth = ko.pureComputed(function () {
                        if (_this.filterDropDownVisible() === true) {
                            // dummy read to force recalc when windowSize changed
                            _this.windowSize();
                            var minWidth = $("#" + _this.filterUniqueId).outerWidth();
                            return minWidth + "px";
                        }
                        return null;
                    });
                    this.ddOverflow = ko.observable();
                    this.subscriptions = [];
                    this.dataContext = dc;
                    this.name = column.Name;
                    this.dataType = column.DataType && column.DataType.length > 0 ? column.DataType : 'string';
                    this.caption = column.Caption;
                    if (column.ColumnWidth && column.ColumnWidth.length > 0) {
                        this.width(column.ColumnWidth);
                    }
                    this.isCaptionLocalized = column.IsCaptionLocalized === true ? true : false;
                    if (column.formatAsAmount) {
                        this.formatAsAmount = column.formatAsAmount;
                    }
                    if (column.formatAsCurrency) {
                        this.formatAsCurrency = column.formatAsCurrency;
                    }
                    if (column.filterOptionSource) {
                        this.filterOptionSource = column.filterOptionSource;
                        this.filterEnumOptions(this.getFilterEnumOptionsFromSource());
                        this.hasEnumFilter(true);
                        this.subscriptions.push(this.filterOptionSource.items.subscribe(this.onFilterOptionSourceChanged, this));
                    }
                    else if (column.filterOptions && column.filterOptions.length > 0) {
                        _.each(column.filterOptions, function (item) {
                            _.assign(item, item[hasFocusPropName] = ko.observable());
                            _this.filterEnumOptions.push(item);
                        });
                        this.hasEnumFilter(true);
                    }
                    this.maxVisibleFilterOptions = maxVisibleFilterOptions;
                    this.filterEnabled = (this.dataType === 'string' || this.dataType === 'integer' || this.dataType === 'decimal' ||
                        this.dataType === 'bool' || this.dataType === 'date') && (column.EnableFilter !== false);
                    if (this.dataType === 'bool') {
                        this.createLocalizedBoolFilterOptions();
                        this.subscriptions.push(window.sf.localization.currentCultureCode.subscribe(function () {
                            _this.createLocalizedBoolFilterOptions();
                        }));
                    }
                    if (this.dataType === 'date') {
                        this.subscriptions.push(this.filterDateRangeFrom.subscribe(function (newVal) {
                            if (newVal != null) {
                                _this.filterDisplayFrom(_this.localization.currentCulture().dateToStr(newVal));
                            }
                            else {
                                _this.filterDisplayFrom('');
                            }
                        }));
                        this.subscriptions.push(this.filterDateRangeTo.subscribe(function (newVal) {
                            if (newVal != null) {
                                _this.filterDisplayTo(_this.localization.currentCulture().dateToStr(newVal));
                            }
                            else {
                                _this.filterDisplayTo('');
                            }
                        }));
                        this.subscriptions.push(this.filterDisplayFrom.subscribe(function (newVal) {
                            if (newVal === '') {
                                _this.filterDateRangeFrom(null);
                            }
                        }));
                        this.subscriptions.push(this.filterDisplayTo.subscribe(function (newVal) {
                            if (newVal === '') {
                                _this.filterDateRangeTo(null);
                            }
                        }));
                    }
                    if (this.hasEnumFilter() === true) {
                        var uniqueId = "" + Date.now() + Math.random().toString(16).substr(2, 5).toUpperCase();
                        this.filterUniqueId = this.name + "-" + uniqueId;
                        this.ddFilterUniqueId = this.name + "-dd-" + uniqueId;
                        this.filterEnumSelectedOptionText = ko.pureComputed(this.getfilterEnumSelectedOptionText, this);
                        this.ddOverflow(this.getFilterDdOverflow());
                    }
                }
                ListColumnModel.prototype.createLocalizedBoolFilterOptions = function () {
                    var culture = window.sf.localization.currentCulture();
                    this.boolOptions.removeAll();
                    this.boolOptions.push(new SelectOption(null, ''));
                    this.boolOptions.push(new SelectOption(true, culture.boolToStr(true)));
                    this.boolOptions.push(new SelectOption(false, culture.boolToStr(false)));
                };
                ListColumnModel.prototype.getfilterEnumSelectedOptionText = function () {
                    var _this = this;
                    var result = _.map(this.filterEnumSelectedValue(), function (filterVal) {
                        var itm = _.find(_this.filterEnumOptions(), function (filterOption) {
                            return filterOption.value === filterVal;
                        });
                        return itm ? itm.isLocalized === true ? _this.dataContext.$localize(itm.text) : ko.unwrap(itm.text) : filterVal;
                    });
                    return result;
                };
                ListColumnModel.prototype.getFilterEnumOptionsFromSource = function () {
                    var result = [];
                    var displayMemberName = this.filterOptionSource.getDisplayMemberName();
                    var valueMemberName = this.filterOptionSource.getValueMemberName();
                    var codelistItems = _.orderBy(this.filterOptionSource.items(), displayMemberName);
                    _.each(codelistItems, function (itm) {
                        var item;
                        if (itm[displayMemberName]) {
                            item = { value: itm[valueMemberName], text: itm[displayMemberName] };
                        }
                        else {
                            item = { value: itm[valueMemberName], text: itm[valueMemberName] };
                        }
                        _.assign(item, item[hasFocusPropName] = ko.observable());
                        result.push(item);
                    });
                    return result;
                };
                ListColumnModel.prototype.getFilterDdOverflow = function () {
                    var mfo = ko.unwrap(this.maxVisibleFilterOptions);
                    if (_.isNumber(mfo) && this.filterEnumOptions().length > mfo) {
                        // in FF default overflow in combination with max-height eats inner horizontal space and long items are wrapping
                        return '-moz-scrollbars-vertical';
                    }
                    return null;
                };
                ListColumnModel.prototype.onFilterOptionSourceChanged = function () {
                    this.filterEnumOptions.removeAll();
                    this.filterEnumOptions(this.getFilterEnumOptionsFromSource());
                    this.ddOverflow(this.getFilterDdOverflow());
                };
                ListColumnModel.prototype.dispose = function () {
                    _.each(this.subscriptions, function (sub) {
                        sub.dispose();
                    });
                };
                return ListColumnModel;
            }());
            list.ListColumnModel = ListColumnModel;
        })(list = components.list || (components.list = {}));
    })(components = sffw.components || (sffw.components = {}));
})(sffw || (sffw = {}));
var sffw;
(function (sffw) {
    var components;
    (function (components) {
        var list;
        (function (list) {
            'use strict';
            var ListDataRecord = /** @class */ (function () {
                function ListDataRecord($plainObj, columns) {
                    var _this = this;
                    this.$plainObj = $plainObj;
                    this.$rowCss = ko.pureComputed(function () {
                        var classes = [];
                        if (_this.$selected()) {
                            classes.push('sffw-list-selected-row');
                        }
                        if (_this.$colorIndicator()) {
                            classes.push('sffw-list-colorindicator-' + _this.$colorIndicator().toLowerCase());
                        }
                        return classes.join(' ');
                    });
                    this.$selected = ko.observable(false);
                    this.$colorIndicator = ko.observable();
                    var culture = window.sf.localization.currentCulture();
                    _.forEach(columns, function (column) {
                        var cellValue = $plainObj[column.name];
                        switch (column.dataType) {
                            case 'string':
                            case 'integer':
                                if (cellValue === null || _.isUndefined(cellValue)) {
                                    _this[column.name] = '';
                                }
                                else if (column.formatAsAmount || column.formatAsCurrency) {
                                    _this[column.name] = sffw.formatAsAmountOrCurrency(cellValue.toString(), column.formatAsAmount, column.formatAsCurrency);
                                }
                                else {
                                    _this[column.name] = cellValue;
                                }
                                break;
                            case 'decimal':
                                if (cellValue === null || _.isUndefined(cellValue)) {
                                    _this[column.name] = '';
                                }
                                else {
                                    var numVal = +cellValue;
                                    var decStrVal = _.isNaN(numVal) ? cellValue.toString() : culture.decimalToStr(numVal);
                                    if (column.formatAsAmount || column.formatAsCurrency) {
                                        _this[column.name] = sffw.formatAsAmountOrCurrency(decStrVal, column.formatAsAmount, column.formatAsCurrency);
                                    }
                                    else {
                                        _this[column.name] = decStrVal;
                                    }
                                }
                                break;
                            case 'date':
                                if (cellValue === null || _.isUndefined(cellValue)) {
                                    _this[column.name] = '';
                                }
                                else {
                                    _this[column.name] = culture.dateToStr(moment(cellValue).toDate());
                                }
                                break;
                            case 'bool':
                                if (cellValue === null || _.isUndefined(cellValue)) {
                                    _this[column.name] = '';
                                }
                                else {
                                    _this[column.name] = culture.boolToStr(cellValue);
                                }
                                break;
                            default:
                                throw new Error("Unknown column type " + column.dataType + " in DeclListRecord constructor");
                        }
                        if (column.name === 'ColorIndicator' && cellValue) {
                            _this.$colorIndicator(cellValue);
                        }
                    });
                }
                return ListDataRecord;
            }());
            list.ListDataRecord = ListDataRecord;
        })(list = components.list || (components.list = {}));
    })(components = sffw.components || (sffw.components = {}));
})(sffw || (sffw = {}));
var sffw;
(function (sffw) {
    var components;
    (function (components) {
        var list;
        (function (list) {
            var ListViewModel = /** @class */ (function () {
                function ListViewModel(params, componentInfo) {
                    var _this = this;
                    this.columns = [];
                    this.visibleColumns = ko.observableArray();
                    this.hiddenColumns = ko.observableArray();
                    this.records = ko.observableArray();
                    this.pageBackEnabled = ko.pureComputed(function () {
                        return _this.pageNumber() > 1;
                    });
                    this.pageForwardEnabled = ko.pureComputed(function () {
                        return _this.pageNumber() < _this.pagesCount();
                    });
                    this.orderByColumnName = ko.pureComputed(function () {
                        return _this.ctrlCore.getSortingColumn();
                    }, this);
                    this.isDescending = ko.pureComputed(function () {
                        return _this.ctrlCore.getSortingOrder() && _this.ctrlCore.getSortingOrder() === 'desc';
                    }, this);
                    this.subscriptions = [];
                    this.onMultipleDropdownChange = function (col, newValue) {
                        if (_.isArray(newValue)) {
                            _this.ctrlCore.setTextFilter(col.name, col.filterEnumSelectedValue().join(','));
                            col.isFilterActive(_this.ctrlCore.isFilterActive(col.name));
                        }
                    };
                    this.onFilterDropdownChange = function (col, newValue) {
                        var boolVal = null;
                        if (col.dataType === 'bool' && (newValue === true || newValue === false)) {
                            boolVal = newValue;
                        }
                        if (boolVal != null) {
                            _this.ctrlCore.setBooleanFilter(col.name, boolVal);
                        }
                        else {
                            _this.ctrlCore.setBooleanFilter(col.name, null);
                        }
                        col.isFilterActive(_this.ctrlCore.isFilterActive(col.name));
                    };
                    this.onFilterDateFromChange = function (col, newValue) {
                        _this.ctrlCore.setDateRangeFilterStart(col.name, col.filterDateRangeFrom());
                        col.isFilterActive(_this.ctrlCore.isFilterActive(col.name));
                    };
                    this.onFilterDateToChange = function (col, newValue) {
                        _this.ctrlCore.setDateRangeFilterEnd(col.name, col.filterDateRangeTo());
                        col.isFilterActive(_this.ctrlCore.isFilterActive(col.name));
                    };
                    this.onFilterChanged = function (col, newValue) {
                        // if value is not trimmed, we do it first, which will trigger another event later
                        var trimmed = newValue.trim();
                        if (trimmed !== newValue) {
                            return;
                        }
                        _this.ctrlCore.setTextFilter(col.name, col.filterText());
                        col.isFilterActive(_this.ctrlCore.isFilterActive(col.name));
                    };
                    this.onPageMinClick = function () {
                        _this.page('1');
                    };
                    this.onPageMaxClick = function () {
                        var newPageNum = _this.pagesCount();
                        _this.page(newPageNum.toString());
                    };
                    this.onPageForwardClick = function () {
                        if (_this.pageNumber() < _this.pagesCount()) {
                            var newPageNum = _this.pageNumber() + 1;
                            _this.page(newPageNum.toString());
                        }
                    };
                    this.onPageBackClick = function () {
                        if (_this.pageNumber() > 1) {
                            var newPageNum = _this.pageNumber() - 1;
                            _this.page(newPageNum.toString());
                        }
                    };
                    this.onPageRefreshClick = function () {
                        _this.clearSelection();
                        _this.ctrlCore.loadData();
                    };
                    this.onColumnHeaderClick = function (column) {
                        _this.ctrlCore.changeSortColumnOrDirection(column.name);
                        _this.clearSelection();
                    };
                    this.dataContext = params.$parentData;
                    this.listName = params.listName;
                    this.selectionChangeHandler = params.onSelectionChange;
                    this.ctrlCore = params.controller.ctrlCore;
                    this.maxVisibleFilterOptions = params.maxVisibleFilterOptions;
                    this.onRowsChangedHandler = params.onRowsChanged;
                    this.selectedRowReference = params.selectedRow;
                    this.onRowClickHandler = params.onRowClicked;
                    this.createColumns(params.columns);
                    var wasCtrlReady = this.ctrlCore.isReady();
                    if (wasCtrlReady === true) {
                        this.ctrlCore.isReady(false);
                    }
                    this.ctrlCore.initColumns(params.columns);
                    this.pageNumber = this.ctrlCore.activePage;
                    this.page = ko.observable(_.isNumber(this.pageNumber()) ? this.pageNumber().toString() : '');
                    this.error = this.ctrlCore.error;
                    this.isLoading = this.ctrlCore.isLoading;
                    this.ctrlCore.listName = params.listName;
                    this.recordsCount = this.ctrlCore.rowCount;
                    // there is always at least 1 page even if there is no record
                    this.pagesCount = ko.pureComputed(function () { return Math.ceil(_this.recordsCount() / _this.ctrlCore.pageSize()) || 1; });
                    this.subscriptions.push(this.pageNumber.subscribe(function (newPageNum) {
                        _this.page(newPageNum.toString());
                    }));
                    this.subscriptions.push(this.page.subscribe(function (newPageStr) {
                        var n = Number(_this.page().trim());
                        if (_.isNaN(n) || n < 1 || n > _this.pagesCount() || !_.isInteger(n)) {
                            _this.page(_this.pageNumber().toString());
                        }
                        else {
                            if (_this.pageNumber() !== n) {
                                _this.pageNumber(n);
                            }
                        }
                    }));
                    this.subscriptions.push(this.ctrlCore.isReady.subscribe(function (isReady) {
                        if (isReady) {
                            _this.setColumnFilters();
                            _this.setColumnsVisibilityAndOrder();
                        }
                    }));
                    this.setColumnFilters();
                    this.subscriptions.push(this.ctrlCore.rows.subscribe(this.onRowsChange, this, 'arrayChange'));
                    this.ctrlCore.onClearState = function () {
                        _.each(_this.columns, function (col) {
                            col.isFilterActive(false);
                            if (col.hasEnumFilter() === true) {
                                col.filterEnumSelectedValue.removeAll();
                            }
                            else {
                                switch (col.dataType) {
                                    case 'string':
                                    case 'integer':
                                    case 'decimal':
                                        col.filterText('');
                                        break;
                                    case 'date':
                                        col.filterDateRangeFrom(null);
                                        col.filterDateRangeTo(null);
                                        break;
                                    case 'bool':
                                        col.filterBoolSelectedValue(null);
                                        break;
                                }
                            }
                        });
                    };
                    if (wasCtrlReady === true) {
                        this.ctrlCore.isReady(true);
                    }
                }
                ListViewModel.prototype.onRowsChange = function () {
                    var _this = this;
                    this.records.removeAll();
                    var promiseChain = this.clearSelection();
                    var newDataRecords = [];
                    promiseChain = promiseChain.then(function () {
                        newDataRecords = _.map(_this.ctrlCore.rows(), function (obj) {
                            return new list.ListDataRecord(obj, _this.columns);
                        });
                        _.each(newDataRecords, function (r) {
                            _this.records.push(r);
                        });
                        return _this.setFocusedRow(_this.ctrlCore.focusedRecordIndex());
                    });
                    if (this.onRowsChangedHandler) {
                        promiseChain = promiseChain.then(function () {
                            return _this.onRowsChangedHandler();
                        });
                    }
                    return promiseChain;
                };
                ListViewModel.prototype.setFocusedRow = function (index) {
                    if (index >= 0 && index < this.records().length) {
                        var focusedRecord = this.records()[index];
                        return this.onRowClick(focusedRecord, null);
                    }
                    return Promise.resolve();
                };
                ListViewModel.prototype.createColumns = function (columns) {
                    var _this = this;
                    _(columns).each(function (c, index) {
                        var column = new list.ListColumnModel(c, _this.dataContext, _this.maxVisibleFilterOptions, index);
                        _this.columns.push(column);
                        if (c.IsVisible !== false) { // may be undefined because of default value
                            _this.visibleColumns.push(column);
                        }
                        else {
                            _this.hiddenColumns.push(column);
                        }
                        if (c.DataType === 'bool') {
                            _this.subscriptions.push(column.filterBoolSelectedValue.subscribe(_.partial(_this.onFilterDropdownChange, column)));
                        }
                        else if (c.DataType === 'date') {
                            _this.subscriptions.push(column.filterDateRangeFrom.subscribe(_.partial(_this.onFilterDateFromChange, column)));
                            _this.subscriptions.push(column.filterDateRangeTo.subscribe(_.partial(_this.onFilterDateToChange, column)));
                        }
                        else if (column.hasEnumFilter() === true) {
                            _this.subscriptions.push(column.filterEnumSelectedValue.subscribe(_.partial(_this.onMultipleDropdownChange, column)));
                        }
                        else {
                            _this.subscriptions.push(column.filterText.subscribe(_.partial(_this.onFilterChanged, column)));
                        }
                    });
                };
                ListViewModel.prototype.setColumnFilters = function () {
                    var _this = this;
                    _.each(this.columns, function (col) {
                        col.isFilterActive(false);
                    });
                    if (this.ctrlCore.columnFilters().length > 0) {
                        _.each(this.ctrlCore.columnFilters(), function (colFilter) {
                            var filteredColumn = _.find(_this.columns, function (col) { return col.name === colFilter.name; });
                            if (filteredColumn) {
                                if (colFilter.type === 'text') {
                                    if (filteredColumn.hasEnumFilter() === true) {
                                        if (colFilter.getValue().length > 0) {
                                            filteredColumn.filterEnumSelectedValue(colFilter.getValue().split(','));
                                            filteredColumn.isFilterActive(colFilter.hasValue());
                                        }
                                    }
                                    else {
                                        switch (filteredColumn.dataType) {
                                            case 'string':
                                            case 'integer':
                                            case 'decimal':
                                                filteredColumn.filterText(colFilter.getValue());
                                                filteredColumn.isFilterActive(colFilter.hasValue());
                                                break;
                                        }
                                    }
                                }
                                if (colFilter.type === 'boolean') {
                                    switch (filteredColumn.dataType) {
                                        case 'bool':
                                            filteredColumn.filterBoolSelectedValue(colFilter.getValue());
                                            filteredColumn.isFilterActive(colFilter.hasValue());
                                            break;
                                    }
                                }
                                if (colFilter.type === 'date') {
                                    switch (filteredColumn.dataType) {
                                        case 'date':
                                            filteredColumn.filterDateRangeFrom(colFilter.getStart());
                                            filteredColumn.filterDateRangeTo(colFilter.getEnd());
                                            filteredColumn.isFilterActive(colFilter.hasValue());
                                            break;
                                    }
                                }
                            }
                        });
                    }
                };
                ListViewModel.prototype.onRowClick = function (row, column) {
                    var _this = this;
                    sffw.assert(!!row);
                    sffw.assert(_.isFunction(row.$selected));
                    var promiseChain = Promise.resolve();
                    if (this.selectedRow === row) {
                        // click on selected row does nothing
                        if (this.onRowClickHandler) {
                            promiseChain = promiseChain.then(function () {
                                return _this.onRowClickHandler(_this, event, { columnName: column ? column.name : null });
                            });
                        }
                        return promiseChain;
                    }
                    if (this.selectedRow) {
                        this.selectedRow.$selected(false);
                    }
                    this.selectedRow = row;
                    row.$selected(true);
                    if (this.selectedRowReference) {
                        promiseChain = promiseChain.then(function () {
                            return _this.selectedRowReference.$fromJson(row.$plainObj);
                        });
                    }
                    if (this.selectionChangeHandler) {
                        promiseChain = promiseChain.then(function () {
                            return _this.selectionChangeHandler();
                        });
                    }
                    if (this.onRowClickHandler) {
                        promiseChain = promiseChain.then(function () {
                            return _this.onRowClickHandler(_this, event, { columnName: column ? column.name : null });
                        });
                    }
                    return promiseChain;
                };
                ListViewModel.prototype.clearSelection = function () {
                    var _this = this;
                    var promiseChain = Promise.resolve();
                    if (this.selectedRow) {
                        this.selectedRow.$selected(null);
                        this.selectedRow = null;
                        if (this.selectedRowReference) {
                            promiseChain = promiseChain.then(function () {
                                return _this.selectedRowReference.$emptyRecursive();
                            });
                        }
                        if (this.selectionChangeHandler) {
                            promiseChain = promiseChain.then(function () {
                                return _this.selectionChangeHandler();
                            });
                        }
                    }
                    return promiseChain;
                };
                // List controller holds current column visibility and order
                // that can be different than at design-time
                ListViewModel.prototype.setColumnsVisibilityAndOrder = function () {
                    var _this = this;
                    var orderedCols = this.ctrlCore.getVisibleColumns();
                    if (orderedCols && orderedCols.length > 0) {
                        var tmpVisibleCols_1 = [];
                        _.each(orderedCols, function (cName) {
                            var cModel = _.find(_this.columns, function (col) {
                                return col.name === cName;
                            });
                            if (cModel) {
                                tmpVisibleCols_1.push(cModel);
                            }
                        });
                        if (tmpVisibleCols_1.length > 0) {
                            this.visibleColumns(tmpVisibleCols_1);
                            var tmpHiddenCols = _.filter(this.columns, function (col) {
                                var vc = _.find(_this.visibleColumns(), function (visCol) {
                                    return col.name === visCol.name;
                                });
                                return vc === undefined;
                            });
                            this.hiddenColumns(tmpHiddenCols);
                        }
                    }
                };
                ListViewModel.prototype.dispose = function () {
                    _.each(this.subscriptions, function (sub) {
                        sub.dispose();
                    });
                    _(this.columns).each(function (column) {
                        column.dispose();
                    });
                };
                return ListViewModel;
            }());
            list.ListViewModel = ListViewModel;
        })(list = components.list || (components.list = {}));
    })(components = sffw.components || (sffw.components = {}));
})(sffw || (sffw = {}));
var sffw;
(function (sffw) {
    var components;
    (function (components) {
        var list;
        (function (list) {
            if (ko && !ko.components.isRegistered('sffw-list')) {
                ko.components.register('sffw-list', {
                    viewModel: {
                        createViewModel: function (params, componentInfo) { return new sffw.components.list.ListViewModel(params, componentInfo); }
                    },
                    synchronous: true,
                    template: "\n<div class=\"sffw-list\">\n    <table>\n        <thead>\n            <!-- captions -->\n            <tr data-bind=\"foreach: visibleColumns\">\n                <th data-bind=\"click: $parent.onColumnHeaderClick, style: { width: $data.width }, winsize: windowSize\" class=\"noselect\">\n                    <span data-bind=\"text: (isCaptionLocalized === true ? $root.$localize(caption) : caption)\"></span>\n                    <div class=\"sffw-list-ordering-glyph\">\n                        <span data-bind=\"visible: $parent.orderByColumnName() === name && !$parent.isDescending()\"><i class=\"fa fa-sort-alpha-asc\"></i></span>\n                        <span data-bind=\"visible: $parent.orderByColumnName() === name && $parent.isDescending()\"><i class=\"fa fa-sort-alpha-desc\"></i></span>\n                    </div>\n                </th>\n            </tr>\n            <!-- filter row -->\n            <tr data-bind=\"foreach: visibleColumns\">\n                <th data-bind=\"css: { 'enum-th' : dataType == 'date' }\">\n                <!-- ko if: filterEnabled -->\n                    <!-- ko if: dataType == 'bool' -->\n                        <select data-bind=\"options: boolOptions,\n                                value: filterBoolSelectedValue,\n                                optionsText: 'text',\n                                optionsValue: 'value',\n                                css: {'sffw-list-filter-active': isFilterActive}\" class=\"sffw-list-filter\">\n                        </select>\n                    <!-- /ko -->\n                    <!-- ko if: dataType == 'date' -->\n                        <input type=\"text\" style=\"width: 46%; display: inline-block; float: left;\" class=\"sffw-list-filter\" data-bind=\"filterDatePicker: filterDateRangeFrom,\n                            value: filterDisplayFrom,\n                            css: {'sffw-list-filter-active': isFilterActive},\n                            attr: { placeholder: $root.$localize('List$$fromPlaceholderLocalization') }\"/>\n                        <span style=\"display: inline-block; font-weight: bold; width: 8%; text-align: center;\">-</span>\n                        <input type=\"text\" style=\"width: 46%; display: inline-block; float: right;\" class=\"sffw-list-filter\" data-bind=\"filterDatePicker: filterDateRangeTo,\n                            value: filterDisplayTo,\n                            css: {'sffw-list-filter-active': isFilterActive},\n                            attr: { placeholder: $root.$localize('List$$toPlaceholderLocalization') }\"/>\n                    <!-- /ko -->\n                    <!-- ko if: hasEnumFilter() === true -->\n                        <input type=\"text\" data-bind=\"hasFocus: ddFilterFocus, attr:{ id: filterUniqueId },\n                            value: filterEnumSelectedOptionText,\n                            css: { 'sffw-list-filter-active' : isFilterActive, 'sffw-list-dd-filter-empty' : !isFilterActive() }\",\n                            tabindex=\"0\" class=\"sffw-list-filter sffw-list-dd-filter\" readonly />\n                        <div data-bind=\"hasFocus: ddFocus, visible: filterDropDownVisible, style: { left: filterDropDownLeft, 'max-height': filterDropDownHeight, 'min-width': filterDropDownMinWidth, overflow: ddOverflow }, attr: { id: ddFilterUniqueId }\" class=\"sffw-list-dd\">\n                        <!-- ko foreach: filterEnumOptions -->\n                            <label data-bind=\"filterOptionHasFocus: $data.hasFocus\">\n                                <div style=\"display: block; width: 100%; padding: 5px;\">\n                                    <input data-bind=\"checked: $parent.filterEnumSelectedValue, attr: { value: $data.value }\"\n                                        type=\"checkbox\" class=\"dd-check-input\" tabindex=\"0\" />\n                                    <span data-bind=\"text: ($data.isLocalized === true ? $root.$localize($data.text) : $data.text)\" style=\"margin-left: 10px; display: inline-block;\"></span>\n                                </div>\n                            </label>\n                        <!-- /ko -->\n                        </div>\n                    <!-- /ko -->\n                    <!-- ko ifnot: hasEnumFilter() === true -->\n                        <!-- ko if: dataType != 'bool' && dataType != 'date' && dataType != 'datetime' -->\n                            <input type=\"text\" class=\"sffw-list-filter\" data-bind=\"textInput: filterText, css: {'sffw-list-filter-active': isFilterActive}\"/>\n                        <!-- /ko -->\n                    <!-- /ko -->\n                <!-- /ko -->\n                </th>\n            </tr>\n        </thead>\n        <tbody data-bind=\"foreach: { data: records, as: 'record' }\">\n            <tr data-bind=\"click: function(data, event){ return $parent.onRowClick(record); }, css: $rowCss\">\n                <!-- ko foreach: { data: $parent.visibleColumns, as: 'column' } -->\n                    <td data-bind=\"text: record[column.name], click: function(data, event){ return $parents[1].onRowClick(record, column, event); }, clickBubble: false\"></td>\n                <!-- /ko -->\n            </tr>\n        </tbody>\n    </table>\n    <div class=\"sffw-list-paging\">\n        <span data-bind=\"text: $root.$localize('List$$page')\"></span>\n        <button class=\"sffw-list-paging-button\" data-bind=\"click: onPageMinClick, enable: pageBackEnabled\"><i class=\"fa fa-fast-backward\"></i></button>\n        <button class=\"sffw-list-paging-button\" data-bind=\"click: onPageBackClick, enable: pageBackEnabled\"><i class=\"fa fa-play fa-flip-horizontal\"></i></button>\n        <input type=\"number\" data-bind=\"value: page\" width=\"5\" class=\"sffw-list-paging-pageinput\">\n        <span class=\"sffw-list-paging-spin\" data-bind=\"visible: isLoading() && !error()\"><i class=\"fa fa-refresh fa-spin\"></i></span>\n        <span class=\"sffw-list-paging-spin\" data-bind=\"visible: !isLoading() && !error()\">/</span>\n        <span class=\"sffw-list-paging-spin sffw-list-paging-spin-error\" data-bind=\"visible: error\"><i class=\"fa fa-exclamation-triangle\"></i></span>\n        <span class=\"sffw-list-paging-pagemax\" data-bind=\"text: pagesCount\"></span>\n        <button class=\"sffw-list-paging-button\" data-bind=\"click: onPageRefreshClick\"><i class=\"fa fa-refresh\"></i></button>\n        <button class=\"sffw-list-paging-button\" data-bind=\"click: onPageForwardClick, enable: pageForwardEnabled\"><i class=\"fa fa-play\"></i></button>\n        <button class=\"sffw-list-paging-button\" data-bind=\"click: onPageMaxClick, enable: pageForwardEnabled\"><i class=\"fa fa-fast-forward\"></i></button>\n    </div>\n    <div class=\"sffw-list-error\" data-bind=\"visible: error, text: error\"></div>\n</div>"
                });
            }
        })(list = components.list || (components.list = {}));
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
    function formatAsAmountOrCurrency(strValue, formatAsAmount, formatAsCurrency) {
        var decimalSign = window.sf.localization.currentCulture().getDecimalSign();
        var thousandSign = window.sf.localization.currentCulture().getThousandSign();
        var places = 0; // pocet destinych pozic
        var symbol = '\u20AC'; // euro znak
        if (formatAsCurrency) {
            places = 2;
        }
        if (formatAsAmount) {
            places = 6;
        }
        var numValue = strValue.replace(decimalSign, '.');
        var decimalPart = numValue.split('.');
        var negative = numValue < 0 ? '-' : '';
        var i = parseInt(numValue = Math.abs(+numValue || 0).toFixed(places), 10) + '';
        var j = i.length > 3 ? (i.length) % 3 : 0;
        return negative + (j ? i.substr(0, j) + thousandSign : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + thousandSign) + (typeof decimalPart[1] !== 'undefined' ? (decimalSign + decimalPart[1]) : '') + (formatAsCurrency ? ' ' + symbol : '');
    }
    sffw.formatAsAmountOrCurrency = formatAsAmountOrCurrency;
})(sffw || (sffw = {}));
