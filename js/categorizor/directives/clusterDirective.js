categorizorModule.directive('cluster', function() {

    var linker = function(scope, element, attrs) {

        makeDraggable(element);
        makeDroppable(scope, element);

        handleFocusEvents(scope, element);
        handleCollapseEvents(element);
        handleCategorySelection(scope, element);

        // TODO move this so that is only called once, when clustering is completed.
        angular.element(".category-selector:first").find("input").focus();
    };

    var makeDraggable = function(element) {
        element.draggable({
            revert:         "invalid",
            opacity:		0.7,
            containment:	"#clusterContainer",
            scroll:			true,
            handle:			".handle",
            cancel:			".nohandle",
            cursorAt:		{top: 0, left: 0}
        });
    };

    var makeDroppable = function(scope, element) {
        element.droppable({
            accept:         "*[cluster],*[transaction]",
            tolerance:		"pointer",
            activeClass:	"droppable",
            hoverClass:		"dropHover",
            greedy:			true,

            drop: function(event, ui) {
                var draggableId = getDraggableId(ui),
                    toClusterId = scope.cluster.id,
                    fromClusterId = getFromClusterId(ui);

                if (draggableId.startsWith('cluster-')) {
                    fromClusterId = getClusterId(draggableId);
                    scope.moveAllTransactions(fromClusterId, toClusterId);
                } else {
                    var transactionId = getTransactionId(ui);
                    scope.moveTransaction(transactionId, fromClusterId, toClusterId);
                }

                ui.draggable.detach();
                scope.removeIfEmpty(fromClusterId);
                layoutClusters(scope);
            }
        });
    };

    var getDraggableId = function(ui) {
        return ui.draggable.attr('id') || 'unknownTransactionId';
    };

    var getTransactionId = function(ui) {
        return ui.draggable.data("transactionId");
    };

    var getFromClusterId = function(ui) {
        return ui.draggable.data("clusterId");
    };

    var layoutMasonry = function() {
        $('#clusterContainer').masonry({
            itemSelector: '.cluster',
            columnWidth: 10,
            gutterWidth: 10
        });
    };

    var layoutClusters = function(scope) {
        if (scope) {
            scope.$apply();
        }
        layoutMasonry();
    }

    var getClusterId = function(prefixedId) {
        return prefixedId.replace('cluster-','');
    };

    var handleCollapseEvents = function(element) {
        element.on('shown.bs.collapse hidden.bs.collapse' , function() {

            var icon = element.find(".collapse-icon");

            layoutClusters();

            if (icon.is(".glyphicon-chevron-up")) {
                icon.removeClass("glyphicon-chevron-up");
                icon.addClass("glyphicon-chevron-right");
            } else {
                icon.removeClass("glyphicon-chevron-right");
                icon.addClass("glyphicon-chevron-up");
            }

        });
    };

    var handleCategorySelection = function(scope, element) {
        var collapsable,
            panel;

        element.on('categorySelected', function(event, cluster, term) {

            scope.cluster.setCategory(term);

            collapsable = cluster.find(".panel-collapse");
            panel       = cluster.find(".panel");

            collapsable.collapse("hide");
            panel.removeClass("panel-default panel-danger");
            panel.addClass("panel-success");

            scope.mergeClustersForCategory(term);

            scope.focusOnFirstUncategorisedCluster();
            layoutClusters(scope);

        }).on('categoryDeselected', function(event, cluster) {

            scope.cluster.unsetCategory();

            collapsable = cluster.find(".panel-collapse");
            panel       = cluster.find(".panel");

            collapsable.collapse("show");
            panel.removeClass("panel-success");
            panel.addClass("panel-default");

        });

    };

    var handleFocusEvents = function(scope, element) {
        var focusClass = "panel-info";

        element.find("input").focusin(function () {
            element.find(".panel:first").addClass(focusClass)
        }).focusout(function () {
            element.find(".panel:first").removeClass(focusClass);
        });

    };

    return {
      restrict:     'A',
      link:         linker,
      controller:   'ClusterCtrl'
    };

});