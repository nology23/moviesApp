var sffw;
(function (sffw) {
    var api;
    (function (api) {
        var urlRouter;
        (function (urlRouter) {
            var Route = /** @class */ (function () {
                // routeParams looks like a&b&c?&d?, where '&' splits the params and '?' after param name indicates that param is optional
                function Route(formAlias, formName, routeParamsDef, masterPage) {
                    if (masterPage === void 0) { masterPage = null; }
                    var _this = this;
                    this.formAlias = formAlias;
                    this.formName = formName;
                    this.masterPage = masterPage;
                    var parts = (routeParamsDef || '').split(',');
                    var optionalParamDefRegex = /^(\w+)\?$/;
                    var mandatoryParamDefRegex = /^(\w+)$/;
                    this.routeParams = [];
                    _(parts).each(function (s) {
                        var regexResult = optionalParamDefRegex.exec(s);
                        if (regexResult) {
                            _this.routeParams.push(new RouteParam(regexResult[1], true));
                        }
                        else {
                            regexResult = mandatoryParamDefRegex.exec(s);
                            if (regexResult) {
                                _this.routeParams.push(new RouteParam(regexResult[1], false));
                            }
                        }
                    });
                }
                Route.prototype.matchUrlParse = function (parse) {
                    var _this = this;
                    if (!parse.form || !this.formAlias) {
                        return false;
                    }
                    if (parse.form.toLowerCase() !== this.formAlias.toLowerCase()) {
                        return false;
                    }
                    var hasExtraParams = _.some(parse.routeParams, function (p) {
                        return !_this.hasParam(p.name);
                    });
                    if (hasExtraParams) {
                        return false;
                    }
                    var mandatoryParamNames = _(this.routeParams)
                        .filter(function (rp) { return !rp.optional; })
                        .map(function (rp) { return rp.name; })
                        .valueOf();
                    var parseParamNames = _.map(parse.routeParams, function (rp) {
                        return rp.name;
                    });
                    var isMissingMandatoryParam = _.some(mandatoryParamNames, function (name) {
                        return !_(parseParamNames).includes(name);
                    });
                    if (isMissingMandatoryParam) {
                        return false;
                    }
                    return true;
                };
                Route.prototype.hasParam = function (paramName) {
                    return _(this.routeParams)
                        .map(function (rp) {
                        return rp.name;
                    })
                        .some(function (rpName) {
                        return rpName === paramName;
                    });
                };
                return Route;
            }());
            urlRouter.Route = Route;
            var RouteParam = /** @class */ (function () {
                function RouteParam(name, optional) {
                    this.name = name;
                    this.optional = optional;
                }
                return RouteParam;
            }());
            urlRouter.RouteParam = RouteParam;
        })(urlRouter = api.urlRouter || (api.urlRouter = {}));
    })(api = sffw.api || (sffw.api = {}));
})(sffw || (sffw = {}));
var sffw;
(function (sffw) {
    var api;
    (function (api) {
        var urlRouter;
        (function (urlRouter) {
            var UrlModel = /** @class */ (function () {
                function UrlModel(router) {
                    this.router = router;
                    this.paramStrings = [];
                }
                UrlModel.prototype.addString = function (args) {
                    this.paramStrings.push(args.name + "=" + encodeURI(args.value));
                    return this;
                };
                UrlModel.prototype.addInt = function (args) {
                    this.paramStrings.push(args.name + "=" + encodeURI(args.value.toString()));
                    return this;
                };
                UrlModel.prototype.updatePageUrl = function () {
                    this.router.internalUrlUpdate = true;
                    var hash = "" + this.formAlias + (this.paramStrings.length > 0 ? '/' : '') + this.paramStrings.join('&');
                    window.location.hash = hash;
                    this.router.internalHashChange = true;
                    this.router.internalUrlUpdate = false;
                    return this;
                };
                UrlModel.prototype.getPageUrl = function () {
                    return "" + window.location.origin + window.location.pathname + "#" + this.formAlias + (this.paramStrings.length > 0 ? '/' : '') + this.paramStrings.join('&');
                };
                return UrlModel;
            }());
            urlRouter.UrlModel = UrlModel;
        })(urlRouter = api.urlRouter || (api.urlRouter = {}));
    })(api = sffw.api || (sffw.api = {}));
})(sffw || (sffw = {}));
var sffw;
(function (sffw) {
    var api;
    (function (api) {
        var urlRouter;
        (function (urlRouter) {
            var UrlParse = /** @class */ (function () {
                function UrlParse(pathHash) {
                    var _this = this;
                    this.routeParams = [];
                    this.isValid = true;
                    if (!_.isString(pathHash) || pathHash[0] !== '#') {
                        this.isValid = false;
                        return;
                    }
                    this.form = this.getForm(pathHash);
                    if (!this.form) {
                        this.isValid = false;
                        return;
                    }
                    var paramParts = this.getParameterParts(pathHash);
                    _(paramParts).each(function (param) {
                        var p = _this.parseParam(param);
                        if (!p) {
                            _this.isValid = false;
                        }
                        else {
                            _this.routeParams.push({ name: p.name, value: p.value });
                        }
                    });
                }
                UrlParse.prototype.getForm = function (locationPathName) {
                    var regexResult = /^\#(\w+)/.exec(locationPathName);
                    // assert(regexResult);
                    if (regexResult) {
                        sffw.assert(regexResult[1]);
                        return regexResult[1];
                    }
                    return null;
                };
                UrlParse.prototype.getParameterParts = function (locationPathName) {
                    var paramString = locationPathName.split('/');
                    if (paramString.length !== 2) {
                        return [];
                    }
                    var paramParts = paramString[1].split('&');
                    paramParts = _.filter(paramParts, function (s) { return s.length > 0; }); // skipping empty to allow url like #form/
                    return paramParts;
                };
                UrlParse.prototype.parseParam = function (param) {
                    var parts = param.split('=');
                    if (parts.length !== 2) {
                        return null;
                    }
                    return {
                        name: parts[0],
                        value: decodeURI(parts[1])
                    };
                };
                return UrlParse;
            }());
            urlRouter.UrlParse = UrlParse;
        })(urlRouter = api.urlRouter || (api.urlRouter = {}));
    })(api = sffw.api || (sffw.api = {}));
})(sffw || (sffw = {}));
var sffw;
(function (sffw) {
    var api;
    (function (api) {
        var urlRouter;
        (function (urlRouter) {
            var UrlRouter = /** @class */ (function () {
                function UrlRouter(datacontext, args) {
                    var _this = this;
                    this.internalUrlUpdate = false;
                    this.internalHashChange = false;
                    this.dataHasChanged = false;
                    sffw.assert(_.isArray(args.routes));
                    this.routes = [];
                    _(args.routes).each(function (routeDef) {
                        _this.routes.push(new urlRouter.Route(routeDef.url, routeDef.form.Reference, routeDef.params, routeDef.masterPage && routeDef.masterPage.Reference));
                    });
                    this.registerBeforeUnloadConfirm = !!args.registerBeforeUnloadConfirm;
                    this.ieOrEdgeVersion = this.getIEOrEdgeVersion();
                    this.onpopstateHandler = function (event) {
                        if (!_this.internalUrlUpdate) {
                            window.location.reload();
                        }
                    };
                    this.onhashchangeHandler = function (event) {
                        if (!_this.internalUrlUpdate) {
                            // workaround for IE bug - previous url remains in address bar, older Edge perhaps works
                            if (_this.isIe()) {
                                window.location.hash = window.location.hash;
                            }
                            // do not reload after updatePageUrl(), only after browser back/forward
                            if (!_this.internalHashChange) {
                                window.location.reload();
                            }
                            else {
                                _this.internalHashChange = false;
                            }
                        }
                    };
                    // IE and Edge < 14 do not fire the popstate event when the URL's hash value changes
                    // https://caniuse.com/#feat=history
                    if (this.isIeOrEdgeUnder14()) {
                        window.onhashchange = this.onhashchangeHandler;
                    }
                    else {
                        window.onpopstate = this.onpopstateHandler;
                    }
                    if (this.registerBeforeUnloadConfirm) {
                        window.addEventListener('beforeunload', function (event) {
                            var retVal;
                            if (_this.dataHasChanged === true) {
                                // Cancel the event as stated by the standard.
                                event.preventDefault();
                                retVal = '';
                                // Chrome requires returnValue to be set.
                                event.returnValue = retVal;
                            }
                            else {
                                retVal = undefined;
                            }
                            return retVal;
                        });
                    }
                }
                UrlRouter.prototype.openInitialForm = function (navigation, defaultForm, defaultMasterPage) {
                    var _this = this;
                    if (typeof window !== 'undefined') {
                        var urlParse_1 = new urlRouter.UrlParse(window.location.hash);
                        if (urlParse_1.isValid && urlParse_1.form) {
                            var route_1 = _(this.routes).find(function (r) {
                                return r.matchUrlParse(urlParse_1);
                            });
                            if (route_1) {
                                if (route_1.masterPage) {
                                    return navigation.navigate({ type: 'Replace', isRoot: true, form: route_1.masterPage })
                                        .then(function () {
                                        return navigation.navigate({
                                            type: 'Replace',
                                            form: route_1.formName,
                                            inputDataCallback: function (dc) {
                                                _this.setInputData(dc, urlParse_1);
                                                return Promise.resolve();
                                            }
                                        });
                                    });
                                }
                                return navigation.navigate({
                                    type: 'Replace',
                                    isRoot: true,
                                    form: route_1.formName,
                                    inputDataCallback: function (dc) {
                                        _this.setInputData(dc, urlParse_1);
                                        return Promise.resolve();
                                    }
                                });
                            }
                        }
                    }
                    // default navigation
                    if (defaultMasterPage) {
                        return navigation.navigate({ type: 'Replace', isRoot: true, form: defaultMasterPage })
                            .then(function () {
                            return navigation.navigate({ type: 'Replace', form: defaultForm });
                        });
                    }
                    else {
                        return navigation.navigate({ type: 'Replace', isRoot: true, form: defaultForm });
                    }
                };
                UrlRouter.prototype.clearUrl = function () {
                    window.location.hash = '';
                };
                UrlRouter.prototype.findFormUrl = function (args) {
                    var model = new urlRouter.UrlModel(this);
                    var route = _.find(this.routes, function (r) {
                        return r.formName === args.fullname;
                    });
                    if (route) {
                        model.formAlias = route.formAlias;
                    }
                    else {
                        console.error("Failed to find route for form " + args.fullname);
                        model.formAlias = 'urlNotFound';
                    }
                    return model;
                };
                UrlRouter.prototype.createUrl = function (formAlias) {
                    var model = new urlRouter.UrlModel(this);
                    model.formAlias = formAlias;
                };
                UrlRouter.prototype.setDataHasChanged = function (args) {
                    this.dataHasChanged = args.changed;
                };
                UrlRouter.prototype.getIEOrEdgeVersion = function () {
                    var ua = window.navigator.userAgent;
                    var msie = ua.indexOf('MSIE ');
                    if (msie > 0) {
                        // IE 10 or older => return version number
                        return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
                    }
                    var trident = ua.indexOf('Trident/');
                    if (trident > 0) {
                        // IE 11 => return version number
                        var rv = ua.indexOf('rv:');
                        return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
                    }
                    var edge = ua.indexOf('Edge/');
                    if (edge > 0) {
                        // Edge (IE 12+) => return version number
                        return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
                    }
                    // other browser
                    return null;
                };
                UrlRouter.prototype.isIeOrEdgeUnder14 = function () {
                    return typeof this.ieOrEdgeVersion !== 'undefined' && this.ieOrEdgeVersion !== null && this.ieOrEdgeVersion < 14;
                };
                UrlRouter.prototype.isIe = function () {
                    return typeof this.ieOrEdgeVersion !== 'undefined' && this.ieOrEdgeVersion !== null && this.ieOrEdgeVersion < 12;
                };
                UrlRouter.prototype.getAppUrl = function () {
                    var parts = window.location.href.split('#');
                    return parts[0];
                };
                UrlRouter.prototype.setInputData = function (dc, urlParse) {
                    _(urlParse.routeParams).each(function (par) {
                        var att = dc[par.name];
                        if (att) {
                            switch (att.$meta.type) {
                                case 'string':
                                    sffw.assert(_.isString(par.value));
                                    att.$value(par.value);
                                    break;
                                case 'integer':
                                    var num = Number(par.value);
                                    sffw.assert(_.isFinite(num));
                                    att.$value(num);
                                    break;
                                case 'enum':
                                    att.$value(par.value);
                                    break;
                                default:
                                    console.error("Unsupported type " + att.$meta.type + " as route parameter");
                            }
                        }
                        else {
                            console.error("Cannot find attribute " + par.name + " on datacontext to be filled from route parameter");
                        }
                    });
                };
                return UrlRouter;
            }());
            urlRouter.UrlRouter = UrlRouter;
        })(urlRouter = api.urlRouter || (api.urlRouter = {}));
    })(api = sffw.api || (sffw.api = {}));
})(sffw || (sffw = {}));
if (typeof define !== 'undefined') {
    define([], function () {
        return sffw.api.urlRouter.UrlRouter;
    });
}
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
