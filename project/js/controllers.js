/**
 * Created by Administrator on 2017/2/14.
 */
angular.module('app.controllers',['app.servers'])
.controller('tabsCtrl',['$scope','$interval','tabsServer',function($scope,$interval,tabsServer){
        $scope.data = [
            {
                href:'',
                src:'',
                alt:'',
                name:'广告位',
                message:'新美丽都三甲医院主任开通方案定制服务，点击定制等等...'
            },{
                href:'',
                src:'',
                alt:'',
                name:'广告位',
                message:'新美丽都三甲医院主任开通方案定制服务，点击定制等等...'
            },{
                href:'',
                src:'',
                alt:'',
                name:'广告位',
                message:'新美丽都三甲医院主任开通方案定制服务，点击定制等等...'
            },{
                href:'',
                src:'',
                alt:'',
                name:'广告位',
                message:'新美丽都三甲医院主任开通方案定制服务，点击定制等等...'
            }
        ];
        var uls = $('#banner').find('ul');
//        uls.append(uls.find("li:first").clone());/*复制第一个到最后面，保证最后出来的是第一张*/
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
            if(index < 3){
                index ++;
                uls.animate({left:(index)*(-375)},1000);
            }else{
                index = 0;
                uls.animate({left:3*(-375)},500, function () {//运动到复制的第一张，并执行回调
                    $(this).css("left","0");
                });
            }
            oBtn.eq(index).addClass("active-span").siblings().removeClass("active-span");
        }
    }])
.controller('lineCtrl',['$scope', function ($scope) {

    }])
.controller('loginCtrl',['$scope', function ($scope) {
        
    }])