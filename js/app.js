/**
 * Created by Master on 2017/02/13.
 */
angular.module('app',['ionic','ngRoute','app.controllers','app.servers'])
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
            .when('/tabs/line/:id',{
                templateUrl:'views/lineyisheng.html',
                controller:'yishengCtrl'
            })
            .when('/tabs/diy',{
                templateUrl:'views/diylist.html',
                controller:'diylistCtrl'
            })
            .when('/tabs/login',{
                templateUrl:'views/login.html',
                controller:'loginCtrl'
            })
        .otherwise({redirectTo:'/tabs'});/*默认的路由*/
})