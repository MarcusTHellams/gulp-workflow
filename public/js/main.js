(function () {


    angular.module('myApp', [])
        .controller('myController', myController);

        console.log('goodbye');
        console.log('Hello');
    


    var marko = "not my fight";

    myController.$inject = ['$scope', '$location', '$window'];

    function myController($scope, $location, $window) {
        $scope.changeUrl = function () {
            console.warn(marko);
            $location.url('readyToGo');
            $location.replace();
        };
    }
})();