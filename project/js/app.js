/**
 * Created by Master on 2017/02/13.
 */
angular.module('app',['ionic','app.controllers','app.servers'])
.config(function($stateProvider, $urlRouterProvider){
	$stateProvider
	.state('tabs',{
		url:'/tabs',
		templateUrl: 'templates/yimei.html'
	})
	.state('tabs.line',{
		url:'/line',
		views: {
	      'tab-line': {
	        templateUrl: 'templates/yimei-line.html',
	        controller: 'lineCtrl'
	      }
	    }
	})
    $urlRouterProvider.otherwise('/tabs');
})