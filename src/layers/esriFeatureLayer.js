(function(angular) {
    'use strict';

    angular.module('esri.map').directive('esriFeatureLayer', function() {
        // this object will tell angular how our directive behaves
        return {
            // only allow esriFeatureLayer to be used as an element (<esri-feature-layer>)
            restrict: 'E',

            // require the esriFeatureLayer to have its own controller as well an esriMap controller
            // you can access these controllers in the link function
            require: ['esriFeatureLayer', '^esriMap'],

            // replace this element with our template.
            // since we aren't declaring a template this essentially destroys the element
            replace: true,

            // isolate scope for feature layer so it can be added/removed dynamically
            scope: {
                url: '@',
                visible: '@?',
                opacity: '@?',
                definitionExpression: '@?',
                // function binding for event handlers
                load: '&',
                updateEnd: '&',
                // function binding for reading object hash from attribute string
                // or from scope object property
                // see Example 7 here: https://gist.github.com/CMCDragonkai/6282750
                layerOptions: '&'
            },

            controllerAs: 'layerCtrl',

            bindToController: true,

            // define an interface for working with this directive
            controller: 'EsriFeatureLayerController',

            // now we can link our directive to the scope, but we can also add it to the map
            link: function(scope, element, attrs, controllers) {
                // controllers is now an array of the controllers from the 'require' option
                var layerController = controllers[0];
                var mapController = controllers[1];

                // get the layer object
                layerController.getLayer().then(function(layer){
                    // get layer info from layer object and directive attributes
                    var layerInfo = layerController.getLayerInfo(layer, attrs);

                    // add the layer to the map
                    mapController.addLayer(layer, 0);
                    mapController.addLayerInfo(layerInfo);

                    // bind directive attributes to layer properties and events
                    layerController.bindLayerEvents(scope, attrs, layer, mapController);
                });
            }
        };
    });

})(angular);
