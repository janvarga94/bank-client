'use strict';

app.component('bankOrders', {
    templateUrl: 'app/commonTemplates/defaultTable.html',
    controller: ['$scope', '$http', '$attrs', '$rootScope', '$compile', '$element', function OrdersCtrl($scope, $http, $attrs, $rootScope, $compile, $element) {

        $scope.rows = [];
        $scope.selected = {};
        $scope.editing = {};
        $scope.setSelected = function (row) {
            if ($attrs.iamdialog)
                $rootScope.$broadcast('BANK_ORDER_SELECTED', row);
            $scope.selected = row;
            $scope.editing = $.extend({}, row);
        }

        $scope.header = [
            { label: "Id", code: "id", manatory: false, type: "text" },
            { label: "Bank order date", code: "bankOrderDate", manatory: false, type: "date" },
            { label: "Direction", code: "direction", manatory: false, type: "text" },
            { label: "Debtor", code: "debtor", manatory: false, type: "text" },
            { label: "Purpose of payment", code: "purposeOfPayment", manatory: false, type: "text" },
            { label: "Recipient", code: "recipient", manatory: false, type: "text" },
            { label: "Order date", code: "orderDate", manatory: false, type: "date" },
            { label: "Currensy date", code: "currensyDate", manatory: false, type: "date" },
            { label: "First account", code: "firstAccount", manatory: false, type: "text" },
            { label: "First model", code: "firstModel", manatory: false, type: "text" },
            { label: "First number", code: "firstNumber", manatory: false, type: "text" },
            { label: "Secont account", code: "secondAccount", manatory: false, type: "text" },
            { label: "Second model", code: "secondModel", manatory: false, type: "text" },
            { label: "Second number", code: "secondNumber", manatory: false, type: "text" },
            { label: "Amount", code: "amount", manatory: false, type: "number" },
            { label: "Urgently", code: "urgently", manatory: false, type: "checkbox" },
            { label: "Daily account balance", code: "dailyAccountBalance", manatory: false, type: "number", isReference: true, openDialog: () =>$scope.openDialog('daily-account-balances') },
        ];

        $http.get('/api/bankOrders.json').then(function successCallback(response) {
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

        $scope.openDialog = function (tagName, id) {
            if (id) {
                $scope.dialog = $compile(
                    "<" + tagName + ' ' +  "filterid='"+id+"'  iamdialog='true'></" + tagName + ">"
                )($scope);
            } else {
                $scope.dialog = $compile(
                    "<" + tagName + " iamdialog='true'></" + tagName + ">"
                )($scope);
            }

            $element.append($scope.dialog);
        }

        $scope.zoomSingleLine = function (code, row) {
            if (code == 'dailyAccountBalance') {
               $scope.openDialog('daily-account-balances',row[code]);
            }
        };

        $rootScope.$on('DAILY_ACCOUNT_BALANCE_SELECTED', function (event, row) {
            if (row['id']) $scope.editing['dailyAccountBalance'] = row['id']
            $scope.dialog.remove();
        });

        //-------------------------------------> filtering, ordering, pagination <----------------------------------------------

        $scope.filters = {};
        $scope.filterId = $attrs.filterid;

        $scope.showRow = function (row) {
            if ($scope.filterId && $scope.filterId.toString() != row['id'].toString())  //if zoom on one entity
                return false;
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