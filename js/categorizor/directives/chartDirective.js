categorizorModule.directive('chart', ['categorizorHelper', function(categorizorHelper) {

//    var chart,
//        options = {
//            'title':    '',
//            'width':    400,
//            'height':   300
//        },
//        rows;

    var linker = function(scope, element, attrs) {

        var chart           = new google.visualization.ColumnChart(element.get(0)),
            options         = {
                title:  attrs.chartTitle,
                width:  350,
                height: 200
            };

        makeChart(scope, chart, options);

        scope.$watchCollection(
            function () {
                return scope.source().flatten();
            },
            function () {
                drawChart(scope, chart, options);
            }
        );

    };

    var makeChart = function(scope, chart, options) {
        google.setOnLoadCallback(function() {
            drawChart(scope, chart, options);
        });
    };

    var drawChart = function(scope, chart, options) {
        var data = buildData(scope);
        chart.draw(data, options);
    };

    var buildData = function(scope) {
        var data = new google.visualization.DataTable();
        data.addColumn('string', 'Category');
        data.addColumn('number', 'Net');
        data.addRows(scope.source());
        return data;
    };

    return {
        restrict:   "A",
        link:       linker,
        scope:      {
            source: "&"
        }
    };

}]);
