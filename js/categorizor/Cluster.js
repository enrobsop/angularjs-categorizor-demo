Cluster = function Cluster(config) {
    this.id         = config.id;
    this.items      = new Array();
    this.category   = config.category;
};

Cluster.prototype = {

    constructor:	Cluster,

    getId: function getId() {
        return this.id;
    },

    getCategory: function getCategory() {
        return this.category;
    },

    setCategory: function setCategory(categoryName) {
        this.category = categoryName;
    },

    unsetCategory: function unsetCategory() {
        this.category = undefined;
    },

    size: function size() {
        return this.items.length;
    },

    getItems: function getItems() {
        return this.items;
    },

    add: function add(newItem) {
        this.items.push(newItem);
        return this;
    },

    addAll: function addAll(newItems) {
        this.items.add(newItems);
        return this;
    },

    getItemAtIndex: function getItemAtIndex(n) {
        return this.items[n];
    },

    removeItemAtIndex: function removeItemAtIndex(n) {
        this.items.removeAt(n);
    },

    moveItemAt: function moveItemAt(n, toCluster) {
        var item = this.items.at(n);
        if (item && toCluster) {
            toCluster.add(item);
            this.items.removeAt(n);
        }
    },

    moveAllItems: function moveAllItems(toCluster) {
        if (toCluster) {
            toCluster.items.add(this.items);
            this.items = new Array();
        }
    }

}