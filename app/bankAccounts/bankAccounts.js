'use strict';

app.directive('bankAccounts', function () {
    return {
        templateUrl: 'bankAccounts/bankAccounts.html',
        controller: ['$scope', '$http', '$attrs', function BankAccoutnsCtrl($scope, $http, $attrs) {

            $scope.bankAccounts = [];
            $scope.selectedBankAccount = {};

            $scope.header = [
                { label: "Id", code: "id", manatory: false, type: "number" },
                { label: "Account Number", code: "accountNumber", manatory: false, type: "number" },
                { label: "Status", code: "status", manatory: false, type: "string" },
                { label: "Start Date", code: "startDate", manatory: false, type: "date" },
                { label: "End  Date", code: "endDate", manatory: false, type: "date" },
                { label: "Bank", code: "bank", manatory: false, type: "number" },
                { label: "Currency", code: "currency", manatory: false, type: "string", zoomClick : function(){ $.event.trigger({type: "currensiesZoomShow"})}},
                { label: "Client", code: "client", manatory: false, type: "number" },
            ];


            var tabela;
            var generateDataTable = function () {
                tabela = new Tabela("bankAccountsTable");
                tabela.header = $scope.header;

                tabela.onAdd = function (newBankAccount) {   //validiramo i vrami success ako se sme dodati novi red
                    return { success: true }
                }

                tabela.onEdit = function (editedBankAccount) {
                    return { success: true }
                }

                tabela.onRemove = function () {  //proverimo dali selektovani red smemo obrisati, vratimo success:true ako da
                    return { success: true }
                }

                tabela.generate();
            };
           
            $http.get('/api/bankAccounts.json').then(function successCallback(response) {
                $scope.bankAccounts = response.data;
                setTimeout(generateDataTable, 300);
            }, function errorCallback(err) {
                console.log(err);
            });
  
            $scope.selectChanged = function (obj) {
                $scope.selectedBankAccount = obj;
                $.event.trigger({type: "rowSelected", message: obj});
            }

        }]
    }
});