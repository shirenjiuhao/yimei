/**
 * Created by Administrator on 2017/2/14.
 */
angular.module('app.controllers',['app.servers'])
.controller('tabsCtrl',['$scope','$interval','tabsServer',function($scope,$interval,tabsServer){
        var callback = function (data) {
            $scope.data = data;
        };
        tabsServer.getData(callback);
    }])
.controller('lineCtrl',['$scope','lineServer', function ($scope,lineServer) {
    var callback = function (data) {
        $scope.lists = data ;
    }
        lineServer.getData(callback);
    }])
.controller('yishengCtrl',['$scope', function ($scope) {
        
    }])
.controller('diylistCtrl',['$scope', function ($scope) {
        
    }])
.controller('diyInfoCtrl',['$scope', function ($scope) {

    }])
.controller('loginCtrl',['$scope','$interval',function ($scope,$interval) {
        var text = $('.login-get').find('a');
        var reg = /^1(3|4|5|7|8)\d{9}$/ig;
        var str1 = "";
        $scope.getInfo = function () {
            var name = $('.login-input').find("input[type='tel']").val();
            var text1 = "";
            if(!reg.test(name)){
                alert('手机号有误，请重新填写');
                return false;
            }else {
                for (var i = 1; i <= 6; i++) {
                    str1 = str1 + parseInt(Math.random() * 10);
                }
                alert(str1);
            };
            var targetDate = new Date();
            targetDate.setMinutes(targetDate.getMinutes()+1);
            var timer = $interval(function () {
                var newDate = new Date();
                var result = targetDate.valueOf() - newDate.valueOf();
                var minute = Math.floor(result%(1000 * 60)/(1000));
                if(result > 0){
                    text1 = minute + '后可发送';
                }else{
                    $interval.cancel(timer);
                    text1 = '重新发送';
                }
                text.html(text1);
            },20);
        }
        $scope.login = function () {
            var pwd = $('.login-input').find("input[type='text']").val();
            if(pwd != '' && pwd == str1){
                $('#login-btn').find('a').attr({href:'#/tabs'});
            }
        }
    }])
.controller('mineCtrl',['$scope', function ($scope) {

    }])
.controller('counselorCtrl',['$scope', function ($scope) {

    }])