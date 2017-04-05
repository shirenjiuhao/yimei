/**
 * Created by Administrator on 2017/2/14.
 */
angular.module('app.servers',[])
.service('tabsServer',['$http', function ($http) {
        this.getData = function(callback,url){
            $http.get(url,{cache:true}).success(function (data) {
                callback(data);
            })
        }
        return this;
    }])
//登录
.service('loginServer',['$http',function ($http) {
        this.getData = function(callback,url){
            $http.get(url,{cache:true}).success(function (data) {
                callback(data);
            })
        };
        return this;
    }])
//医生列表
.service('lineServer',['$http', function ($http) {
    this.getData = function(callback,url){
        $http.get(url,{cache:true}).success(function (data) {
            callback(data);
        })
    }
    this.getDataList = function(callback,url){
        $http.get(url,{cache:true}).success(function (data) {
            callback(data);
        })
    }
    return this;
}])
//医生详情
.service('yishengServer',['$http', function ($http) {
    this.getData = function(callback,url){
        $http.get(url,{cache:true}).success(function (data) {
            callback(data);
        })
    }
    return this;
}])
//医院列表
.service('diylistServer',['$http', function ($http) {
    this.getData = function(callback,url){
        $http.get(url,{cache:true}).success(function (data) {
            callback(data);
        })
    }
    return this;
}])
//医院详情
.service('diyInfoServer',['$http', function ($http) {
        this.getData = function(callback,url){
            $http.get(url,{cache:true}).success(function (data) {
                callback(data);
            })
        }
        return this;
    }])
//订单列表
.service('orderServer',['$http', function ($http) {
        this.getData = function(callback,url,Authorization){
            $http({
                url: url,
                method:'get',
                cache:true,
                headers: {
                    Authorization: Authorization
                }
            }).then(function (res) {
                callback(res.data);
            })
        }
        return this;
    }])
/*.service('focus', function ($timeout, $window) {
    return function (id) {
        $timeout(function () {
            var element = $window.document.getElementById(id);
            if (element)
                element.focus();
        });
    };
})*/
//消息列表
.service('messagesServer',['$http', function ($http) {
    this.getData = function(callback,url,params,Authorization){
        $http({
            url: url,
            method:'get',
            cache:true,
            params: params,
            headers: {
                Authorization: Authorization
            }
        }).then(function (res){
            callback(res.data);
        })
    }
    return this;
}])
//方案列表
.service('programServer',['$http', function ($http) {
    this.getData = function(callback,url,Authorization){
        $http({
            url: url,
            method:'get',
            cache:true,
            headers: {
                Authorization: Authorization
            }
        }).then(function (res){
            callback(res.data);
        })
    }
    return this;
}])
//方案详情
.service('programInfoServer',['$http', function ($http) {
    this.getData = function(callback,url,params,Authorization){
        $http({
            url: url,
            method:'get',
            cache:true,
            params: params,
            headers: {
                Authorization: Authorization
            }
        }).then(function (res){
            callback(res.data);
        })
    };
    this.payParams = function(callback,url,params,Authorization){
        $http({
            url: url,
            method:'post',
            params: params,
            headers: {
                Authorization: Authorization
            }
        }).then(function (res){
            callback(res.data);
        })
    }
    return this;
}])
//订单详情
.service('orderInfoServer',['$http',function ($http){
    this.getData = function(callback,url,params,Authorization){
        $http({
            url: url,
            method:'get',
            cache:true,
            params: params,
            headers: {
                Authorization: Authorization
            }
        }).then(function (res){
            callback(res.data);
        })
    }
    return this;
}])
//聊天窗口
.service('counselorServer',['$http',function ($http){
    this.getData = function(callback,url,params,Authorization){
        $http({
            url: url,
            method:'get',
            cache:true,
            params: params,
            headers: {
                Authorization: Authorization
            }
        }).then(function (res){
            callback(res.data);
        })
    }
    return this;
}])