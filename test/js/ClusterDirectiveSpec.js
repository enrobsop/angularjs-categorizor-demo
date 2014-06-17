describe("The cluster directive", function() {

    var scope;

    beforeEach(module('Categorizor'));

    beforeEach(inject(function($rootScope, $compile) {
        compileDirective($rootScope, $compile);
    }));

    function compileDirective($rootScope, $compile) {
        var element = $compile("<div cluster></div>")($rootScope);
        $rootScope.$digest();
        scope = element.scope();
    }

    // ******************** Tests ********************

    it("correctly adds a new cluster", function() {
        var initialClusterCount = scope.getClusterCount();
        scope.newCluster();
        expect(scope.getClusterCount()).toBe(initialClusterCount + 1);
    });

    it("correctly gets a cluster by id", function() {
        var aCluster = scope.newCluster(),
            invalidClusterId = -1;

        expect(scope.getCluster(invalidClusterId)).toBeNull();
        expect(scope.getCluster(aCluster.getId())).not.toBeNull();

    });

    it("correctly gets the max cluster id", function() {
        expect(scope.getMaxClusterId()).toEqual(0);
        scope.newCluster();
        expect(scope.getMaxClusterId()).toEqual(1);
    });

    it("correctly removes a cluster", function() {
        var firstCluster = scope.newCluster(),
            secondCluster = scope.newCluster();

        scope.removeCluster(firstCluster.getId());
        expect(scope.clusters.length).toEqual(1);
        expect(scope.clusters[0]).toBe(secondCluster);
    });

    it("correctly moves a transaction from one cluster to another", function() {
        var firstCluster = scope.newCluster(),
            secondCluster = scope.newCluster(),
            transaction = {date:"21/07/2001", label:"CASH NATWIDE JUL21 NEW MARKET  @15:23",amount:-100};

        firstCluster.add(transaction);

        expect(firstCluster.size()).toEqual(1);
        expect(secondCluster.size()).toEqual(0);

        scope.moveTransaction(0, firstCluster.getId(), secondCluster.getId());

        expect(firstCluster.size()).toEqual(0);
        expect(secondCluster.size()).toEqual(1);
    });

    it("correctly moves all transactions from one cluster to another", function() {
        var firstCluster = scope.newCluster(),
            secondCluster = scope.newCluster(),
            transaction1 = {date:"21/07/2001", label:"CASH NATWIDE JUL21 NEW MARKET  @15:23",amount:-100},
            transaction2 = {date:"20/07/2001", label:"SAINSBURYS BANGOR",amount:1.75};

        firstCluster.add(transaction1).add(transaction2);

        expect(firstCluster.size()).toEqual(2);
        expect(secondCluster.size()).toEqual(0);

        scope.moveAllTransactions(firstCluster.getId(), secondCluster.getId());

        expect(firstCluster.size()).toEqual(0);
        expect(secondCluster.size()).toEqual(2);
    });

});
