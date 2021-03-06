/*CONTROLLER: modify-controller
Controls the modify page.
Comments refer to content above */
app.controller('modify-controller', ['globalData', '$state', 'customFileIO', '$cordovaFile', '$anchorScroll', '$timeout', '$rootScope', '$window', '$ionicScrollDelegate', '$scope', '$ionicPopover', 'Photo', 'Labels', 'Sets', function(globalData, $state, customFileIO, $cordovaFile, $anchorScroll, $timeout, $rootScope, $window, $ionicScrollDelegate, $scope, $ionicPopover, Photo, Labels, Sets) {
    $scope.photoService = Photo;		
	globalData.canEditLabel = false;	//var for whether label can be edited
	$scope.curIndex = 0;				//var determining which label the popover is assigned to			
	globalData.curLabel;				//the actual name of the label specified by curIndex			
	$scope.labelStyle = [];				//array of coordinates of each label
	globalData.popOpen = false;			//boolean for determining whether popover is shown
	$scope.LabelsService = Labels;
	$scope.globalDataService = globalData;
	
	$scope.setTitle = "";  //Intermediate vars to store the name and subject of the set while saving
	$scope.setSubject = "";
	
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
	
	
	
	
	$rootScope.setStyleAll = function() {
		for (i = 0; i < Labels.labels.length; i++) {
			$scope.setStyle(i);
		}
	}
	
	//Set coordinates for each label when called.
	
	$scope.setStyle = function(val) {
		$scope.labelStyle[val] = {
			left: (Labels.labels[val].x * 0.01 * document.getElementById('imagecont').getBoundingClientRect().width + 'px'),
			top: (Labels.labels[val].y * 0.01 * document.getElementById('imagecont').getBoundingClientRect().height + 'px')
		};
	}
	
	//the positions of each label are stored as percentages from top and left-most points of the image. here, they're converted to page coordinates by applying the percentage (x 0.01) to image dimensions.
	
	$scope.deleteLabel = function() {
		$scope.popover.hide();
		Labels.labels.splice($scope.curIndex, 1);
		$rootScope.setStyleAll();
	}
	
	$rootScope.checkNull = function() {
		if (Labels.labels[$scope.curIndex].label.length == 0) {$scope.deleteLabel();}
	}
	
	//if the label is empty, the label(/button) is deleted.
	
	$scope.eventManage = function($event) {
		$scope.addControl($event); 
		$timeout(function() {
			$scope.clickButton(Labels.labels.length - 1);
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
			$ionicScrollDelegate.scrollTo(0, Labels.labels[index].y * 0.01 * document.getElementById('imagecont').getBoundingClientRect().height - 50, true)
		},50)
		globalData.popOpen = true;
        $scope.index = {value:index};
		$scope.curIndex = index;
		$rootScope.insReset();
		$timeout(function() {
			$scope.popover.show(event);
		}, 400)
		$rootScope.textFocus();
		globalData.curLabel = Labels.labels[$scope.curIndex].label;
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
	//Saving Popover
	//~~~~~~~~~~~~~~~~~
	
	$ionicPopover.fromTemplateUrl('templates/save-popover.html', {
        scope: $scope
    	}).then(function(popover) {
        	$scope.save_popover = popover;
		});
		
		
	$scope.callSave = function() {
		globalData.showSets = false;			//prevent sets from loading/lagging up app
		$scope.save_popover.remove();      //delete and hide the saving popover
		customFileIO.saveSet(Labels.labels, document.getElementById('save_title').value, document.getElementById('save_subject'))		//save labels of current set
		.then(function() {
			return customFileIO.loadDirList();	//load new range of sets to sets page
		}).then(function() {
			$state.go('index');					
			$timeout(function() {
				globalData.showSets = true;		//after small amount of time (enough for transition), show sets
			}, 400);
		});
	}
	
	$scope.callDelete = function() {
		globalData.showSets = false;			//prevent sets from loading/lagging up app
		customFileIO.deleteSet(globalData.modifyName)
		.then(function(success) {
			return customFileIO.loadDirList();
		}).then(function(success) {
			$state.go('index');					
			$timeout(function() {
				globalData.showSets = true;		//after small amount of time (enough for transition), show sets
			}, 400);
		});
	}
	
}])


	
	
	