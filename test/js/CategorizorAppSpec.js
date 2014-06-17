describe("The Categorizor App", function() {

    var scope,
        clusterService;

    beforeEach(module('Categorizor'));
    beforeEach(inject(function($controller) {
        scope = {};
        clusterService = {
            findClustersIn: function(config) { }
        };
        $controller('MainCtrl', {
            $scope:         scope,
            clusterService: clusterService
        });
    }));

    it("correctly delegates cluster identification", function() {
        var data = ["my","data"];
        spyOn(clusterService, "findClustersIn").andReturn(["some","clusters"]);
        scope.identifyClusters(data);
        expect(clusterService.findClustersIn).toHaveBeenCalledWith({
            data:       data,
            property:   "label",
            strength:   scope.clusterStrength
        });
        expect(scope.clusters).toEqual(["some", "clusters"]);
    });

});