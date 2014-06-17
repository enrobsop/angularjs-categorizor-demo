describe('the similarity service', function() {

    var service;

    beforeEach(function() {
        service = new SimilarityService();
    });

    it('correctly calculates the intersection of two lists of words', function() {
        expectIntersect(["hello"], ["hello"], ["hello"]);
        expectIntersect(["hello", "paul"], ["hello"], ["hello"]);
        expectIntersect(["hello", "hello"], ["hello"], ["hello"]);
        expectIntersect(["hello", "hello"], ["hello", "hello"], ["hello", "hello"]);
    });

    it('correctly calculates the similarity between two strings as a percentage', function() {
        expectPercentageSimilarity("hello", "hello", 1);
        expectPercentageSimilarity("goodbye", "hello", 0);
        expectPercentageSimilarity("hello paul", "hello", 0.5);
        expectPercentageSimilarity("hello hello", "hello", 0.5);
        expectPercentageSimilarity("hello hello hello", "hello hello", 0.67);
        expectPercentageSimilarity("", "", 1);
        expectPercentageSimilarity(" ", " ", 1);
        expectPercentageSimilarity("  ", " ", 1);
    });

    function expectPercentageSimilarity(string1, string2, expectedPercentage) {
        var actualPercentage = service.similarityBetween(string1, string2);
        expect(actualPercentage.round(2)).toEqual(expectedPercentage.round(2));
    }

    function expectIntersect(words1, words2, expectedIntersect) {
        expect(service.intersect(words1, words2)).toEqual(expectedIntersect);
        expect(service.getIntersectionSize(words1, words2)).toEqual(expectedIntersect.length);
    }

});