// CONTROLLER: home-controller
// Controls home page.

app.controller('home-controller', ['Labels', 'globalData', 'customFileIO', '$ionicPlatform', '$timeout', '$cordovaFile', '$state', '$scope', '$rootScope', '$ionicPopover', 'Photo', 'Sets', function(Labels, globalData, customFileIO, $ionicPlatform, $timeout, $cordovaFile, $state, $scope, $rootScope, $ionicPopover, Photo, Sets) {
        
    var btn1 = document.getElementById("button1");
    var btn2 = document.getElementById("button2");
    var btn3 = document.getElementById("button3");
    var market = document.getElementById("market-content");
    var sets = document.getElementById("sets-content");
	globalData.modifyName = "";		
	globalData.dirList = [];
	globalData.previewImages = [];
	$scope.customFileIOService = customFileIO;	//direct scope injection of service
	$scope.globalDataService = globalData;		//direct scope injection of service
	
	
	
	
	$rootScope.$on('appIsReady', function() {
		if(globalData.isDevice) {
			globalData.curDir = cordova.file.dataDirectory; //"file:///storage/emulated/0/Android/data/com.ionicframework.coverup924061/files/";
			customFileIO.loadDirList();
		}
	});
	
	/*when appIsReady event is emitted by globalData i.e. app is ready, and assuming app isn't on a browser,
	the current directory variable is assigned the path of the root app data directory, and the sets to be loaded on
	the sets page are loaded initially. */
	
	
	
	
	//~~~~~~~~~~~~~~~~~~~~
    //Home page folder selection control functions (not currently in use, unfinished)
    //~~~~~~~~~~~~~~~~~~~~
	
	$scope.newFolder = function() {
		//popup asking for name
		var newFolderName = globalData.chooseRandomName(); // = whatever is entered
		$cordovaFile.checkDir(globalData.curDir, "dir" + newFolderName)
			.then(function (success) {
				$cordovaFile.createDir(globalData.curDir, "dir" + newFolderName, false)
				//update dir list
			}, function (error) {
				console.log("error, dir already exists");
			});
	}
    
	$scope.selectImageOrFolder = function(index) {
		var ID = globalData.dirList[index];
		if (ID.substring(0, 3) == "img") {
			
		}
		else if (ID.substring(0,3) == "dir") {
			globalData.curDir += ID;
			customFileIO.loadDirList();
		}
	}
	
	$scope.upFolder = function() {
		globalData.curDir = globalData.curDir.substring(0, globalData.curDir.length - 1);
		globalData.curDir = globalData.curDir.substring(0, globalData.curDir.lastIndexOf('/') + 1);
		customFileIO.loadDirList();
	}
	
	
	
	
	
    //~~~~~~~~~~~~~~~~~~~~
    //Home page photo control
    //~~~~~~~~~~~~~~~~~~~~

    $scope.takePhoto = function() {
		globalData.modifyName = null;		//since this is not an instance of a pre-existing set being modified
        globalData.moveOrCopy = true;
		var options = {
			destinationType: navigator.camera.DestinationType.FILE_URI,
			quality: 60,
			correctOrientation: true,
			saveToPhotoAlbum: false
        };
        
        Photo.getPicture(options).then(function (sourcePath) {
			var mainString = sourcePath + "?";
			globalData.sourceDirectory = mainString.substring(0, mainString.lastIndexOf('/') + 1);
			globalData.sourceFileName = mainString.substring(mainString.lastIndexOf('/') + 1, mainString.indexOf('?'));
			Photo.setImage(sourcePath);
			$scope.handleTransition();
			$state.go('modify');		//after taking photo and storing in cache memory, go to modify page
        }, function(err) {
			$state.go('index');			//if a photo isn't taken, return to home page
		});
    };
    
	$scope.takePhotoFromGallery = function() {
		globalData.modifyName = null;
		globalData.moveOrCopy = false;
        var options = {
			destinationType: navigator.camera.DestinationType.FILE_URI,
			quality: 60,
			correctOrientation: true,
			sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY 
        };
        
        Photo.getPicture(options).then(function (sourcePath) {
			var mainString = sourcePath + "?";
			globalData.sourceDirectory = mainString.substring(0, mainString.lastIndexOf('/') + 1); //possibly contentious for ios
			globalData.sourceFileName = mainString.substring(mainString.lastIndexOf('/') + 1, mainString.indexOf('?'));
			Photo.setImage(sourcePath);
			$scope.handleTransition();
			$state.go('modify');
        }, function(err) {
			$state.go('index');
		});
    }
    
    $scope.setToDefaultPhoto = function() {
		globalData.moveOrCopy = false;
		globalData.modifyName = null;
		globalData.sourceDirectory = window.location.href.substring(0, window.location.href.indexOf("index.html")) + "img/";
		globalData.sourceFileName = "default.jpg";
        Photo.setImage("img/default.jpg");
        $scope.handleTransition();
		$state.go('modify');
    }
    
	$scope.handleTransition = function() {
		Labels.labels = [];			//reset loaded labels
		globalData.showImage = false;
		$timeout(function() {
			globalData.showImage = true;
			$timeout(function() {$rootScope.setStyleAll();}, 50)
		}, 800);
	}
	
	
    //~~~~~~~~~~~~~~~~~~~~~
    //Home page button control / layout control! (Mostly button toggling)
    //~~~~~~~~~~~~~~~~~~~~~
    
    enableMarket = function() {
        btn1.classList.add("toggle-home-btn");
        btn2.classList.remove("toggle-home-btn");
        market.style.display = "block";
        sets.style.display = "none";
    }
    
    enableSets = function() {
        btn1.classList.remove("toggle-home-btn");
        btn2.classList.add("toggle-home-btn");
        market.style.display = "none";
        sets.style.display = "block";
    }
    
    toggleCreate = function() {
        btn3.classList.toggle("toggle-home-btn");
    }
    
     btn1.onclick = function() {
        enableMarket();
    }
    
    btn2.onclick = function() {
        enableSets();
    }

    btn3.onclick = function() {
        toggleCreate();
    }    
    
    $(document).on("click", "#home-test-btn", function(e) {
    	this.classList.toggle("toggle_home_test_dropdown");
    	document.getElementById("home-edit-btn").classList.remove("toggle_home_edit_dropdown");
    });
    
    $(document).on("click", "#home-edit-btn", function(e) {
    	this.classList.toggle("toggle_home_edit_dropdown");
    	document.getElementById("home-test-btn").classList.remove("toggle_home_test_dropdown");
    });
    
    enableSets(); //Set tab is open by default
    
    //~~~~~~~~~~~~~~~~~~~~~
    //Home page renaming control
    //~~~~~~~~~~~~~~~~~~~~~
    
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
    
}]);
