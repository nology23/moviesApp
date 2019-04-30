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
		    var ibi, designLabel, paramsParts,
		        processBinding = componentGen.processBinding,
		        generateComponentTree = componentGen.generateComponentTree,
		        staticText, classDefs;

            ibi = new componentGen.Tree('incontent-busy-indicator');

            paramsParts = [];
            if (def.Name) {
                paramsParts.push('Name: \'' + def.Name + '\'');
            }

            if (def.isLoading === true) {
                paramsParts.push('isLoading: ' + def.isLoading);
            } else if (def.isLoading) {
                paramsParts.push('isLoading: ' + (def.isLoading.Binding ? processBinding(def.isLoading.Binding)
                    : '\'' + def.isLoading.replace(/\"/g, '&quot;') + '\''));
            } else {
                paramsParts.push('isLoading: ' + false);
            }

            if (def.loadingImageSource) {
                paramsParts.push('loadingImageSource: \'' + def.loadingImageSource + '\'');
            }

            if (def.iconCssClass) {
                paramsParts.push('iconCssClass: \'' + def.iconCssClass + '\'');
            }

            paramsParts.push('$parentData: $data');

            ibi.attributes.params = paramsParts.join(', ');

            if (def.Content) {
                ibi.content.push(generateComponentTree(def.Content, isDesignTime));
            }

            componentWrapperTree.content.push(ibi);
		}
	};
});