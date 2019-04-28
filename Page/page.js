var sffw;
(function (sffw) {
    var Page = /** @class */ (function () {
        function Page(datacontext, args) {
            this.subscriptions = [];
            this.onLangChangedCallback = sffw.extractEventHandlerFromApiArgs(datacontext, args, 'OnLangChanged');
            if (this.onLangChangedCallback && typeof window !== 'undefined' && window.sf && window.sf.localization) {
                this.subscriptions.push(window.sf.localization.currentCultureCode.subscribe(this.onCurrentCultureCodeChanged, this));
            }
        }
        Page.prototype.onCurrentCultureCodeChanged = function () {
            if (this.onLangChangedCallback && _.isFunction(this.onLangChangedCallback)) {
                this.onLangChangedCallback();
            }
        };
        Page.prototype.setLang = function (args) {
            if (typeof window !== 'undefined' && window.sf && window.sf.localization) {
                window.sf.localization.setCurrentCultureSync(args.lang);
            }
        };
        Page.prototype.getLang = function () {
            if (typeof window !== 'undefined' && window.sf && window.sf.localization) {
                return window.sf.localization.currentCultureCode();
            }
        };
        Page.prototype.setTitle = function (args) {
            if (args.title) {
                document.title = args.title;
            }
        };
        Page.prototype.confirm = function (args) {
            return confirm(args.message);
        };
        Page.prototype.scrollToTop = function (args) {
            $('html,body').scrollTop(0);
        };
        Page.prototype.navigateToUrl = function (args) {
            if (window) {
                if (args.replace) {
                    window.location.replace(args.url);
                }
                else {
                    window.location.href = args.url;
                }
            }
        };
        Page.prototype.getCurrentUrlProtocol = function () {
            if (window) {
                return window.location.protocol;
            }
        };
        Page.prototype.getCurrentUrlOrigin = function () {
            if (window) {
                return window.location.origin;
            }
        };
        Page.prototype.getCurrentUrlPathName = function () {
            if (window) {
                return window.location.pathname;
            }
        };
        Page.prototype.getCurrentUrlHash = function () {
            if (window) {
                return window.location.hash;
            }
        };
        Page.prototype.print = function () {
            if (window) {
                window.print();
            }
        };
        Page.prototype.focusControl = function (args) {
            var collectionIdx;
            if (args.pointer) {
                var partIdx = args.pointer.match(/\d+(?=\])/); // pointer with [number]
                if (partIdx) {
                    collectionIdx = +partIdx[partIdx.length - 1]; // index in last collection in the pointer path
                }
            }
            if (_.isNumber(collectionIdx)) {
                // input editor in collection (repeater, datatable)
                if ($("div[data-name='" + args.name + "']").length > 1) {
                    $("div[data-name='" + args.name + "']:eq(" + (collectionIdx - 1) + ") .editor-value").focus();
                    return;
                }
            }
            if ($("div[data-name='" + args.name + "'] sffw-referencelookup").length === 1) {
                // referenceLookup
                $("div[data-name='" + args.name + "'] .editor-value .ui-autocomplete-input").focus();
            }
            else if ($("div[data-name='" + args.name + "'] sffw-iconstylecheckbox").length === 1) {
                // iconStyleCheckbox
                $("div[data-name='" + args.name + "'] .editor-value .sffw-icon-checkbox").focus();
            }
            else {
                // input editor
                $("div[data-name='" + args.name + "'] .editor-value").focus();
            }
        };
        Page.prototype.scrollTo = function (args) {
            var $element = this.getScrollElement(args);
            if ($element) {
                var pos = $element.offset();
                $('html,body').animate({ scrollTop: pos.top });
            }
        };
        Page.prototype.getScrollElement = function (args) {
            var $element = null;
            var collectionIdx;
            if (args.pointer) {
                var partIdx = args.pointer.match(/\d+(?=\])/); // pointer with [number]
                if (partIdx) {
                    collectionIdx = +partIdx[partIdx.length - 1]; // index in last collection in the pointer path
                }
            }
            if (_.isNumber(collectionIdx)) {
                // input editor in collection (repeater, datatable)
                if ($("div[data-name='" + args.name + "']").length > 1) {
                    $element = $("div[data-name='" + args.name + "']:eq(" + (collectionIdx - 1) + ")");
                }
            }
            else {
                $element = $("div[data-name='" + args.name + "']");
            }
            return $element;
        };
        Page.prototype.scrollToWithOffset = function (args) {
            var $element = this.getScrollElement(args);
            if ($element) {
                var scrollTo_1 = $element.offset().top;
                var offset = +args.offset;
                if (_.isNumber(offset)) {
                    scrollTo_1 -= offset;
                }
                $('html,body').animate({ scrollTop: scrollTo_1 });
            }
        };
        Page.prototype.dispose = function () {
            this.onLangChangedCallback = null;
            _.each(this.subscriptions, function (sub) { return sub.dispose(); });
        };
        return Page;
    }());
    sffw.Page = Page;
})(sffw || (sffw = {}));
if (typeof define !== 'undefined') {
    define([], function () {
        return sffw.Page;
    });
}
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
