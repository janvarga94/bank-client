'use strict';

app.component('transferItems', {
    templateUrl: 'app/transferItems/transferItems.html',
    controller: ['$scope', '$http', '$attrs', '$rootScope', function TransferItemssCtrl($scope, $http, $attrs, $rootScope) {

        $scope.rows = [];
        $scope.selected = {};
        $scope.editing = {};
        $scope.setSelected = function (row) {
            if ($attrs.iamdialog)
                $rootScope.$broadcast('TRANSFER_ITEM_SELECTED', row);
            $scope.selected = row;
            $scope.editing = $.extend({}, row);   
        }

        $scope.header = [
            { label: "Id", code: "id", manatory: false, type: "text" },
            { label: "Interbank Transfer", code: "interbankTransfer", manatory: false, type: "number", isReference: true, openDialog: () => $scope.IsInterbankTransferDialogOpened = true },
            { label: "Bank Order", code: "bankOrder", manatory: false, type: "number", isReference: true, openDialog: () => $scope.IsBankOrderDialogOpened = true },
        ];

        $http.get('/api/transferItems.json').then(function successCallback(response) {
            $scope.header.filter(h => h.type == "date").forEach(h => response.data.forEach(row => row[h.code] = new Date(row[h.code])));  //conver strings to dates where needed
            $scope.rows = response.data;
        });

        $scope.allowAdd = true; $scope.allowEdit = true; $scope.allowRemove = true;
        $scope.doAdd = function () {
            $scope.rows.push(JSON.parse(JSON.stringify($scope.editing)));
        }

        $scope.doEdit = function () {
            $scope.rows.splice($scope.rows.indexOf($scope.selected), 1);
            $scope.rows.push($scope.editing);
        }

        $scope.doRemove = function () {
            $scope.rows.splice($scope.rows.indexOf($scope.selected), 1);
        }


        $scope.iamdialog = $attrs.iamdialog == 'true';

        //-------------------------------------> zoom <--------------------------------------------------------------------------

        $scope.IsInterbankTransferDialogOpened = false;
        $scope.IsBankOrderDialogOpened = false;

        $rootScope.$on('INTERBANK_TRANSFER_SELECTED', function (event, row) {
            $scope.editing['interbankTransfer'] = row['id']
            $scope.IsInterbankTransferDialogOpened = false;
        });
        $rootScope.$on('BANK_ORDER_SELECTED', function (event, row) {
            $scope.editing['bankOrder'] = row['id']
            $scope.IsBankOrderDialogOpened = false;
        });

        //-------------------------------------> filtering, ordering, pagination <----------------------------------------------

        $scope.filters = {};
        $scope.showRow = function (row) {
            for (var code in $scope.filters) {
                if (row[code] && $scope.filters[code] && row[code].toString().indexOf($scope.filters[code].toString()) < 0)
                    return false;
            }
            return true;
        }
        $scope.ordering = 'id';
        $scope.setOrdering = function (ordering) {
            if ($scope.ordering == ordering)
                $scope.ordering = '-' + ordering;
            else
                $scope.ordering = ordering;
        }


        $scope.pageRows = 7;
        $scope.minShow = 0;
        $scope.maxShow = $scope.pageRows;
        $scope.getPageCount = function () {
            return new Array(parseInt($scope.rows.length / $scope.pageRows + 1));
        }
        $scope.changeMinMaxShow = function ($index) {
            $scope.minShow = $index * $scope.pageRows;
            $scope.maxShow = ($index + 1) * $scope.pageRows;
        }

    }]
});