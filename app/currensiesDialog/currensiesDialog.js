'use strict';

app.component('currensiesDialog', {
    templateUrl: 'currensiesDialog/currensiesDialog.html',
    controller: ['$scope', '$http','$attrs','$rootScope', function CurrensiesCtrl($scope, $http,$attrs,$rootScope) {       
        
        $(document).on('zoomHide',function(){
                $("#currensiesDialog").hide();
        })

        $(document).on('currensiesZoomShow',function(){
                $("#currensiesDialog").show();
        })

    }]
});