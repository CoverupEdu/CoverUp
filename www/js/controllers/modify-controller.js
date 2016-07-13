/*CONTROLLER: modify-controller
Controls the modify page.
Injects: $scope, $rootScope, $ionicPopover, Photo, Labels
Comments refer to content above */
app.controller('modify-controller', ['$cordovaFile', '$ionicLoading', '$location', '$anchorScroll', '$timeout', '$rootScope', '$window', '$ionicScrollDelegate', '$scope', '$ionicPopover', 'Photo', 'Labels', 'Sets', function($cordovaFile, $ionicLoading, $location, $anchorScroll, $timeout, $rootScope, $window, $ionicScrollDelegate, $scope, $ionicPopover, Photo, Labels, Sets) {
    $scope.labels = Labels.labels;		//mirror general labels to local copy
    $scope.photoService = Photo;		
	$rootScope.canEditLabel = false;	//var for whether label can be edited
	$scope.curIndex = 0;				//var determining which label the popover is assigned to			
	$rootScope.curLabel;				//the actual name of the label specified by curIndex			
	$scope.labelStyle = [];				//array of coordinates of each label
	$rootScope.popOpen = false;			//boolean for determining whether popover is shown
	
	$ionicPopover.fromTemplateUrl('templates/modify-popover.html', {
        scope: $scope
    }).then(function(popover) {
        $scope.popover = popover;
	});
    	
	/*
	One popover is generated from the html template specified, and assigned to local scope.
	Only one popover ever exists in the application; what changes is its position and contents according to which label is selected.
	NOTE: fromTemplateUrl is occasionally reported to yield errors on mobile, alternative here:
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
	
	//Set coordinates for each label when called.
	
	$scope.setStyle = function(val) {
		$scope.labelStyle[val] = {
			left: ($scope.labels[val].x * 0.01 * document.getElementById('imagecont').getBoundingClientRect().width + 'px'),
			top: ($scope.labels[val].y * 0.01 * document.getElementById('imagecont').getBoundingClientRect().height + 'px')
		};
	}
	
	//the positions of each label are stored as percentages from top and left-most points of the image. here, they're converted to page coordinates by applying the percentage (x 0.01) to image dimensions.
	
	$scope.deleteLabel = function() {
		$scope.popover.hide();
		Labels.labels.splice($scope.curIndex, 1);
		$scope.setStyleAll();
	}
	
    $scope.swapcanEditLabel = function(boole) {
        if (boole) {$rootScope.canEditLabel = !$rootScope.canEditLabel;}
        else {$rootScope.canEditLabel = false;}
        $scope.labels[$scope.curIndex].label = $rootScope.curLabel;
    }
	
	$rootScope.checkNull = function() {
			if ($scope.labels[$scope.curIndex].label.length == 0) {$scope.deleteLabel();}
	}
	
	//if the label is empty, the label(/button) is deleted.
	
	$scope.eventManage = function($event) {
		$scope.addControl($event); 
		$timeout(function() {
			$scope.clickButton($scope.labels.length - 1);
		}, 0);
		$rootScope.editButton();
	}
	
	//when a point on the image is clicked, a corresponding label is added, the label is clicked i.e. the popover opens, and edit mode is engaged.
	
	$scope.addControl = function(event) {
		$rootScope.insReset();
        $scope.xpos = (event.offsetX) / (0.01 * document.getElementById('imagecont').getBoundingClientRect().width);
        $scope.ypos = (event.offsetY) / (0.01 * document.getElementById('imagecont').getBoundingClientRect().height);
        Labels.addLabel($scope.xpos, $scope.ypos, "");
	}
	
	//calculating the percentage distance in terms of image dimensions from top-left.
	
    $scope.openPopover = function(event, index) {
		$timeout(function() {
			$ionicScrollDelegate.scrollTo(0, $scope.labels[index].y * 0.01 * document.getElementById('imagecont').getBoundingClientRect().height - 50, true)
		},50)
		$rootScope.popOpen = true;
        $scope.index = {value:index};
		$scope.curIndex = index;
		$rootScope.insReset();
		$timeout(function() {
			$scope.popover.show(event);
		}, 400)
		$rootScope.textFocus();
		$rootScope.curLabel = $scope.labels[$scope.curIndex].label;
    }

	//scroll to label, open popover, set current label as clicked label, 'focus' text (i.e. textbox is selected)
	
	$scope.clickButton = function(ind) {
		var el = document.getElementById('labelbutton'+ind.toString());
		$timeout(function() {
			angular.element(el).triggerHandler('click');
		}, 0);
	}
	
	//select appropriate element of the 'modify' html DOM.

	//~~~~~~~~~~~~~~~~~
	//Save Feature
	//~~~~~~~~~~~~~~~~~
	
	$scope.saveSet = function() {
		$cordovaFile.copyFile(
			$rootScope.sourceDirectory, $rootScope.sourceFileName, $rootScope.targetDirectory, $rootScope.sourceFileName //source directory, source file name, target directory, target file name (here same as source)
		).then(function(success) {
			$rootScope.fileName = $rootScope.targetDirectory + $rootScope.sourceFileName;
		})
		Sets.setImage(Photo.image);
		Sets.setLabels($scope.labels);
		$rootScope.initSetList();
	}
}])
