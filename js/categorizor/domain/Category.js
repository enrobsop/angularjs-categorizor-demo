Category = function Category(config) {
    config = config || {};
    this.id             = config.id;
    this.text           = config.text;
    this.net            = 0;
    this.size           = 0;
    this._transactions  = [];
};

Category.prototype = {

    setTransactions: function(transactions) {
        transactions = transactions || [];
        this._transactions  = transactions;
        this.net            = this.calculateNet();
        this.size           = transactions.length;
    },

    getTransactions: function() {
        return this._transactions;
    },

    calculateNet: function() {
        var total = 0;
        this._transactions.each(function(transaction) {
            total += transaction.amount;
        });
        return total;
    }

};