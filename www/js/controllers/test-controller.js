// CONTROLLER: test-controller
// Controls the test page.
app.controller('test-controller', ['$timeout', '$ionicScrollDelegate', '$scope', 'Photo', 'Labels', function($timeout, $ionicScrollDelegate, $scope, Photo, Labels) {
    $scope.labels = Labels.labels;
    $scope.photoService = Photo;
    $scope.currentButton = 0;
    $scope.finished = false;
    $scope.score = 0;
    $scope.labelStyle = [];
    $scope.answer="";
    $scope.correctORwrong = "";
    $scope.howmanybuttons = 0;
    $scope.randomiser = [];

    $scope.IsItTheRightButton = function (index) {
        $scope.setStyle(index)
        if (index == $scope.currentButton) {
            return true;
        }
        return false;
    };

    $scope.EnterNextAnswer = function ()
    {
        var tempInput = $scope.answer;
        var tempCurrentLabel = $scope.labels[$scope.currentButton].label;

        tempInput = $scope.caseInsensitive(tempInput);
        tempCurrentLabel = $scope.caseInsensitive(tempCurrentLabel);
        
        if ($scope.equivalent(tempInput, tempCurrentLabel)) {
            $scope.score++;
            $scope.correctORwrong = "Correct";
        }
        else {
            $scope.correctORwrong = "Wrong";
        }
        $scope.howmanybuttons++;
        $scope.currentButton = $scope.randomiser[$scope.howmanybuttons];
        if ($scope.howmanybuttons == $scope.labels.length) {
            $scope.finished = true;
        }
    };

    $scope.setStyleAll = function () {
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

    $scope.Shuffle = function ()
    {
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
        if (tempInput.length == tempCurrentLabel.length + 1)
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
