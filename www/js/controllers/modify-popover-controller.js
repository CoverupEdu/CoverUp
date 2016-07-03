app.controller('modify-popover-controller', function($scope, $ionicPopover, $rootScope, $timeout) {
	$scope.insLabel;

	$rootScope.textFocus = function(){
		if ($rootScope.labelEdit) {
			$timeout(function () {
			document.getElementById('textEntry').focus();
			if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
			  cordova.plugins.Keyboard.show(); //open keyboard manually
			}
		  }, 500);
	}};
	
	$scope.$on('popover.hidden', function() {
		$rootScope.editButton();
		if ($rootScope.labelEdit) {$rootScope.labelEdit = false;}
		$timeout(function() {
			if ($rootScope.popOpen) {
				$rootScope.checkNull();
				$rootScope.popOpen = false;
			}
		})
	});
	
	$scope.editStyle = function() {
		if ($rootScope.labelEdit) {
			return "button energized button-icon icon ion-android-done";
		} else {
			return "button energized button-icon icon ion-edit";
		}
	}
	
	
	$rootScope.editButton = function() {
		$rootScope.curLabel = $scope.insLabel;
		if (!$rootScope.labelEdit) {
			$scope.insLabel = $scope.labels[$scope.curIndex].label;
		}
		else {$scope.labels[$scope.curIndex].label = $rootScope.curLabel;}
		$rootScope.labelEdit = !$rootScope.labelEdit;
		$rootScope.textFocus();
	};
	
	$rootScope.insReset = function() {
		$scope.insLabel = "";
	}
});