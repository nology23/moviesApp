var sffw;
(function (sffw) {
    var api;
    (function (api) {
        var listCtrl;
        (function (listCtrl) {
            var SortColumn = /** @class */ (function () {
                function SortColumn(name, sortOrder) {
                    this.name = name;
                    this.sortOrder = sortOrder;
                    if (!sortOrder) {
                        this.sortOrder = 'asc';
                    }
                }
                SortColumn.prototype.toSortString = function () {
                    if (this.sortOrder) {
                        return this.name + ":" + this.sortOrder;
                    }
                    else {
                        return "" + this.name;
                    }
                };
                return SortColumn;
            }());
            listCtrl.SortColumn = SortColumn;
            var TextColumnFilter = /** @class */ (function () {
                function TextColumnFilter(name, value) {
                    this.type = 'text';
                    this.name = name;
                    this.value = value;
                }
                TextColumnFilter.prototype.setValue = function (value) {
                    this.value = value;
                };
                TextColumnFilter.prototype.getValue = function () {
                    return this.value;
                };
                TextColumnFilter.prototype.hasValue = function () {
                    return this.value != null && typeof this.value !== 'undefined' && this.value.length > 0;
                };
                TextColumnFilter.prototype.getStart = function () {
                    throw new Error('Method not implemented.');
                };
                TextColumnFilter.prototype.getEnd = function () {
                    throw new Error('Method not implemented.');
                };
                return TextColumnFilter;
            }());
            listCtrl.TextColumnFilter = TextColumnFilter;
            var BoolColumnFilter = /** @class */ (function () {
                function BoolColumnFilter(name, value) {
                    this.type = 'boolean';
                    this.name = name;
                    this.value = value;
                }
                BoolColumnFilter.prototype.setValue = function (value) {
                    this.value = value;
                };
                BoolColumnFilter.prototype.getValue = function () {
                    return this.value;
                };
                BoolColumnFilter.prototype.hasValue = function () {
                    return this.value != null && typeof this.value !== 'undefined';
                };
                BoolColumnFilter.prototype.getStart = function () {
                    throw new Error('Method not implemented.');
                };
                BoolColumnFilter.prototype.getEnd = function () {
                    throw new Error('Method not implemented.');
                };
                return BoolColumnFilter;
            }());
            listCtrl.BoolColumnFilter = BoolColumnFilter;
            var DateRangeColumnFilter = /** @class */ (function () {
                function DateRangeColumnFilter(name, dateStart, dateEnd) {
                    this.type = 'date';
                    this.name = name;
                    this.dateStart = dateStart;
                    this.dateEnd = dateEnd;
                }
                DateRangeColumnFilter.prototype.setValue = function (value) {
                    throw new Error('Method not implemented.');
                };
                DateRangeColumnFilter.prototype.getValue = function () {
                    throw new Error('Method not implemented.');
                };
                DateRangeColumnFilter.prototype.setRange = function (dateStart, dateEnd) {
                    this.dateStart = (_.isUndefined(dateStart) || dateStart === null) ? null : dateStart;
                    this.dateEnd = (_.isUndefined(dateEnd) || dateEnd === null) ? null : dateEnd;
                };
                DateRangeColumnFilter.prototype.setStart = function (dateStart) {
                    this.dateStart = (_.isUndefined(dateStart) || dateStart === null) ? null : dateStart;
                };
                DateRangeColumnFilter.prototype.setEnd = function (dateEnd) {
                    this.dateEnd = (_.isUndefined(dateEnd) || dateEnd === null) ? null : dateEnd;
                };
                DateRangeColumnFilter.prototype.getStart = function () {
                    return this.dateStart;
                };
                DateRangeColumnFilter.prototype.getEnd = function () {
                    return this.dateEnd;
                };
                DateRangeColumnFilter.prototype.hasValue = function () {
                    return (this.dateStart != null && typeof this.dateStart !== 'undefined') || (this.dateEnd != null && typeof this.dateEnd !== 'undefined');
                };
                return DateRangeColumnFilter;
            }());
            listCtrl.DateRangeColumnFilter = DateRangeColumnFilter;
        })(listCtrl = api.listCtrl || (api.listCtrl = {}));
    })(api = sffw.api || (sffw.api = {}));
})(sffw || (sffw = {}));
var sffw;
(function (sffw) {
    var api;
    (function (api) {
        var listCtrl;
        (function (listCtrl) {
            var ListCtrlApi = /** @class */ (function () {
                function ListCtrlApi(datacontext, args) {
                    this.listCtrlCore = new listCtrl.ListCtrlCore(datacontext, args);
                    this.ctrlCore.onDataRowsChangedCallback = sffw.extractEventHandlerFromApiArgs(datacontext, args, 'OnDataRowsChanged');
                }
                ListCtrlApi.prototype.setReady = function (args) {
                    this.listCtrlCore.setReady(args.isReady);
                };
                Object.defineProperty(ListCtrlApi.prototype, "ctrlCore", {
                    get: function () {
                        return this.listCtrlCore;
                    },
                    enumerable: true,
                    configurable: true
                });
                ListCtrlApi.prototype.setSorting = function (args) {
                    this.listCtrlCore.setSorting(args.columnAndOrder);
                };
                ListCtrlApi.prototype.clearSorting = function () {
                    this.listCtrlCore.clearSorting();
                };
                ListCtrlApi.prototype.getSorting = function () {
                    return this.listCtrlCore.getSorting();
                };
                ListCtrlApi.prototype.clearVisibleFilters = function () {
                    this.listCtrlCore.clearVisibleFilters();
                };
                ListCtrlApi.prototype.setTextFilter = function (args) {
                    this.listCtrlCore.setTextFilter(args.column, args.filterText);
                };
                ListCtrlApi.prototype.getTextFilter = function (args) {
                    return this.listCtrlCore.getTextFilter(args.column);
                };
                ListCtrlApi.prototype.setBooleanFilter = function (args) {
                    this.listCtrlCore.setBooleanFilter(args.column, args.value);
                };
                ListCtrlApi.prototype.getBooleanFilter = function (args) {
                    return this.listCtrlCore.getBooleanFilter(args.column);
                };
                ListCtrlApi.prototype.setDateRangeFilter = function (args) {
                    this.listCtrlCore.setDateRangeFilter(args.column, args.startDate, args.endDate);
                };
                ListCtrlApi.prototype.getDateFilterStart = function (args) {
                    return this.listCtrlCore.getDateFilterStart(args.column);
                };
                ListCtrlApi.prototype.getDateFilterEnd = function (args) {
                    return this.listCtrlCore.getDateFilterEnd(args.column);
                };
                ListCtrlApi.prototype.setInvisibleODataFilter = function (args) {
                    this.ctrlCore.setInvisibleODataFilter(args.filter);
                };
                ListCtrlApi.prototype.getInvisibleODataFilter = function () {
                    return this.getInvisibleODataFilter();
                };
                ListCtrlApi.prototype.setActivePage = function (args) {
                    this.listCtrlCore.setActivePage(args.pageNumber);
                };
                ListCtrlApi.prototype.getActivePage = function () {
                    return this.listCtrlCore.getActivePage();
                };
                ListCtrlApi.prototype.setPageSize = function (args) {
                    this.listCtrlCore.setPageSize(args.pageSize);
                };
                ListCtrlApi.prototype.getPageSize = function () {
                    return this.listCtrlCore.getPageSize();
                };
                ListCtrlApi.prototype.getRowCount = function () {
                    return this.listCtrlCore.getRowCount();
                };
                ListCtrlApi.prototype.focusFirstRecord = function () {
                    this.listCtrlCore.focusFirstRecord();
                };
                ListCtrlApi.prototype.saveState = function (args) {
                    return this.listCtrlCore.saveState(args.options);
                };
                ListCtrlApi.prototype.loadState = function (args) {
                    this.listCtrlCore.loadState(args.json);
                };
                ListCtrlApi.prototype.setVisibleColumns = function (args) {
                    this.listCtrlCore.setVisibleColumns(JSON.parse(args.json));
                };
                ListCtrlApi.prototype.getVisibleColumns = function () {
                    return JSON.stringify(this.listCtrlCore.getVisibleColumns());
                };
                ListCtrlApi.prototype.resetColumns = function () {
                    this.listCtrlCore.resetColumns();
                };
                ListCtrlApi.prototype.setColumnVisibility = function (args) {
                    this.ctrlCore.setColumnVisibility(args.columnName, args.isVisible, args.order);
                };
                ListCtrlApi.prototype.getColumnVisibility = function (args) {
                    return this.ctrlCore.getColumnVisibility(args.columnName);
                };
                ListCtrlApi.prototype.clearState = function () {
                    this.listCtrlCore.clearState();
                };
                ListCtrlApi.prototype.dispose = function () {
                    this.listCtrlCore.dispose();
                    this.listCtrlCore = null;
                };
                return ListCtrlApi;
            }());
            listCtrl.ListCtrlApi = ListCtrlApi;
        })(listCtrl = api.listCtrl || (api.listCtrl = {}));
    })(api = sffw.api || (sffw.api = {}));
})(sffw || (sffw = {}));
if (typeof define !== 'undefined') {
    define([], function () {
        return sffw.api.listCtrl.ListCtrlApi;
    });
}
var sffw;
(function (sffw) {
    var api;
    (function (api) {
        var listCtrl;
        (function (listCtrl) {
            'use strict';
            var ListPageData = /** @class */ (function () {
                function ListPageData(dataArr, count) {
                    this.count = count;
                    this.records = dataArr;
                }
                return ListPageData;
            }());
            listCtrl.ListPageData = ListPageData;
        })(listCtrl = api.listCtrl || (api.listCtrl = {}));
    })(api = sffw.api || (sffw.api = {}));
})(sffw || (sffw = {}));
// tslint:disable-next-line:no-reference
/// <reference path="./ListDataPage.ts" />
var sffw;
(function (sffw) {
    var api;
    (function (api) {
        var listCtrl;
        (function (listCtrl) {
            'use strict';
            // export let pageSize = 20;
            var ListDataProvider = /** @class */ (function () {
                function ListDataProvider(server) {
                    this.server = server;
                }
                // page number starting index is 1
                ListDataProvider.prototype.loadData = function (listName, columns, pageSize, activePage, sortColumn, columnFilters, oDataFilter) {
                    var _this = this;
                    return new Promise(function (resolve, reject) {
                        var baseUrl = (_this.server.listsUrl || '') + listName;
                        var oDataParams = [];
                        var oDataQueryFilter = [];
                        // columns
                        oDataParams.push('$select=' + _.map(columns, 'Name').join(','));
                        // paging
                        oDataParams.push("$top=" + pageSize);
                        if (activePage > 1) {
                            oDataParams.push('$skip=' + (pageSize * (activePage - 1)));
                        }
                        oDataParams.push('$inlinecount=allpages');
                        // sorting
                        if (sortColumn) {
                            var orderByParam = '$orderby=' + sortColumn.name;
                            if (sortColumn.sortOrder) {
                                orderByParam += " " + sortColumn.sortOrder;
                            }
                            oDataParams.push(orderByParam);
                        }
                        // filtering
                        _.each(columnFilters, function (colFilter) {
                            var column = _.find(columns, function (colDef) {
                                return colDef.Name === colFilter.name;
                            });
                            if (column) {
                                if (colFilter instanceof listCtrl.TextColumnFilter) {
                                    var filterVal = colFilter.getValue();
                                    if (filterVal) {
                                        var filterArray_1 = [];
                                        _.forEach(colFilter.getValue().split(','), function (value) {
                                            switch (column.DataType) {
                                                case 'string':
                                                    var uriEncodedValue = sffw.replaceUriParamSpecialChars(value);
                                                    switch (column.FilterOperatorType) {
                                                        case 'eq':
                                                            filterArray_1.push("(" + colFilter.name + " eq '" + uriEncodedValue + "')");
                                                            break;
                                                        case 'substring':
                                                            filterArray_1.push("contains(" + colFilter.name + ", '" + uriEncodedValue + "')");
                                                            break;
                                                        default:
                                                            filterArray_1.push("startswith(" + colFilter.name + ", '" + uriEncodedValue + "')");
                                                            break;
                                                    }
                                                    break;
                                                case 'integer':
                                                    var intValue = +value;
                                                    if (!isNaN(intValue)) {
                                                        filterArray_1.push("(" + colFilter.name + " eq " + intValue + ")");
                                                    }
                                                    else {
                                                        console.log("ignoring invalid " + column.DataType + " filter value(" + value + ") on column " + colFilter.name);
                                                    }
                                                    break;
                                                case 'decimal':
                                                    var decValue = +value;
                                                    if (!isNaN(decValue)) {
                                                        // 'm' as suffix means OData decimal; if it should be double, it would be 'd'
                                                        filterArray_1.push("(" + colFilter.name + " eq " + decValue + "m)");
                                                    }
                                                    else {
                                                        console.log("ignoring invalid " + column.DataType + " filter value(" + value + ") on column " + colFilter.name);
                                                    }
                                                    break;
                                                default:
                                                    console.log("ignoring text filter value on column " + colFilter.name + "(" + column.DataType + ")");
                                                    break;
                                            }
                                        });
                                        if (filterArray_1.length > 0) {
                                            oDataQueryFilter.push("( " + filterArray_1.join(' or ') + " )");
                                        }
                                    }
                                }
                                else if (colFilter instanceof listCtrl.BoolColumnFilter) {
                                    if (colFilter.getValue() != null) {
                                        oDataQueryFilter.push("(" + colFilter.name + " eq " + colFilter.getValue() + ")");
                                    }
                                }
                                else if (colFilter instanceof listCtrl.DateRangeColumnFilter) {
                                    if (colFilter.getStart()) {
                                        var from = moment(colFilter.getStart()).format('YYYY-MM-DD') + 'T00:00:00';
                                        oDataQueryFilter.push("(" + colFilter.name + " ge datetime'" + from + "')");
                                    }
                                    if (colFilter.getEnd()) {
                                        var to = moment(colFilter.getEnd()).format('YYYY-MM-DD') + 'T23:59:59';
                                        oDataQueryFilter.push("(" + colFilter.name + " le datetime'" + to + "')");
                                    }
                                }
                                else {
                                    console.log("ignoring nonimplemented type of filter on column " + colFilter.name);
                                }
                            }
                            else {
                                console.log("ignoring filter on unknown column " + colFilter.name);
                            }
                        });
                        if (oDataFilter) {
                            if (typeof (oDataFilter) === 'string') {
                                oDataQueryFilter.push("(" + oDataFilter + ")");
                            }
                            else if (_.isFunction(oDataFilter)) {
                                if (oDataFilter != null && oDataFilter !== '') {
                                    oDataQueryFilter.push(oDataFilter);
                                }
                            }
                            else {
                                console.error("Ignoring additionalFilter when loading decllist " + listName + " as its type was not recognized");
                            }
                        }
                        if (oDataQueryFilter.length > 0) {
                            oDataParams.push('$filter=' + oDataQueryFilter.join(' and '));
                        }
                        _this.server.sendRequest(baseUrl + '?' + oDataParams.join('&'))
                            .then(function (response) {
                            if (response.isError()) {
                                return reject(response.getErrorMessage());
                            }
                            else {
                                var result = JSON.parse(response.getJsonString());
                                var countStr = result['odata.count'];
                                if (!_.isUndefined(countStr)) {
                                    var count = Number(countStr);
                                    if (_.isArray(result.value) && _.isFinite(count)) {
                                        return resolve(new listCtrl.ListPageData(result.value, count));
                                    }
                                }
                                return reject('Failed to load List ' + listName);
                            }
                        }).catch(reject);
                    });
                };
                return ListDataProvider;
            }());
            listCtrl.ListDataProvider = ListDataProvider;
        })(listCtrl = api.listCtrl || (api.listCtrl = {}));
    })(api = sffw.api || (sffw.api = {}));
})(sffw || (sffw = {}));
// tslint:disable-next-line:no-reference
/// <reference path="./ColumnState.ts" />
// tslint:disable-next-line:no-reference
/// <reference path="./ListDataProvider.ts" />
var sffw;
(function (sffw) {
    var api;
    (function (api) {
        var listCtrl;
        (function (listCtrl) {
            var DataColumn = /** @class */ (function () {
                function DataColumn(Name, Caption, IsCaptionLocalized, DataType, FilterOperatorType, IsVisible) {
                    this.Name = Name;
                    this.Caption = Caption;
                    this.IsCaptionLocalized = IsCaptionLocalized;
                    this.DataType = DataType;
                    this.FilterOperatorType = FilterOperatorType;
                    this.IsVisible = IsVisible;
                }
                return DataColumn;
            }());
            listCtrl.DataColumn = DataColumn;
            var ListCtrlCore = /** @class */ (function () {
                function ListCtrlCore(dc, args) {
                    var _this = this;
                    this.columns = null;
                    this.originalColumns = null;
                    this.subscriptions = [];
                    this.isInitialized = false;
                    this.sortColumn = ko.observable();
                    this.columnFilters = ko.observableArray();
                    this.isReady = ko.observable(false);
                    this.oDataFilter = ko.observable();
                    this.activePage = ko.observable(1);
                    this.rows = ko.observableArray();
                    this.isLoading = ko.observable(false);
                    this.error = ko.observable(null);
                    this.pageSize = ko.observable(20);
                    this.rowCount = ko.observable(0);
                    this.focusedRecordIndex = ko.observable();
                    this.isViewSettingsComponentAvailable = ko.observable(false);
                    this.isViewSettingsComponentEnabled = ko.observable(false);
                    this.dataContext = dc;
                    if (args.server) {
                        if (args.server.IsGlobal) {
                            this.server = dc.$globals.$api[args.server.Reference];
                        }
                        else {
                            this.server = dc.$api[args.server.Reference];
                        }
                    }
                    else {
                        console.error('\"server\" param not provided to ListCtrl');
                    }
                    if (!this.server) {
                        throw new Error('Failed to find ServerConnection');
                    }
                    if (args.dataProvider) {
                        if (args.dataProvider.IsGlobal) {
                            this.dataProvider = dc.$globals.$api[args.dataProvider.Reference];
                        }
                        else {
                            this.dataProvider = dc.$api[args.dataProvider.Reference];
                        }
                    }
                    if (!this.dataProvider) {
                        this.dataProvider = new listCtrl.ListDataProvider(this.server);
                    }
                    this.subscriptions.push(this.isReady.subscribe(function () {
                        if (!_this.activePage()) {
                            _this.activePage(1);
                        }
                        else {
                            _this.loadData();
                        }
                    }));
                    this.subscriptions.push(this.sortColumn.subscribe(function () {
                        _this.loadData();
                    }));
                    this.subscriptions.push(this.columnFilters.subscribe(function () {
                        _this.loadData();
                    }));
                    this.subscriptions.push(this.oDataFilter.subscribe(function () {
                        _this.loadData();
                    }));
                    this.subscriptions.push(this.activePage.subscribe(function () {
                        _this.loadData();
                    }));
                    this.subscriptions.push(this.pageSize.subscribe(function () {
                        _this.loadData();
                    }));
                    this.subscriptions.push(window.sf.localization.currentCultureCode.subscribe(function (newItem) {
                        _this.loadData();
                    }));
                    this.rows.extend({ rateLimit: { timeout: 500, method: 'notifyWhenChangesStop' } });
                    this.subscriptions.push(this.rows.subscribe(this.onDataRowsChanged, this, 'arrayChange'));
                }
                ListCtrlCore.prototype.getSortingColumn = function () {
                    if (this.sortColumn()) {
                        return this.sortColumn().name;
                    }
                    return null;
                };
                ListCtrlCore.prototype.getSortingOrder = function () {
                    if (this.sortColumn() && this.sortColumn().sortOrder) {
                        return this.sortColumn().sortOrder;
                    }
                    return null;
                };
                ListCtrlCore.prototype.initColumns = function (columns) {
                    var _this = this;
                    if (!this.isInitialized) {
                        this.columns = [];
                        _(columns).each(function (c) {
                            var dCol = new DataColumn(c.Name, c.Caption, c.IsCaptionLocalized, c.DataType || 'string', c.FilterOperatorType || 'startswith', c.IsVisible !== false);
                            _this.columns.push(dCol);
                        });
                        this.originalColumns = _.cloneDeep(this.columns);
                        this.isInitialized = true;
                    }
                };
                ListCtrlCore.prototype.changeSortColumnOrDirection = function (column) {
                    var newSortCol = new listCtrl.SortColumn(column);
                    if (this.sortColumn() && this.sortColumn().name === column) {
                        if (this.sortColumn().sortOrder) {
                            if (this.sortColumn().sortOrder === 'asc') {
                                newSortCol.sortOrder = 'desc';
                            }
                            else {
                                newSortCol.sortOrder = 'asc';
                            }
                        }
                        else {
                            newSortCol.sortOrder = 'desc';
                        }
                    }
                    this.sortColumn(newSortCol);
                };
                ListCtrlCore.prototype.isFilterActive = function (column) {
                    var colFilter = _.find(this.columnFilters(), function (filter) {
                        return filter.name === column;
                    });
                    return colFilter && colFilter.hasValue();
                };
                ListCtrlCore.prototype.loadData = function () {
                    var _this = this;
                    if (!this.isInitialized) {
                        return;
                    }
                    if (!this.isReady()) {
                        return;
                    }
                    if (this.isLoading()) {
                        return;
                    }
                    this.isLoading(true);
                    this.error(null);
                    this.dataProvider.loadData(this.listName, this.columns, this.pageSize(), this.activePage(), this.sortColumn(), this.columnFilters(), this.oDataFilter())
                        .then(function (dataPage) {
                        _this.rowCount(dataPage.count);
                        _this.rows.removeAll();
                        _.each(dataPage.records, function (r) {
                            _this.rows.push(r);
                        });
                        // skip na stránku 1 pokud při nastavení page nebo filtrů se dostaneme mimo rozsah
                        if (_this.rows().length === 0 && _this.activePage() > 1) {
                            _this.activePage(1);
                            _this.dataProvider.loadData(_this.listName, _this.columns, _this.pageSize(), _this.activePage(), _this.sortColumn(), _this.columnFilters(), _this.oDataFilter())
                                .then(function (dataPage1) {
                                _this.rowCount(dataPage1.count);
                                _.each(dataPage1.records, function (r) {
                                    _this.rows.push(r);
                                });
                            });
                        }
                        _this.isLoading(false);
                    })
                        .catch(function (req) {
                        var errorText = _this.dataContext.$localize('ListCtrl$$loadingDataError') || 'Loading data error';
                        var oDataError;
                        try {
                            var respObj = JSON.parse(req.responseText);
                            oDataError = respObj['odata.error'];
                        }
                        catch (ignored) {
                            // ignored
                        }
                        if (oDataError && oDataError.message && oDataError.message.value) {
                            errorText += ': ' + oDataError.message.value;
                        }
                        _this.error(errorText);
                        _this.isLoading(false);
                    });
                };
                ListCtrlCore.prototype.clearStateObservables = function () {
                    this.sortColumn(null);
                    this.columnFilters.removeAll();
                    this.oDataFilter(null);
                    this.activePage(1);
                    this.focusedRecordIndex = ko.observable();
                    if (this.onClearState != null) {
                        this.onClearState();
                    }
                };
                ListCtrlCore.prototype.onDataRowsChanged = function () {
                    if (this.onDataRowsChangedCallback && _.isFunction(this.onDataRowsChangedCallback)) {
                        this.onDataRowsChangedCallback();
                    }
                };
                //#region public methods for ListCtrlApi wrapper methods
                ListCtrlCore.prototype.setReady = function (isReady) {
                    this.isReady(!!isReady);
                };
                ListCtrlCore.prototype.setSorting = function (columnAndOrder) {
                    if (columnAndOrder) {
                        var sortParams = columnAndOrder.split(':');
                        var sortOrder = null;
                        if (sortParams.length > 1) {
                            switch (sortParams[1]) {
                                case 'asc':
                                    sortOrder = 'asc';
                                    break;
                                case 'desc':
                                    sortOrder = 'desc';
                                    break;
                                default:
                                    break;
                            }
                        }
                        if (sortOrder) {
                            this.sortColumn(new listCtrl.SortColumn(sortParams[0], sortOrder));
                        }
                        else {
                            this.sortColumn(new listCtrl.SortColumn(sortParams[0]));
                        }
                    }
                };
                ListCtrlCore.prototype.clearSorting = function () {
                    this.sortColumn(null);
                };
                ListCtrlCore.prototype.getSorting = function () {
                    if (this.sortColumn()) {
                        return this.sortColumn().toSortString();
                    }
                    return null;
                };
                ListCtrlCore.prototype.clearVisibleFilters = function () {
                    this.columnFilters.removeAll();
                };
                ListCtrlCore.prototype.setTextFilter = function (column, filterText) {
                    var existing = _.find(this.columnFilters(), function (item) { return item.name === column; });
                    if (existing) {
                        if (filterText && filterText.length > 0) {
                            existing.setValue(filterText);
                            this.columnFilters.valueHasMutated();
                        }
                        else {
                            this.columnFilters.remove(existing);
                        }
                    }
                    else if (filterText && filterText.length > 0) {
                        this.columnFilters.push(new listCtrl.TextColumnFilter(column, filterText));
                    }
                };
                ListCtrlCore.prototype.getTextFilter = function (column) {
                    var existing = _.find(this.columnFilters(), function (item) { return item.name === column; });
                    if (existing) {
                        return existing.getValue();
                    }
                    return null;
                };
                ListCtrlCore.prototype.setBooleanFilter = function (column, value) {
                    var existing = _.find(this.columnFilters(), function (item) { return item.name === column; });
                    if (existing) {
                        if (value === true || value === false) {
                            existing.setValue(value);
                            this.columnFilters.valueHasMutated();
                        }
                        else {
                            this.columnFilters.remove(existing);
                        }
                    }
                    else if (value === true || value === false) {
                        this.columnFilters.push(new listCtrl.BoolColumnFilter(column, value));
                    }
                };
                ListCtrlCore.prototype.getBooleanFilter = function (column) {
                    var existing = _.find(this.columnFilters(), function (item) { return item.name === column; });
                    if (existing) {
                        return existing.getValue();
                    }
                    return null;
                };
                ListCtrlCore.prototype.setDateRangeFilter = function (column, startDate, endDate) {
                    var existing = _.find(this.columnFilters(), function (item) { return item.name === column; });
                    if (existing) {
                        if (_.isDate(startDate) || _.isDate(endDate)) {
                            if (existing instanceof listCtrl.DateRangeColumnFilter) {
                                existing.setRange(startDate, endDate);
                                this.columnFilters.valueHasMutated();
                            }
                            else {
                                // toto by nemelo nastat
                                this.columnFilters.remove(existing);
                                this.columnFilters.push(new listCtrl.DateRangeColumnFilter(column, startDate, endDate));
                            }
                        }
                        else {
                            this.columnFilters.remove(existing);
                        }
                    }
                    else if (_.isDate(startDate) || _.isDate(endDate)) {
                        this.columnFilters.push(new listCtrl.DateRangeColumnFilter(column, startDate, endDate));
                    }
                };
                ListCtrlCore.prototype.setDateRangeFilterStart = function (column, startDate) {
                    var existing = _.find(this.columnFilters(), function (item) { return item.name === column; });
                    if (existing) {
                        if (_.isDate(startDate) || _.isDate(existing.getEnd())) {
                            if (existing instanceof listCtrl.DateRangeColumnFilter) {
                                existing.setStart(startDate);
                                this.columnFilters.valueHasMutated();
                            }
                            else {
                                this.columnFilters.remove(existing);
                                this.columnFilters.push(new listCtrl.DateRangeColumnFilter(column, startDate, null));
                            }
                        }
                        else {
                            this.columnFilters.remove(existing);
                        }
                    }
                    else if (_.isDate(startDate)) {
                        this.columnFilters.push(new listCtrl.DateRangeColumnFilter(column, startDate, null));
                    }
                };
                ListCtrlCore.prototype.setDateRangeFilterEnd = function (column, endDate) {
                    var existing = _.find(this.columnFilters(), function (item) { return item.name === column; });
                    if (existing) {
                        if (_.isDate(endDate) || _.isDate(existing.getStart())) {
                            if (existing instanceof listCtrl.DateRangeColumnFilter) {
                                existing.setEnd(endDate);
                                this.columnFilters.valueHasMutated();
                            }
                            else {
                                this.columnFilters.remove(existing);
                                this.columnFilters.push(new listCtrl.DateRangeColumnFilter(column, null, endDate));
                            }
                        }
                        else {
                            this.columnFilters.remove(existing);
                        }
                    }
                    else if (_.isDate(endDate)) {
                        this.columnFilters.push(new listCtrl.DateRangeColumnFilter(column, null, endDate));
                    }
                };
                ListCtrlCore.prototype.getDateFilterStart = function (column) {
                    var existing = _.find(this.columnFilters(), function (item) { return item.name === column; });
                    if (existing && existing instanceof listCtrl.DateRangeColumnFilter) {
                        return existing.getStart();
                    }
                    return null;
                };
                ListCtrlCore.prototype.getDateFilterEnd = function (column) {
                    var existing = _.find(this.columnFilters(), function (item) { return item.name === column; });
                    if (existing && existing instanceof listCtrl.DateRangeColumnFilter) {
                        return existing.getEnd();
                    }
                    return null;
                };
                ListCtrlCore.prototype.setInvisibleODataFilter = function (filter) {
                    if (filter) {
                        this.oDataFilter(filter);
                    }
                };
                ListCtrlCore.prototype.getInvisibleODataFilter = function () {
                    if (this.oDataFilter()) {
                        return this.oDataFilter();
                    }
                    return null;
                };
                ListCtrlCore.prototype.setActivePage = function (pageNumber) {
                    if (pageNumber) {
                        this.activePage(pageNumber);
                    }
                };
                ListCtrlCore.prototype.getActivePage = function () {
                    if (_.isNumber(this.activePage())) {
                        return this.activePage();
                    }
                    return null;
                };
                ListCtrlCore.prototype.setPageSize = function (pageSize) {
                    if (pageSize) {
                        this.pageSize(pageSize);
                    }
                };
                ListCtrlCore.prototype.getPageSize = function () {
                    if (_.isNumber(this.pageSize())) {
                        return this.pageSize();
                    }
                    return null;
                };
                ListCtrlCore.prototype.getRowCount = function () {
                    if (_.isNumber(this.rowCount())) {
                        return this.rowCount();
                    }
                    return null;
                };
                ListCtrlCore.prototype.focusFirstRecord = function () {
                    this.focusedRecordIndex(0);
                };
                ListCtrlCore.prototype.loadState = function (json) {
                    var _this = this;
                    var oldIsReady = this.isReady() === true ? true : false;
                    if (oldIsReady) {
                        this.isReady(false);
                    }
                    this.clearStateObservables();
                    if (json && json.length > 0) {
                        var objState = JSON.parse(json);
                        if (objState.sorting) {
                            this.sortColumn(new listCtrl.SortColumn(objState.sorting.name, objState.sorting.sortOrder));
                        }
                        if (objState.visibleFilter) {
                            _.each(objState.visibleFilter, function (filterCol) {
                                switch (filterCol.type) {
                                    case 'text':
                                        _this.columnFilters.push(new listCtrl.TextColumnFilter(filterCol.name, filterCol.value));
                                        break;
                                    case 'boolean':
                                        _this.columnFilters.push(new listCtrl.BoolColumnFilter(filterCol.name, filterCol.value === 'true' ? true : false));
                                        break;
                                    case 'date':
                                        var start = null;
                                        var end = null;
                                        var m = null;
                                        if (filterCol.dateStart) {
                                            m = moment(filterCol.dateStart);
                                            if (m.isValid()) {
                                                start = m.toDate();
                                            }
                                        }
                                        if (filterCol.dateEnd) {
                                            m = moment(filterCol.dateEnd);
                                            if (m.isValid()) {
                                                end = m.toDate();
                                            }
                                        }
                                        _this.columnFilters.push(new listCtrl.DateRangeColumnFilter(filterCol.name, start, end));
                                        break;
                                }
                            });
                        }
                        if (objState.invisibleFilter) {
                            this.oDataFilter(objState.invisibleFilter);
                        }
                        var paging = objState.paging;
                        if (paging) {
                            if (_.isNumber(paging.activePage)) {
                                this.activePage(paging.activePage);
                            }
                            if (_.isNumber(paging.pageSize)) {
                                this.pageSize(paging.pageSize);
                            }
                        }
                    }
                    if (oldIsReady) {
                        this.isReady(true);
                    }
                };
                ListCtrlCore.prototype.saveState = function (options) {
                    var _this = this;
                    var objState = {};
                    if (options) {
                        var optArr = options.split(',');
                        _.each(optArr, function (o) {
                            switch (o) {
                                case 'sorting':
                                    Object.defineProperty(objState, o, { value: _this.sortColumn() });
                                    break;
                                case 'visibleFilter':
                                    Object.defineProperty(objState, o, { value: _this.columnFilters() });
                                    break;
                                case 'invisibleFilter':
                                    Object.defineProperty(objState, o, { value: _this.oDataFilter() });
                                    break;
                                case 'paging':
                                    var paging = objState.paging = {};
                                    Object.defineProperty(paging, 'activePage', { value: _this.activePage() });
                                    Object.defineProperty(paging, 'pageSize', { value: _this.pageSize() });
                                    break;
                            }
                        });
                    }
                    else {
                        objState = { sorting: this.sortColumn(), visibleFilter: this.columnFilters(), invisibleFilter: this.oDataFilter(), paging: { activePage: this.activePage(), pageSize: this.pageSize() } };
                    }
                    // JSON serializes dates as UTC
                    return JSON.stringify(objState);
                };
                ListCtrlCore.prototype.clearState = function () {
                    var oldIsReady = this.isReady() === true ? true : false;
                    if (oldIsReady) {
                        this.isReady(false);
                    }
                    this.clearStateObservables();
                    if (oldIsReady) {
                        this.isReady(true);
                    }
                };
                ListCtrlCore.prototype.setVisibleColumns = function (columnName) {
                    var _this = this;
                    var oldIsReady = this.isReady() === true ? true : false;
                    if (oldIsReady) {
                        this.isReady(false);
                    }
                    // columnName contains ordered visible column names
                    // all other columns will be hidden
                    _.each(this.columns, function (item) {
                        item.IsVisible = false;
                    });
                    // temp array of IDataColumn-s in required order
                    var visibleColumns = [];
                    _.each(columnName, function (cName, cIndex) {
                        var item = _.find(_this.columns, function (col) {
                            return col.Name === cName;
                        });
                        if (item) {
                            item.IsVisible = true;
                            var currentPos = _this.columns.indexOf(item);
                            // remove columns from this.columns and push to visibleColumns
                            _this.columns.splice(currentPos, 1);
                            visibleColumns.push(item);
                        }
                    });
                    // first ordered visible columns and then hidden columns
                    this.columns = visibleColumns.concat(this.columns);
                    if (oldIsReady) {
                        this.isReady(true);
                    }
                };
                ListCtrlCore.prototype.getVisibleColumns = function () {
                    var result = [];
                    _.each(this.columns, function (item) {
                        if (item.IsVisible) {
                            result.push(item.Name);
                        }
                    });
                    return result;
                };
                ListCtrlCore.prototype.resetColumns = function () {
                    var oldIsReady = this.isReady() === true ? true : false;
                    if (oldIsReady) {
                        this.isReady(false);
                    }
                    this.columns = _.cloneDeep(this.originalColumns);
                    if (oldIsReady) {
                        this.isReady(true);
                    }
                };
                ListCtrlCore.prototype.setColumnVisibility = function (columnName, isVisible, order) {
                    var oldIsReady = this.isReady() === true ? true : false;
                    if (oldIsReady) {
                        this.isReady(false);
                    }
                    var item = _.find(this.columns, function (col) {
                        return col.Name === columnName;
                    });
                    if (item) {
                        item.IsVisible = !!isVisible;
                        var visibleColumns = _.filter(this.columns, function (col) {
                            return col.IsVisible === true;
                        });
                        var hiddenColumns = _.filter(this.columns, function (col) {
                            return col.IsVisible === false;
                        });
                        if (item.IsVisible) {
                            if (_.isNumber(order) && order > 0 && visibleColumns.length >= order - 1) {
                                // if possible, move IDataColumn to required position
                                var currentPos = visibleColumns.indexOf(item);
                                visibleColumns.splice(currentPos, 1);
                                visibleColumns.splice(order - 1, 0, item);
                            }
                        }
                        // first ordered visible columns and then hidden columns
                        this.columns = visibleColumns.concat(hiddenColumns);
                    }
                    if (oldIsReady) {
                        this.isReady(true);
                    }
                };
                ListCtrlCore.prototype.getColumnVisibility = function (columnName) {
                    var item = _.find(this.columns, function (col) {
                        return col.Name === columnName;
                    });
                    if (item) {
                        return item.IsVisible;
                    }
                    return false;
                };
                ListCtrlCore.prototype.setViewSettingsComponentAvailable = function (isViewSettingsComponentAvailable) {
                    this.isViewSettingsComponentAvailable(!!isViewSettingsComponentAvailable);
                };
                ListCtrlCore.prototype.setViewSettingsComponentEnabled = function (isViewSettingsComponentEnabled) {
                    this.isViewSettingsComponentEnabled(!!isViewSettingsComponentEnabled);
                };
                // #endregion
                ListCtrlCore.prototype.getVisibleColumnsCore = function () {
                    var result = _.filter(this.columns, function (col) {
                        return col.IsVisible;
                    });
                    return result;
                };
                ListCtrlCore.prototype.getHiddenColumnsCore = function () {
                    var result = _.filter(this.columns, function (col) {
                        return !col.IsVisible;
                    });
                    return result;
                };
                ListCtrlCore.prototype.dispose = function () {
                    _.each(this.subscriptions, function (sub) {
                        sub.dispose();
                    });
                };
                return ListCtrlCore;
            }());
            listCtrl.ListCtrlCore = ListCtrlCore;
        })(listCtrl = api.listCtrl || (api.listCtrl = {}));
    })(api = sffw.api || (sffw.api = {}));
})(sffw || (sffw = {}));
var sffw;
(function (sffw) {
    function replaceUriParamSpecialChars(strValue) {
        var replacedValue = encodeURIComponent(strValue.replace(/'/g, "''")
            .replace(/"+"/g, '%2B')
            .replace(/\//g, '%2F')
            .replace(/"?"/g, '%3F')
            .replace(/%/g, '%25')
            .replace(/#/g, '%23')
            .replace(/&/g, '%26'));
        return replacedValue;
    }
    sffw.replaceUriParamSpecialChars = replaceUriParamSpecialChars;
})(sffw || (sffw = {}));
var sffw;
(function (sffw) {
    function extractEventHandlerFromApiArgs(datacontext, args, eventName) {
        if (args.$events && args.$events[eventName] && args.$events[eventName].Reference) {
            if (args.$events[eventName].ReferenceType === 'Global') {
                return datacontext.$globals.$actions[args.$events[eventName].Reference];
            }
            else {
                return datacontext.$actions[args.$events[eventName].Reference];
            }
        }
        return undefined;
    }
    sffw.extractEventHandlerFromApiArgs = extractEventHandlerFromApiArgs;
})(sffw || (sffw = {}));
