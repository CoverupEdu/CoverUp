// CONTROLLER: modify-controller
// Controls the modify page.
// Injects: $scope, $rootScope, $ionicPopover, Photo, Labels
app.controller('modify-controller', ['$timeout', '$rootScope', '$window', '$ionicScrollDelegate', '$scope', '$ionicPopover', 'Photo', 'Labels', function($timeout, $rootScope, $window, $ionicScrollDelegate, $scope, $ionicPopover, Photo, Labels) {
    $scope.labels = Labels.labels;
    $scope.photoService = Photo;
	$rootScope.labelEdit = false;
	$scope.curIndex = 0;
	$scope.nullString = "";
	$rootScope.curLabel;
	$scope.checkFocused;
	$scope.labelStyle = [];
	$rootScope.popOpen = false;
	
	$ionicPopover.fromTemplateUrl('templates/modify-popover.html', {
        scope: $scope
    }).then(function(popover) {
        $scope.popover = popover;
	});
    
    /* NOTE: fromTemplateUrl is occasionally reported to yield errors on mobile, alternative here:
    var poptemplate = (content, e.g. '<ion-popover-view class="label-popover">' + '<h3 class="title">text</h3>' + '</ion-popover-view>';)
    
    $scope.popover = $ionicPopover.fromTemplate(poptemplate, {
       scope: $scope
   });
    */
	
	$scope.setStyleAll = function() {
		for (i = 0; i < $scope.labels.length; i++) {
			$scope.setStyle(i);
		}
	}
	
	$scope.setStyle = function(val) {
		$scope.labelStyle[val] = {
			left: ($scope.labels[val].x * 0.01 * document.getElementById('imagecont').getBoundingClientRect().width + 'px'),
			top: ($scope.labels[val].y * 0.01 * document.getElementById('imagecont').getBoundingClientRect().height + 'px')
		};
	}
	
	$scope.deleteLabel = function() {
		$scope.popover.hide();
		Labels.labels.splice($scope.curIndex, 1);
		$scope.setStyleAll();
	}
	
    $scope.swapLabelEdit = function(boole) {
        if (boole) {$rootScope.labelEdit = !$rootScope.labelEdit;}
        else {$rootScope.labelEdit = false;}
        $scope.labels[$scope.curIndex].label = $rootScope.curLabel;
    }
	
	$rootScope.checkNull = function() {
		if ($scope.labels[$scope.curIndex].label.length == 0) {$scope.deleteLabel();}
	}
	
	$scope.eventManage = function($event) {
		$scope.addControl($event); 
		//popup?
	}
	
	$scope.addControl = function(event) {
		$rootScope.insReset();
        $scope.xpos = (event.offsetX) / (0.01 * document.getElementById('imagecont').getBoundingClientRect().width);
        $scope.ypos = (event.offsetY) / (0.01 * document.getElementById('imagecont').getBoundingClientRect().height);
        Labels.addLabel($scope.xpos, $scope.ypos, "");
		$timeout(function() {
			$scope.clickButton($scope.labels.length - 1);
		}, 0);
		$rootScope.editButton();
	}
	
    $scope.openPopover = function(event, index) {
		$rootScope.popOpen = true;
		$scope.checkFocused=true;
        $scope.index = {value:index};
		$scope.curIndex = index;
		$rootScope.insReset();
        $scope.popover.show(event);
		$rootScope.textFocus();
		$rootScope.curLabel = $scope.labels[$scope.curIndex].label;
    }
	
	$scope.clickButton = function(ind) {
		var el = document.getElementById('button'+ind.toString());
		$timeout(function() {
			angular.element(el).triggerHandler('click');
		}, 0);
	}
}])
