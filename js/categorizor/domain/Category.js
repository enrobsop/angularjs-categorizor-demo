Category = function Category(config) {
    config = config || {};
    this.id             = config.id;
    this.text           = config.text;
    this.transactions   = config.transactions || [];
}

Category.prototype = {

};