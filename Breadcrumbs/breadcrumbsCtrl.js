var sffw;
(function (sffw) {
    var components;
    (function (components) {
        var breadcrumbs;
        (function (breadcrumbs) {
            var Breadcrumb = /** @class */ (function () {
                function Breadcrumb(index, id, title, url, data, clickable) {
                    this.id = id;
                    this.title = title;
                    this.url = url;
                    this.data = data;
                    this.index = index;
                    this.active = ko.observable(false);
                    if (clickable === true) {
                        this.clickable = ko.observable(true);
                    }
                    else {
                        this.clickable = ko.observable(false);
                    }
                    this.cssClass = ko.pureComputed(this.getCssClass, this);
                }
                Breadcrumb.prototype.getCssClass = function () {
                    var cssClass = this.active() ? 'active' : '';
                    return cssClass;
                };
                Breadcrumb.prototype.getIndex = function () {
                    return this.index;
                };
                Breadcrumb.prototype.getId = function () {
                    return this.id;
                };
                Breadcrumb.prototype.getTitle = function () {
                    if (typeof (this.title) === 'function') {
                        return this.title();
                    }
                    else {
                        return this.title;
                    }
                };
                Breadcrumb.prototype.getUrl = function () {
                    return this.url;
                };
                Breadcrumb.prototype.getData = function () {
                    return this.data;
                };
                Breadcrumb.prototype.isClickable = function () {
                    if (this.clickable() === true) {
                        return true;
                    }
                    return false;
                };
                return Breadcrumb;
            }());
            breadcrumbs.Breadcrumb = Breadcrumb;
        })(breadcrumbs = components.breadcrumbs || (components.breadcrumbs = {}));
    })(components = sffw.components || (sffw.components = {}));
})(sffw || (sffw = {}));
var sffw;
(function (sffw) {
    var components;
    (function (components) {
        var breadcrumbs;
        (function (breadcrumbs) {
            var BreadcrumbsCtrl = /** @class */ (function () {
                function BreadcrumbsCtrl(datacontext, args) {
                    this.datacontext = datacontext;
                    this.breadcrumbs = ko.observableArray();
                    if (args.$events && args.$events.OnChange && args.$events.OnChange.Reference) {
                        this.onChangeCallback = datacontext.$actions[args.$events.OnChange.Reference];
                    }
                }
                BreadcrumbsCtrl.prototype.setActive = function (bc) {
                    this.breadcrumbs().forEach(function (item) {
                        item.active(false);
                    });
                    bc.active(true);
                };
                BreadcrumbsCtrl.prototype.setLastBreadcrumbActive = function () {
                    if (this.breadcrumbs().length > 0) {
                        var lastBc = this.breadcrumbs()[this.breadcrumbs().length - 1];
                        this.setActive(lastBc);
                    }
                };
                BreadcrumbsCtrl.prototype.addBreadcrumb = function (args) {
                    var newIndex = this.breadcrumbs().length;
                    var title = null;
                    var titleAtt = this.findDataOnPathInternal(args.titleOrTitlePath, this.controlStruct);
                    if (titleAtt) {
                        if (titleAtt.$asString) {
                            title = titleAtt.$asString;
                        }
                        else if (titleAtt.$meta.caption) {
                            title = titleAtt.$meta.caption;
                        }
                    }
                    title = title || args.titleOrTitlePath;
                    var newItem = new breadcrumbs.Breadcrumb(newIndex, args.id, title, args.url, args.data, args.clickable);
                    this.breadcrumbs.push(newItem);
                    this.setActive(newItem);
                    if (this.onChangeCallback) {
                        this.onChangeCallback();
                    }
                };
                BreadcrumbsCtrl.prototype.findDataOnPathInternal = function (path, datastruct) {
                    var normalizedPath = path.replace(/\//g, '.');
                    return _.at(datastruct, [normalizedPath])[0];
                };
                BreadcrumbsCtrl.prototype.removeLast = function () {
                    this.breadcrumbs.pop();
                    this.setLastBreadcrumbActive();
                    if (this.onChangeCallback) {
                        this.onChangeCallback();
                    }
                };
                BreadcrumbsCtrl.prototype.removeTo = function (args) {
                    if (args && args.index !== null && args.index >= 0) {
                        var savedLength = this.breadcrumbs().length;
                        for (var ii = savedLength - 1; ii >= 0; ii--) {
                            if (ii >= args.index) {
                                this.breadcrumbs.pop();
                                this.setLastBreadcrumbActive();
                            }
                        }
                        if (savedLength !== this.breadcrumbs().length && this.onChangeCallback) {
                            this.onChangeCallback();
                        }
                    }
                };
                BreadcrumbsCtrl.prototype.removeAll = function () {
                    this.breadcrumbs.removeAll();
                    if (this.onChangeCallback) {
                        this.onChangeCallback();
                    }
                };
                BreadcrumbsCtrl.prototype.count = function () {
                    return this.breadcrumbs().length;
                };
                BreadcrumbsCtrl.prototype.getItem = function (args) {
                    if (args.index >= 0 && this.breadcrumbs().length >= args.index) {
                        var bcItem = this.breadcrumbs()[args.index];
                        return bcItem;
                    }
                    return null;
                };
                BreadcrumbsCtrl.prototype.getItemJson = function (args) {
                    if (args.index >= 0 && this.breadcrumbs().length >= args.index) {
                        var bcItem = this.breadcrumbs()[args.index];
                        var bcJson = JSON.stringify(bcItem);
                        return bcJson;
                    }
                    return null;
                };
                BreadcrumbsCtrl.prototype.getAllJson = function () {
                    if (this.breadcrumbs().length >= 0) {
                        var bcJson = JSON.stringify(this.breadcrumbs());
                        return bcJson;
                    }
                    return null;
                };
                BreadcrumbsCtrl.prototype.getFullPath = function () {
                    if (this.breadcrumbs().length > 0) {
                        var fullPath_1 = '';
                        _(this.breadcrumbs()).each(function (bc) {
                            fullPath_1 = fullPath_1 + "/" + bc.id;
                        });
                        return fullPath_1;
                    }
                    return null;
                };
                BreadcrumbsCtrl.prototype.init = function (args) {
                    if (args.controlStruct.indexOf('::') !== -1) {
                        var parts = args.controlStruct.split('::');
                        sffw.assert(parts.length === 2);
                        var dataPathRoot = this.datacontext.$globals[parts[0].toLowerCase()];
                        this.controlStruct = dataPathRoot[parts[1]];
                    }
                    else {
                        this.controlStruct = this.datacontext[args.controlStruct];
                    }
                };
                BreadcrumbsCtrl.prototype.dispose = function () {
                    this.onChangeCallback = null;
                    this.breadcrumbs = null;
                };
                return BreadcrumbsCtrl;
            }());
            breadcrumbs.BreadcrumbsCtrl = BreadcrumbsCtrl;
        })(breadcrumbs = components.breadcrumbs || (components.breadcrumbs = {}));
    })(components = sffw.components || (sffw.components = {}));
})(sffw || (sffw = {}));
if (typeof define !== 'undefined') {
    define([], function () {
        return sffw.components.breadcrumbs.BreadcrumbsCtrl;
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
