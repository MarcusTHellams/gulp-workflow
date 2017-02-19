(function () {
    angular.module('myApp', [])
        .controller('myController', myController);

    console.log('not my');

    var marko = "not my fight";

    myController.$inject = ['$scope', '$location', '$window'];

    function myController($scope, $location, $window) {
        console.log('james');
        $scope.changeUrl = function () {
            console.error(marko);
            $location.url('readyToGo');
            $location.replace();
        };
    }
})();