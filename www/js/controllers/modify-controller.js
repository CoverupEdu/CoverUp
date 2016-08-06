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
	
	//Set coordinates for each label	when called.
	
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
		
		var dirList = "";
		var filename = $scope.chooseRandomName(); 					//name entered while saving goes here
		var nameTXT = "Data" + filename + ".txt";					//name of txt file
		var nameImage = "Image" + filename + ".jpg";				//name of image file
		var nameDir = $rootScope.curDir + "img" + filename + "/";	//directory path of files
		
		$cordovaFile.readAsText($rootScope.curDir, "dir.txt")
		.then(function (success) {
				dirList += success;
		}, function (error) {
			$scope.writeTXT($rootScope.curDir, "dir.txt", "");
		}).then(function () {
			if ($rootScope.modifyName == null) {				//if creating a new image
				$cordovaFile.createDir(								//create nameDir location
					$rootScope.curDir, 
					"img" + filename, 
					false
				).then(function () {
					$cordovaFile.moveFile(								//move image to nameDir location
					$rootScope.sourceDirectory, 
					$rootScope.sourceFileName, 
					nameDir,
					nameImage
					);
				}).then(function() {
					$scope.writeTXT(nameDir, nameTXT, JSON.stringify(Labels.labels));
				}).then(function() {
					dirList += "img" + filename + "/";
				}).then(function () {
					$cordovaFile.removeFile($rootScope.curDir, "dir.txt");
				}).then(function () {
					$scope.writeTXT($rootScope.curDir, "dir.txt", dirList);
				});
			}
			
			else if ($rootScope.modifyName === filename) {		//if image being edited has the same name as before 
				
				$cordovaFile.removeFile(nameDir, nameTXT)
				.then(function () {
					$scope.writeTXT(nameDir, nameTXT, JSON.stringify(Labels.labels));
				}).then(function () {
					$cordovaFile.removeFile($rootScope.curDir, "dir.txt");
				}).then(function () {
					$scope.writeTXT($rootScope.curDir, "dir.txt", dirList);
				});
			}
					
			else {												//if image being edited is changing name
				
				dirList.splice(dirList.indexOf("img" + $rootScope.modifyName + "/"), 1);
				dirList += "img" + filename + "/";
				
				var oldNameDir = $rootScope.curDir + "img" + $rootScope.modifyName + "/";
				var oldnameTXT = "Data" + $rootScope.modifyName + ".txt";
				var oldNameImage = "Image" + $rootScope.modifyName + ".jpg";
				
				$cordovaFile.removeFile(							//destroy old txt packet in old folder
					oldNameDir, 
					oldnameTXT
				).then(function () {
					$cordovaFile.createDir(								//create nameDir location
						$rootScope.curDir, 
						"img" + filename, false
					);
				}).then(function () {
					$cordovaFile.moveFile(								//move image to nameDir location
						oldNameDir, 
						oldNameImage, 
						nameDir,
						nameImage
					);
				}).then(function () {
					$scope.writeTXT(nameDir, nameTXT, JSON.stringify(Labels.labels));				//write new txt packet
				}).then(function () {
					$cordovaFile.removeDir(								//destroy old folder
						$rootScope.curDir,
						"img" + $rootScope.modifyName
					);
				}).then(function () {
					$cordovaFile.removeFile($rootScope.curDir, "dir.txt");
				}).then(function () {
					$scope.writeTXT($rootScope.curDir, "dir.txt", dirList);
				});
			}
			
		});
		
		Sets.image.push(Photo.image);
		$rootScope.initSetList();
	}
	
	$scope.writeTXT = function(fileDir, fileName, content) {
		$cordovaFile.writeFile(									//write txt packet of metadata to cache
				$rootScope.sourceDirectory, 
				fileName, 
				content, 
				true
			).then(function () {
				$cordovaFile.moveFile(								//transfer txt packet from cache to specified location
					$rootScope.sourceDirectory, 
					fileName, 
					fileDir 
				);
			});
	}
	
	$scope.chooseRandomName = function() {
		var alpha = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
		var name = "";
		for (var i = 0; i < 5; i++) {
			name += alpha.charAt(Math.floor(Math.random() * alpha.length));
		}
		return name;
	}
}])
