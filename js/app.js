/**
 * Created by Master on 2017/02/13.
 */
angular.module('app',['ngRoute','app.controllers','app.servers'])
.config(function($routeProvider){
        $routeProvider
            .when('/tabs',{
                templateUrl: 'views/yimei.html',
                controller:'tabsCtrl'
            })
            .when('/tabs/line',{
                templateUrl:'views/yimeiLine.html',
                controller:'lineCtrl'
            })
            .when('/tabs/login',{
                templateUrl:'views/login.html',
                controller:'loginCtrl'
            })
        .otherwise({redirectTo:'/tabs'});/*默认的路由*/
})