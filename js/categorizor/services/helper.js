categorizorModule.factory('categorizorHelper', function() {

    return {

        countCategorizedTransactions: function(clusters) {
            var total = 0;
            clusters.each(function(cluster) {
                if (cluster.hasCategory()) {
                    total += cluster.size();
                }
            });
            return total;
        },

        flattenedClusterMap: function(clusters) {
            var categoriesAndSizes = clusters.map(function(cluster) {
                return [cluster.category, cluster.size()].join(":");
            });
            return categoriesAndSizes.join();
        }

    };

});