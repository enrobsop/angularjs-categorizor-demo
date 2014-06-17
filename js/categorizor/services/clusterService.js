categorizorModule.factory('clusterService', function() {

    var findClustersIn = function(config) {

        var matrix = new SimilarityMatrix({
                items:  config.data || [],
                config: { threshold: config.strength || 0.1 }
            }),
            clusters = [];

        matrix.evaluate(function(item) {
            return item.label + " " + item.amount;
        });

        matrix.clusters.each(function(cluster, n) {
            clusters[n] = clusters[n] || new Cluster({id: n});
            clusters[n].addAll(cluster);
        });

        return clusters;
    }

    return {
        findClustersIn:     findClustersIn
    }

});