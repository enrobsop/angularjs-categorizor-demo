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

    $scope.getCategoryExpenseData = function() {
        return $scope.categories.map(function(item) {
            var net = item.calculateNet();
            return (net < 0) ?
                [item.text, Math.abs(item.calculateNet())] : null;
        });
    };

    $scope.getCategoryIncomeData = function() {
        return $scope.categories.map(function(item) {
            var net = item.calculateNet();
            return (net > 0) ?
                [item.text, Math.abs(item.calculateNet())] : null;
        });
    };

    $scope.getCategoryBalanceData = function() {
        return $scope.categories.map(function(item) {
            var net = item.calculateNet();
            return [item.text, item.calculateNet()];
        });
    };

    var updateCategoryTransactions = function(clusters) {
        clusters.each(function(cluster) {

            var category = getCategoryForCluster(cluster);

            if (category) {
                category.setTransactions(cluster.getItems());
            };
        });
    };

    var getCategoryForCluster = function(cluster) {
        if (cluster && cluster.category) {
            return findCategoryByName(cluster.category);
        }
    };

    var findCategoryByName = function(name) {
        return $scope.categories.find(function(category) {
            return category.text == name;
        });
    }

    var startup = function() {

        $scope.$watch(
            function() {
                return categorizorHelper.flattenedClusterMap($scope.clusters);
            },
            function() {
                $scope.categorizedTransactionsCount =
                    categorizorHelper.countCategorizedTransactions($scope.clusters);
                updateCategoryTransactions($scope.clusters);
            }
        );

        $scope.identifyClusters($scope.rawTransactions);
    };

    startup();

});
