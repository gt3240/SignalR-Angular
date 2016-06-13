(function () {
    "use strict";

    angular.module(APPNAME)
        .factory('$signalRService', SignalRServiceFactory);

    SignalRServiceFactory.$inject = ['$baseService', '$sabio'];

    function SignalRServiceFactory($baseService, $sabio) {

        var svc = this;
        svc = $baseService.merge(true, {}, svc, $baseService);

        var $hub = $.connection.notificationHub;
        var connection = null;
        var signalR = {
            startHub: function () {
                console.log("started");
                connection = $.connection.hub.start();
            },
            //////////////////// SERVER METHODS/////////////////
            Connect: function (userName, userId) {
                connection.done(function () {
                    $hub.server.connect(userName, userId);
                });
            },
            
            ////////////////////// CLIENT METHODS////////////////////            
            onConnected: function (callback) {
                $hub.client.onConnected = callback;
            },

            dmReceived: function (callback) {
                $hub.client.dmNotificationFromSever = callback;
            }


        }
        return signalR;
    }
})();