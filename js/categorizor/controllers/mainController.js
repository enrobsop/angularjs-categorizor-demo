categorizorModule.controller('MainCtrl', function($scope, categorizorHelper, categorizorModel, clusterService) {

    $scope.rawTransactions  = categorizorModel.getTransactions();
    $scope.clusterStrength  = 0.2;
    $scope.clusters         = [];
    $scope.categories       = categorizorModel.getCategories();
    $scope.categorizedTransactionsCount = 0;

    $scope.identifyClusters = function(data) {
        $scope.clusters = clusterService.findClustersIn({
            data:       data || $scope.rawTransactions,
            property:   "label",
            strength:   $scope.clusterStrength
        });
    };

    $scope.$watch(
        function() {
            return categorizorHelper.flattenedClusterMap($scope.clusters);
        },
        function() {
            $scope.categorizedTransactionsCount =
            categorizorHelper.countCategorizedTransactions($scope.clusters);
        }
    );

    /**
     * Initialize the clusters at startup.
     */
    $scope.identifyClusters($scope.rawTransactions);

});
