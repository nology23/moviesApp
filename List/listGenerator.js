(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
	'use strict';
	var _ = (typeof window !== 'undefined' ? window._ : require('lodash'));

	return {
		generate: function (componentGen, def, componentWrapperTree, isDesignTime) {
		    var list, designLabel, paramsParts,
		        processBinding = componentGen.processBinding,
		        staticText, columns, filterOptions;

			if (isDesignTime) {
				designLabel = new componentGen.Tree('span');
				designLabel.content.push({ text: 'list ' + def.name });
				componentWrapperTree.content.push(designLabel);
			} else {
				list = new componentGen.Tree('sffw-list');

				paramsParts = [];
				if (def.listName) {
					paramsParts.push('listName: \'' + def.listName + '\'');
				}

				if (def.columns) {
					columns = _.map(def.columns, function (c) {
						var resultParts = [];
						if (c.ColumnName) {
							resultParts.push('Name: \'' + c.ColumnName + '\'');
						}

						if (c.DataType) {
							resultParts.push('DataType: \'' + c.DataType + '\'');
						}

						if (c.Caption) {
							if (c.Caption.Binding) {
								if (c.Caption.Binding.Context == '$localized') {
									resultParts.push('Caption: \'' + c.Caption.Binding.Path + '\'');
									resultParts.push('IsCaptionLocalized: true');
								} else {
									resultParts.push('Caption: '+ componentGen.processBinding(c.Caption.Binding));
								}
							} else {
								resultParts.push('Caption: \'' + c.Caption.replace(/\"/g, '&quot;') + '\'');
							}
						}
						if (c.IsVisible === false) {
							resultParts.push('IsVisible: ' + c.IsVisible);
						}

						if (c.EnableFilter === false) {
							resultParts.push('EnableFilter: ' + c.EnableFilter);
						}

						if (c.ColumnWidth) {
							resultParts.push('ColumnWidth: \'' + c.ColumnWidth + '\'');
						}

						if (c.filterOptions) {
							filterOptions = _.map(c.filterOptions, function (opt) {
								var optParts = [];
								if (opt.text) {
									if (opt.text.Binding) {
										if (opt.text.Binding.Context == '$localized') {
											optParts.push('text: \'' + opt.text.Binding.Path + '\'');
											optParts.push('isLocalized: true');
										} else {
											optParts.push('text: '+ componentGen.processBinding(opt.text.Binding));
										}
									} else {
										optParts.push('text: \'' + opt.text + '\'');
									}
								}
								if (opt.value) {
									optParts.push('value: \'' + opt.value + '\'');
								}
								return '{' + optParts.join(', ') + '}';
							});

							resultParts.push('filterOptions: [' + filterOptions.join(', ') + ']');
						}

						if (c.FilterOperatorType) {
							resultParts.push('FilterOperatorType: \'' + c.FilterOperatorType + '\'');
						}

						if (c.formatAsAmount === true) {
							resultParts.push('formatAsAmount: ' + c.formatAsAmount);
						}

						if (c.formatAsCurrency === true) {
							resultParts.push('formatAsCurrency: ' + c.formatAsCurrency);
						}

						if (c.filterOptionSource && c.filterOptionSource.Reference) {
							resultParts.push('filterOptionSource: ' + (c.filterOptionSource.IsGlobal ? '$root.$globals.$api[\'' : '$root.$api[\'') + c.filterOptionSource.Reference + '\']');
						}

						return '{' + resultParts.join(', ') + '}';
					});

					paramsParts.push('columns: [' + columns.join(', ') + ']');
				}

				if (def.controller && def.controller.Reference && !isDesignTime) {
					paramsParts.push('controller: ' + (def.controller.IsGlobal ? '$root.$globals.$api[\'' : '$root.$api[\'') + def.controller.Reference + '\']');
				}

				if (def.selectedRow && def.selectedRow.Binding) {
					paramsParts.push('selectedRow: ' + processBinding(def.selectedRow.Binding, null));
				}

				if (def.maxVisibleFilterOptions) {
					if (def.maxVisibleFilterOptions.Binding) {
						paramsParts.push('maxVisibleFilterOptions: ' + componentGen.processBinding(def.maxVisibleFilterOptions.Binding));
					} else {
						paramsParts.push('maxVisibleFilterOptions: ' + def.maxVisibleFilterOptions);
					}
				}

				paramsParts.push('$parentData: $data');

				list.attributes.params = paramsParts.join(', ');

				if (def.OnSelectionChange) {
		            list.attributes.params += ', onSelectionChange: ' + componentGen.processActionReference(def.OnSelectionChange);
				}

				if (def.OnRowsChanged) {
		            list.attributes.params += ', onRowsChanged: ' + componentGen.processActionReference(def.OnRowsChanged);
		        }

				if (def.OnRowClicked) {
		            list.attributes.params += ', onRowClicked: ' + componentGen.processActionReference(def.OnRowClicked);
		        }

				componentWrapperTree.content.push(list);
			}
		}
	};
});