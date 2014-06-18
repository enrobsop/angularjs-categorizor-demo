categorizorModule.directive('clusterStrength', function() {

    var linker = function(scope, element, attrs) {
        makeSlider(element,scope);
    };

    var makeSlider = function(element, scope) {
        element.slider({
            min:    0.0,
            value:  scope.clusterStrength,
            max:    1.0,
            step:   0.05,
            slide: function(event, ui) {
                scope.clusterStrength = Math.abs(ui.value);
                scope.$apply();
                scope.identifyClusters();
            }
        });

    };

    return {
        restrict:     'A',
        link:         linker
    };

});