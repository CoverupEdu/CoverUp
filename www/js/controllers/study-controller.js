// CONTROLLER: study-controller
// Controls the study page.
// Injects: $scope, $rootScope, $ionicPopover, Photo, Labels
app.controller('study-controller', ['globalData', '$rootScope', '$ionicScrollDelegate', '$scope', '$ionicPopover', 'Photo', 'Labels', function(globalData, $rootScope, $ionicScrollDelegate, $scope, $ionicPopover, Photo, Labels) {
    $scope.labelsService = Labels;
	$scope.photoService = Photo;
	$scope.curIndex = 0;
	$scope.nullString = "";
	globalData.curLabel;
	$scope.labelStyle = [];
	$scope.openAll = false;

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
