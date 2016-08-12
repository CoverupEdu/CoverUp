// SERVICE: customFileIO
// Contains functions for file input/output.
app.service('customFileIO', ['globalData', '$interval', '$state', '$timeout', '$rootScope', '$cordovaFile', function(globalData, $interval, $state, $timeout, $rootScope, $cordovaFile) {
    var self = this;
	self.loop;
	
	self.loadDirList = function() {
		globalData.dirList = [];
		globalData.previewImages = [];
		var quantity = 0;
		$cordovaFile.readAsText(globalData.curDir, "dir.txt")
		.then(function (success) {
			var mainString = success;
			quantity = mainString.split('/').length - 1;
			for (var i = 1; i < quantity; i++) {
				console.log("ayy");
				globalData.dirList.push(mainString.substring(0, mainString.indexOf('/') + 1));
				mainString = mainString.substring(mainString.indexOf('/') + 1);
			}
			globalData.dirList.push(mainString);
		}, function(error) {
			console.log(error);
		}).then(function() {
			console.log(quantity);
			console.log(globalData.dirList);
			var prefix;
			for (var i = 0; i < globalData.dirList.length; i++) {
				prefix = globalData.dirList[i].substring(0,3);
				if(prefix == "img") {
					globalData.previewImages[i] = 
						globalData.curDir + 
						globalData.dirList[i] + 
						"Image" + 
						globalData.dirList[i].substring(3).split('/')[0] +
						".jpg";
				}
				else if(prefix == "dir") {
					globalData.previewImages[i] = "img/folder.jpg";
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
		var nameDir = globalData.curDir + "img" + filename + "/";	//directory path of files
		
		$cordovaFile.readAsText(globalData.curDir, "dir.txt")
		.then(function (success) {
			dirList += success;
		}, function (error) {
			self.writeTXT(globalData.curDir, "dir.txt", "");
		}).then(function () {
			if (globalData.modifyName == null) {				//if creating a new image
				$cordovaFile.createDir(								//create nameDir location
					globalData.curDir, 
					"img" + filename, 
					false
				).then(function () {
					$cordovaFile.moveFile(								//move image to nameDir location
						globalData.sourceDirectory, 
						globalData.sourceFileName, 
						nameDir,
						nameImage
					);
				}).then(function() {
					self.writeTXT(nameDir, nameTXT, dataContent);
				}).then(function() {
					dirList += "img" + filename + "/";
				}).then(function () {
					$cordovaFile.removeFile(globalData.curDir, "dir.txt");
				}).then(function () {
					self.writeTXT(globalData.curDir, "dir.txt", dirList);
				});
			}
			
			else if (globalData.modifyName === filename) {		//if image being edited has the same name as before 
				
				$cordovaFile.removeFile(nameDir, nameTXT)
				.then(function () {
					self.writeTXT(nameDir, nameTXT, dataContent);
				}).then(function () {
					$cordovaFile.removeFile(globalData.curDir, "dir.txt");
				}).then(function () {
					self.writeTXT(globalData.curDir, "dir.txt", dirList);
				});
			}
					
			else {												//if image being edited is changing name
				
				dirList.splice(dirList.indexOf("img" + globalData.modifyName + "/"), 1);
				dirList += "img" + filename + "/";
				
				var oldNameDir = globalData.curDir + "img" + globalData.modifyName + "/";
				var oldnameTXT = "Data" + globalData.modifyName + ".txt";
				var oldNameImage = "Image" + globalData.modifyName + ".jpg";
				
				$cordovaFile.removeFile(							//destroy old txt packet in old folder
					oldNameDir, 
					oldnameTXT
				).then(function () {
					$cordovaFile.createDir(								//create nameDir location
						globalData.curDir, 
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
						globalData.curDir,
						"img" + globalData.modifyName
					);
				}).then(function () {
					$cordovaFile.removeFile(globalData.curDir, "dir.txt");
				}).then(function () {
					self.writeTXT(globalData.curDir, "dir.txt", dirList);
				});
			}
			
		}).then(function() {
			self.startLoop(filename);
		});
	};
	
	self.startLoop = function(filename) {
		var stay = true;
		self.loop = $interval(function() {
				$cordovaFile.readAsText(globalData.curDir, "dir.txt")
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
				globalData.sourceDirectory, 
				fileName, 
				content, 
				true
			).then(function () {
				$cordovaFile.moveFile(								//transfer txt packet from cache to specified location
					globalData.sourceDirectory, 
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