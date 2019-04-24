var sffw;
(function (sffw) {
    var api;
    (function (api) {
        var serverConnection;
        (function (serverConnection) {
            var CsrfProtection = /** @class */ (function () {
                function CsrfProtection(conn, isEnabled, tokenHeader, tokenUrl) {
                    this.conn = conn;
                    this.isEnabled = isEnabled;
                    this.tokenHeader = tokenHeader;
                    this.tokenUrl = tokenUrl;
                    this.tokenAquired = false;
                }
                CsrfProtection.prototype.init = function () {
                    if (this.isEnabled) {
                        this.requestToken();
                    }
                };
                CsrfProtection.prototype.getRequestDependency = function () {
                    if (!this.isEnabled || this.tokenAquired) {
                        return Promise.resolve();
                    }
                    else {
                        return this.requestTokenPromise;
                    }
                };
                CsrfProtection.prototype.requestToken = function () {
                    var _this = this;
                    // using generalRequest to avoid cyclic waiting for CSRF token
                    this.requestTokenPromise = this.conn.requestWithoutHeadersAndCsrf(this.tokenUrl)
                        .then(function (response) {
                        if (response.isError()) {
                            console.error(response.getErrorMessage());
                        }
                        else {
                            var tokenValue = response.getHeader({ name: _this.tokenHeader });
                            if (tokenValue) {
                                _this.conn.setHeader({ name: _this.tokenHeader, value: tokenValue });
                                _this.tokenAquired = true;
                            }
                        }
                    });
                };
                return CsrfProtection;
            }());
            serverConnection.CsrfProtection = CsrfProtection;
        })(serverConnection = api.serverConnection || (api.serverConnection = {}));
    })(api = sffw.api || (sffw.api = {}));
})(sffw || (sffw = {}));
var sffw;
(function (sffw) {
    var ServerResponse = /** @class */ (function () {
        function ServerResponse(req) {
            this.req = req;
            this.responseText = req.responseText;
        }
        ServerResponse.prototype.getJsonString = function () {
            return this.responseText;
        };
        ServerResponse.prototype.extractJson = function (args) {
            var obj = JSON.parse(this.req.responseText);
            var path = sffw.api.plainObject.ObjectPath.fromALangNotation(args.path);
            var value = _.get(obj, path.toObjectNotation());
            return JSON.stringify(value);
        };
        ServerResponse.prototype.isError = function () {
            return !(this.req.status > 199 && this.req.status < 300);
        };
        ServerResponse.prototype.getErrorMessage = function () {
            if (!this.isError()) {
                return '';
            }
            return "Server responded with status " + this.req.status + " " + this.req.statusText;
        };
        ServerResponse.prototype.getMessageType = function () {
            // if CORS are used Access-Control-Expose-Headers should be set or it may fail
            return this.req.getResponseHeader('X-MessageType') || '';
        };
        ServerResponse.prototype.getStatusCode = function () {
            if (_.isFinite(this.req.status)) {
                return this.req.status;
            }
            return null;
        };
        ServerResponse.prototype.getHeader = function (args) {
            // if CORS are used Access-Control-Expose-Headers should be set or it may fail
            return this.req.getResponseHeader(args.name);
        };
        return ServerResponse;
    }());
    sffw.ServerResponse = ServerResponse;
})(sffw || (sffw = {}));
var sffw;
(function (sffw) {
    var ServerConnection = /** @class */ (function () {
        function ServerConnection(datacontext, args) {
            this.isAliveTimeoutMs = null;
            this.defaultHeaders = {
                Accept: 'application/json'
            };
            this.rootUrl = args.rootUrl || undefined;
            this.listsUrl = _.isString(args.listsUrl) ? args.listsUrl : 'datasets/';
            this.codelistsUrl = _.isString(args.codelistsUrl) ? args.codelistsUrl : 'codelists/';
            this.withCredentials = args.withCredentials || false;
            if (args.version) {
                var versionUnwrapped = ko.unwrap(args.version);
                if (versionUnwrapped.trim().length > 0) {
                    this.version = versionUnwrapped;
                }
            }
            this.onIsAliveTimeout = sffw.extractEventHandlerFromApiArgs(datacontext, args, 'OnIsAliveTimeout');
            this.onCodelistsChanged = sffw.extractEventHandlerFromApiArgs(datacontext, args, 'OnCodelistsChanged');
            this.codelistsLastChangeHeader = args.codelistsLastChangeHeader || 'X-CodelistsLastChange';
            this.csrfProtection = new sffw.api.serverConnection.CsrfProtection(this, !!args.useCsrfToken, args.csrfTokenHeader || 'X-CSRFToken', args.csrfTokenUrl || '/GetCSRFToken');
            this.csrfProtection.init();
        }
        ServerConnection.prototype.createAbsoluteUrl = function (args) {
            var argsUrl = args.url || '';
            return this.rootUrl ? this.rootUrl + argsUrl : argsUrl;
        };
        ServerConnection.prototype.createHeaders = function (args) {
            var headers = _.clone(this.defaultHeaders);
            if (args.data && !headers['Content-Type']) {
                headers['Content-Type'] = 'application/json; charset=utf-8';
            }
            if (this.version) {
                headers['X-Version'] = this.version;
            }
            return headers;
        };
        ServerConnection.prototype.setLanguage = function (args) {
            var uppperCaseValue = _.isString(args.value) ? args.value.toUpperCase() : args.value;
            this.setHeader({ name: 'X-Language', value: uppperCaseValue });
        };
        ServerConnection.prototype.setVersion = function (args) {
            this.setHeader({ name: 'X-Version', value: args.value });
        };
        ServerConnection.prototype.setHeader = function (args) {
            var headerValue = (args.value && args.value !== '' ? args.value : null);
            this.defaultHeaders[args.name] = headerValue;
        };
        ServerConnection.prototype.generalRequest = function (absoluteUrl, method, headers, data) {
            var _this = this;
            if (method === void 0) { method = 'GET'; }
            if (headers === void 0) { headers = {}; }
            return new Promise(function (resolve) {
                var httpRequest;
                var model = _this;
                if (XMLHttpRequest) {
                    httpRequest = new XMLHttpRequest();
                }
                else if (ActiveXObject) { // IE 8 and older
                    httpRequest = new ActiveXObject('Microsoft.XMLHTTP');
                }
                else {
                    throw new Error('Cannot create XMLHttpRequest or Microsoft.XMLHTTP');
                }
                httpRequest.onreadystatechange = function () {
                    if (httpRequest.readyState === httpRequest.DONE) {
                        if (model.isAliveTimeoutMs !== null && model.onIsAliveTimeout && model.timeoutId !== undefined) {
                            clearTimeout(model.timeoutId);
                            model.timeoutId = setTimeout(model.onIsAliveTimeout, model.isAliveTimeoutMs);
                        }
                        if (model.codelistsLastChangeHeader && model.onCodelistsChanged) {
                            var headerValue = this.getResponseHeader(model.codelistsLastChangeHeader);
                            if (headerValue) {
                                var m = moment(headerValue, 'YYYY-MM-DDTHH:mm:ss.SSS');
                                if (m.isValid()) {
                                    model.setLastCodelistChange(m.toDate());
                                }
                            }
                        }
                        resolve(httpRequest);
                    }
                };
                httpRequest.open(method, absoluteUrl, true);
                if (_this.withCredentials) {
                    httpRequest.withCredentials = true;
                }
                _.each(_.keys(headers), function (key) {
                    if (headers[key]) { // values may be null if developer wanted to remove them
                        httpRequest.setRequestHeader(key, headers[key]);
                    }
                });
                if (_.isUndefined(data) || data === null) {
                    httpRequest.send();
                }
                else {
                    httpRequest.send(data);
                }
            });
        };
        ServerConnection.prototype.requestWithoutHeadersAndCsrf = function (relativeUrl, method, finalHeaders, data) {
            var absoluteUrl = this.createAbsoluteUrl({ url: relativeUrl });
            return this.generalRequest(absoluteUrl, method, finalHeaders, data)
                .then(function (req) { return new sffw.ServerResponse(req); });
        };
        ServerConnection.prototype.getAsync = function (args) {
            return this.sendRequest(args.url);
        };
        ServerConnection.prototype.postAsync = function (args) {
            return this.sendRequest(args.url, 'POST', undefined, args.data);
        };
        ServerConnection.prototype.sendRequest = function (relativeUrl, method, additionalHeaders, data) {
            var _this = this;
            return this.csrfProtection.getRequestDependency()
                .then(function () {
                var standardHeaders = _this.createHeaders({ url: relativeUrl, data: data });
                var combinedHeaders = additionalHeaders ? _.assign(standardHeaders, additionalHeaders) : standardHeaders;
                return _this.requestWithoutHeadersAndCsrf(relativeUrl, method, combinedHeaders, data);
            });
        };
        ServerConnection.prototype.getCodelist = function (name) {
            return this.getAsync({
                url: (this.codelistsUrl || '') + name
            }).then(function (response) {
                var responseJson = response.getJsonString();
                var responseObj = JSON.parse(responseJson);
                if (responseObj && responseObj.value) {
                    return responseObj.value;
                }
                else {
                    return [];
                }
            });
        };
        ServerConnection.prototype.getCsrfToken = function () {
            if (this.csrfProtection) {
                return this.defaultHeaders[this.csrfProtection.tokenHeader];
            }
            return null;
        };
        ServerConnection.prototype.setIsAliveTimeout = function (args) {
            if (this.isAliveTimeoutMs !== null && this.timeoutId !== undefined) {
                clearTimeout(this.timeoutId);
            }
            this.isAliveTimeoutMs = _.isInteger(args.isAliveTimeout) && args.isAliveTimeout > 0 ? args.isAliveTimeout * 60 * 1000 : null;
            if (this.isAliveTimeoutMs !== null && this.onIsAliveTimeout) {
                this.timeoutId = setTimeout(this.onIsAliveTimeout, this.isAliveTimeoutMs);
            }
        };
        ServerConnection.prototype.getIsAliveTimeout = function () {
            if (this.isAliveTimeoutMs !== null) {
                return this.isAliveTimeoutMs / 1000 / 60;
            }
            return null;
        };
        /*
        If newer timestamp is received than codelists have probably changed.
        "Probably" is because timestamps can differ among instances of endpoint for the same codelists change.
        So if newer timestamp is received - change is signaled, if older or same - nothing happens.
        */
        ServerConnection.prototype.setLastCodelistChange = function (receivedTimestamp) {
            if (this.codelistsLastStamp) {
                if (this.codelistsLastStamp < receivedTimestamp) {
                    this.codelistsLastStamp = receivedTimestamp;
                    if (this.onCodelistsChanged) {
                        this.onCodelistsChanged();
                    }
                }
            }
            else if (receivedTimestamp) {
                this.codelistsLastStamp = receivedTimestamp;
                if (this.onCodelistsChanged) {
                    this.onCodelistsChanged();
                }
            }
        };
        return ServerConnection;
    }());
    sffw.ServerConnection = ServerConnection;
})(sffw || (sffw = {}));
if (typeof define !== 'undefined') {
    define([], function () {
        return sffw.ServerConnection;
    });
}
var sffw;
(function (sffw) {
    var api;
    (function (api) {
        var plainObject;
        (function (plainObject) {
            var ObjectPath = /** @class */ (function () {
                function ObjectPath(parts) {
                    this.parts = parts;
                }
                ObjectPath.fromALangNotation = function (path) {
                    var parts = path.split('/').map(function (s) {
                        return new ObjectPathPart(s, false);
                    });
                    return new ObjectPath(parts);
                };
                ObjectPath.fromObjectNotation = function (path) {
                    var parts = path.split('.').map(function (s) {
                        return new ObjectPathPart(s, true);
                    });
                    return new ObjectPath(parts);
                };
                ObjectPath.prototype.isArrayItem = function () {
                    return this.parts[this.parts.length - 1].hasIndex();
                };
                ObjectPath.prototype.lastPartZeroBasedIndex = function () {
                    return this.parts[this.parts.length - 1].zeroBasedIndex;
                };
                ObjectPath.prototype.toActionLangNotation = function () {
                    return this.parts.map(function (p) {
                        return p.toString(false);
                    }).join('/');
                };
                ObjectPath.prototype.toObjectNotation = function () {
                    return this.parts.map(function (p) {
                        return p.toString(true);
                    }).join('.');
                };
                ObjectPath.prototype.parentPath = function () {
                    if (this.parts.length === 1) {
                        return null;
                    }
                    else {
                        return new ObjectPath(this.parts.slice(0, this.parts.length - 1));
                    }
                };
                ObjectPath.prototype.lastItemArrayPath = function () {
                    if (!this.isArrayItem()) {
                        throw new Error("ObjectPath.lastItemArrayPath expects to be called only if it is ArrayItem (" + this.parts + ")");
                    }
                    var arrayParts = this.parts.slice(0, this.parts.length - 1);
                    arrayParts.push(new ObjectPathPart(this.parts[this.parts.length - 1].text, true));
                    return new ObjectPath(arrayParts);
                };
                return ObjectPath;
            }());
            plainObject.ObjectPath = ObjectPath;
            var ObjectPathPart = /** @class */ (function () {
                function ObjectPathPart(path, zeroBased) {
                    var matches = path.match(/^(\w+)\[(\d+)\]$/);
                    if (matches && matches.length === 3) {
                        this.text = matches[1];
                        this.zeroBasedIndex = zeroBased ? Number(matches[2]) : Number(matches[2]) - 1;
                    }
                    else {
                        this.text = path;
                        this.zeroBasedIndex = null;
                    }
                }
                ObjectPathPart.prototype.hasIndex = function () {
                    return _.isNumber(this.zeroBasedIndex);
                };
                ObjectPathPart.prototype.toString = function (zeroBased) {
                    if (this.hasIndex()) {
                        return this.text + "[" + ((this.zeroBasedIndex || 0) + (zeroBased ? 0 : 1)) + "]";
                    }
                    else {
                        return this.text;
                    }
                };
                return ObjectPathPart;
            }());
            plainObject.ObjectPathPart = ObjectPathPart;
        })(plainObject = api.plainObject || (api.plainObject = {}));
    })(api = sffw.api || (sffw.api = {}));
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
