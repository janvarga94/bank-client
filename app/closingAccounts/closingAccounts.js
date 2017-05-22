'use strict';

app.component('closingAccounts', {
    templateUrl: 'closingAccounts/closingAccounts.html',
    controller: ['$scope', '$http', '$attrs', '$rootScope', function ClosingAccountsCtrl($scope, $http, $attrs, $rootScope) {
        
        $scope.closingAccounts = [];

        $scope.header = [
            { label: "Id", code: "id", manatory: false, type: "number" },
            { label: "Switch to an account", code: "switchToAnAccount", manatory: false, type: "string" },
            { label: "End date", code: "endDate", manatory: false, type: "number" },
            { label: "Account", code: "account", manatory: false, type: "number", zoomClick: function () { $.event.trigger({ type: "bankAccountZoomShow" }) }  },
        ];

        $scope.tabelaId = "closingAccountsTable" + Math.floor(Math.random()*10000000);

        var tabela;
        var generateDataTable = function () {
            tabela = new Tabela($scope.tabelaId);
            tabela.header = $scope.header;

            tabela.onAdd = function (newCurrensy) {   //validiramo i vrami success ako se sme dodati novi red      
                return { success: true }

            }

            tabela.onEdit = function (editedCurernsy) {
                return { success: true }
            }

            tabela.onRemove = function () {  //proverimo dali selektovani red smemo obrisati, vratimo success:true ako da
                return { success: true }
            }

            tabela.generate();
        };


        $http.get('/api/closingAccounts.json').then(function successCallback(response) {
            $scope.closingAccounts = response.data;
            setTimeout(generateDataTable, 300);
        }, function errorCallback(err) {
            console.log(err);
        });


        $scope.selectChanged = function (obj) {
            $.event.trigger({ type: "rowSelected", message: obj });
            if ($attrs.mode = "referenceChooser") {
                $.event.trigger({
                    type: "zoomChoosen",
                    message: obj.id,
                });
                $.event.trigger({
                    type: "zoomHide",
                });
            }
        }

    }]
});