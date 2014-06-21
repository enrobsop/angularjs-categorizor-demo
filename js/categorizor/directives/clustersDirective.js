categorizorModule.directive('clusters', ["categorizorHelper", function(categorizorHelper) {

    var linker = function(scope, element, attrs) {
        makeDroppable(scope, element);
    };

    var makeDroppable = function(scope, element) {
        element.droppable({
            accept:         "*[transaction]",
            tolerance:		"pointer",
            activeClass:	"droppable",
            hoverClass:		"dropHover",
            greedy:			true,

            drop: function(event, ui) {
                var transactionId = categorizorHelper.getTransactionId(ui),
                    fromClusterId = categorizorHelper.getFromClusterId(ui),
                    toClusterId = scope.newCluster().getId();

                scope.moveTransaction(transactionId, fromClusterId, toClusterId);

                ui.draggable.detach();
                scope.removeIfEmpty(fromClusterId)
                scope.$apply();
                categorizorHelper.layoutMasonry();
            }
        });
    };

    return {
        restrict:   'A',
        link:       linker,
        controller: 'ClusterCtrl'
    };

}]);