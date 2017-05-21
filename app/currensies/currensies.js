'use strict';

app.component('currensies', {
    templateUrl: 'currensies/currensies.html',
    controller: ['$scope', '$http', function CurrensiesCtrl($scope, $http) {

        $scope.currensies = [];
        $scope.selectedCurrensy = {};

        $scope.header = [
            { label: "Id", code: "id", manatory: false, type: "number" },
            { label: "Currensy Code", code: "currensyCode", manatory: false, type: "number" },
            { label: "Name", code: "name", manatory: false, type: "string" },      
        ];

        var tabela;
        var generateDataTable = function () {
            tabela = new Tabela("currensiesTable");
            tabela.header = $scope.header;

            tabela.onAdd = function (newCurrensy) {   //validiramo i vrami success ako se sme dodati novi red
                pullCurrensiesAndRemakeDatatable();
                return { success: true }
                
            }

            tabela.onEdit = function (editedCurernsy) {
                pullCurrensiesAndRemakeDatatable();
                return { success: true }
            }

            tabela.onRemove = function () {  //proverimo dali selektovani red smemo obrisati, vratimo success:true ako da
                return { success: true }
            }

            tabela.generate();
        };


        var pullCurrensiesAndRemakeDatatable = function () {
            $http.get('/api/currensies.json').then(function successCallback(response) {
                $scope.currensies = response.data;
                setTimeout(generateDataTable,300);
            }, function errorCallback(err) {
                console.log(err);
            });
        }

        pullCurrensiesAndRemakeDatatable();

        $scope.selectChanged = function (obj) {
            $scope.selectedCurrensy = obj;
            tabela.selectedRow = $scope.selectedCurrensy;
        }

    }]
});