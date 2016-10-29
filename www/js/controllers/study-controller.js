// CONTROLLER: study-controller
// Controls the study page.
// Injects: $scope, $rootScope, $ionicPopover, Photo, Labels
app.controller('study-controller', ['$timeout', 'globalData', '$rootScope', '$ionicScrollDelegate', '$scope', '$ionicPopover', 'Photo', 'Labels', function($timeout, globalData, $rootScope, $ionicScrollDelegate, $scope, $ionicPopover, Photo, Labels) {
    $scope.labelsService = Labels;
	$scope.globalDataService = globalData;
	$scope.photoService = Photo;
	$scope.curIndex = 0;
	$scope.nullString = "";
	globalData.curLabel;
	$scope.labelStyle = [];
	$scope.openAll = false;
	$scope.isLoctest = true;
	$scope.testName = "Find";
	$scope.otherTestName = "Name";
	$scope.findScores = globalData.metadata.scores[0];
	$scope.nameScores = globalData.metadata.scores[1];
	
	$timeout(function() {
		console.log($scope.findScores);
		console.log($scope.nameScores);
	}, 100)
	
	$ionicPopover.fromTemplateUrl('templates/study-test-popover.html', {
        scope: $scope,
		animation: 'slide-in-up'
    	}).then(function(popover) {
        	$scope.study_test_popover = popover;
		});
	
	$scope.showScores = function() {
		console.log("showscores");
		$scope.study_test_popover.show();
	}
	
	$scope.setWhether = function(val) {
		$scope.isLoctest = val;
	}
	
	$scope.swapTest = function() {
		var temp = $scope.otherTestName;
		$scope.otherTestName = $scope.testName;
		$scope.testName = temp;
		$scope.isLoctest = !$scope.isLoctest;
		
		//debugger
		console.log(globalData.metadata.scores[0]);
	}
	
	$scope.setStyleAll = function() {
		for (i = 0; i < Labels.labels.length; i++) {
			$scope.setStyle(i);
		}
	}
	
	$scope.setStyle = function(val) {
		$scope.labelStyle[val] = {
			left: (Labels.labels[val].x * 0.01 * document.getElementById('imagecont2').getBoundingClientRect().width + 'px'),
			top: (Labels.labels[val].y * 0.01 * document.getElementById('imagecont2').getBoundingClientRect().height + 'px')
		};
	}
	
	$ionicPopover.fromTemplateUrl('templates/study-popover.html', {
        scope: $scope
    }).then(function(popover) {
        $scope.popover = popover;
    });
	

    $scope.openPopover = function(event, index) {
        $scope.index = {value:index};
		$scope.curIndex = index;
		$scope.popover.show(event);
    }

    $scope.switchOpenAll = function (isIt)
    {
        $scope.openAll = isIt;
    }
}])
