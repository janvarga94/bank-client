'use strict';

app.component('currensies', {
    templateUrl: 'currensies/currensies.html',
    controller: ['$scope', '$http', '$attrs', '$rootScope', function CurrensiesCtrl($scope, $http, $attrs, $rootScope) {
        $scope.currensies = [];
        $scope.selectedCurrensy = {};

        $scope.header = [
            { label: "Id", code: "id", manatory: false, type: "number" },
            { label: "Currensy Code", code: "currensyCode", manatory: false, type: "number" },
            { label: "Name", code: "name", manatory: false, type: "string" },
        ];
        
        $scope.tabelaId = "currensiesTable" + Math.floor(Math.random()*10000000);
        
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


        $http.get('/api/currensies.json').then(function successCallback(response) {
            $scope.currensies = response.data;
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