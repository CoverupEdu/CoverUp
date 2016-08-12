app.controller('modify-popover-controller', ['globalData', '$scope', '$ionicPopover', '$rootScope', '$timeout', function(globalData, $scope, $ionicPopover, $rootScope, $timeout) {
	$scope.insLabel;	//currently entered label while in edit mode.

	$scope.$watch(function() { 
		return globalData.canEditLabel;
		}, function(newValue, oldValue) {
			$scope.canEditLabel = newValue;
		}
	);
	
	$rootScope.textFocus = function(){		//
		if (globalData.canEditLabel) {
			$timeout(function () {
			document.getElementById('textEntry').focus();
			if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
			  cordova.plugins.Keyboard.show(); //open keyboard manually
			}
		  }, 500);
	}};
	
	//'focus' text such that the textbox becomes selected (on phone, keyboard comes up etc.)
	
	$scope.$on('popover.hidden', function() {
		$rootScope.editButton();
		if (globalData.canEditLabel) {globalData.canEditLabel = false;}
		$timeout(function() {
			if (globalData.popOpen) {
				$rootScope.checkNull();
				globalData.popOpen = false;
			}
		})
	});
	
	//save currently entered label, set edit mode to false for next label, and delete popover if label is null.
	
	$scope.editStyle = function() {
		if (globalData.canEditLabel) {
			return "button energized button-icon icon ion-android-done";
		} else {
			return "button energized button-icon icon ion-edit";
		}
	}
	
	//define how edit button looks whether in edit/view mode for label.
	
	$rootScope.editButton = function() {
		globalData.curLabel = $scope.insLabel;
		if (!globalData.canEditLabel) {
			$scope.insLabel = $scope.labels[$scope.curIndex].label;
		}
		else {$scope.labels[$scope.curIndex].label = globalData.curLabel;}
		globalData.canEditLabel = !globalData.canEditLabel;
		$rootScope.textFocus();
	};
	
	/*actions when 'edit' button is clicked. currently entered label is saved as actual label, 
	and if going from viewing to editing, the currently entered label is defined as the actual label.
	*/
	
	$rootScope.insReset = function() {
		$scope.insLabel = "";
	}
}]);