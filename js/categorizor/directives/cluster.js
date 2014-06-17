categorizorModule.directive('cluster', function() {

    var linker = function(scope, element, attrs) {
        makeDraggable(element);
        makeDroppable(scope, element);
    };

    var controller = function($scope) {

        // TODO extract functions to a new ClusterService.

        $scope.newCluster = function newCluster() {
            initClustersIfRequired();
            var newCluster = new Cluster({id:($scope.getMaxClusterId() + 1)});
            $scope.clusters.push(newCluster);
            return newCluster;
        };

        $scope.moveAllTransactions = function(fromClusterId, toClusterId) {
            var fromCluster = $scope.getCluster(fromClusterId),
                toCluster = $scope.getCluster(toClusterId);

            if (fromCluster && toCluster) {
                fromCluster.moveAllItems(toCluster);
                $scope.removeCluster(fromClusterId);
            }
        };

        $scope.moveTransaction = function(transactionId, fromClusterId, toClusterId) {
            var fromCluster = $scope.getCluster(fromClusterId),
                toCluster = $scope.getCluster(toClusterId);

            if (fromCluster && toCluster) {
                var index = transactionId;
                fromCluster.moveItemAt(index, toCluster);
            }
        };

        $scope.getCluster = function(clusterId) {
            var found = $scope.clusters.find(function(cluster) {
                return cluster.getId() == clusterId;
            });
            return found || null;
        };

        $scope.removeCluster = function(clusterId) {
            $scope.clusters.remove(function(cluster) {
                return cluster.getId() == clusterId;
            });
        };

        $scope.getClusterCount = function getClusterCount() {
            initClustersIfRequired();
            return $scope.clusters.length;
        };

        $scope.getMaxClusterId = function() {
            initClustersIfRequired();
            var max = 0;
            $.each($scope.clusters, function(i, cluster) {
                max = Math.max(max, cluster.id);
            });
            return max;
        };

        $scope.removeIfEmpty = function(clusterId) {
            var cluster = $scope.getCluster(clusterId);
            if (cluster && cluster.size() == 0) {
                $scope.removeCluster(clusterId);
            }
        }

        var initClustersIfRequired = function() {
            if (!$scope.clusters) {
                $scope.clusters = [];
            }
        };

    };

    var makeDraggable = function(element) {
        element.draggable({
            revert:         "invalid",
            opacity:		0.7,
            containment:	"#clusterContainer",
            scroll:			true,
            handle:			".handle",
            cancel:			".nohandle",
            cursorAt:		{top: 0, left: 0}
        });
    };

    var getDraggableId = function(ui) {
        return ui.draggable.attr('id') || 'unknownTransactionId';
    };

    var getTransactionId = function(ui) {
        return ui.draggable.data("transactionId");
    };

    var getFromClusterId = function(ui) {
        return ui.draggable.data("clusterId");
    };

    var layoutMasonry = function() {
        $('#clusterContainer').masonry({
            itemSelector: '.cluster',
            columnWidth: 10,
            gutterWidth: 10
        });
    };

    var makeDroppable = function(scope, element) {
        element.droppable({
            accept:         "*[cluster],*[transaction]",
            tolerance:		"pointer",
            activeClass:	"droppable",
            hoverClass:		"dropHover",
            greedy:			true,

            drop: function(event, ui) {
                var draggableId = getDraggableId(ui),
                    toClusterId = scope.cluster.id,
                    fromClusterId = getFromClusterId(ui);

                if (draggableId.startsWith('cluster-')) {
                    fromClusterId = getClusterId(draggableId);
                    scope.moveAllTransactions(fromClusterId, toClusterId);
                } else {
                    var transactionId = getTransactionId(ui);
                    scope.moveTransaction(transactionId, fromClusterId, toClusterId);
                }

                ui.draggable.detach();
                scope.removeIfEmpty(fromClusterId);
                scope.$apply();
                layoutMasonry();
            }
        });
    };

    var getClusterId = function(prefixedId) {
        return prefixedId.replace('cluster-','');
    };

    return {
      restrict:     'A',
      link:         linker,
      controller:   controller
    };

});