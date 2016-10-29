// CONTROLLER: test-controller
// Controls the test page.
app.controller('test-controller', ['globalData', '$rootScope', '$ionicPlatform', '$ionicPopover', 'Test', '$timeout', '$ionicScrollDelegate', '$scope', 'Photo', 'Labels', function(globalData, $rootScope, $ionicPlatform, $ionicPopover, Test, $timeout, $ionicScrollDelegate, $scope, Photo, Labels) {
    $scope.globalDataService = globalData;
	$scope.labels = Labels.labels;
	$scope.labelsService = Labels;
    $scope.photoService = Photo;
	$scope.testService = Test;
    $scope.currentButton = 0;
    $scope.finished = false;
    $scope.score = 0;
    $scope.labelStyle = [];
    $scope.answer="";
    $scope.correctORwrong = "";
    $scope.howmanybuttons = 0;
    $scope.randomiser = [];
	$scope.answer_toggled = false;
	$scope.showAnsText = "Show Answer";
	Test.testCorrect = [];
	Test.testIncorrect = [];
	Test.onFind = false;
	

	var toggle_answer_btn = document.getElementById("loctestShowAnswerButton");	//define variable as HTML DOM element for Show Answer button
	
	$ionicPopover.fromTemplateUrl('templates/test-popover.html', {
        scope: $scope,
		animation: 'slide-in-up'
    	}).then(function(popover) {
        	Test.test_popover = popover;
		});
	
	$ionicPlatform.registerBackButtonAction(function (event) {
		if(Test.onResults){
			Test.callReturn(1);
		}
		else {
			navigator.app.backHistory();
		}
	}, 1000);
	
    $scope.IsItTheRightButton = function (index) {
        $scope.setStyle(index)
        if (index == $scope.currentButton) {
            return true;
        }
        return false;
    };

    $scope.EnterNextAnswer = function (override) {
        var tempInput = $scope.answer;
        var tempCurrentLabel = $scope.labels[$scope.currentButton].label;

        tempInput = $scope.caseInsensitive(tempInput);
        tempCurrentLabel = $scope.caseInsensitive(tempCurrentLabel);
        
        if ($scope.equivalent(tempInput, tempCurrentLabel)) {
			$scope.score++;
            $scope.correctORwrong = "Correct";
			Test.testCorrect.push($scope.currentButton);
        }
		else if(override) {
			$scope.score++;
			$scope.correctORwrong = "Correct";
			Test.testIncorrect.push($scope.currentButton);
		}
        else {
            $scope.correctORwrong = "Wrong";
			Test.testIncorrect.push($scope.currentButton);
        }
        $scope.howmanybuttons++;
        $scope.currentButton = $scope.randomiser[$scope.howmanybuttons];
        if ($scope.howmanybuttons == $scope.labels.length) {
            Test.onResults = true;
			Test.test_popover.show();	//SHOW FINAL POPUP
        }
		console.log(Test.testCorrect);
		console.log(Test.testIncorrect);
    };

	$scope.callLocalReturn = function() {
		Test.callReturn(1);
	}
	
    $rootScope.setStyleAll = function () {
        for (i = 0; i < $scope.labels.length; i++) {
            $scope.setStyle(i);
        }
        $scope.randomiser = new Array($scope.labels.length);
        $scope.Shuffle();
    };

    $scope.setStyle = function (val) {
        $scope.labelStyle[val] = {
            left: ($scope.labels[val].x * 0.01 * document.getElementById('imagecont2').getBoundingClientRect().width + 'px'),
            top: ($scope.labels[val].y * 0.01 * document.getElementById('imagecont2').getBoundingClientRect().height + 'px')
        };
    };

    $scope.caseInsensitive = function (inString) {
        var chars = inString.split("");
        for (i = 0; i < inString.length; i++) {
            var temp = chars[i].charCodeAt();
            if (temp < 91 && temp > 64) {
                chars[i] = String.fromCharCode(32 + temp);
            }
        }
        inString = chars.join("");
        return inString;
    };

    $scope.Shuffle = function () {
        var temp = new Array($scope.labels.length);
        for (i = 0; i < $scope.labels.length; i++)
        {
            temp[i] = i;
        }
        for (j = 0; j < $scope.labels.length; j++)
        {
            var chosenIndex = Math.floor((Math.random() * temp.length));
            $scope.randomiser[j] = temp[chosenIndex];
            temp.splice(chosenIndex, 1);
        }
        $scope.currentButton = $scope.randomiser[0];
    }

    $scope.equivalent = function (Input, CurrentLabel) {
        if (Input == CurrentLabel)
        {
            return true;
        }
        tempInput = Input.split("");
        tempCurrentLabel = CurrentLabel.split("");
        if (tempInput.length == tempCurrentLabel.length)
        {
            for (i = 0; i < tempInput.length; i++)
            {
                if (tempInput[i] != tempCurrentLabel[i])
                {
                    tempInput[i] = tempCurrentLabel[i]
                    if (tempInput == tempCurrentLabel) {
                        return true;
                    }
                    else
                    {
                        return false;
                    }
                }
            }
        }
        if (tempInput.length == tempCurrentLabel.length + 1 && tempInput.length != 0)
        {
            for (i = 0; i < tempInput.length; i++)
            {
                if (tempInput[i] != tempCurrentLabel[i])
                {
                    tempInput.splice(i,1)
                    if (tempInput == tempCurrentLabel)
                    {
                        return true;
                    }
                    else
                    {
                        return false;
                    }
                }
            }
            return true;
        }
        if (tempInput.length + 1 == tempCurrentLabel.length)
        {
            for (i = 0; i < tempInput.length; i++)
            {
                if (tempInput[i] != tempCurrentLabel[i])
                {
                    tempCurrentLabel.splice(i, 1)
                    if (tempInput == tempCurrentLabel)
                    {
                        return true;
                    }
                    else
                    {
                        return false;
                    }
                }
            }
            return true;
        }
        return false;
    };

}])
