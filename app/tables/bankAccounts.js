'use strict';

app.component('bankAccounts', {
    templateUrl: 'app/commonTemplates/defaultTable.html',
    controller: ['$scope', '$http', '$attrs', '$timeout', '$rootScope', '$element', '$compile', function BankAccoutnsCtrl($scope, $http, $attrs, $timeout, $rootScope, $element, $compile) {
        var ctrl = this;
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
            { label: "Bank", code: "bank", type: "text", isReference: true, openDialog: () => $scope.openDialog('banks') },
            { label: "Currency", code: "currency", type: "text", isReference: true, openDialog: () => $scope.openDialog('currensies') },
            { label: "Client Details", code: "client", type: "text", isReference: true, openDialog: () => $scope.openDialog('client-details') },
        ];

        $http.get(appConfig.apiUrl + 'accounts').then(function successCallback(response) {
            console.log(response.data);
            $scope.header.filter(h => h.type == "date").forEach(h => response.data.forEach(row => row[h.code] = new Date(row[h.code])));  //conver strings to dates where needed
            $scope.rows = response.data;
        },function err(e){
            console.log(e);
        });

        $scope.allowAdd = true; $scope.allowEdit = true; $scope.allowRemove = true;
        $scope.doAdd = function () {
            $http.post(appConfig.apiUrl + 'accounts', $scope.editing).then(function successCallback(response) {
                var row = response.data;
                if (row) {
                    $scope.header.filter(h => h.type == "date").forEach(h => row[h.code] = new Date(row[h.code]));  //conver strings to dates where needed
                    $scope.rows.push(row);
                    toastr.success('Added successfuly.')
                }
            }, function err(e) {
                toastr.error("Can't add sorry.")
            });
        }

        $scope.doEdit = function () {
            if ($scope.selected.id) {
                $http.post(appConfig.apiUrl + 'accounts', $scope.editing).then(function successCallback(response) {
                    var row = response.data;
                    if (row) {
                        $scope.header.filter(h => h.type == "date").forEach(h => row[h.code] = new Date(row[h.code]));  //conver strings to dates where needed
                        $scope.rows.splice($scope.rows.indexOf($scope.selected), 1);
                        $scope.rows.push(row);
                        toastr.success('Edited successfuly.')
                    }
                }, function err(e) {
                    toastr.error("Can't edit sorry.")
                });
            } else {
                toastr.info('Select row first.')
            }

        }

        $scope.doRemove = function () {
            if ($scope.selected.id) {
                $http.delete(appConfig.apiUrl + 'accounts/' + $scope.selected.id).then(function successCallback(response) {

                    $scope.rows.splice($scope.rows.indexOf($scope.selected), 1);
                    toastr.success('Removed successfuly.')

                }, function err(e) {
                    toastr.error("Can't remove sorry.")
                });
            } else {
                toastr.info('Select row first.')
            }
        }

        $scope.iamdialog = $attrs.iamdialog == 'true';

        //-------------------------------------> zoom <--------------------------------------------------------------------------


        $scope.openDialog = function (tagName, id) {
            if (id) {
                $scope.dialog = $compile(
                    "<" + tagName + ' ' + "filterid='" + id + "'  iamdialog='true'></" + tagName + ">"
                )($scope);
            } else {
                $scope.dialog = $compile(
                    "<" + tagName + " iamdialog='true'></" + tagName + ">"
                )($scope);
            }

            $element.append($scope.dialog);
        }

        $scope.zoomSingleLine = function (code, row) {
            if (code == 'currency') {
                $scope.openDialog('currensies', row[code]);
            }
            if (code == 'clientDetails') {
                $scope.openDialog('client-details', row[code]);
            } if (code == 'bank') {
                $scope.openDialog('client-details', row[code]);
            }
        };

        $rootScope.$on('BANK_SELECTED', function (event, row) {
            if (row['id'])
                $scope.editing['bank'] = row['id']
            $scope.dialog.remove();
        });

        $rootScope.$on('CURRENSY_SELECTED', function (event, row) {
            if (row['id'])
                $scope.editing['currency'] = row['id']
            $scope.dialog.remove();
        });

        $rootScope.$on('CLIENT_DETAILS_SELECTED', function (event, row) {
            if (row['id'])
                $scope.editing['clientDetails'] = row['id']
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