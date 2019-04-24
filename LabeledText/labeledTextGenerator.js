(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "../utils", "./editor"], factory);
    }
})(function (require, exports) {
    'use strict';
    
    return {
    	generate: function (componentGen, def, componentWrapperTree, isDesigntime) {
	        var processBindingPreferAsString = componentGen.processBindingPreferAsString,
	        	Tree = componentGen.Tree,
	        	editorValueTree;
	        
			editorValueTree = new Tree('sffw-labeledtext');

			var paramsParts = [];

			if (def.Data && def.Data.Binding) {
                paramsParts.push('Data: ' + componentGen.processBindingPreferAsString(def.Data.Binding));
            }

            if(def.IsCurrency){
                paramsParts.push('IsCurrency: ' + def.IsCurrency);
            }

            if(def.IsAmount){
                paramsParts.push('IsAmount: ' + def.IsAmount);
            }

	        if (def.TextAlign) {
	            editorValueTree.style['text-align'] = def.TextAlign.toLowerCase();
			}
			
			editorValueTree.attributes.params = paramsParts.join(', ');


	        componentGen.editor.generate(componentGen, def, componentWrapperTree, isDesigntime, editorValueTree);
	    }
    };
});
