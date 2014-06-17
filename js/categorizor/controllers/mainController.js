categorizorModule.controller('MainCtrl', function($scope, categorizorHelper, categorizorModel, clusterService) {

    $scope.rawTransactions  = categorizorModel.getTransactions();
    $scope.clusterStrength  = 0.2;
    $scope.clusters         = [];
    $scope.categories       = categorizorModel.getCategories();

    $scope.identifyClusters = function(data) {
        $scope.clusters = clusterService.findClustersIn({
            data:       data || $scope.rawTransactions,
            property:   "label",
            strength:   $scope.clusterStrength
        });
    };

    /**
     * Initialize the clusters at startup.
     */
    $scope.identifyClusters($scope.rawTransactions);

});
