// CONTROLLER: modify-controller
// Controls the modify page.
// Injects: $scope, $rootScope, $ionicPopover, Photo, Labels
app.controller('modify-controller', ['$cordovaFile', '$ionicLoading', '$location', '$anchorScroll', '$timeout', '$rootScope', '$window', '$ionicScrollDelegate', '$scope', '$ionicPopover', 'Photo', 'Labels', 'Sets', function($cordovaFile, $ionicLoading, $location, $anchorScroll, $timeout, $rootScope, $window, $ionicScrollDelegate, $scope, $ionicPopover, Photo, Labels, Sets) {
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
		$timeout(function() {
			$scope.clickButton($scope.labels.length - 1);
		}, 0);
		$rootScope.editButton();
	}
	
	$scope.addControl = function(event) {
		$rootScope.insReset();
        $scope.xpos = (event.offsetX) / (0.01 * document.getElementById('imagecont').getBoundingClientRect().width);
        $scope.ypos = (event.offsetY) / (0.01 * document.getElementById('imagecont').getBoundingClientRect().height);
        Labels.addLabel($scope.xpos, $scope.ypos, "");
	}
	
    $scope.openPopover = function(event, index) {
		$timeout(function() {
			$ionicScrollDelegate.scrollTo(0, $scope.labels[index].y * 0.01 * document.getElementById('imagecont').getBoundingClientRect().height - 50, true)
		},50)
		$rootScope.popOpen = true;
		$scope.checkFocused=true;
        $scope.index = {value:index};
		$scope.curIndex = index;
		$rootScope.insReset();
		$timeout(function() {
			$scope.popover.show(event);
		}, 400)
		$rootScope.textFocus();
		$rootScope.curLabel = $scope.labels[$scope.curIndex].label;
    }
	
	$scope.clickButton = function(ind) {
		var el = document.getElementById('labelbutton'+ind.toString());
		$timeout(function() {
			angular.element(el).triggerHandler('click');
		}, 0);
	}

	//~~~~~~~~~~~~~~~~~
	//Save Feature
	//~~~~~~~~~~~~~~~~~
	
	$scope.saveSet = function() {
		$cordovaFile.copyFile($rootScope.sourceDirectory, $rootScope.sourceFileName, $rootScope.targetDirectory, $rootScope.sourceFileName).then(function(success) {
			$rootScope.fileName = $rootScope.targetDirectory + $rootScope.sourceFileName;
		})
		Sets.image.push(Photo.image);
		$rootScope.initSetList();
	}
}])
