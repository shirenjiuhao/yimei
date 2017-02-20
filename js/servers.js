/**
 * Created by Administrator on 2017/2/14.
 */
angular.module('app.servers',[])
.service('tabsServer',['$http', function ($http) {
        this.getData = function(callback){
            var url = "json/yimei.json";
            $http.get(url).success(function (data) {
                callback(data);
            })
        }
        return this;
    }])
.service('loginServer',['$http',function ($http) {
        this.getData = function(callback){
            var url = "";
            $http.get(url).success(function (data) {
                callback(data);
            })
        }
        return this;
    }])
.service('lineServer',['$http', function ($http) {
    this.getData = function(callback){
        var url = "json/yishenglist.json";
        $http.get(url).success(function (data) {
            callback(data);
        })
    }
    return this;
}])