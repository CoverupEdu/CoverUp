// SERVICE: customFileIO
// Contains functions for file input/output.
app.service('customFileIO', ['$q', 'Labels', 'globalData', '$interval', '$state', '$timeout', '$rootScope', '$cordovaFile', function($q, Labels, globalData, $interval, $state, $timeout, $rootScope, $cordovaFile) {
    var self = this;
	self.loop;
	
	self.loadDirList = function() {
		return $q(function(resolve, reject) {
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
					if(i + 1 == globalData.dirList.length) {resolve("finish");}
				}
			});
		});
	}
	
	self.loadData = function(name) {
		return $q(function(resolve, reject) {
			$cordovaFile.readAsText(globalData.curDir + "img" + name + "/", "Data" + name + ".txt")
			.then(function (success) {
				Labels.labels = angular.fromJson(success);
			}, function (error) {
				Labels.labels = [];
			}).then(function() {
				resolve("finish");
			});
		});
	}
	
	this.saveSet = function(dataContent) {
		return $q(function(resolve, reject) {
		
		var dirList = "";
		var filename = self.chooseRandomName(); 					//name entered while saving goes here
		var nameTXT = "Data" + filename + ".txt";					//name of txt file
		var nameImage = "Image" + filename + ".jpg";				//name of image file
		var nameDir = globalData.curDir + "img" + filename + "/";	//directory path of files
		
		$cordovaFile.readAsText(globalData.curDir, "dir.txt")
		.then(function (success) {
			dirList += success;
		}, function (error) {
			console.log(error);
		}).then(function () {
			if (globalData.modifyName == null) {				//if creating a new image
				$cordovaFile.createDir(								//create nameDir location
					globalData.curDir, 
					"img" + filename, 
					false
				).then(function () {
					console.log("createdir");
					if(globalData.moveOrCopy) {
						$cordovaFile.moveFile(								//move image to nameDir location
							globalData.sourceDirectory, 
							globalData.sourceFileName, 
							nameDir,
							nameImage
						).then(function(success){console.log(success);}
						, function(error) {console.log(error);});
					}
					else {
						console.log("special");
						globalData.moveOrCopy = true;
						$cordovaFile.copyFile(								//move image to nameDir location
							globalData.sourceDirectory, 
							globalData.sourceFileName, 
							nameDir,
							nameImage
						).then(function(success){console.log(success);}
						, function(error) {console.log(error);});
					}
				}).then(function() {
					console.log("writedata");
					self.writeTXT(nameDir, nameTXT, dataContent);
				}).then(function() {
					console.log("createdirlist");
					dirList += "img" + filename + "/";
				}).then(function () {
					console.log("deleteoldtxtfile");
					$cordovaFile.removeFile(globalData.curDir, "dir.txt");
				}).then(function () {
					console.log("createnewdirtxtfile");
					return self.writeTXT(globalData.curDir, "dir.txt", dirList);
				}).then(function() {
					console.log("finish");
					resolve("finish");
				});
			}
			
			else if (globalData.modifyName === filename) {		//if image being edited has the same name as before 
				
				$cordovaFile.removeFile(nameDir, nameTXT)
				.then(function () {
					self.writeTXT(nameDir, nameTXT, dataContent);
				}).then(function() {
					$cordovaFile.removeFile(globalData.curDir, "dir.txt");
				}).then(function () {
					return self.writeTXT(globalData.curDir, "dir.txt", dirList);
				}).then(function() {
					resolve("finish");
				});
			}
					
					
			else {												//if image being edited is changing name
				
				var pos = dirList.indexOf("img" + globalData.modifyName + "/");
				var temp1 = dirList.substring(0, pos);
				var temp2 = dirList.substring(pos + ("img" + globalData.modifyName + "/").length);
				
				dirList = temp1 + "img" + filename + "/" + temp2;
				
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
					return self.writeTXT(globalData.curDir, "dir.txt", dirList);
				}).then(function() {
					resolve("finish");
				});
			}
		});
		});
	};
	
	self.writeTXT = function(fileDir, fileName, content) {
		return $q(function(resolve, reject) {
			$cordovaFile.writeFile(									//write txt packet of metadata to cache
					cordova.file.cacheDirectory, 
					fileName, 
					content, 
					true
				).then(function () {
					return $cordovaFile.moveFile(								//transfer txt packet from cache to specified location
						cordova.file.cacheDirectory, 
						fileName, 
						fileDir 
					);
				}).then(function() {
					resolve("finish");
				});
		});
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