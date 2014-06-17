describe("A cluster", function() {

    var theCluster;

    beforeEach(function() {
        theCluster = new Cluster({id: 123});
    });

    it("contains an id", function() {
        expect(theCluster.id).toBe(123);
    });

    it("is empty by default", function() {
        expect(theCluster.size).toBeDefined();
        expect(theCluster.size()).toBe(0);
        expect(theCluster.getItems).toBeDefined();
        expect(theCluster.getItems().length).toBe(0);
    });

    it("correctly adds items", function() {
        var anItem = 'firstItem';
        theCluster.add(anItem);
        expect(theCluster.size()).toBe(1);
        expect(theCluster.getItems()).toContain('firstItem');
    });

    it("correctly gets an item by index", function() {
        var theItem = "an item";
        expect(theCluster.getItemAtIndex(0)).toBeUndefined();
        theCluster.add(theItem);
        expect(theCluster.getItemAtIndex(0)).toBe(theItem);
    });

    it("correctly removes an item at an index", function() {
        theCluster.add('an item');
        theCluster.removeItemAtIndex(0);
        expect(theCluster.size()).toEqual(0);
    });

    it("correctly allows a single item to be moved to another cluster", function() {
        var anotherCluster = new Cluster({id:124});
        theCluster.add('an item').add('another item');

        theCluster.moveItemAt(0, anotherCluster);

        expect(theCluster.size()).toEqual(1);
        expect(anotherCluster.size()).toEqual(1);
    });

    it("correctly allows all items to be moved to a new cluster", function() {
        var anotherCluster = new Cluster({id:124});
        theCluster.add('an item').add('another item');

        theCluster.moveAllItems(anotherCluster);

        expect(theCluster.size()).toEqual(0);
        expect(anotherCluster.size()).toEqual(2);
    });

});