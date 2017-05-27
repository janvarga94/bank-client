'use strict';

app.component('closingAccounts', {
    templateUrl: 'app/commonTemplates/defaultTable.html',
    controller: ['$scope', '$http', '$attrs', '$rootScope', '$element', '$compile', function ClosingAccountsCtrl($scope, $http, $attrs, $rootScope, $element, $compile) {

        $scope.rows = [];
        $scope.selected = {};
        $scope.editing = {};
        $scope.setSelected = function (row) {
            if ($attrs.iamdialog)
                $rootScope.$broadcast('CLOSING_ACCOUNT_SELECTED', row);
            $scope.selected = row;
            $scope.editing = $.extend({}, row);
        }

        $scope.header = [
            { label: "Id", code: "id", manatory: false, type: "text" },
            { label: "Switch to an account", code: "switchToAnAccount", manatory: false, type: "text" },
            { label: "End date", code: "endDate", manatory: false, type: "date" },
            { label: "Bank Account", code: "bankAccount", manatory: false, type: "text", isReference: true, openDialog: () => $scope.IsBankAccountsDialogOpened = true },
            { label: "Bank Order", code: "bankOrder", manatory: false, type: "text", isReference: true, openDialog: () => $scope.IsBankOrderDialogOpened = true },
        ];

        $http.get('/api/closingAccounts.json').then(function successCallback(response) {
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

        $element.append(
            $compile(
                "<bank-accounts ng-if='!iamdialog && IsBankAccountsDialogOpened' iamdialog='true'></bank-accounts>"
            )($scope)
        );
        $element.append(
            $compile(
                "<bank-orders ng-if='!iamdialog && IsBankOrderDialogOpened' iamdialog='true'></bank-orders>"
            )($scope)
        );


        $scope.IsBankAccountsDialogOpened = false;
        $scope.IsBankOrderDialogOpened = false;

        $rootScope.$on('BANK_ACCOUNT_SELECTED', function (event, row) {
            if (row['id']) $scope.editing['bankAccount'] = row['id']
            $scope.IsBankAccountsDialogOpened = false;
        });
        $rootScope.$on('BANK_ORDER_SELECTED', function (event, row) {
            if (row['id']) $scope.editing['bankOrder'] = row['id']
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