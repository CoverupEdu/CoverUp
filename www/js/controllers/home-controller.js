// CONTROLLER: home-controller
// Controls home page.

app.controller('home-controller', ['Labels', 'globalData', 'customFileIO', '$ionicPlatform', '$timeout', '$cordovaFile', '$state', '$scope', '$rootScope', 'Photo', 'Sets', function(Labels, globalData, customFileIO, $ionicPlatform, $timeout, $cordovaFile, $state, $scope, $rootScope, Photo, Sets) {
    
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
			globalData.curDir = cordova.file.dataDirectory; //debug dir: "file:///storage/emulated/0/Android/data/com.ionicframework.coverup924061/files/";
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
        var options = {
			destinationType: navigator.camera.DestinationType.FILE_URI,
			quality: 60,
			correctOrientation: true,
			saveToPhotoAlbum: false
        };
        
        Photo.getPicture(options).then(function (sourcePath) {
			globalData.sourceDirectory = sourcePath.substring(0, sourcePath.lastIndexOf('/') + 1);
			globalData.sourceFileName = sourcePath.substring(sourcePath.lastIndexOf('/') + 1);
			Photo.setImage(sourcePath);
			Labels.labels = [];			//refresh loaded labels
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
			globalData.sourceDirectory = "file://" + sourcePath.substring(0, sourcePath.lastIndexOf('/') + 1); //possibly contentious for ios
			globalData.sourceFileName = sourcePath.substring(sourcePath.lastIndexOf('/') + 1);
			Photo.setImage(sourcePath);
			Labels.labels = [];
			$state.go('modify');
        }, function(err) {
			$state.go('index');
		});
    }
    
    $scope.setToDefaultPhoto = function() {
		globalData.modifyName = null;
        Photo.setImage("img/default.jpg");
        Labels.labels = [];
		$state.go('modify');
    }
    
	
	
	
    //~~~~~~~~~~~~~~~~~~~~~
    //Home page button control / layout control!
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
    
     btn1.onclick = function() {
        enableMarket();
    }
    
    btn2.onclick = function() {
        enableSets();
    }

    $(btn3).hover(
        function() {
            $(this).addClass("toggle-home-btn");
        }, 
        function() {
            $(this).removeClass("toggle-home-btn");
        }
    );
    
    enableSets(); //Set tab is open by default
    
}]);
