categorizorModule.directive('cluster', function() {

    var linker = function(scope, element, attrs) {

        makeDraggable(element);
        makeDroppable(scope, element);

        handleFocusEvents(scope, element);
        handleCollapseEvents(element);
        handleCategorySelection(scope, element);
        
        angular.element(".category-selector:first").find("input").focus();
    };

    var controller = function($scope) {

        // TODO extract functions to a new ClusterService.

        $scope.newCluster = function newCluster(config) {
            initClustersIfRequired();
            var config = config || {},
                newCluster;

            config.id = $scope.getMaxClusterId() + 1;
            newCluster = new Cluster(config);

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

        $scope.mergeClustersForCategory = function(categoryName) {
            var clustersInCategory = $scope.findClustersInCategory(categoryName),
                targetClusterId,
                sourceClusterId,
                i,
                n = clustersInCategory.length;


            if (n > 1) {

                targetClusterId = clustersInCategory[0].id;

                for (i = 1; i < n; i++) {
                    sourceClusterId = clustersInCategory[i].id
                    $scope.moveAllTransactions(sourceClusterId, targetClusterId);
                }

            }

        };

        $scope.findClustersInCategory = function(categoryName) {
            return $scope.clusters.findAll(function(cluster) {
                return cluster.category == categoryName;
            });
        };

        $scope.firstUncategorisedCluster = function() {
            return $scope.clusters && $scope.clusters.find(function(cluster) {
               return !cluster.hasCategory();
            });
        };

        $scope.focusOnFirstUncategorisedCluster = function() {
            angular.element("#clusterContainer")
                .find(".panel:not('.panel-success,.panel-info'):first")
                .find(".select2-choice:first").focus();
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
                layoutClusters(scope);
            }
        });
    };

    var layoutClusters = function(scope) {
        if (scope) {
            scope.$apply();
        }
        layoutMasonry();
    }

    var getClusterId = function(prefixedId) {
        return prefixedId.replace('cluster-','');
    };

    var handleCollapseEvents = function(element) {
        element.on('shown.bs.collapse hidden.bs.collapse' , function() {

            var icon = element.find(".collapse-icon");

            layoutClusters();

            if (icon.is(".glyphicon-chevron-up")) {
                icon.removeClass("glyphicon-chevron-up");
                icon.addClass("glyphicon-chevron-right");
            } else {
                icon.removeClass("glyphicon-chevron-right");
                icon.addClass("glyphicon-chevron-up");
            }

        });
    };

    var handleCategorySelection = function(scope, element) {
        var collapsable,
            panel;

        element.on('categorySelected', function(event, cluster, term) {

            scope.cluster.setCategory(term);

            collapsable = cluster.find(".panel-collapse");
            panel       = cluster.find(".panel");

            collapsable.collapse("hide");
            panel.removeClass("panel-default panel-danger");
            panel.addClass("panel-success");

            scope.mergeClustersForCategory(term);

            scope.focusOnFirstUncategorisedCluster();
            layoutClusters(scope);

        }).on('categoryDeselected', function(event, cluster) {

            scope.cluster.unsetCategory();

            collapsable = cluster.find(".panel-collapse");
            panel       = cluster.find(".panel");

            collapsable.collapse("show");
            panel.removeClass("panel-success");
            panel.addClass("panel-default");

        });

    };

    var handleFocusEvents = function(scope, element) {
        var focusClass = "panel-info";

        element.find("input").focusin(function () {
            element.find(".panel:first").addClass(focusClass)
        }).focusout(function () {
            element.find(".panel:first").removeClass(focusClass);
        });

    };

    return {
      restrict:     'A',
      link:         linker,
      controller:   controller
    };

});