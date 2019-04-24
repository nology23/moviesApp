var sffw;
(function (sffw) {
    var components;
    (function (components) {
        var labeledtext;
        (function (labeledtext) {
            var LabeledTextModel = /** @class */ (function () {
                function LabeledTextModel(params, componentInfo) {
                    this.displayedText = params.Data;
                    if (params.IsCurrency || params.IsAmount) {
                        this.displayedText = ko.pureComputed(function () {
                            return sffw.formatAsAmountOrCurrency(params.Data(), params.IsAmount, params.IsCurrency);
                        });
                    }
                    else {
                        this.displayedText = params.Data;
                    }
                }
                return LabeledTextModel;
            }());
            labeledtext.LabeledTextModel = LabeledTextModel;
        })(labeledtext = components.labeledtext || (components.labeledtext = {}));
    })(components = sffw.components || (sffw.components = {}));
})(sffw || (sffw = {}));
var sffw;
(function (sffw) {
    var components;
    (function (components) {
        var labeledtext;
        (function (labeledtext) {
            if (ko && !ko.components.isRegistered('sffw-labeledtext')) {
                ko.components.register('sffw-labeledtext', {
                    viewModel: {
                        createViewModel: function (params, componentInfo) { return new sffw.components.labeledtext.LabeledTextModel(params, componentInfo); }
                    },
                    template: "\n            <div data-bind=\"text: displayedText\" class=\"editor-value\">\n            </div>"
                });
            }
        })(labeledtext = components.labeledtext || (components.labeledtext = {}));
    })(components = sffw.components || (sffw.components = {}));
})(sffw || (sffw = {}));
var sffw;
(function (sffw) {
    function formatAsAmountOrCurrency(strValue, formatAsAmount, formatAsCurrency) {
        var decimalSign = window.sf.localization.currentCulture().getDecimalSign();
        var thousandSign = window.sf.localization.currentCulture().getThousandSign();
        var places = 0; // pocet destinych pozic
        var symbol = '\u20AC'; // euro znak
        if (formatAsCurrency) {
            places = 2;
        }
        if (formatAsAmount) {
            places = 6;
        }
        var numValue = strValue.replace(decimalSign, '.');
        var decimalPart = numValue.split('.');
        var negative = numValue < 0 ? '-' : '';
        var i = parseInt(numValue = Math.abs(+numValue || 0).toFixed(places), 10) + '';
        var j = i.length > 3 ? (i.length) % 3 : 0;
        return negative + (j ? i.substr(0, j) + thousandSign : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + thousandSign) + (typeof decimalPart[1] !== 'undefined' ? (decimalSign + decimalPart[1]) : '') + (formatAsCurrency ? ' ' + symbol : '');
    }
    sffw.formatAsAmountOrCurrency = formatAsAmountOrCurrency;
})(sffw || (sffw = {}));
