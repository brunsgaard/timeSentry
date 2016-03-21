'use strict';

var tsApp = angular.module('tsApp');

var resource_url = "http://127.0.0.1:5000";

tsApp.factory('apiService', function($http, $q) {

    var fac = {};

    fac.encode = function(item) {
        var ret = {}
        angular.forEach(item, function(value, key) {
            if (value instanceof Date) {
                ret[key] = {
                    $date: value.getTime() - value.getTimezoneOffset() * 60 * 1000
                };
            } else if (key == "$uri") {
                // omit uri
            } else {
                ret[key] = value;
            };
        });
        return ret;
    };

    fac.decode = function(item) {
        var ret = {}
        angular.forEach(item, function(value, key) {
            if (value !== null && typeof value.$date != 'undefined') {
                ret[key] = new Date(value.$date + new Date().getTimezoneOffset() * 60 * 1000);
            } else {
                ret[key] = value;
            };
        });
        return ret;
    };

    fac.get = function(id) {
        var deferred = $q.defer();
        $http.get(resource_url + id).then(
            function(response) {
                deferred.resolve(fac.decode(response.data));
            },
            function(response) {
                deferred.reject(fac.decode(response.data));
            }
        );
        return deferred.promise;
    }

    fac.patch = function(item) {
        var deferred = $q.defer();
        $http.patch(resource_url + item.$uri, fac.encode(item)).then(
            function(response) {
                deferred.resolve(fac.decode(response.data))
            },
            function(response) {
                deferred.reject(fac.decode(response.data))
            }
        );
        return deferred.promise;
    }

    fac.post = function(resource, item) {
        var deferred = $q.defer();
        $http.post(resource_url + resource, fac.encode(item)).then(
            function(response) {
                deferred.resolve(fac.decode(response.data))
            },
            function(response) {
                deferred.reject(fac.decode(response.data))
            }
        );
        return deferred.promise;
    }

    fac.delete = function(uri) {
        var deferred = $q.defer();
        $http.delete(resource_url + uri).then(
            function(response) {
                deferred.resolve(fac.decode(response.data));
            },
            function(response) {
                deferred.reject(fac.decode(response.data));
            }
        );
        return deferred.promise;
    }

    return fac;

});

tsApp.factory('clientService', function($http, $q, apiService) {

    var instance = {};
    instance.results = []
    instance.get = apiService.get;
    instance.patch = apiService.patch;

    instance.query = function() {
        var deferred = $q.defer();
        $http.get(resource_url + "/employee").then(
            function(response) {
                var ret = [];
                angular.forEach(response.data, function(item) {
                    ret.push(apiService.decode(item))
                });
                instance.results = ret;
                deferred.resolve(ret);
            },
            function(response) {
                deferred.reject(response.data);
            }
        );
        return deferred.promise;
    }
    return instance;
});
