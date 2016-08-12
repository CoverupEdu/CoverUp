// CONTROLLER: home-controller
// Controls home page.
// Injects: $scope, $rootScope, Photo, Sets

app.controller('home-controller', ['customFileIO', '$ionicPlatform', '$timeout', '$cordovaFile', '$state', '$scope', '$rootScope', 'Photo', 'Sets', function(customFileIO, $ionicPlatform, $timeout, $cordovaFile, $state, $scope, $rootScope, Photo, Sets) {
    
    var btn1 = document.getElementById("button1");
    var btn2 = document.getElementById("button2");
    var btn3 = document.getElementById("button3");
    var market = document.getElementById("market-content");
    var sets = document.getElementById("sets-content");
	$scope.dirList = [];
	$scope.previewImages = [];
	$rootScope.modifyName = "";		//name of image being modified (null if new image being created)
	$rootScope.dirList = [];
	$rootScope.previewImages = [];
	$rootScope.saving = false;
	
	$rootScope.$on('appIsReady', function() {
		$rootScope.curDir = cordova.file.dataDirectory; //"file:///storage/emulated/0/Android/data/com.ionicframework.coverup924061/files/";
		customFileIO.loadDirList();
	});
	
	
	//~~~~~~~~~~~~~~~~~~~~
    //Home page set selection control (not currently in use)
    //~~~~~~~~~~~~~~~~~~~~
	
	$scope.newFolder = function() {
		//popup asking for name
		var newFolderName // = whatever is entered
		$cordovaFile.checkDir($rootScope.curDir, "dir" + newFolderName)
			.then(function (success) {
				$cordovaFile.createDir($rootScope.curDir, "dir" + newFolderName, false)
				//update dir list
			}, function (error) {
				//error; dir already exists
			});
	}
    
	$scope.selectImageOrFolder = function(identifier) {
		if (identifier.substring(0, 3) == "img") {
			
		}
		else if (identifier.substring(0,3) == "dir") {
			$rootScope.curDir += identifier + "/";
		}
	}
	
	$scope.upFolder = function() {
		$rootScope.curDir = $rootScope.curDir.substring(0, $rootScope.curDir.length - 1);
		$rootScope.curDir = $rootScope.curDir.substring(0, $rootScope.curDir.lastIndexOf('/') + 1);
	}
	
    //~~~~~~~~~~~~~~~~~~~~
    //Home page photo control
    //~~~~~~~~~~~~~~~~~~~~

    $scope.takePhoto = function() {
		$rootScope.modifyName = null;
        var options = {
			destinationType: navigator.camera.DestinationType.FILE_URI,
			quality: 60,
			correctOrientation: true,
			saveToPhotoAlbum: false
        };
        
        Photo.getPicture(options).then(function (sourcePath) {
			$rootScope.sourceDirectory = sourcePath.substring(0, sourcePath.lastIndexOf('/') + 1);
			$rootScope.targetDirectory = $rootScope.sourceDirectory.substring(0, $rootScope.sourceDirectory.length - 6) + "files/";
			$rootScope.sourceFileName = sourcePath.substring(sourcePath.lastIndexOf('/') + 1, sourcePath.length);
            Photo.setImage(sourcePath);
            $scope.photo = Photo.image;
        }, function(err) {
			$state.transitionTo('index');
		});
    };
    $scope.takePhotoFromGallery = function() {
		$rootScope.modifyName = null;
        var options = {
			destinationType: navigator.camera.DestinationType.FILE_URI,
			quality: 75,
			correctOrientation: true,
			sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY 
        };
        
        Photo.getPicture(options).then(function (sourcePath) {
			$rootScope.sourceDirectory = sourcePath.substring(0, sourcePath.lastIndexOf('/') + 1);
			$rootScope.targetDirectory = $rootScope.sourceDirectory.substring(0, $rootScope.sourceDirectory.length - 6) + "files/";
			$rootScope.sourceFileName = sourcePath.substring(sourcePath.lastIndexOf('/') + 1, sourcePath.length);
            Photo.setImage(sourcePath);
            $scope.photo = Photo.image;
        }, function(err) {
			$state.transitionTo('index');
		});
    }
    
    $scope.setToDefaultPhoto = function() {
		$rootScope.modifyName = null;
        Photo.setImage("img/default.jpg");
        $state.go('modify');
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