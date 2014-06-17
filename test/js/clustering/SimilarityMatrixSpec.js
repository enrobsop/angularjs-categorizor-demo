describe('the similarity martix', function() {

    var matrix;

    beforeEach(function() {
        matrix = new SimilarityMatrix({
            items: [
                {description: "Elephant Giraffe Lion Tiger"},
                {description: "Elephant Lion Tiger"},
                {description: "Elephant Giraffe Lion Tigers"},
                {description: "Cheese Grapes Lettuce"},
                {description: "Grapes Lettuce"},
                {description: "Lithium"},
                {description: "Hacksaw"}
            ],
            config: {
                threshold: 0.3
            }
        });
    });

    it('correctly determines the clusters', function() {
        matrix.evaluate(function(item) {
            return item.description;
        });
        expect(matrix.clusters).toBeDefined();
        expect(matrix.clusters.length).toEqual(4);
        expect(matrix.clusters.flatten().length).toEqual(7);
    });

});