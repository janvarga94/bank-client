'use strict';

app.component('bankAccounts', {
    templateUrl: 'app/bankAccounts/bankAccounts.html',
    controller: ['$scope', '$http', '$attrs', '$timeout', '$rootScope', function BankAccoutnsCtrl($scope, $http, $attrs, $timeout, $rootScope) {

        $scope.rows = [];
        $scope.selected = {};
        $scope.editing = {};
        $scope.setSelected = function (row) {
            if ($attrs.iamdialog)
                $rootScope.$broadcast('BANK_ACCOUNT_SELECTED', row);
            $scope.selected = row;
            $scope.editing = $.extend({}, row);
        }

        $scope.header = [
            { label: "Id", code: "id", type: "text" },
            { label: "Account Number", code: "accountNumber", type: "text" },
            { label: "Status", code: "status", type: "text" },
            { label: "Start Date", code: "startDate", type: "date" },
            { label: "End  Date", code: "endDate", type: "date" },
            { label: "Bank", code: "bank", type: "text" },
            { label: "Currency", code: "currency", type: "text", isReference: true, openDialog: () => $scope.IsCurrensyDialogOpened = true },
            { label: "Client Details", code: "clientDetails", type: "text", isReference: true, openDialog: () => $scope.IsClientDetailsDialogOpened = true },
        ];

        $http.get('/api/bankAccounts.json').then(function successCallback(response) {
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

        $scope.IsCurrensyDialogOpened = false;
        $scope.IsClientDetailsDialogOpened = false;

        $rootScope.$on('CURRENSY_SELECTED', function (event, row) {
            $scope.editing['currency'] = row['id']
            $scope.IsCurrensyDialogOpened = false;
        });

        $rootScope.$on('CLIENT_DETAILS_SELECTED', function (event, row) {
            $scope.editing['clientDetails'] = row['id']
            $scope.IsClientDetailsDialogOpened = false;
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