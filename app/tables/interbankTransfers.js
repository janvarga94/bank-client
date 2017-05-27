'use strict';

app.component('interbankTransfers', {
    templateUrl: 'app/commonTemplates/defaultTable.html',
    controller: ['$scope', '$http', '$attrs', '$rootScope', '$compile', '$element', function InterbankTrCtrl($scope, $http, $attrs, $rootScope, $compile, $element) {

        $scope.rows = [];
        $scope.selected = {};
        $scope.editing = {};
        $scope.setSelected = function (row) {
            if ($attrs.iamdialog)
                $rootScope.$broadcast('INTERBANK_TRANSFER_SELECTED', row);
            $scope.selected = row;
            $scope.editing = $.extend({}, row);
        }

        $scope.header = [
            { label: "Id", code: "id", manatory: false, type: "text" },
            { label: "Transfer Date", code: "transferDate", manatory: false, type: "date" },
            { label: "Amount", code: "amount", manatory: false, type: "number" },
            { label: "Bank Message", code: "bankMessage", manatory: false, type: "text", isReference: true, openDialog: () => $scope.IsBankMessageDialogOpened = true },
            { label: "Sender bank", code: "senderBank", manatory: false, type: "text" },
            { label: "Recipient bank", code: "recipientBank", manatory: false, type: "text", isReference: true, openDialog: () => $scope.IsBankDialogOpened = true },
        ];

        $http.get('/api/interbankTransfer.json').then(function successCallback(response) {
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
                "<bank-messages ng-if='!iamdialog && IsBankMessageDialogOpened' iamdialog='true' dialogvisible='IsBankAccountsDialogOpened'></bank-messages>"
            )($scope)
        );
        $element.append(
            $compile(
                "<banks ng-if='!iamdialog && IsBankDialogOpened' iamdialog='true' dialogvisible='IsBankAccountsDialogOpened'></banks>"
            )($scope)
        );

        $scope.IsBankMessageDialogOpened = false;
        $scope.IsBankDialogOpened = false;

        $rootScope.$on('BANK_MESSAGE_SELECTED', function (event, row) {
            if (row['id']) $scope.editing['bankMessage'] = row['id']
            $scope.IsBankMessageDialogOpened = false;
        });
        $rootScope.$on('BANK_SELECTED', function (event, row) {
            if (row['id']) $scope.editing['recipientBank'] = row['id']
            $scope.IsBankDialogOpened = false;
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