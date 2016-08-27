
var app = angular.module("mainApp", ['ui.router'])
app.config(function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/');

    $stateProvider

        // // HOME STATES AND NESTED VIEWS ========================================
        .state('home', {
            url: '/home',
            templateUrl: './partials/designer.html'
        })
        .state('design', {
            url: '/design',
            templateUrl: './partials/designer.html'
        })
        .state('login', {
            url: '/login',
            templateUrl: './partials/login.html'
        })
        .state('signup', {
            url: '/signup',
            templateUrl: './partials/signup.html'
        })
        .state('logout', {
          url: '/logout',
          templateUrl: './partials/login.html'
        })
        //
        // // ABOUT PAGE AND MULTIPLE NAMED VIEWS =================================
        // .state('about', {
        //     // we'll get to this in a bit
        // });

});
