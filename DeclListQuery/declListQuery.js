var sffw;
(function (sffw) {
    var DeclListQuery = /** @class */ (function () {
        function DeclListQuery(datacontext, args) {
            this.datacontext = datacontext;
            if (args.server) {
                if (args.server.IsGlobal) {
                    this.server = datacontext.$globals.$api[args.server.Reference];
                }
                else {
                    this.server = datacontext.$api[args.server.Reference];
                }
            }
            else {
                console.error('\"server\" param not provided to DeclListQuery');
            }
            if (!this.server) {
                throw new Error('Failed to find ServerConnection');
            }
            this.listName = args.listName;
        }
        DeclListQuery.prototype.getResultAsync = function (args) {
            var _this = this;
            this.columnNames = args.columnNames.split(',');
            this.filter = args.filter;
            this.top = 1;
            this.count = false;
            return new Promise(function (resolve, reject) {
                if (_this.filter) {
                    var urlParams = _this.prepareUrlParams();
                    var url = _this.getUrl(urlParams);
                    if (!_this.server) {
                        resolve(new sffw.DeclListQueryResponse(null, "Cannot load data from list " + _this.listName + ". Server connection is not set."));
                    }
                    _this.server.getAsync({ url: url }).then(function (response) {
                        if (response.isError()) {
                            var errMsg = ("Error when querying list " + _this.listName + "\n" + response.getErrorMessage());
                            resolve(new sffw.DeclListQueryResponse(null, errMsg));
                        }
                        else {
                            var oDataResponse = JSON.parse(response.getJsonString());
                            resolve(new sffw.DeclListQueryResponse(oDataResponse));
                        }
                    });
                }
                else {
                    resolve(new sffw.DeclListQueryResponse(null, 'Filter expression was not set'));
                }
            }).then(function (res) { return res; });
        };
        DeclListQuery.prototype.getCountAsync = function (args) {
            var _this = this;
            this.filter = args.filter;
            this.count = true;
            return new Promise(function (resolve, reject) {
                var urlParams = _this.prepareUrlParams();
                var url = _this.getUrl(urlParams);
                if (!_this.server) {
                    throw new Error("Cannot load data from list " + _this.listName + ". Server connection is not set.");
                }
                _this.server.sendRequest(url, 'GET', { Accept: args.acceptHeaderValue }, null).then(function (response) {
                    if (response.isError()) {
                        throw new Error("Error when querying list " + _this.listName + "\n" + response.getErrorMessage());
                    }
                    else {
                        resolve(parseInt(response.getJsonString(), null));
                    }
                });
            }).then(function (res) { return res; });
        };
        DeclListQuery.prototype.getUrl = function (params) {
            return "" + this.server.listsUrl + this.listName + (this.count === true ? '/$count' : '') + "?" + params.join('&');
        };
        DeclListQuery.prototype.prepareUrlParams = function () {
            var params = [];
            var filter = [];
            if (this.count === false) {
                params.push("$top=" + this.top);
                params.push("$select=" + this.columnNames.join(','));
            }
            if (this.filter) {
                filter.push("" + this.filter);
            }
            if (filter.length > 0) {
                params.push("$filter=" + filter.join(' and '));
            }
            return params;
        };
        DeclListQuery.prototype.dispose = function () {
            this.server = null;
        };
        return DeclListQuery;
    }());
    sffw.DeclListQuery = DeclListQuery;
})(sffw || (sffw = {}));
if (typeof define !== 'undefined') {
    define([], function () {
        return sffw.DeclListQuery;
    });
}
var sffw;
(function (sffw) {
    var DeclListQueryResponse = /** @class */ (function () {
        function DeclListQueryResponse(oDataResponse, error) {
            if (oDataResponse) {
                this.oDataResponse = oDataResponse;
            }
            if (error) {
                this.error = error;
            }
        }
        DeclListQueryResponse.prototype.isError = function () {
            if (this.error) {
                return true;
            }
            if (this.oDataResponse) {
                if (this.oDataResponse['odata.error']) {
                    return true;
                }
            }
            return false;
        };
        DeclListQueryResponse.prototype.getErrorMessage = function () {
            if (this.error) {
                return this.error;
            }
            if (this.oDataResponse) {
                if (this.oDataResponse['odata.error']) {
                    return this.oDataResponse['odata.error'];
                }
            }
            return null;
        };
        DeclListQueryResponse.prototype.getStringValue = function (args) {
            if (!this.isError() && args.columnName && this.oDataResponse.value.length > 0) {
                return this.oDataResponse.value[0][args.columnName];
            }
            return null;
        };
        DeclListQueryResponse.prototype.getIntValue = function (args) {
            if (!this.isError() && args.columnName && this.oDataResponse.value.length > 0) {
                var jsonNumber = this.oDataResponse.value[0][args.columnName];
                if (typeof jsonNumber === 'number') {
                    return Math.floor(jsonNumber);
                }
            }
            return null;
        };
        DeclListQueryResponse.prototype.getDecimalValue = function (args) {
            if (!this.isError() && args.columnName && this.oDataResponse.value.length > 0) {
                var jsonNumber = this.oDataResponse.value[0][args.columnName];
                if (typeof jsonNumber === 'number') {
                    return jsonNumber;
                }
            }
            return null;
        };
        DeclListQueryResponse.prototype.getDtmResponseValue = function (args) {
            var jsonDateTime = this.oDataResponse.value[0][args.columnName];
            var m = moment(jsonDateTime);
            return m.isValid() ? m.toDate() : null;
        };
        DeclListQueryResponse.prototype.getDateValue = function (args) {
            if (!this.isError() && args.columnName && this.oDataResponse.value.length > 0) {
                return this.getDtmResponseValue(args);
            }
            return null;
        };
        DeclListQueryResponse.prototype.getDateTimeValue = function (args) {
            if (!this.isError() && args.columnName && this.oDataResponse.value.length > 0) {
                return this.getDtmResponseValue(args);
            }
            return null;
        };
        DeclListQueryResponse.prototype.dispose = function () {
            this.oDataResponse = null;
        };
        return DeclListQueryResponse;
    }());
    sffw.DeclListQueryResponse = DeclListQueryResponse;
})(sffw || (sffw = {}));
