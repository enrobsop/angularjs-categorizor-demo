categorizorModule.controller('ClusterCtrl', ['$scope', function($scope) {

    $scope.newCluster = function(config) {
        var newCluster;

        initClustersIfRequired();
        config      = config || {};
        config.id   = $scope.getMaxClusterId() + 1;
        newCluster  = new Cluster(config);

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

    $scope.getClusterCount = function() {
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
                sourceClusterId = clustersInCategory[i].id;
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

    var initClustersIfRequired = function() {
        if (!$scope.clusters) {
            $scope.clusters = [];
        }
    };

}]);
