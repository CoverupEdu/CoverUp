// CONTROLLER: home-controller
// Controls home page.
// Injects: $scope, $rootScope, Photo, Labels, Sets

app.controller('home-controller', ['$state', '$scope', '$rootScope', 'Photo', 'Labels', 'Sets', function($state, $scope, $rootScope, Photo, Labels, Sets) {
    
    var btn1 = document.getElementById("button1");
    var btn2 = document.getElementById("button2");
    var btn3 = document.getElementById("button3");
    var market = document.getElementById("market-content");
    var sets = document.getElementById("sets-content");
    
    $rootScope.setService = Sets;
        
    //~~~~~~~~~~~~~~~~~~~~
    //Home page photo control
    //~~~~~~~~~~~~~~~~~~~~

    $scope.takePhoto = function() {
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
        }, null);
    };
    $scope.takePhotoFromGallery = function() {
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
        }, null);
    }
    
    $scope.setToDefaultPhoto = function() {
        Photo.setImage("img/default.jpg");
        Labels.labels = [];
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
    
    //~~~~~~~~~~~~~~~~~~~~
    //Home page load feature control
    //~~~~~~~~~~~~~~~~~~~~
    
    $scope.edit_click = function(event, index) {
        Photo.setImage(Sets.image[index]);
        Labels.labels = Sets.set_labels[index];
        $state.go('modify');
    }
}]);