// CONTROLLER: loctest-controller
// Controls the loctest page.
app.controller('loctest-controller', ['$timeout', '$ionicScrollDelegate', '$scope', 'Photo', 'Labels', function($timeout, $ionicScrollDelegate, $scope, Photo, Labels) {
    $scope.labels = Labels.labels;
	$scope.testIndex = [];
    $scope.photoService = Photo;
	$scope.curIndex1 = 0;
	$scope.curIndex2 = 0;
	$scope.labelStyle = [];
	$scope.answerResult;
	$scope.showResult = false;
	$scope.crossLoc;
	$scope.showCross = false;
	$scope.showButtons = true;
	$scope.answer_toggled = false;
	
	var toggle_answer_btn = document.getElementById("loctestShowAnswerButton");

	$timeout(function() {
		for (var i = 0; i < $scope.labels.length; i++) {
			$scope.testIndex.push(i);
		}
	}, 0)
	
	$scope.toggleButtons = function() {$scope.showButtons = !$scope.showButtons;}
	
	$scope.selectLabel = function() {
		if ($scope.testIndex.length == 0) {
			console.log("unfinished");
		} 
		else {
			$scope.curIndex1 = Math.floor($scope.testIndex.length * Math.random());
			$scope.curIndex2 = $scope.testIndex[$scope.curIndex1];
		}
		if ($scope.answer_toggled == true) { /*This toggles back the styling of the show answer button after the timeout reset once you've clicked it.*/
			toggle_answer_btn.classList.toggle("toggle_show_btn");
			$scope.answer_toggled == false;
		}
	}
	
	/*Sorry this function has ended up so expanded - It was getting headachy to read it*/
	$scope.clickManage = function(event, num, button) {
		if ($scope.showResult) {
			$scope.showResult = false;
			$scope.showTick = false;
			$scope.showCross = false;
			$scope.testIndex.splice($scope.curIndex1, 1);
			$scope.selectLabel();
		} 
		else if ($scope.showButtons && !button) {}
		else {
			$scope.showResult = true;
			
			if (!button) {
				var x = Math.pow((event.offsetX - ($scope.labels[$scope.curIndex2].x * 0.01 * document.getElementById('imagecont2').getBoundingClientRect().width)), 2) +
						Math.pow((event.offsetY - ($scope.labels[$scope.curIndex2].y * 0.01 * document.getElementById('imagecont2').getBoundingClientRect().height)), 2);
				if (x <= 6400) {
					$scope.answerResult = true;
				} 
				else {
					$scope.answerResult = false;
				}
				
				$scope.crossLoc = {
					left: (event.offsetX  + 'px'),
					top: (event.offsetY + 'px')
				};
			}
			
			else {
				
				if ($scope.curIndex2 == num) {
					$scope.answerResult = true;
				}
				else {
					$scope.answerResult = false;
				}
				
				$scope.crossLoc = {
						left: ($scope.labelStyle[num].left),
						top: ($scope.labelStyle[num].top)
				};
			}
			
			$scope.showTick = true;
			if ($scope.answerResult == false) {
				$scope.showCross = true;
			}
			else {
				$scope.showCross = false;
			}
		}
	}
	
	$timeout(function() {
		$scope.selectLabel();
		$scope.setStyleAll();
	})
	
	$scope.setStyleAll = function() {
		for (i = 0; i < $scope.labels.length; i++) {
			$scope.setStyle(i);
		}
	}
	
	$scope.setStyle = function(val) {
		$scope.labelStyle[val] = {
			left: ($scope.labels[val].x * 0.01 * document.getElementById('imagecont2').getBoundingClientRect().width + 'px'),
			top: ($scope.labels[val].y * 0.01 * document.getElementById('imagecont2').getBoundingClientRect().height + 'px')
		};
	}
	
	/*Function simulates a click on the correct label and also toggles the styling of the button.*/
	toggle_answer_btn.onclick = function() {
		toggle_answer_btn.classList.toggle("toggle_show_btn");
		$scope.answer_toggled = true;
		$timeout(function() {
			angular.element(document.getElementById('locbutton'+$scope.curIndex2.toString())).triggerHandler('click');
		}, 0);
	}
}])