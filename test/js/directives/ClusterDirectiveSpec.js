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

    // ...

});
