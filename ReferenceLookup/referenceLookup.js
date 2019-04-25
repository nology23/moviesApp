var sffw;
(function (sffw) {
    var components;
    (function (components) {
        var referenceLookup;
        (function (referenceLookup) {
            'use strict';
            if (!ko.components.isRegistered('sffw-referencelookup')) {
                ko.components.register('sffw-referencelookup', {
                    viewModel: {
                        createViewModel: function (params, componentInfo) { return new sffw.components.referenceLookup.ReferenceLookupViewModel(params, componentInfo); }
                    },
                    template: "   <!-- ko if: isEnabled -->\n        <input data-bind=\"referenceLookup: data\" autocomplete=\"off\">\n    <!-- /ko -->\n    <!-- ko ifnot: isEnabled -->\n        <input data-bind=\"value: data[displayMember].$asString\" autocomplete=\"off\" disabled/>\n    <!-- /ko -->"
                });
            }
        })(referenceLookup = components.referenceLookup || (components.referenceLookup = {}));
    })(components = sffw.components || (sffw.components = {}));
})(sffw || (sffw = {}));
/* tslint:disable-next-line:interface-name */
var sffw;
(function (sffw) {
    var components;
    (function (components) {
        var referenceLookup;
        (function (referenceLookup) {
            'use strict';
            var handlers = ko.bindingHandlers;
            handlers.referenceLookup = handlers.referenceLookup || {
                init: function (element, valueAccessor, allBindings, viewModelDeprecated, bindingContext) {
                    var vm = bindingContext.$component;
                    var findOptions = function (request, response) {
                        var elementValue = $(element).val().trim();
                        var lookupData;
                        vm.getLookupData(elementValue, vm.displayMember).then(function (data) {
                            lookupData = data;
                            var foundItem = _.find(lookupData, function (item) {
                                return item[vm.displayMember].toLowerCase() === elementValue.toLowerCase();
                            });
                            if (foundItem != null) {
                                $(element).val(foundItem[vm.displayMember]);
                                if (vm.immediateUpdate) {
                                    return vm.data.$fromJson(lookupData[0], null, true);
                                }
                            }
                        }).then(function () {
                            var result = _(lookupData)
                                .map(function (item) { return item[vm.displayMember]; })
                                .value();
                            response(result);
                        });
                    };
                    var scrollPosition = -1;
                    var lastScrollTop = 0;
                    $(element).autocomplete({
                        source: findOptions,
                        appendTo: '.' + vm.panelClass,
                        // autoFocus: true,
                        minLength: vm.minChars,
                        select: function (event, ui) {
                            if (vm.immediateUpdate && (typeof event.key === 'undefined' || event.key !== 'Tab')) {
                                vm.getLookupData(ui.item.value, vm.displayMember).then(function (data) {
                                    return vm.data.$fromJson(data[0], null, true);
                                });
                            }
                        },
                        // jqueryui change event is triggered when the field is blurred
                        // we have own $(element).blur handler, so we will not use change event
                        open: function (event, ui) {
                            if (vm.panelClass !== null && vm.panelClass !== '' && typeof vm.panelClass !== 'undefined') {
                                var $input = $(event.target);
                                var $results = $input.autocomplete('widget');
                                var top_1 = $results.position().top;
                                var height = $results.height();
                                var inputHeight = $input[0].offsetHeight;
                                var newTop = top_1 - height - inputHeight - 2;
                                var elemTopPosition = $('.' + vm.panelClass).position().top;
                                var elemHeight = $('.' + vm.panelClass).height();
                                var elemBottom = elemTopPosition + elemHeight;
                                if (elemBottom < (top_1 + height + inputHeight)) {
                                    $results.css('top', newTop + 'px');
                                }
                                scrollPosition = $('.' + vm.panelClass).scrollTop();
                            }
                        },
                        search: function (event, ui) {
                            // fix bug in jQuery.ui somewhere where menu.bindings just grows and grows
                            // https://bugs.jqueryui.com/ticket/15095
                            // possibly could be fixed in jQuery.ui 1.12.2
                            $(element).data('ui-autocomplete').menu.bindings = $();
                        },
                        close: function (event, ui) {
                            if (vm.panelClass != null && vm.panelClass !== '') {
                                scrollPosition = -1;
                            }
                        }
                    });
                    function SetWarningTimeout(el) {
                        $(el).addClass('notifyRefusal');
                        setTimeout(function () {
                            $(el).removeClass('notifyRefusal');
                        }, 2000);
                    }
                    $('.' + vm.panelClass).scroll(function (event) {
                        if (vm.panelClass !== null && vm.panelClass !== '' && typeof vm.panelClass !== 'undefined') {
                            var st = $(this).scrollTop();
                            if (scrollPosition !== -1) {
                                $('.' + vm.panelClass).scrollTop(scrollPosition);
                                if (st > lastScrollTop) {
                                    $(window).scrollTop($(window).scrollTop() + st - lastScrollTop);
                                }
                            }
                            lastScrollTop = st;
                        }
                    });
                    if (vm.minChars === 0) {
                        $(element).focus(function () {
                            if ($(element).val() !== null && $(element).val() !== '') {
                                $(element).autocomplete('search', $(element).val());
                            }
                            else {
                                $(element).autocomplete('search', '');
                            }
                        });
                    }
                    $(element).blur(function (event, ui) {
                        var referenceAtt = vm.data;
                        var descAtt = referenceAtt[vm.displayMember];
                        var elementValue = $(element).val().trim();
                        if (elementValue.length === 0) {
                            return vm.data.$emptyRecursive(true);
                        }
                        else if (descAtt.$hasValue() && descAtt.$value().toLowerCase() === elementValue.toLowerCase()) {
                            $(element).val(descAtt.$value());
                        }
                        else {
                            var boxContent_1 = $(element).val();
                            var cachedItem_1;
                            if (vm.itemsCache && vm.itemsCache.startString.toLowerCase() === boxContent_1.toLowerCase()) {
                                cachedItem_1 = _.find(vm.itemsCache.values, function (itm) { return itm[vm.displayMember] && itm[vm.displayMember].toLowerCase() === boxContent_1; });
                            }
                            if (cachedItem_1) {
                                return vm.data.$fromJson(cachedItem_1, null, true).then(function () {
                                    $(element).val(cachedItem_1[vm.displayMember]);
                                });
                            }
                            else {
                                vm.getLookupData(boxContent_1, vm.displayMember).then(function (data) {
                                    if (data != null && data.length > 0) {
                                        var selectedItem_1 = data[0];
                                        return vm.data.$fromJson(selectedItem_1, null, true).then(function () {
                                            $(element).val(selectedItem_1[vm.displayMember]);
                                        });
                                    }
                                    else {
                                        return vm.data.$emptyRecursive(true).then(function () {
                                            SetWarningTimeout(element);
                                            $(element).val(elementValue);
                                        });
                                    }
                                });
                            }
                        }
                    });
                },
                update: function (element, valueAccessor, allBindings, viewModelDeprecated, bindingContext) {
                    var vm = bindingContext.$component;
                    var displayMemberAtt = vm.data[vm.displayMember];
                    if (displayMemberAtt.$value() != null) {
                        $(element).val(displayMemberAtt.$value());
                    }
                    else {
                        $(element).val('');
                    }
                }
            };
        })(referenceLookup = components.referenceLookup || (components.referenceLookup = {}));
    })(components = sffw.components || (sffw.components = {}));
})(sffw || (sffw = {}));
var sffw;
(function (sffw) {
    var components;
    (function (components) {
        var referenceLookup;
        (function (referenceLookup) {
            'use strict';
            var ReferenceLookupViewModel = /** @class */ (function () {
                function ReferenceLookupViewModel(params, componentInfo) {
                    var _this = this;
                    this.subscriptions = [];
                    this.panelClass = params.panelClass;
                    this.dataApiObject = params.dataApiObject;
                    this.data = params.data;
                    this.displayMember = params.displayMember || this.dataApiObject.getDisplayMemberName();
                    if (_.isUndefined(params.isEnabled)) {
                        this.isEnabled = ko.observable(true);
                    }
                    else if (typeof (params.isEnabled) === 'function') {
                        this.isEnabled = params.isEnabled;
                    }
                    else {
                        this.isEnabled = ko.observable(params.isEnabled);
                    }
                    this.minChars = _.isNumber(params.minChars) ? params.minChars : 1;
                    this.useContains = params.useContains !== false;
                    this.immediateUpdate = params.immediateUpdate === true;
                    this.expectLinebreaksInValues = params.expectLinebreaksInValues === true;
                    this.resultSorting = params.resultSorting || 'advanced';
                    this.subscriptions.push(window.sf.localization.currentCultureCode.subscribe(function () {
                        _this.itemsCache = null;
                    }));
                }
                ReferenceLookupViewModel.prototype.getLookupData = function (startString, attributeName) {
                    var _this = this;
                    if (this.itemsCache && this.itemsCache.startString === startString) {
                        return Promise.resolve(this.itemsCache.values);
                    }
                    return this.dataApiObject.getLookupData(startString, attributeName, this.useContains, this.expectLinebreaksInValues, null, this.resultSorting)
                        .then(function (values) {
                        _this.itemsCache = { startString: startString, values: values };
                        return values;
                    });
                };
                ReferenceLookupViewModel.prototype.dispose = function () {
                    this.data = null;
                    this.dataApiObject = null;
                    this.itemsCache = null;
                    _.each(this.subscriptions, function (sub) {
                        sub.dispose();
                    });
                };
                return ReferenceLookupViewModel;
            }());
            referenceLookup.ReferenceLookupViewModel = ReferenceLookupViewModel;
        })(referenceLookup = components.referenceLookup || (components.referenceLookup = {}));
    })(components = sffw.components || (sffw.components = {}));
})(sffw || (sffw = {}));
