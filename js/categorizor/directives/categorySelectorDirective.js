categorizorModule.directive('categorySelector', function() {

    var linker = function(scope, element, attrs) {

        var getSelectedTerm = function() {
                var data = element.select2('data');
                return data ? data.text : '';
            },

            handleNewCategorySelected = function() {
                var cluster     = element.parents(".cluster"),
                    term        = getSelectedTerm();

                if (term) {
                    cluster.trigger('categorySelected', [cluster, term]);
                } else {
                    cluster.trigger('categoryDeselected', [cluster]);
                }

            };

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
        }).on("change", function(event, ui) {
            scope.maybeAddCategory(getSelectedTerm());
            handleNewCategorySelected();
        });
    };

    var controller = function($scope) {

        $scope.maybeAddCategory = function(name) {
            if (name && name.trim().length > 0 && $scope.categoryExistsWithName(name)) {
                $scope.addCategory(name);
            }
        };

        $scope.addCategory = function(name) {
            $scope.categories.add($scope.newCategoryChoice(name));
        };

        $scope.categoryExistsWithName = function(name) {
            var existingCategories = angular.element($scope.categories)
                name = name || '';
            return existingCategories.filter(function() {
                return this.text.localeCompare(name) === 0;
            }).length===0
        };

        $scope.newCategoryChoice = function(name) {
            return new Category({id: name, text: name});
        };

    };

    return {
        restrict:     'A',
        link:         linker,
        controller:   controller
    };

});