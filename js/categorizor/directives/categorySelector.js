categorizorModule.directive('categorySelector', function() {

    var linker = function(scope, element, attrs) {
        element.select2({
            minimumInputLength:     0,
            data:                   scope.categories,
            allowClear:             true,
            selectOnBlur:           true,
            formatNoMatches:        "Type a new category name.",
            sortResults: function(results, container, query) {
                return results.sortBy('text');
            },
            createSearchChoice: function(term) {
                if (scope.categoryExistsWithName(term)) {
                    return scope.newCategoryChoice(term);
                }
            }
        }).on("select2-blur", function() {
            var selectedTerm = $(this).select2('data').text;
            scope.maybeAddCategory(selectedTerm);
        });
    };

    var controller = function($scope) {

        $scope.maybeAddCategory = function(name) {
            if ($scope.categoryExistsWithName(name)) {
                $scope.addCategory(name);
            }
        };

        $scope.addCategory = function(name) {
            $scope.categories.add($scope.newCategoryChoice(name));
        };

        $scope.categoryExistsWithName = function(name) {
            var existingCategories = angular.element($scope.categories);
            return existingCategories.filter(function() {
                return this.text.localeCompare(name) === 0;
            }).length===0
        };

        $scope.newCategoryChoice = function(name) {
            return {id: name, text: name}
        };

    };

    return {
        restrict:     'A',
        link:         linker,
        controller:   controller
    };

});