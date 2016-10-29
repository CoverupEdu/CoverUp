// CONTROLLER: loctest-controller
// Controls the loctest page.
app.controller('loctest-controller', ['$rootScope', '$ionicPlatform', 'Test', '$state', 'customFileIO', '$ionicPopover', 'globalData', '$timeout', '$ionicScrollDelegate', '$scope', 'Photo', 'Labels', function($rootScope, $ionicPlatform, Test, $state, customFileIO, $ionicPopover, globalData, $timeout, $ionicScrollDelegate, $scope, Photo, Labels) {
    $scope.labelsService = Labels;
	$scope.photoService = Photo;
	$scope.globalDataService = globalData;
	$scope.testService = Test;
	$scope.testIndex = [];
	$scope.curIndex1 = 0;
	$scope.curIndex2 = 0;
	$scope.labelStyle = [];
	$scope.answerResult;
	$scope.showResult = false;
	$scope.crossLoc;
	$scope.showCross = false;
	$scope.showButtons = true;
	$scope.answer_toggled = false;
	$scope.showAnsText = "Show Answer";
	Test.testCorrect = [];
	Test.testIncorrect = [];
	Test.onFind = true;
	
	
	$ionicPopover.fromTemplateUrl('templates/test-popover.html', {
        scope: $scope,
		animation: 'slide-in-up'
    	}).then(function(popover) {
        	Test.test_popover = popover;
		});
	
	$ionicPlatform.registerBackButtonAction(function (event) {
		if(Test.onResults){
			Test.callReturn(0);
		}
		else {
			navigator.app.backHistory();
		}
	}, 1000);
	
	$scope.toggleButtons = function() {$scope.showButtons = !$scope.showButtons;}	//needed because invoked in DOM through angular
	
	var toggle_answer_btn = document.getElementById("loctestShowAnswerButton");	//define variable as HTML DOM element for Show Answer button

	$timeout(function() {
		for (var i = 0; i < Labels.labels.length; i++) {		//create array of indexes of original labels (starts as 0, 1, 2, 3... n)
			$scope.testIndex.push(i);
		}
	}, 0)
	
	$scope.selectLabel = function() {		//choose new label to be tested for 
		if ($scope.testIndex.length == 0) {
			Test.onResults = true;
			Test.test_popover.show();
		} 
		else {
			$scope.curIndex1 = Math.floor($scope.testIndex.length * Math.random());		//explanation for these two lines at the bottom of the page
			$scope.curIndex2 = $scope.testIndex[$scope.curIndex1];
		}
		if ($scope.answer_toggled == true) { /*This toggles back the styling of the show answer button after the timeout reset once you've clicked it.*/
			toggle_answer_btn.classList.toggle("toggle_show_btn");
			$scope.answer_toggled == false;
		}
	}
	
	/*Sorry this function has ended up so expanded - It was getting headachy to read it*/
	$scope.clickManage = function(event, num, button, user) {	//passed vars are: click event details, index of button in DOM clicked, whether buttons are displayed, and whether the user is clicking or if the show answer button was clicked
		if ($scope.showResult) {							//if currently showing result phase
			$scope.showAnsText = "Show Answer"
			$scope.showResult = false;
			$scope.showTick = false;
			$scope.showCross = false;
			$scope.testIndex.splice($scope.curIndex1, 1);
			$scope.selectLabel();
		} 
		else if ($scope.showButtons && !button) {}			//illegitimate click (not clicking on button while buttons are displayed)
		else {												//if something is legally clicked while in test phase
			$scope.showAnsText = "Proceed";
			$scope.showResult = true;
			if (user)										//if the user clicked (not applied if show answer clicked because assumed that answer is correct)
			{
				if (!button) {
					var x = Math.pow((event.offsetX - (Labels.labels[$scope.curIndex2].x * 0.01 * document.getElementById('imagecont2').getBoundingClientRect().width)), 2) +
							Math.pow((event.offsetY - (Labels.labels[$scope.curIndex2].y * 0.01 * document.getElementById('imagecont2').getBoundingClientRect().height)), 2);
					if (x <= 6400) {						//pythagorean implementation of whether clicked point lies within 80 pixels of correct label position (80 squared = 6400)
						$scope.answerResult = true;
						Test.testCorrect.push($scope.curIndex2);
						console.log(Test.testCorrect);
					} 
					else {
						$scope.answerResult = false;
						Test.testIncorrect.push($scope.curIndex2);
						console.log(Test.testIncorrect);
					}
					
					$scope.crossLoc = {	
						left: (event.offsetX  + 'px'),
						top: (event.offsetY + 'px')
					};
				}
				
				else {
					if ($scope.curIndex2 == num) {			//if index of button clicked was correct label
						$scope.answerResult = true;
						Test.testCorrect.push($scope.curIndex2);
						console.log(Test.testCorrect);
					}
					else {
						$scope.answerResult = false;
						Test.testIncorrect.push($scope.curIndex2);
						console.log(Test.testIncorrect);
					}
					
					$scope.crossLoc = {
							left: ($scope.labelStyle[num].left),
							top: ($scope.labelStyle[num].top)
					};
				}
			}
			else {											//if 'show answer' clicked, asume answer correct
				$scope.showTick = true;
				$scope.answerResult = true;
				Test.testIncorrect.push($scope.curIndex2);
				console.log(Test.testIncorrect);
			}
			$scope.showTick = true;							//if the answer was right, don't bother showing the cross
			if ($scope.answerResult == false) {
				$scope.showCross = true;
			}
			else {
				$scope.showCross = false;
			}
		}
	}
	
	$timeout(function() {			//initialise style
		$scope.selectLabel();
		$rootScope.setStyleAll();
	})
	
	$rootScope.setStyleAll = function() {
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
	
	$scope.callLocalReturn = function() {
		Test.callReturn(0);
	}
	
	/*Function simulates a click on the correct label and also toggles the styling of the button.*/
	toggle_answer_btn.onclick = function() {
		toggle_answer_btn.classList.toggle("toggle_show_btn");
		$scope.answer_toggled = true;
		$timeout(function() {
			$scope.clickManage(null, 0, true, false);		//make a click on an undefined point on the DOM with the assumption that it's a correct click (from the false boolean)
		}, 0);
	}
}])

/*
Consider an ordered hand of cards, each with a number written on it.
The first hand received is 1, 2, 3, 4, 5. The first card is 1, the second is 2 etc. Here the values are self-referential in terms of ordinal position
Assume we don't need the second card anymore (second button is clicked in DOM and no longer tested for).
It is removed from the pack, leaving 1, 3, 4, 5. The first card is 1, the second card is 3, the third is 4, the fourth is 5. They are no longer self-referential in terms of ordinal position.
The 'testIndex' allows an array of indices referring to the Labels array (containing labels for a set) to be referred to (e.g. 0, 2, 4, 5) and manipulated without affecting the original Labels array.
*/