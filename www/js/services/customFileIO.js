// SERVICE: customFileIO
// Contains functions for file input/output.
app.service('customFileIO', ['$interval', '$state', '$timeout', '$rootScope', '$cordovaFile', function($interval, $state, $timeout, $rootScope, $cordovaFile) {
    var self = this;
	self.loop;
	
	this.emitReady = function() {		//not strictly related to file io but just here for convenience
		$rootScope.$emit('appIsReady');
	}
	
	self.loadDirList = function() {
		$rootScope.dirList = [];
		$rootScope.previewImages = [];
		var quantity = 0;
		$cordovaFile.readAsText($rootScope.curDir, "dir.txt")
		.then(function (success) {
			var mainString = success;
			quantity = mainString.split('/').length - 1;
			for (var i = 1; i < quantity; i++) {
				console.log("ayy");
				$rootScope.dirList.push(mainString.substring(0, mainString.indexOf('/') + 1));
				mainString = mainString.substring(mainString.indexOf('/') + 1);
			}
			$rootScope.dirList.push(mainString);
		}, function(error) {
			console.log(error);
		}).then(function() {
			console.log(quantity);
			console.log($rootScope.dirList);
			var prefix;
			$rootScope.stuff = ""
			for (var i = 0; i < $rootScope.dirList.length; i++) {
				prefix = $rootScope.dirList[i].substring(0,3);
				if(prefix == "img") {
					$rootScope.previewImages[i] = 
						$rootScope.curDir + 
						$rootScope.dirList[i] + 
						"Image" + 
						$rootScope.dirList[i].substring(3).split('/')[0] +
						".jpg";
					$rootScope.stuff +=( " <div class = 'setPhoto'><img src = '" + $rootScope.previewImages[i] + "'><a>Edit</a><a>Learn</a><a>Test</a></div>" );
				}
				else if(prefix == "dir") {
					$rootScope.previewImages[i] = "img/folder.jpg";
					$rootScope.stuff +=( " <div class = 'setPhoto'><img src = '" + $rootScope.previewImages[i] + "'><a>Options</a><a>Open</a><a>Delete</a></div>" );
				}
				else {console.log(prefix)};
			}
		});
	}
	
	this.saveSet = function(dataContent) {
		
		var dirList = "";
		var filename = self.chooseRandomName(); 					//name entered while saving goes here
		var nameTXT = "Data" + filename + ".txt";					//name of txt file
		var nameImage = "Image" + filename + ".jpg";				//name of image file
		var nameDir = $rootScope.curDir + "img" + filename + "/";	//directory path of files
		
		$cordovaFile.readAsText($rootScope.curDir, "dir.txt")
		.then(function (success) {
			dirList += success;
		}, function (error) {
			self.writeTXT($rootScope.curDir, "dir.txt", "");
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
					self.writeTXT(nameDir, nameTXT, dataContent);
				}).then(function() {
					dirList += "img" + filename + "/";
				}).then(function () {
					$cordovaFile.removeFile($rootScope.curDir, "dir.txt");
				}).then(function () {
					self.writeTXT($rootScope.curDir, "dir.txt", dirList);
				});
			}
			
			else if ($rootScope.modifyName === filename) {		//if image being edited has the same name as before 
				
				$cordovaFile.removeFile(nameDir, nameTXT)
				.then(function () {
					self.writeTXT(nameDir, nameTXT, dataContent);
				}).then(function () {
					$cordovaFile.removeFile($rootScope.curDir, "dir.txt");
				}).then(function () {
					self.writeTXT($rootScope.curDir, "dir.txt", dirList);
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
					self.writeTXT(nameDir, nameTXT, dataContent);				//write new txt packet
				}).then(function () {
					$cordovaFile.removeDir(								//destroy old folder
						$rootScope.curDir,
						"img" + $rootScope.modifyName
					);
				}).then(function () {
					$cordovaFile.removeFile($rootScope.curDir, "dir.txt");
				}).then(function () {
					self.writeTXT($rootScope.curDir, "dir.txt", dirList);
				});
			}
			
		}).then(function() {
			self.startLoop(filename);
		});
	};
	
	self.startLoop = function(filename) {
		var stay = true;
		self.loop = $interval(function() {
				$cordovaFile.readAsText($rootScope.curDir, "dir.txt")
				.then(function (success) {
					console.log(success);
					console.log(success.substring(success.length - ("img" + filename + "/").length));
					if(success.substring(success.length - ("img" + filename + "/").length) == "img" + filename + "/" && stay == true) {
						$rootScope.$emit('breakInterval');
						stay = false;	
					}
					else if(stay == false) {console.log("bullet dodge");}
				}, function (error) {
					console.log(error);
				});
			}, 100);
	}
	
	$rootScope.$on('breakInterval', function() {
		console.log("load");
		$timeout(function() {self.loadDirList(); })
		.then(function() { $state.transitionTo('index'); })
		.then(function() { $interval.cancel(self.loop); });	
	});
	
	self.writeTXT = function(fileDir, fileName, content) {
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
		return;
	};
	
	self.chooseRandomName = function() {
		var alpha = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
		var name = "";
		for (var i = 0; i < 5; i++) {
			name += alpha.charAt(Math.floor(Math.random() * alpha.length));
		}
		return name;
	};
}])