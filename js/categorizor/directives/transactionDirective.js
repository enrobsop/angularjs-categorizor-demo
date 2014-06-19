categorizorModule.directive('transaction', function() {

    var linker = function(scope, element, attrs) {
        makeDraggable(element);
    };

    var makeDraggable = function(element) {
        element.draggable({
            helper:         "clone",
            revert:         "invalid",
            opacity:		0.7,
            containment:	"#clusterContainer",
            scroll:			true
        });
    };

    return {
      restrict:     'A',
      link:         linker
    };

});