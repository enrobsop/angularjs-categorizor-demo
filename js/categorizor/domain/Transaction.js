Transaction = function Transaction(config) {
    config = config || {};
    this.id         = config.id;
    this.date       = config.date;
    this.label      = config.label;
    this.category   = config.category;
    this.amount     = config.amount;
};

Transaction.prototype = {

};