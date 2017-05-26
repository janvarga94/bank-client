'use strict';

// Declare app level module which depends on views, and components
var app = angular.module('myApp', [
    'ngRoute',
]).
    config(['$locationProvider', '$routeProvider', function ($locationProvider, $routeProvider) {
        $locationProvider.hashPrefix('!');
        $routeProvider.when("/login", {
            template: "<login></login>",
        }).when("/otvaranjeRacuna", {
            template: "<otvaranje-racuna></otvaranje-racuna>",
        }).when("/bankAccounts", {
            template: "<bank-accounts></bank-accounts>",
        }).when("/currensies", {
            template: "<currensies></currensies>",
        }).when("/closingAccounts", {
            template: "<closing-accounts></closing-accounts>",
        }).when("/bankMessages", {
            template: "<bank-messages></bank-messages>",
        }).when("/clientDetails", {
            template: "<client-details></client-details>",
        }).when("/banks", {
            template: "<banks></banks>",
        }).when("/interbankTransfer", {
            template: "<interbank-transfer></interbank-transfer>",
        }).when("/", {
            template: "<welcome-page></welcome-page>",
        });
        $routeProvider.otherwise({ redirectTo: '/' });
    }]);

