/* jshint -W117 */
(function () {
    'use strict';
    angular.module('myApp')
        .controller('myController', myController);

    console.log('goodbye');
    console.log('Hello');
    console.log('Yes me');


    var marko = "not my fight";

    myController.$inject = ['$location'];

    function myController($location) {
        var vm = this; // jshint ignore:line
        vm.changeUrl = changeUrl;

        function changeUrl() {
            debugger;
            console.warn(marko);
            $location.url('readyToGo');
            $location.replace();
        }
    }
})();