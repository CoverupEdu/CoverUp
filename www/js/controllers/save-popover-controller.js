/*CONTROLLER: save-popover-controller
Controls the save popover. */

app.controller('save-popover-controller', ['globalData', '$state', 'customFileIO', '$cordovaFile', '$timeout', '$rootScope', '$scope', '$ionicPopover', 'Photo', 'Labels', 'Sets', function(globalData, $state, customFileIO, $cordovaFile, $timeout, $rootScope, $scope, $ionicPopover, Photo, Labels, Sets) {
	
	console.log("save popover is running!");
	
	$scope.setTitle = "";
	$scope.setSubject = "";
	
	
}])