'use strict';

app.component('bankAccountsDialog', {
    templateUrl: 'bankAccountsDialog/bankAccountsDialog.html',
    controller: ['$scope', '$http','$attrs','$rootScope', function bankAccountCtrl($scope, $http,$attrs,$rootScope) {       
        
        $(document).on('zoomHide',function(){          
                $("#bankAccountDialog").hide();
        })

        $(document).on('bankAccountZoomShow',function(){
                  console.log("opening bank dialog")
                $("#bankAccountDialog").show();
        })

    }]
});