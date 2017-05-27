'use strict';

app.component('dailyAccountBalances', {
    templateUrl: 'app/commonTemplates/defaultTable.html',
    controller: ['$scope', '$http', '$attrs', '$rootScope', '$compile', '$element', function DailtyAccountsBCtrl($scope, $http, $attrs, $rootScope, $compile, $element) {

        $scope.rows = [];
        $scope.selected = {};
        $scope.editing = {};
        $scope.setSelected = function (row) {
            if ($attrs.iamdialog)
                $rootScope.$broadcast('DAILY_ACCOUNT_BALANCE_SELECTED', row);
            $scope.selected = row;
            $scope.editing = $.extend({}, row);
        }

        $scope.header = [
            { label: "Id", code: "id", manatory: false, type: "text" },
            { label: "Date", code: "date", manatory: false, type: "date" },
            { label: "Previous state", code: "previousState", manatory: false, type: "number" },
            { label: "Amount charged", code: "amountCharged", manatory: false, type: "number" },
            { label: "Amount in favour", code: "amountInFavour", manatory: false, type: "number" },
            { label: "New State", code: "newState", manatory: false, type: "number" },
            { label: "Bank Account", code: "bankAccount", manatory: false, type: "text", isReference: true, openDialog: () => $scope.IsBankAccountsDialogOpened = true },
        ];

        $http.get('/api/dailyAccountBalances.json').then(function successCallback(response) {
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
        $scope.IsBankAccountsDialogOpened = false;

        $rootScope.$on('BANK_ACCOUNT_SELECTED', function (event, row) {
            if (row['id']) $scope.editing['bankAccount'] = row['id']
            $scope.IsBankAccountsDialogOpened = false;
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