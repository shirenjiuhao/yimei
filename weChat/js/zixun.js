/**
 * Created by Administrator on 2017/2/15.
 */
/*angular.module('app', ['app.controllers',"app.servers"])
    .config(['$routeProvider', function ($routeProvider) {

    }])*/
var app = angular.module('app',['ngRoute']);
app.config(function ($routeProvider) {
    $routeProvider
        .when('/tabs',{
            templateUrl:'zixun.html'
        })
        .when('/tabs/:id',{
            templateUrl:'zixun-info.html',
            controller:"infoCtrl"
        })
        .otherwise({redirectTo:'/tabs'})
});
// 定义滚动指令
app.directive('whenScrolled', function() {
    return function(scope, elm, attr) {
        // 内层DIV的滚动加载
        var raw = elm[0];
        elm.bind('scroll', function() {
            if (raw.scrollTop + raw.offsetHeight >= raw.scrollHeight) {
                scope.$apply(attr.whenScrolled);
            }
        });
    };
});
app.controller('bannerCtrl',['$scope','$interval','bannerServer',function($scope,$interval,bannerServer){
    /*轮播图*/
    var uls = $('#banner').find('ul');
    var oBtn = $('#btn').find('span');
    var index = 0;//第一张banner
    oBtn.click(function () {
        index = $(this).index();
        uls.animate({left:(index)*(-375)},1000);
        oBtn.eq(index).addClass("active-span").siblings().removeClass("active-span");
    });//对应的按钮切换图片
    var timer = $interval(next,2000);//启动间歇
    uls.bind({"mouseenter":function () {//over 停止间歇
        $interval.cancel(timer);
    },"mouseleave":function () {//out 启动间歇
        $interval.cancel(timer);
        timer = $interval(next,2000);
    }});
    oBtn.hover(function () {
        $interval.cancel(timer);
    },function () {//out 启动间歇
        $interval.cancel(timer);
        timer = $interval(next,2000);
    });
    function next() {
        if(index < 2){
            index ++;
            uls.animate({left:(index)*(-375)},1000);
        }else{
            index = 0;
            uls.animate({left:2*(-375)},500, function () {//运动到复制的第一张，并执行回调
                $(this).css("left","0");
            });
        }
        oBtn.eq(index).addClass("active-span").siblings().removeClass("active-span");
    };
    /*加载回调*/
    var callback = function(data){
        $scope.data = data;
    }
    bannerServer.getData(callback);
}]);
/*加载banner*/
app.service('bannerServer',['$http', function ($http) {
    var items = [];
    this.getData = function(callback){
        var url = "banner.json";
        $http.get(url,{cache:true}).success(function (data) {
            for (var i in data.list) {
                items.push(data.list[i]);
            }
            callback(items);
            items = [];
        })
    }
    return this;
}])
/*加载列表*/
app.controller('contentCtrl',['$scope','contentServer',function ($scope,contentServer) {
    /*$scope.date = new Date();*/
    $scope.hasMore = contentServer.flag;
    var callback = function(data){
        $scope.data = data;
    }
//    第一次加载数据
    contentServer.loadMore(callback);
    $scope.click = function () {

    }
}]);
app.service('contentServer',['$http', function ($http) {
    // 当前页数
    var pageNumber = 0;
    // 总页数
    var totalCount = 1;
    var flag = false;
    // 存放数据
    var items = [];
    //请求数据方法
    this.loadMore = function(callback){
            // 请求后台服务器
        var url = 'content.json';
        $http.get(url)
            .success(function(data) {
                //组织数据
                callback(data);
            })

    }
    return this;
}])
/*加载详情页*/
app.controller('infoCtrl',['$scope','infoServer',function($scope,infoServer){
    $scope.date = new Date();
    var callback = function(data){
        $scope.data =data;
    }
//    infoServer.getData(callback)
}])
app.service('infoServer',['$http',function($http){
/*    var items = [];
    this.getData = function(callback){
        var url = "content.json";
        $http.get(url,{cache:true}).success(function (data) {
//                console.log(data);
            for (var i in data.list) {
                items.push(data.list[i]);
            }
            callback(items);
            items = [];
        })
    }
    return this;*/
}])
