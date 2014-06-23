categorizorModule.controller('statementCtrl', function($scope, categorizorModel) {

    $scope.rawTransactions  = categorizorModel.getTransactions();

});
