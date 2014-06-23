var categorizorModule = angular.module('Categorizor', [
    "wu.masonry",
    "ui.unique",
    "ngRoute"
]);

categorizorModule.config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider.
            when('/statement', {
                templateUrl: './partials/statement.html',
                controller: 'statementCtrl'
            }).
            when('/clusters', {
                templateUrl: './partials/clusters.html',
                controller: 'clustersCtrl'
            }).
            otherwise({
                redirectTo: '/statement'
            });
    }]);