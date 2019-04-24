var sffw;
(function (sffw) {
    var api;
    (function (api) {
        var codelist;
        (function (codelist) {
            var CodelistApi = /** @class */ (function () {
                function CodelistApi(dc, args) {
                    this.core = new codelist.CodelistCore(dc, args);
                    this.items = this.core.items;
                }
                CodelistApi.prototype.dispose = function () {
                    this.items = null;
                    this.core.dispose();
                };
                CodelistApi.prototype.startLoadingData = function (args) {
                    this.core.setRelevantDate(args.date);
                    this.core.loadDataInternal();
                };
                CodelistApi.prototype.loadDataAsync = function (args) {
                    this.core.setRelevantDate(args.date);
                    return this.core.loadDataInternal();
                };
                CodelistApi.prototype.setDate = function (args) {
                    this.core.setRelevantDate(args.date);
                };
                CodelistApi.prototype.setDateTime = function (args) {
                    this.core.setRelevantDate(args.datetime);
                };
                // allows to set the data of codelist from actionlang in form of JSON;
                // server parameter is not necessary for this
                CodelistApi.prototype.fillFromJson = function (args) {
                    this.core.fillFromJsonString(args.dataAsJson);
                };
                CodelistApi.prototype.getLookupData = function (startString, attributeName, useContains, expectLinebreaksInValues, relevantDate, resultSorting) {
                    return this.core.getLookupData(startString, attributeName, useContains, expectLinebreaksInValues, relevantDate, resultSorting);
                };
                CodelistApi.prototype.getDataAsJson = function () {
                    return JSON.stringify(this.items());
                };
                CodelistApi.prototype.getItemByIntegerColumnAsync = function (args) {
                    return this.getItemByColumnValue(args);
                };
                CodelistApi.prototype.getItemByStringColumnAsync = function (args) {
                    return this.getItemByColumnValue(args);
                };
                CodelistApi.prototype.getItemByColumnValue = function (args) {
                    return this.core.getItemByColumnValue(args.columnName, args.columnValue, args.relevantDate, args.requeryIfLoadedAndNotFound);
                };
                CodelistApi.prototype.getDisplayMemberName = function () {
                    return this.core.displayMember;
                };
                CodelistApi.prototype.getValueMemberName = function () {
                    return this.core.valueMember;
                };
                CodelistApi.prototype.getItemsFilteredByValidityDate = function (dt) {
                    return this.core.getItemsFilteredByValidityDate(dt);
                };
                CodelistApi.prototype.loadDescReplaceValues = function (args) {
                    this.core.loadDescReplaceValues(args.replaceValuesJson);
                };
                return CodelistApi;
            }());
            codelist.CodelistApi = CodelistApi;
        })(codelist = api.codelist || (api.codelist = {}));
    })(api = sffw.api || (sffw.api = {}));
})(sffw || (sffw = {}));
if (typeof define !== 'undefined') {
    define(function () { return sffw.api.codelist.CodelistApi; });
}
var sffw;
(function (sffw) {
    var api;
    (function (api) {
        var codelist;
        (function (codelist) {
            var CodelistCore = /** @class */ (function () {
                function CodelistCore(dc, args) {
                    this.items = ko.observable();
                    this.filterByDate = true;
                    this.loadingInProgress = false;
                    this.dataLoaded = false;
                    if (args.server) {
                        if (args.server.IsGlobal) {
                            this.server = dc.$globals.$api[args.server.Reference];
                        }
                        else {
                            this.server = dc.$api[args.server.Reference];
                        }
                        sffw.assert(this.server, 'Failed to find ServerConnection');
                    }
                    // TODO: Split codelistName & API object name. Requires project migration in IDE.
                    this.codelistName = args.name;
                    this.additionalFilter = args.filter && args.filter.length > 0 ? args.filter : null;
                    this.autoLoad = args.autoLoad !== false;
                    this.filterByDate = args.filterByDate !== false;
                    this.valueMember = this.getColumnDefByRole('Key', args.columns);
                    this.serverDescriptionColumnName = this.getColumnDefByRole('Description', args.columns);
                    this.validityDateStartColumn = this.getColumnDefByRole('ValidityStart', args.columns);
                    this.validityDateEndColumn = this.getColumnDefByRole('ValidityEnd', args.columns);
                    sffw.assert(this.valueMember, "Expecting codelist " + this.codelistName + " to have column with the role Key");
                    sffw.assert(this.serverDescriptionColumnName, "Expecting codelist " + this.codelistName + " to have column with the role Description");
                    if (args.createDescriptionOnClient === 'No') {
                        this.displayMember = this.serverDescriptionColumnName;
                    }
                    else {
                        this.displayMember = args.clientDescriptionColumnName || '_description';
                    }
                    this.displayMemberMethod = codelist.DisplayMemberMethodFactory.create(args.createDescriptionOnClient || 'Key-Description', this.displayMember, this.valueMember, this.serverDescriptionColumnName);
                    this.columns = args.columns;
                    this.language = args.language;
                    if (args.autoLoad !== false) {
                        this.setRelevantDate(new Date());
                        this.loadDataInternal();
                    }
                }
                CodelistCore.prototype.getColumnDefByRole = function (role, columnDefs) {
                    var def = _.find(columnDefs, { columnRole: role });
                    return def && def.columnName;
                };
                CodelistCore.prototype.dispose = function () {
                    this.server = null;
                };
                CodelistCore.prototype.setRelevantDate = function (dt) {
                    this.relevantDate = dt || null;
                };
                CodelistCore.prototype.loadDataInternal = function () {
                    var _this = this;
                    sffw.assert(this.server, "Cannot load data for codelist " + this.codelistName + ". Server connection is not set.");
                    var reqUrl = new codelist.CodelistReqUrl({
                        codelistsUrl: this.server.codelistsUrl,
                        codelistName: this.codelistName,
                        columns: this.columns,
                        additionalODataFilter: this.additionalFilter,
                        relevantDateFilter: this.filterByDate ? this.relevantDate : null,
                        language: this.language
                    });
                    this.loadingInProgress = true;
                    return this.server.getAsync({ url: reqUrl.toString() }).then(function (response) {
                        if (response.isError()) {
                            console.error("Error when loading codelist " + _this.codelistName + "\n" + response.getErrorMessage());
                            _this.loadingInProgress = false;
                            return;
                        }
                        else {
                            var oDataResponse = JSON.parse(response.getJsonString());
                            var items = oDataResponse.value;
                            sffw.assert(_.isArray(items), 'Expecting OData response value to be array of objects');
                            _this.transformResponseItemsValues(items);
                            if (_this.displayMemberMethod) {
                                _this.attachDisplayMemberOnItems(items);
                            }
                            _this.items(items);
                            _this.loadingInProgress = false;
                            _this.dataLoaded = true;
                        }
                    });
                };
                CodelistCore.prototype.fillFromJsonString = function (dataAsJson) {
                    this.loadingInProgress = true;
                    try {
                        var items = JSON.parse(dataAsJson);
                        sffw.assert(_.isArray(items));
                        if (this.displayMemberMethod) {
                            this.attachDisplayMemberOnItems(items);
                        }
                        this.items(items);
                        this.loadingInProgress = false;
                        this.dataLoaded = true;
                    }
                    catch (err) {
                        throw new Error("Failed to fill codelist " + this.codelistName + " from JSON.\n" + err);
                    }
                };
                CodelistCore.prototype.getLookupData = function (startString, attNamePar, useContains, expectLinebreaksInValues, relevantDate, resultSorting) {
                    var _this = this;
                    var attName = attNamePar || this.displayMember;
                    var startStringLower = (startString || '').toLowerCase();
                    var promiseChain = Promise.resolve();
                    if (this.dataLoaded) {
                        promiseChain = this.getCachedLookupData(startStringLower, attName, useContains, relevantDate);
                    }
                    else {
                        promiseChain = this.getRemoteLookupData(startString || '', attName, useContains, expectLinebreaksInValues, relevantDate);
                    }
                    // Advanced sorting of ReferenceLookup items lookup results makes sense only when
                    // display member is bound to client description column created with 'Key-Description' method
                    if (attName === this.displayMember && this.displayMemberMethod.name === 'Key-Description') {
                        var lang_1 = window.sf.localization.currentCultureCode();
                        if (resultSorting === 'advanced') {
                            promiseChain = promiseChain.then(function (results) {
                                return _this.sortResultsAdvanced(results, startStringLower, attName, lang_1);
                            });
                        }
                    }
                    return promiseChain;
                };
                CodelistCore.prototype.sortResultsAdvanced = function (results, startStringLower, attName, lang) {
                    var _this = this;
                    var codeMatchPriorityGroup = _.filter(results, function (item) {
                        var attValue = item[_this.valueMember] && item[_this.valueMember].toString();
                        return attValue && attValue.toLowerCase().localeCompare(startStringLower, lang) === 0;
                    });
                    this.removeItemsFromArray(results, codeMatchPriorityGroup);
                    this.sortPriorityGroupArray(codeMatchPriorityGroup, lang);
                    var descStartPriorityGroup = _.filter(results, function (item) {
                        var attValue = item[_this.serverDescriptionColumnName] && item[_this.serverDescriptionColumnName].toString();
                        return attValue && attValue.toLowerCase().indexOf(startStringLower) === 0;
                    });
                    this.removeItemsFromArray(results, descStartPriorityGroup);
                    this.sortPriorityGroupArray(descStartPriorityGroup, lang);
                    var descContainsPriorityGroup = _.filter(results, function (item) {
                        var attValue = item[_this.serverDescriptionColumnName] && item[_this.serverDescriptionColumnName].toString();
                        return attValue && attValue.toLowerCase().indexOf(startStringLower) !== -1;
                    });
                    this.removeItemsFromArray(results, descContainsPriorityGroup);
                    this.sortPriorityGroupArray(descContainsPriorityGroup, lang);
                    // nothing should remain in results now, but for all cases it will be sorted and added to the end
                    this.sortPriorityGroupArray(results, lang);
                    var sortedResults = codeMatchPriorityGroup.concat(descStartPriorityGroup).concat(descContainsPriorityGroup).concat(results);
                    return Promise.resolve(sortedResults);
                };
                CodelistCore.prototype.removeItemsFromArray = function (originalArray, itemsToRemove) {
                    _.each(itemsToRemove, function (item) {
                        var itemPos = originalArray.indexOf(item);
                        if (itemPos > -1) {
                            originalArray.splice(itemPos, 1);
                        }
                    });
                };
                CodelistCore.prototype.sortPriorityGroupArray = function (priorityGroupArray, lang) {
                    var _this = this;
                    priorityGroupArray.sort(function (a, b) {
                        return a[_this.valueMember].toLowerCase().localeCompare(b[_this.valueMember].toLowerCase(), lang);
                    });
                };
                CodelistCore.prototype.getCachedLookupData = function (startStringLower, attName, useContains, relevantDate) {
                    var _this = this;
                    var items;
                    if (relevantDate) {
                        items = this.getItemsFilteredByValidityDate(relevantDate);
                    }
                    else {
                        items = this.items();
                    }
                    var result = _(items).filter(function (item) {
                        if (attName === _this.displayMember && _this.displayMemberMethod.name !== 'No') {
                            var value = item[_this.valueMember] && item[_this.valueMember].toString();
                            var desc = item[_this.serverDescriptionColumnName] && item[_this.serverDescriptionColumnName].toString();
                            if (useContains) {
                                return (item[_this.displayMember].toLowerCase().indexOf(startStringLower) !== -1);
                            }
                            else {
                                return (item[_this.displayMember].toLowerCase().indexOf(startStringLower) === 0);
                            }
                        }
                        else {
                            var attValue = item[attName] && item[attName].toString();
                            if (useContains) {
                                return attValue && attValue.toLowerCase().indexOf(startStringLower) !== -1;
                            }
                            else {
                                return attValue && attValue.toLowerCase().indexOf(startStringLower) === 0;
                            }
                        }
                    }).value();
                    return Promise.resolve(result);
                };
                CodelistCore.prototype.getRemoteLookupData = function (startString, attName, useContains, expectLinebreaksInValues, relevantDate) {
                    var _this = this;
                    var reqUrl = new codelist.CodelistReqUrl({
                        codelistsUrl: this.server.codelistsUrl,
                        codelistName: this.codelistName,
                        columns: this.columns,
                        additionalODataFilter: this.additionalFilter,
                        relevantDateFilter: this.filterByDate ? this.relevantDate : null,
                        language: this.language
                    });
                    if (relevantDate) {
                        // relevant date parameter comes from filterCodelist for example and overrides codelist setting
                        reqUrl.relevantDateFilter = relevantDate;
                    }
                    if (attName === this.displayMember && this.displayMemberMethod.name !== 'No') {
                        reqUrl.addDisplayMemberFilter(this.valueMember, this.serverDescriptionColumnName, startString, this.displayMemberMethod, useContains, expectLinebreaksInValues);
                    }
                    else {
                        reqUrl.addLookupAttFilter(attName, startString, useContains, expectLinebreaksInValues);
                    }
                    var url = reqUrl.toString();
                    return this.server.getAsync({ url: url }).then(function (response) {
                        if (response.isError()) {
                            throw new Error("Error while loading codelist " + _this.codelistName + " data: " + response.getErrorMessage());
                        }
                        else {
                            var oDataResponse = JSON.parse(response.getJsonString());
                            var items = oDataResponse.value;
                            if (_this.displayMemberMethod.name !== 'No') {
                                _this.attachDisplayMemberOnItems(items);
                            }
                            return items;
                        }
                    });
                };
                CodelistCore.prototype.getItemByColumnValue = function (columnName, columnValue, relevantDate, requeryIfLoadedAndNotFound) {
                    var _this = this;
                    return new Promise(function (resolve, reject) {
                        if (_this.dataLoaded) {
                            var result = _this.getLoadedItem(columnName, columnValue);
                            if (result.item || result.isError()) {
                                resolve(result);
                            }
                            else {
                                if (requeryIfLoadedAndNotFound === true) {
                                    resolve(_this.getItemFromServer(columnName, columnValue, relevantDate));
                                }
                                else {
                                    resolve(result);
                                }
                            }
                        }
                        else {
                            resolve(_this.getItemFromServer(columnName, columnValue, relevantDate));
                        }
                    });
                };
                CodelistCore.prototype.getLoadedItem = function (columnName, columnValue) {
                    if (!columnName || columnName.length === 0) {
                        return new codelist.CodelistItem(null, null, 'Empty \'columnName\' parameter.');
                    }
                    if (this.items().length > 0) {
                        var first = this.items()[0];
                        if (!first.hasOwnProperty(columnName)) {
                            return new codelist.CodelistItem(null, null, "Invalid 'columnName': " + columnName);
                        }
                    }
                    var result = _(this.items()).filter(function (item) {
                        return item[columnName] === columnValue;
                    }).first();
                    return new codelist.CodelistItem(result, false);
                };
                CodelistCore.prototype.getItemFromServer = function (columnName, columnValue, relevantDate) {
                    var _this = this;
                    return new Promise(function (resolve, reject) {
                        var reqUrl = new codelist.CodelistReqUrl({
                            codelistsUrl: _this.server.codelistsUrl,
                            codelistName: _this.codelistName,
                            columns: _this.columns,
                            additionalODataFilter: _this.additionalFilter,
                            relevantDateFilter: relevantDate,
                            language: _this.language
                        });
                        reqUrl.addSearchFilter(columnName, columnValue);
                        _this.server.getAsync({ url: reqUrl.toString() }).then(function (response) {
                            if (response.isError()) {
                                var errMsg = "Error while loading codelist " + _this.codelistName + " data: " + response.getErrorMessage();
                                return resolve(new codelist.CodelistItem(null, null, errMsg));
                            }
                            else {
                                var oDataResponse = JSON.parse(response.getJsonString());
                                if (typeof oDataResponse.value !== 'undefined' && oDataResponse.value.length > 0) {
                                    _this.transformResponseItemsValues(oDataResponse.value);
                                    var plainObjResult = oDataResponse.value[0];
                                    return resolve(new codelist.CodelistItem(plainObjResult, true));
                                }
                                else {
                                    return resolve(new codelist.CodelistItem(null, null));
                                }
                            }
                        });
                    });
                };
                CodelistCore.prototype.transformResponseItemsValues = function (items) {
                    var _this = this;
                    _.each(items, function (item) {
                        _.each(_this.columns, function (column) {
                            if (item[column.columnName]) {
                                if (column.dataType === 'date' || column.dataType === 'dateTime') {
                                    var m = moment(item[column.columnName]);
                                    item[column.columnName] = m.isValid() ? m.toDate() : null;
                                }
                            }
                        });
                    });
                };
                CodelistCore.prototype.attachDisplayMemberOnItems = function (items) {
                    var _this = this;
                    _(items).each(function (itm) {
                        if (!itm.hasOwnProperty(_this.displayMember)) {
                            try {
                                itm[_this.displayMember] = _this.displayMemberMethod.getDisplayMemberValue(itm);
                            }
                            catch (err) {
                                throw new Error("Failed to create display member " + _this.displayMember + " using " + _this.displayMemberMethod.name + " mode.\n" + err);
                            }
                        }
                    });
                };
                CodelistCore.prototype.getItemsFilteredByValidityDate = function (dt) {
                    var _this = this;
                    if (!this.validityDateStartColumn || !this.validityDateEndColumn) {
                        throw new Error("Codelist " + this.codelistName + " cannot be filtered by validity because it does not have columns in ValidityStart and ValidityEnd roles");
                    }
                    if (!this.items()) {
                        return null;
                    }
                    var dtStr = moment(dt).format('YYYY-MM-DDTHH:mm:ss');
                    var result = _.filter(this.items(), function (itm) {
                        return itm[_this.validityDateStartColumn] < dtStr && dtStr < itm[_this.validityDateEndColumn];
                    });
                    return result;
                };
                CodelistCore.prototype.loadDescReplaceValues = function (replaceValuesJson) {
                    var _this = this;
                    this.loadingInProgress = true;
                    try {
                        var replaceItems = JSON.parse(replaceValuesJson);
                        sffw.assert(_.isArray(replaceItems));
                        var arrItems_1 = this.items();
                        _(replaceItems).each(function (rItem) {
                            var result = _(arrItems_1).find(function (item) {
                                return item[_this.valueMember].toString() === rItem.CodeParameter;
                            });
                            if (result) {
                                var replaceValueArr = rItem.DescriptionParameter;
                                result[_this.serverDescriptionColumnName] = sffw.stringFormat(result[_this.serverDescriptionColumnName], replaceValueArr);
                                if (result.hasOwnProperty(_this.displayMember)) {
                                    try {
                                        result[_this.displayMember] = _this.displayMemberMethod.getDisplayMemberValue(result);
                                    }
                                    catch (err) {
                                        throw new Error("Failed to create display member " + _this.displayMember + " using " + _this.displayMemberMethod.name + " mode.\n" + err);
                                    }
                                }
                            }
                        });
                        this.items([]);
                        this.items(arrItems_1);
                        this.loadingInProgress = false;
                        this.dataLoaded = true;
                    }
                    catch (err) {
                        throw new Error("Failed to load replace values for codelist " + this.codelistName + " from JSON.\n" + err);
                    }
                };
                return CodelistCore;
            }());
            codelist.CodelistCore = CodelistCore;
        })(codelist = api.codelist || (api.codelist = {}));
    })(api = sffw.api || (sffw.api = {}));
})(sffw || (sffw = {}));
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
    var api;
    (function (api) {
        var codelist;
        (function (codelist) {
            var CodelistReqUrl = /** @class */ (function () {
                // public expectLinebreaksInValues = false;
                function CodelistReqUrl(args) {
                    this.filters = [];
                    this.codelistsUrl = args.codelistsUrl;
                    this.codelistName = args.codelistName;
                    this.columnNames = _.map((args.columns || []), 'columnName');
                    this.relevantDateFilter = args.relevantDateFilter;
                    this.language = args.language;
                    if (args.additionalODataFilter) {
                        this.filters.push(args.additionalODataFilter);
                    }
                }
                CodelistReqUrl.prototype.formatDateToString = function (dt) {
                    return dt.getFullYear() + "-" + this.makeDoubleDigit(dt.getMonth() + 1) + "-" + this.makeDoubleDigit(dt.getDate()) + "T" + this.makeDoubleDigit(dt.getHours()) + ":" + this.makeDoubleDigit(dt.getMinutes()) + ":" + this.makeDoubleDigit(dt.getSeconds());
                };
                CodelistReqUrl.prototype.makeDoubleDigit = function (n) {
                    var result = '0' + n.toString();
                    result = result.substring(result.length - 2);
                    return result;
                };
                CodelistReqUrl.prototype.addDisplayMemberFilter = function (keyColumn, descColumn, lookupValue, displayMemberMethod, useContains, expectLinebreaksInValues) {
                    var trimmedValue = lookupValue.trim();
                    if (trimmedValue.length === 0) {
                        return;
                    }
                    var escapedValue = sffw.replaceUriParamSpecialChars(trimmedValue);
                    var transformedDesc = expectLinebreaksInValues ? this.getServerReplace(descColumn) : descColumn;
                    this.filters.push(displayMemberMethod.getDisplayMemberODataFilter(keyColumn, transformedDesc, escapedValue, useContains));
                };
                CodelistReqUrl.prototype.getServerReplace = function (column) {
                    return "replace(replace(replace(" + column + ",%20%27%0A%27,%27%27),%20%27%0D%27,%27%27),%20%27%09%27,%27%27)";
                };
                CodelistReqUrl.prototype.addLookupAttFilter = function (column, value, useContains, expectLinebreaksInValues) {
                    var trimmedValue = value.trim();
                    if (trimmedValue.length === 0) {
                        return;
                    }
                    var escapedValue = sffw.replaceUriParamSpecialChars(trimmedValue);
                    var method = useContains ? 'contains' : 'startswith';
                    if (expectLinebreaksInValues) {
                        this.filters.push(method + "(" + this.getServerReplace(column) + ",'" + escapedValue + "')");
                    }
                    else {
                        this.filters.push(method + "(" + column + ", '" + escapedValue + "')");
                    }
                };
                CodelistReqUrl.prototype.addSearchFilter = function (column, value) {
                    if (typeof value === 'number') {
                        this.filters.push(column + " eq " + value);
                    }
                    if (typeof value === 'string') {
                        this.filters.push(column + " eq '" + sffw.replaceUriParamSpecialChars(value) + "'");
                    }
                };
                CodelistReqUrl.prototype.toString = function () {
                    var params = [];
                    params.push("$select=" + this.columnNames.join(','));
                    if (this.filters.length > 0) {
                        params.push("$filter=" + this.filters.join(' and '));
                    }
                    if (this.relevantDateFilter) {
                        params.push("timestamp=datetime'" + this.formatDateToString(this.relevantDateFilter) + "'");
                    }
                    if (this.language && this.language.length > 0) {
                        params.push("language=" + this.language.toUpperCase());
                    }
                    return "" + this.codelistsUrl + this.codelistName + "?" + params.join('&');
                };
                return CodelistReqUrl;
            }());
            codelist.CodelistReqUrl = CodelistReqUrl;
        })(codelist = api.codelist || (api.codelist = {}));
    })(api = sffw.api || (sffw.api = {}));
})(sffw || (sffw = {}));
var sffw;
(function (sffw) {
    var api;
    (function (api) {
        var codelist;
        (function (codelist) {
            var DisplayMemberMethodFactory = /** @class */ (function () {
                function DisplayMemberMethodFactory() {
                }
                DisplayMemberMethodFactory.create = function (method, displayMember, keyColumn, descColumn) {
                    switch (method) {
                        case 'No':
                            return null;
                        case 'Key-Description':
                            return new KeyDashValueMethod(method, displayMember, keyColumn, descColumn);
                        case 'DescriptionOrKey':
                            return new DescriptionOrKeyMethod(method, displayMember, keyColumn, descColumn);
                    }
                };
                return DisplayMemberMethodFactory;
            }());
            codelist.DisplayMemberMethodFactory = DisplayMemberMethodFactory;
            var KeyDashValueMethod = /** @class */ (function () {
                function KeyDashValueMethod(name, displayMember, keyColumn, descColumn) {
                    this.name = name;
                    this.displayMember = displayMember;
                    this.keyColumn = keyColumn;
                    this.descColumn = descColumn;
                }
                KeyDashValueMethod.prototype.getDisplayMemberValue = function (item) {
                    sffw.assert(item.hasOwnProperty(this.keyColumn));
                    if (item.hasOwnProperty(this.descColumn) && item[this.descColumn] !== null && typeof (item[this.descColumn]) === 'string' && item[this.descColumn].length > 0) {
                        return item[this.keyColumn] + " - " + item[this.descColumn];
                    }
                    else {
                        return item[this.keyColumn];
                    }
                };
                KeyDashValueMethod.prototype.getDisplayMemberODataFilter = function (keyColumn, transformedDesc, escapedValue, useContains) {
                    if (useContains) {
                        return "contains(concat(concat(" + keyColumn + ", ' - '), " + transformedDesc + "), '" + escapedValue + "')";
                    }
                    else {
                        return "(startswith(concat(concat(" + keyColumn + ", ' - '), " + transformedDesc + "), '" + escapedValue + "') or startswith(" + transformedDesc + ", '" + escapedValue + "'))";
                    }
                };
                return KeyDashValueMethod;
            }());
            var DescriptionOrKeyMethod = /** @class */ (function () {
                function DescriptionOrKeyMethod(name, displayMember, keyColumn, descColumn) {
                    this.name = name;
                    this.displayMember = displayMember;
                    this.keyColumn = keyColumn;
                    this.descColumn = descColumn;
                }
                DescriptionOrKeyMethod.prototype.getDisplayMemberValue = function (item) {
                    sffw.assert(item.hasOwnProperty(this.keyColumn));
                    if (item.hasOwnProperty(this.descColumn) && item[this.descColumn] !== null && typeof (item[this.descColumn]) === 'string' && item[this.descColumn].length > 0) {
                        return item[this.descColumn];
                    }
                    else {
                        return item[this.keyColumn];
                    }
                };
                DescriptionOrKeyMethod.prototype.getDisplayMemberODataFilter = function (keyColumn, transformedDesc, escapedValue, useContains) {
                    if (useContains) {
                        return "(contains(" + keyColumn + ", '" + escapedValue + "') or contains(" + transformedDesc + ", '" + escapedValue + "'))";
                    }
                    else {
                        return "(startswith(" + keyColumn + ", '" + escapedValue + "') or startswith(" + transformedDesc + ", '" + escapedValue + "'))";
                    }
                };
                return DescriptionOrKeyMethod;
            }());
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
var sffw;
(function (sffw) {
    function stringFormat(strToFormat, replaceArgs) {
        var result = strToFormat;
        _(replaceArgs).each(function (k) {
            result = result.replace(new RegExp("\\{" + k.Code + "\\}", 'g'), k.Value);
        });
        return result;
    }
    sffw.stringFormat = stringFormat;
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
