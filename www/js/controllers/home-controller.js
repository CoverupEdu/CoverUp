// CONTROLLER: home-controller
// Controls home page.

app.controller('home-controller', ['Labels', 'globalData', 'customFileIO', '$ionicPlatform', '$timeout', '$cordovaFile', '$state', '$scope', '$rootScope', 'Photo', 'Sets', function(Labels, globalData, customFileIO, $ionicPlatform, $timeout, $cordovaFile, $state, $scope, $rootScope, Photo, Sets) {
    
    var btn1 = document.getElementById("button1");
    var btn2 = document.getElementById("button2");
    var btn3 = document.getElementById("button3");
    var market = document.getElementById("market-content");
    var sets = document.getElementById("sets-content");
	globalData.modifyName = "";		//name of image being modified (null if new image being created)
	globalData.dirList = [];
	globalData.previewImages = [];
	$scope.previewImages = globalData.previewImages;
	
	$scope.$watch(function() { 
		return globalData.previewImages
		}, function(newValue, oldValue) {
			$scope.previewImages = newValue;
			console.log($scope.previewImages);
		}
	);
	
	$rootScope.$on('appIsReady', function() {		//
		globalData.curDir = cordova.file.dataDirectory; //debug dir: "file:///storage/emulated/0/Android/data/com.ionicframework.coverup924061/files/";
		customFileIO.loadDirList();
	});
	
	//~~~~~~~~~~~~~~~~~~~~
    //Set button interaction
    //~~~~~~~~~~~~~~~~~~~~
	
	$scope.setEdit = function(index, nextState) {
		globalData.modifyName = globalData.dirList[index].substring(3).split('/')[0];
		Photo.setImage(globalData.previewImages[index]);
		var dataPath = 
			globalData.curDir + 
			globalData.dirList[index] + 
			"Data" + 
			globalData.dirList[index].substring(3).split('/')[0] +
			".txt";  
		customFileIO.loadData(globalData.modifyName)
		.then(function() {
			$state.transitionTo(nextState);
		});
	}
	
	//~~~~~~~~~~~~~~~~~~~~
    //Home page folder selection control (not currently in use)
    //~~~~~~~~~~~~~~~~~~~~
	
	$scope.newFolder = function() {
		//popup asking for name
		var newFolderName // = whatever is entered
		$cordovaFile.checkDir(globalData.curDir, "dir" + newFolderName)
			.then(function (success) {
				$cordovaFile.createDir(globalData.curDir, "dir" + newFolderName, false)
				//update dir list
			}, function (error) {
				//error; dir already exists
			});
	}
    
	$scope.selectImageOrFolder = function(identifier) {
		if (identifier.substring(0, 3) == "img") {
			
		}
		else if (identifier.substring(0,3) == "dir") {
			globalData.curDir += identifier + "/";
		}
	}
	
	$scope.upFolder = function() {
		globalData.curDir = globalData.curDir.substring(0, globalData.curDir.length - 1);
		globalData.curDir = globalData.curDir.substring(0, globalData.curDir.lastIndexOf('/') + 1);
	}
	
    //~~~~~~~~~~~~~~~~~~~~
    //Home page photo control
    //~~~~~~~~~~~~~~~~~~~~

    $scope.takePhoto = function() {
		globalData.modifyName = null;
        var options = {
			destinationType: navigator.camera.DestinationType.FILE_URI,
			quality: 60,
			correctOrientation: true,
			saveToPhotoAlbum: false
        };
        
        Photo.getPicture(options).then(function (sourcePath) {
			console.log(sourcePath);
			globalData.sourceDirectory = sourcePath.substring(0, sourcePath.lastIndexOf('/') + 1);
			globalData.targetDirectory = globalData.sourceDirectory.substring(0, globalData.sourceDirectory.length - 6) + "files/";
			globalData.sourceFileName = sourcePath.substring(sourcePath.lastIndexOf('/') + 1, sourcePath.length);
            Photo.setImage(sourcePath);
			Labels.labels = [];
			$state.transitionTo('modify');
        }, function(err) {
			$state.transitionTo('index');
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
			console.log(sourcePath);
			globalData.sourceDirectory = "file://" + sourcePath.substring(0, sourcePath.lastIndexOf('/') + 1); //possibly contentious for ios
			console.log(globalData.sourceDirectory);
			globalData.sourceFileName = sourcePath.substring(sourcePath.lastIndexOf('/') + 1, sourcePath.length);
            console.log(globalData.sourceFileName);
			Photo.setImage(sourcePath);
			Labels.labels = [];
			$state.transitionTo('modify');
        }, function(err) {
			$state.transitionTo('index');
		});
    }
    
    $scope.setToDefaultPhoto = function() {
		globalData.modifyName = null;
        Photo.setImage("img/default.jpg");
        Labels.labels = [];
		$state.transitionTo('modify');
    }
    
    //~~~~~~~~~~~~~~~~~~~~
    //Home page button control / layout control!
    //~~~~~~~~~~~~~~~~~~~~
    
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