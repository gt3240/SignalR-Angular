//UserPage Controller

(function () {
    "use strict";

    angular.module(APPNAME)
        .controller('userPageController', userPageController);

    userPageController.$inject = ['$scope', '$baseController', "$userPageService", "$signalRService"];

    function userPageController(
        $scope
        , $baseController
        , $userPageService
        , $signalRService
         ) {

        var vm = this;
        vm.headingInfo = "Angular 101";
        vm.item = null;
        vm.showNewEmployeeErrors = false;
        vm.userId = $('#userId').val();
        vm.isFollowing = $('#isFollowing').val();
        vm.isLoggedIn = $('#isLoggedIn').val();


        vm.$signalRService = $signalRService;
        vm.$userPageService = $userPageService;
        vm.$scope = $scope;

        vm.receiveItems = _receiveItems;
        vm.onAjaxErr = _onAjaxErr;
        vm.init = _init;
        vm.loadUser = loadUser;

        $baseController.merge(vm, $baseController);

        vm.notify = vm.$userPageService.getNotifier($scope);

        _init();

        function _init() {
			vm.$userPageService.GetCurrentUserId(vm.receiveItems, vm.onAjaxErr);
            vm.$systemEventService.broadcast("updateFollowers");
            vm.$systemEventService.listen("testSuccess", loadUser);
            vm.$systemEventService.listen("avatarSuccess", loadUser);
        }

        function _receiveItems(data) {  
            vm.notify(function () {
                vm.item = data.item;
            });
            console.log("layout user info", vm.item);
            var userName = vm.item.firstName + " " + vm.item.lastName;

            vm.$signalRService.startHub();
            vm.$signalRService.Connect(userName, vm.item.id);
        }
		
        vm.$signalRService.onConnected(function (message) {
            console.log("connected ", message);
        });

        vm.$signalRService.dmReceived(function (message) {
            $('#emailNotiDot').addClass('dot bg-danger');
        });

        function _onAjaxErr(response) {
            console.log(response);
        }

     
    }
})();