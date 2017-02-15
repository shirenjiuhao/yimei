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
	/*.state('tabs',{
		url:'/tabs',
		templateUrl: 'views/yimei.html'
	})
	.state('tabs.line',{
		url:'/line',
            view:{
                templateUrl: 'views/yimeiLine.html',
                controller: 'lineCtrl'
            }
	})
        .state('tabs.diy',{
            url:'/diy',
            views:{
                templateUrl:'views/yiyuanDiy.html',
                constroller:'diyCtrl'
            }
        })*/
        .otherwise({redirectTo:'/tabs'});/*默认的路由*/
})