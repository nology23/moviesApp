var sffw;
(function (sffw) {
    var api;
    (function (api) {
        var codelist;
        (function (codelist) {
            var CodelistFilter = /** @class */ (function () {
                function CodelistFilter(filterItems) {
                    this.filterItems = filterItems;
                    this.api = new codelist.CodelistFilterApi(this);
                    this.includeByKey = new codelist.ColumnValueList();
                    this.excludeByKey = new codelist.ColumnValueList();
                }
                CodelistFilter.prototype.apply = function (codelistSource) {
                    if (!codelistSource.items) {
                        return null; // source is disposed
                    }
                    var items;
                    if (this.validityDate) {
                        items = codelistSource.getItemsFilteredByValidityDate(this.validityDate);
                    }
                    else {
                        items = codelistSource.items();
                    }
                    return this.filterByExclude(this.filterByInclude(items));
                };
                CodelistFilter.prototype.filterByExclude = function (items) {
                    var _this = this;
                    if (!items) {
                        return null;
                    }
                    return _(items).filter(function (item) {
                        return !_.some(_this.excludeByKey.items, function (filterRule) {
                            return item[filterRule.columnName] === filterRule.value;
                        });
                    }).value();
                };
                CodelistFilter.prototype.filterByInclude = function (items) {
                    var _this = this;
                    if (!items) {
                        return null;
                    }
                    if (this.includeByKey.items.length === 0) {
                        // if there was no include filter mentioned, we pass back whole list
                        return items;
                    }
                    return _(items).filter(function (item) {
                        return _.some(_this.includeByKey.items, function (filterRule) {
                            return item[filterRule.columnName] === filterRule.value;
                        });
                    }).value();
                };
                CodelistFilter.prototype.commit = function () {
                    this.filterItems();
                };
                CodelistFilter.prototype.reset = function (applyImmediately) {
                    this.validityDate = undefined;
                    this.excludeByKey.clear();
                    this.includeByKey.clear();
                    if (applyImmediately) {
                        this.filterItems();
                    }
                };
                return CodelistFilter;
            }());
            codelist.CodelistFilter = CodelistFilter;
        })(codelist = api.codelist || (api.codelist = {}));
    })(api = sffw.api || (sffw.api = {}));
})(sffw || (sffw = {}));
var sffw;
(function (sffw) {
    var api;
    (function (api) {
        var codelist;
        (function (codelist) {
            var CodelistFilterApi = /** @class */ (function () {
                function CodelistFilterApi(filter) {
                    this.filter = filter;
                }
                CodelistFilterApi.prototype.filterByValidityDateTime = function (args) {
                    this.filter.validityDate = args.validityDate;
                };
                CodelistFilterApi.prototype.excludeItemsByStringColumn = function (args) {
                    this.filter.excludeByKey.add(args.columnName, args.value, 'string');
                };
                CodelistFilterApi.prototype.excludeItemsByIntColumn = function (args) {
                    this.filter.excludeByKey.add(args.columnName, args.value, 'int');
                };
                CodelistFilterApi.prototype.excludeItemsByBoolColumn = function (args) {
                    this.filter.excludeByKey.add(args.columnName, args.value, 'bool');
                };
                CodelistFilterApi.prototype.includeItemsByStringColumn = function (args) {
                    this.filter.includeByKey.add(args.columnName, args.value, 'string');
                };
                CodelistFilterApi.prototype.includeItemsByIntColumn = function (args) {
                    this.filter.includeByKey.add(args.columnName, args.value, 'int');
                };
                CodelistFilterApi.prototype.includeItemsByBoolColumn = function (args) {
                    this.filter.includeByKey.add(args.columnName, args.value, 'bool');
                };
                CodelistFilterApi.prototype.reset = function (args) {
                    this.filter.reset(args.applyImmediately);
                };
                CodelistFilterApi.prototype.commit = function () {
                    this.filter.commit();
                };
                return CodelistFilterApi;
            }());
            codelist.CodelistFilterApi = CodelistFilterApi;
        })(codelist = api.codelist || (api.codelist = {}));
    })(api = sffw.api || (sffw.api = {}));
})(sffw || (sffw = {}));
var sffw;
(function (sffw) {
    var api;
    (function (api) {
        var codelist;
        (function (codelist) {
            var ColumnValueList = /** @class */ (function () {
                function ColumnValueList() {
                    this.items = [];
                }
                ColumnValueList.prototype.add = function (columnName, value, type) {
                    var _this = this;
                    if (!columnName) {
                        throw new Error('Expecting column name to have value');
                    }
                    if (value === null || value === undefined) {
                        throw new Error('Expecting column value to have value');
                    }
                    var newItem = {
                        columnName: columnName.toUpperCase(),
                        value: value,
                        type: type
                    };
                    if (!_.some(this.items, function (itm) { return _this.areColumnValuesEqual(itm, newItem); })) {
                        this.items.push({ columnName: columnName, value: value, type: type });
                    }
                    ;
                };
                ColumnValueList.prototype.clear = function () {
                    this.items = [];
                };
                ColumnValueList.prototype.areColumnValuesEqual = function (x, y) {
                    if (x.type !== y.type) {
                        return false;
                    }
                    if (x.columnName !== y.columnName) {
                        return false;
                    }
                    if (x.type === 'string') {
                        return x.value.toUpperCase() === y.value.toUpperCase();
                    }
                    else {
                        return x.value === y.value;
                    }
                };
                return ColumnValueList;
            }());
            codelist.ColumnValueList = ColumnValueList;
        })(codelist = api.codelist || (api.codelist = {}));
    })(api = sffw.api || (sffw.api = {}));
})(sffw || (sffw = {}));
var sffw;
(function (sffw) {
    var api;
    (function (api) {
        var codelist;
        (function (codelist) {
            var FilteredCodelist = /** @class */ (function () {
                function FilteredCodelist(dc, args) {
                    var _this = this;
                    if (args.codelistSource) {
                        if (args.codelistSource.IsGlobal) {
                            this.codelistSource = dc.$globals.$api[args.codelistSource.Reference];
                        }
                        else {
                            this.codelistSource = dc.$api[args.codelistSource.Reference];
                        }
                        sffw.assert(this.codelistSource, 'Failed to find CodelistSource');
                    }
                    this.items = ko.observable(null);
                    this.filter = new codelist.CodelistFilter(function () { return _this.filterItems(); });
                }
                FilteredCodelist.prototype.dispose = function () {
                    this.items = null;
                    if (this.sourceSubscription) {
                        this.sourceSubscription.dispose();
                        this.sourceSubscription = null;
                    }
                };
                FilteredCodelist.prototype.filterByValidityDateTime = function (args) {
                    sffw.assert(_.isDate(args.dt));
                    this.filter.validityDate = args.dt;
                    this.filterItems();
                };
                FilteredCodelist.prototype.onSourceItemsChange = function () {
                    this.filterItems();
                };
                FilteredCodelist.prototype.filterItems = function () {
                    if (this.items) {
                        this.items(this.filter.apply(this.codelistSource));
                    }
                    this.subscribeToSource();
                };
                FilteredCodelist.prototype.subscribeToSource = function () {
                    if (!this.sourceSubscription && this.codelistSource.items) {
                        this.sourceSubscription = this.codelistSource.items.subscribe(this.onSourceItemsChange, this);
                    }
                };
                FilteredCodelist.prototype.getLookupData = function (startString, attributeName, useContains, expectLinebreaksInValues, relevantDate, resultSorting) {
                    return this.codelistSource.getLookupData(startString, attributeName, useContains, expectLinebreaksInValues, relevantDate || this.filter.validityDate, resultSorting);
                };
                FilteredCodelist.prototype.getDataAsJson = function () {
                    if (this.items) {
                        return JSON.stringify(this.items());
                    }
                    else {
                        return null;
                    }
                };
                FilteredCodelist.prototype.getDisplayMemberName = function () {
                    return this.codelistSource.getDisplayMemberName();
                };
                FilteredCodelist.prototype.getValueMemberName = function () {
                    return this.codelistSource.getValueMemberName();
                };
                FilteredCodelist.prototype.getItemsFilteredByValidityDate = function (dt) {
                    return this.codelistSource.getItemsFilteredByValidityDate(dt);
                };
                FilteredCodelist.prototype.getItemByStringColumnAsync = function (args) {
                    var _this = this;
                    return new Promise(function (resolve) {
                        var item = _this.getItemByColumnValue(args.columnName, args.columnValue);
                        return resolve(item);
                    });
                };
                FilteredCodelist.prototype.getItemByIntegerColumnAsync = function (args) {
                    var _this = this;
                    return new Promise(function (resolve) {
                        var item = _this.getItemByColumnValue(args.columnName, args.columnValue);
                        return resolve(item);
                    });
                };
                FilteredCodelist.prototype.getFilter = function () {
                    return this.filter.api;
                };
                FilteredCodelist.prototype.resetFilter = function (args) {
                    this.filter.reset(args.applyImmediately);
                    this.filterItems();
                    return this.filter.api;
                };
                FilteredCodelist.prototype.getItemByColumnValue = function (columnName, columnValue) {
                    var items = this.items && this.items();
                    if (items) {
                        if (!columnName || columnName.length === 0) {
                            return new sffw.api.codelist.CodelistItem(null);
                        }
                        if (items.length > 0) {
                            var first = items[0];
                            if (!first.hasOwnProperty(columnName)) {
                                return new sffw.api.codelist.CodelistItem(null);
                            }
                        }
                        var result = _(items).filter(function (item) {
                            return item[columnName] === columnValue;
                        }).first();
                        return new sffw.api.codelist.CodelistItem(result);
                    }
                    return new sffw.api.codelist.CodelistItem(null);
                };
                return FilteredCodelist;
            }());
            codelist.FilteredCodelist = FilteredCodelist;
        })(codelist = api.codelist || (api.codelist = {}));
    })(api = sffw.api || (sffw.api = {}));
})(sffw || (sffw = {}));
if (typeof define !== 'undefined') {
    define(function () { return sffw.api.codelist.FilteredCodelist; });
}
var sffw;
(function (sffw) {
    var api;
    (function (api) {
        var codelist;
        (function (codelist) {
            var CodelistItem = /** @class */ (function () {
                function CodelistItem(item, serverQuery, errorMessage) {
                    this.item = item;
                    this.serverQuery = serverQuery;
                    this.errorMessage = errorMessage;
                }
                CodelistItem.prototype.isError = function () {
                    if (this.errorMessage) {
                        return this.errorMessage.length > 0;
                    }
                    return false;
                };
                CodelistItem.prototype.getErrorMessage = function () {
                    if (this.isError()) {
                        return this.errorMessage ? this.errorMessage : null;
                    }
                    return null;
                };
                CodelistItem.prototype.isFound = function () {
                    if (this.item) {
                        return true;
                    }
                    return false;
                };
                CodelistItem.prototype.getPropertyValue = function (args) {
                    if (this.item) {
                        var value = this.item[args.propName];
                        if (value !== undefined && value !== null) {
                            return value.toString();
                        }
                    }
                    return null;
                };
                CodelistItem.prototype.getJsonString = function () {
                    if (this.item) {
                        return JSON.stringify(this.item);
                    }
                    return null;
                };
                CodelistItem.prototype.performedServerQuery = function () {
                    return !!this.serverQuery;
                };
                CodelistItem.prototype.dispose = function () {
                    this.item = null;
                };
                return CodelistItem;
            }());
            codelist.CodelistItem = CodelistItem;
        })(codelist = api.codelist || (api.codelist = {}));
    })(api = sffw.api || (sffw.api = {}));
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
