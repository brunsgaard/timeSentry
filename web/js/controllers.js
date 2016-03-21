'use strict';

var tsApp = angular.module('tsApp');

tsApp.controller('projectCtrl', function($scope, $http, apiService, $mdDialog) {

    $scope.refresh = function() {
        apiService.get('/client').then(
            function(clients) {
                $scope.clients = clients;
            }
        )
    }
    $scope.deleteResource = function(client) {
        apiService.delete(client.$uri).then(
            function(data) {
                $scope.refresh();
            }
        )
    }

    $scope.createClient = function(ev) {

        var confirm = $mdDialog.prompt()
            .title('What would you name your new client')
            .placeholder('E-conomic')
            .ariaLabel('Client Name')
            .targetEvent(ev)
            .ok('Go!')
            .cancel('Take me back');

        $mdDialog.show(confirm).then(function(result) {
            apiService.post('/client', {
                'name': result
            }).then(
                function(data) {
                    $scope.refresh();
                }
            )
        });
    }

    $scope.createProject = function(client, ev) {
        var clientId = parseInt(client.$uri.split("/").slice(-1).pop());

        var confirm = $mdDialog.prompt()
            .title('What would you name your new project')
            .placeholder('Demo app')
            .ariaLabel('Project Name')
            .targetEvent(ev)
            .ok('Go!')
            .cancel('Take me back');

        $mdDialog.show(confirm).then(function(result) {
            apiService.post('/project', {
                'name': result,
                'client': clientId
            }).then(
                function(data) {
                    $scope.refresh();
                },
                function(data) {
                    console.log(data);
                }
            )
        });
    }

    $scope.refresh();

});

tsApp.controller('trackerCtrl', function($scope, $http, apiService, $mdDialog) {

    apiService.get('/client').then(
        function(clients) {
            $scope.clients = clients;
        }
    )

    $scope.save_entry = function() {
        var projectId = parseInt($scope.selected_project.$uri.split("/").slice(-1).pop());
        var payload = {
            'duration': $scope.duration * 60,
            'project': projectId,
            'start': $scope.selected_date,
            'message': $scope.message
        }
        apiService.post('/work_entry', payload).then(
            function(data) {
                $scope.refresh();
                $scope.duration = null;
                $scope.selected_date = null;
                $scope.selected_client = null;
                $scope.message = null;
            }
        )
    }

    $scope.refresh = function() {
        apiService.get('/work_entry/overview').then(
            function(data) {
                $scope.entries = data;
            }
        )
    }

    $scope.refresh();

});

tsApp.controller('invoiceCtrl', function($scope, $http, apiService, $mdDialog) {

    apiService.get('/client').then(
        function(clients) {
            $scope.clients = clients;
        }
    )

    $scope.selected_month = null;
    $scope.months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
    ];

    $scope.load = function() {
        var clientId = parseInt($scope.selected_client.$uri.split("/").slice(-1).pop());
        apiService.post('/client/' + clientId.toString() + '/billing', {
            'month': $scope.selected_month
        }).then(
            function(data) {
                $scope.invoice_data = data;
                console.log(data.projects)
            }
        )
    };

});