'use strict';

// Declare app level module which depends on views, and components
var app = angular.module('myApp', [
  'ngRoute',
]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');
     $routeProvider.when("/login", {
        template : "<login></login>",
    }).when("/otvaranjeRacuna", {
        template : "<otvaranje-racuna></otvaranje-racuna>",
    }).when("/bankAccounts", {
        template : "<bank-accounts></bank-accounts>",
    }).when("/currensies", {
        template : "<currensies></currensies>",
    }).when("/closingAccounts", {
        template : "<closing-accounts></closing-accounts>",
    }).when("/", {
        template : "<welcome-page></welcome-page>",
    });
   $routeProvider.otherwise({redirectTo: '/'});
}]);

