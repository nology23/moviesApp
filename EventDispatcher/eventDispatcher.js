var sffw;
(function (sffw) {
    var api;
    (function (api) {
        var EventDispatcher;
        (function (EventDispatcher_1) {
            var EventDispatcher = /** @class */ (function () {
                function EventDispatcher(datacontext, args) {
                    this.datacontext = datacontext;
                    var self = this;
                    this.singleton = EventDispatcher_1.EventDispatcherSingleton.getInstance();
                    var handler = sffw.extractEventHandlerFromApiArgs(datacontext, args, 'OnMessage');
                    if (handler) {
                        this.onMessageHandler = handler;
                        this.singleton.OnMessage.subscribe(this.onMessageHandler);
                    }
                }
                EventDispatcher.prototype.sendMessage = function (args) {
                    if (this.singleton) {
                        this.singleton.sendMessage(this, null, args);
                    }
                };
                EventDispatcher.prototype.dispose = function () {
                    if (this.onMessageHandler) {
                        this.singleton.OnMessage.unsubscribe(this.onMessageHandler);
                        this.onMessageHandler = null;
                    }
                };
                return EventDispatcher;
            }());
            EventDispatcher_1.EventDispatcher = EventDispatcher;
        })(EventDispatcher = api.EventDispatcher || (api.EventDispatcher = {}));
    })(api = sffw.api || (sffw.api = {}));
})(sffw || (sffw = {}));
if (typeof define !== 'undefined') {
    define([], function () {
        return sffw.api.EventDispatcher.EventDispatcher;
    });
}
var sffw;
(function (sffw) {
    var api;
    (function (api) {
        var EventDispatcher;
        (function (EventDispatcher) {
            var DispatcherEvent = /** @class */ (function () {
                function DispatcherEvent() {
                    this.handlers = [];
                }
                DispatcherEvent.prototype.subscribe = function (handler) {
                    this.handlers.push(handler);
                };
                DispatcherEvent.prototype.unsubscribe = function (handler) {
                    this.handlers = this.handlers.filter(function (h) { return h !== handler; });
                };
                DispatcherEvent.prototype.trigger = function (data, event, params) {
                    this.handlers.slice(0).forEach(function (h) { return h(data, event, params); });
                };
                return DispatcherEvent;
            }());
            EventDispatcher.DispatcherEvent = DispatcherEvent;
            var EventDispatcherSingleton = /** @class */ (function () {
                function EventDispatcherSingleton() {
                    this.OnMessage = new DispatcherEvent();
                }
                EventDispatcherSingleton.getInstance = function () {
                    if (!EventDispatcherSingleton.instance) {
                        EventDispatcherSingleton.instance = new EventDispatcherSingleton();
                    }
                    return EventDispatcherSingleton.instance;
                };
                EventDispatcherSingleton.prototype.sendMessage = function (sender, event, params) {
                    this.OnMessage.trigger(sender, event, params);
                };
                return EventDispatcherSingleton;
            }());
            EventDispatcher.EventDispatcherSingleton = EventDispatcherSingleton;
        })(EventDispatcher = api.EventDispatcher || (api.EventDispatcher = {}));
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
