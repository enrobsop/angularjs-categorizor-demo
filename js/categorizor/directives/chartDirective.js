categorizorModule.directive('chart', ['categorizorHelper', function(categorizorHelper) {

    var linker = function(scope, element, attrs) {
        scope.$watchCollection(
            function () {
                return parseSourceData(scope.source()).flatten();
            },
            function () {
                drawChart(scope, element);
            }
        );
    };

    var drawChart = function(scope, element) {
        if (element.is(":visible")) {
            $.plot(element,
                [parseSourceData(scope.source())], {
                series: {
                    color:  "blue",
                    lines:  {show: false},
                    bars:   {
                        show:       true,
                        barWidth:   0.6,
                        align:      "center"
                    }
                },
                xaxis: {
                    mode: "categories",
                    tickLength: 0
                },
                yaxis: {
                    tickDecimals: 0
                },
                grid: {
                    borderWidth: 0
                }
            });
        }

    };

    var parseSourceData = function(data) {
        var desc = true;
            sorted = data.sortBy(function(item) {
                return Math.abs(item[1]);
            }, desc);
        return sorted.slice(0, 6);
    };

    return {
        restrict:   "A",
        link:       linker,
        scope:      {
            source: "&"
        }
    };

}]);
