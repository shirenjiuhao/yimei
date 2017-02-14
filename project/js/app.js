/**
 * Created by Master on 2017/02/13.
 */
angular.module('app',['ionic','app.controllers','app.servers'])
.config(function($stateProvider, $urlRouterProvider){
	$stateProvider
	.state('tabs',{
		url:'/tabs',
		templateUrl: 'views/yimei.html'
	})
//	.state('tabs.line',{
//		url:'/line',
//		views: {
//	      'tabs-line': {
//	        templateUrl: 'views/yimeiLine.html',
//	        controller: 'lineCtrl'
//	      }
//	    }
//	})
//        .state('tabs.diy',{
//            url:'/diy',
//            views:{
//                'tabs-diy':{
//                    templateUrl:'views/yiyuanDiy.html',
//                    constroller:'diyCtrl'
//                }
//            }
//        })
    $urlRouterProvider.otherwise('/tabs');/*默认的路由*/
})