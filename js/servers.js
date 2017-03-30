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
.service('loginServer',['$http',function ($http) {
        this.getData = function(callback,url){
            $http.get(url,{cache:true}).success(function (data) {
                callback(data);
            })
        };
        return this;
    }])
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
.service('yishengServer',['$http', function ($http) {
        this.getData = function(callback,url){
            $http.get(url,{cache:true}).success(function (data) {
                callback(data);
            })
        }
        return this;
    }])
.service('diylistServer',['$http', function ($http) {
    this.getData = function(callback,url){
        $http.get(url,{cache:true}).success(function (data) {
            callback(data);
        })
    }
    return this;
}])
.service('diyInfoServer',['$http', function ($http) {
        this.getData = function(callback,url){
            $http.get(url,{cache:true}).success(function (data) {
                callback(data);
            })
        }
        return this;
    }])
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
    .service('focus', function ($timeout, $window) {
        return function (id) {
            $timeout(function () {
                var element = $window.document.getElementById(id);
                if (element)
                    element.focus();
            });
        };
    })
    .service('messagesServer',['$http', function ($http) {
        this.getData = function(callback,url){
            $http.get(url,{cache:true}).success(function (data) {
                callback(data);
            })
        }
        return this;
    }])
    .service('programServer',['$http', function ($http) {
        this.getData = function(callback,url,Authorization){
            $http({
                url: url,
                method:'get',
                cache:true,
                headers: {
                    Authorization: Authorization
                }
            }).then(function(res){
                callback(res.data);
            })
        }
        return this;
    }])
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
            }).then(function(res){
                callback(res.data);
            })
        }
        return this;
    }])