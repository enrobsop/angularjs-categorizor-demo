categorizorModule.factory('categorizorHelper', function() {

    var buildIndex = function(source, property) {
        var tempArray = [];
        for(var i= 0, len = source.length; i < len; i++) {
            tempArray[source[i][property]] = source[i];
        }
        return tempArray;
    };

    return {
        buildIndex: buildIndex
    };

});