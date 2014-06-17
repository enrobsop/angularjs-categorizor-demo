SimilarityMatrix = function SimilarityMatrix(config) {

    this.similarityService
    this.items      = config.items || [];
    this.clusters   = [];
    this.config     = config.config;

};

SimilarityMatrix.prototype = {

    constructor: SimilarityMatrix,

    evaluate: function(prepare) {
        return this.buildClusters(prepare);
    },

    buildClusters: function(prepare) {
        var matrix = this;
        this.items.each(function(value, n) {
            var mostSimilar             = matrix.mostSimilarTo(value, prepare),
                similarityCalculator    = matrix.getSimilarityCalculator(),
                similarity              = similarityCalculator.similarityBetween(prepare(value), prepare(mostSimilar));

            if (mostSimilar && similarity >= matrix.config.threshold) {
                matrix.cluster(value, mostSimilar);
            } else {
                matrix.clusters.push([value]);
            }
        });
    },

    getSimilarityCalculator: function() {
        return this.similarityService || new SimilarityService();
    },

    mostSimilarTo: function(value, prepare) {
        var matrix = this;
        return this.items.max(function(it) {
            if (value == it || !value || !it) return -1;
            return matrix.getSimilarityCalculator().similarityBetween(prepare(value), prepare(it));
        });
    },

    cluster: function(value1, value2) {
        var pair = [value1, value2],
            cluster = this.getClusterContainingAny(pair);
        if (!cluster) {
            cluster = [];
            this.clusters.push(cluster);
        }
        pair.each(function(it) {
            if (!cluster.any(it)) {
                cluster.add(it);
            }
        });
    },

    getClusterContainingAny: function(values) {
        return this.clusters.find(function(cluster) {
            return !values.intersect(cluster).isEmpty();
        });
    }

}
