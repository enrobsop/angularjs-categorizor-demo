SimilarityService = function SimilarityService(config) {
};

SimilarityService.prototype = {

    constructor: SimilarityService,

    getJaccardSimilarity: function(string1, string2) {
        if (string1 && string2 && string1 == string2) return 1;
        var words1          = string1.trim().split(" "),
            words2          = string2.trim().split(" "),
            commonWords     = this.intersect(words1, words2),
            commonWordCount = commonWords.length,
            totalWordCount  = words1.length + words2.length - commonWordCount;

        return commonWordCount / totalWordCount;
    },

    similarityBetween: function(string1, string2) {
        return this.getJaccardSimilarity(string1, string2);
    },

    intersect: function(words1, words2) {
        var intersection = [],
            wordIndex,
            words1 = words1.clone(),
            words2 = words2.clone();
        words1.forEach(function(word) {
            wordIndex = words2.indexOf(word);
            if (wordIndex >= 0) {
                intersection.add(word);
                words2.removeAt(wordIndex);
            }
        });
        return intersection;
    },

    getIntersectionSize: function(words1, words2) {
        return this.intersect(words1, words2).length;
    }

}

