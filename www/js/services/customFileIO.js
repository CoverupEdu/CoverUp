// SERVICE: customFileIO
// Contains functions for file input/output.
app.service('customFileIO', ['Photo', '$q', 'Labels', 'globalData', '$interval', '$state', '$timeout', '$rootScope', '$cordovaFile', function(Photo, $q, Labels, globalData, $interval, $state, $timeout, $rootScope, $cordovaFile) {
    var self = this;
	self.loop;
	
	self.changePage = function(index, nextState) {
		globalData.modifyName = globalData.dirList[index].substring(3).split('/')[0];	//e.g. "imgVolcano/" --> "Volcano"
		Photo.setImage(globalData.previewImages[index]);								//set background photo as respective photo
		if(globalData.isDevice) {
			self.loadData(globalData.modifyName)										//load stored labels from json format into Labels.labels
			.then(function() {
				globalData.showImage = false;											//don't show image
				$timeout(function() {
					globalData.showImage = true;										//show image after 800ms (and set style 50ms after that) when data has loaded
					$timeout(function() {$rootScope.setStyleAll();}, 50)
				}, globalData.pageLoadTime);
				$state.go(nextState);													//move to next state
			});
		}
		else {
			Labels.labels = globalData.labelArray[index];
			$state.go(nextState);
		}
	}
	
	self.loadDirList = function() {
		return $q(function(resolve, reject) {
			if(globalData.isDevice) {
				
				globalData.dirList = [];									//initially both arrays are blank
				globalData.previewImages = [];
				var quantity = 0;
				$cordovaFile.readAsText(globalData.curDir, "dir.txt")		//read directory listing from file, return as 'success' and then mainString
				
				.then(function (success) {
					var mainString = success;
					console.log(mainString);
					if(mainString == "")
					{
						resolve("finish");
						return;
					}
					quantity = mainString.split('/').length - 1;			//number of directories in resulting string, e.g. "imgVolcano/imgTectonic/imgCell" --> 3
					for (var i = 1; i < quantity; i++) {					//put each directory into the dirList array, code here...
						globalData.dirList.push(
							mainString.substring(
								0, 
								mainString.indexOf('/') + 1)
							);	
						mainString = mainString.substring(mainString.indexOf('/') + 1);
					}
					globalData.dirList.push(mainString);					//...to here
				}, function(error) {
					console.log(error);
				
				}).then(function() {
					var prefix;
					for (var i = 0; i < globalData.dirList.length; i++) {
						prefix = globalData.dirList[i].substring(0,3);
						if(prefix == "img") {
							globalData.previewImages[i] = 					//store path to each image in previewImages
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
						if(i + 1 == globalData.dirList.length) {resolve("finish");}	//end of function
					}
				});
			}
			
			else {resolve("finish");}
		});
	}
	
	self.loadData = function(name) {
		return $q(function(resolve, reject) {
			$cordovaFile.readAsText(globalData.curDir + "img" + name + "/", "Data" + name + ".txt")		//read labels data file
			.then(function (success) {
				Labels.labels = angular.fromJson(success);												//store in Labels.labels
			}, function (error) {
				Labels.labels = [];	
			}).then(function() {
				return $cordovaFile.readAsText(globalData.curDir + "img" + name + "/", "Meta" + name + ".txt")		//read labels data file
			}).then(function (success) {
				globalData.metadata = angular.fromJson(success);												//store in Labels.labels	
				console.log(success);
			}, function(error) {
				console.log(error);
			}).then(function() {
				resolve("finish");
			});
		});
	}
	
	this.deleteSet = function(modifyName) {
		return $q(function(resolve, reject) {
			if(modifyName != null)
			{
				$cordovaFile.removeFile(globalData.curDir + "img" + modifyName + "/", "Image" + modifyName + ".jpg")
				.then(function() {
					return $cordovaFile.removeFile(globalData.curDir + "img" + modifyName + "/", "Data" + modifyName + ".txt");
				}).then(function() {
					return $cordovaFile.removeFile(globalData.curDir + "img" + modifyName + "/", "Meta" + modifyName + ".txt");
				}).then(function() {
					return $cordovaFile.removeDir(globalData.curDir, "img" + modifyName);
				}).then(function() {
					return $cordovaFile.readAsText(globalData.curDir, "dir.txt")
				}).then(function(success) {
					globalData.dirList = [];
					var mainString = success;		//number of directories in resulting string, e.g. "imgVolcano/imgTectonic/imgCell" --> 3
					var quantity = mainString.split('/').length - 1;	
					for (var i = 1; i < quantity; i++) {					//put each directory into the dirList array
						globalData.dirList.push(mainString.substring(0, mainString.indexOf('/') + 1));	
						mainString = mainString.substring(mainString.indexOf('/') + 1);
					}
					globalData.dirList.push(mainString);
					console.log(globalData.dirList.length);
					return globalData.dirList;
				}).then(function(success) {
					console.log(globalData.dirList.indexOf("img" + modifyName + "/"));
					console.log(globalData.dirList);
					globalData.dirList.splice(globalData.dirList.indexOf("img" + modifyName + "/"), 1);
					var builder = "";
					if(globalData.dirList.length == 0) {return builder;}
					for(var j = 0; j < globalData.dirList.length; j++)
					{
						builder = builder + globalData.dirList[j];
						if(j == globalData.dirList.length - 1) {return builder;}
					}
				}).then(function(success) {
					return self.writeTXT(globalData.curDir, "dir.txt", success);
				}).then(function(success) {
					console.log(globalData.dirList);
					console.log("img" + modifyName + "/");
					resolve("success");
				});
			}
			else {resolve("success");}
		})
	}
	
	this.saveSet = function(sentData, sentName, sentDescription) {
		return $q(function(resolve, reject) {
			
			var dataContent = JSON.stringify(sentData);
			var dirList = "";
			var filename = sentName; 					//name entered while saving goes here
			var nameTXT = "Data" + filename + ".txt";					//name of txt file
			var nameMeta = "Meta" + filename + ".txt";					//name of metadata file
			var nameImage = "Image" + filename + ".jpg";				//name of image file
			var nameDir = globalData.curDir + "img" + filename + "/";	//directory path of files
			
			if(globalData.isDevice) {
			
				$cordovaFile.readAsText(globalData.curDir, "dir.txt")	//reads directory listing previous to saving, stores as dirList (DIFFERENT from dirList array in the load function)
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
							if(globalData.moveOrCopy) {
								$cordovaFile.moveFile(								//move image to nameDir location (when photo is taken; temporary file doesn't need to stay in cache)
									globalData.sourceDirectory, 
									globalData.sourceFileName, 
									nameDir,
									nameImage
								).then(function(success){console.log(success);}
								, function(error) {console.log(error);});
							}
							else {
								globalData.moveOrCopy = true;
								$cordovaFile.copyFile(								//copy image to nameDir location (when image taken from gallery; shouldn't be removed from gallery, only copied)
									globalData.sourceDirectory, 
									globalData.sourceFileName, 
									nameDir,
									nameImage
								).then(function(success){console.log(success);}
								, function(error) {console.log(error);});
							}
						}).then(function() {
							self.writeTXT(nameDir, nameTXT, dataContent);			//write label data file
						}).then(function() {
							var metadata = {
								description: sentDescription,
								scores: null
							};
							metadata.description = sentDescription;
							metadata.scores = [[],[]];
							for(var i = 0; i < sentData.length; i++)
							{
								metadata.scores[0].push(0);
								metadata.scores[1].push(0);
							}
							self.writeTXT(nameDir, nameMeta, JSON.stringify(metadata));						//create new metadata file
						}).then(function() {
							dirList += "img" + filename + "/";						//append new set to previous directory listing string
						}).then(function () {
							$cordovaFile.removeFile(globalData.curDir, "dir.txt");	//delete old directory listing file
						}).then(function () {
							return self.writeTXT(globalData.curDir, "dir.txt", dirList);	//create new directory listing file
						}).then(function() {
							resolve("finish");
						});
					}
					
					else if (globalData.modifyName === filename) {		//if image being edited has the same name as before 
						
						globalData.metadata.description = sentDescription;
						$cordovaFile.removeFile(nameDir, nameTXT)						//delete old label data file
						.then(function () {
							self.writeTXT(nameDir, nameTXT, dataContent);				//write new one
						}).then(function() {
							$cordovaFile.removeFile(nameDir, nameMeta);		//remove old metadata
						}).then(function () {
							var metadata = {
								description: sentDescription,
								scores: null
							};
							metadata.description = sentDescription;
							metadata.scores = [[],[]];
							for(var i = 0; i < sentData.length; i++)
							{
								metadata.scores[0].push(0);
								metadata.scores[1].push(0);
							}
							return self.writeTXT(nameDir, nameMeta, JSON.stringify(metadata));						//create new metadata file
						}).then(function() {
							$cordovaFile.removeFile(globalData.curDir, "dir.txt");		//remove old directory listing
						}).then(function () {
							return self.writeTXT(globalData.curDir, "dir.txt", dirList);	//write new directory listing
						}).then(function() {
							resolve("finish");
						});
					}
										
					else {												//if image being edited is changing name
						
						var pos = dirList.indexOf("img" + globalData.modifyName + "/");						//index of name of old set in old directory listing string
						var temp1 = dirList.substring(0, pos);												//all the bits before it
						var temp2 = dirList.substring(pos + ("img" + globalData.modifyName + "/").length);	//all the bits after it
						
						dirList = temp1 + "img" + filename + "/" + temp2;									//put the new name in the middle and put into new directory listing string
						
						var oldNameDir = globalData.curDir + "img" + globalData.modifyName + "/";
						var oldnameTXT = "Data" + globalData.modifyName + ".txt";
						var oldNameImage = "Image" + globalData.modifyName + ".jpg";
						var oldNameMeta = "Meta" + globalData.modifyName + ".txt";
						
						$cordovaFile.removeFile(								//destroy old label data file in old folder
							oldNameDir, 
							oldnameTXT
						).then(function () {
							$cordovaFile.removeFile(							//destroy old metadata file in old folder
								oldNameDir,
								oldNameMeta
							);
						}).then(function() {
							$cordovaFile.createDir(								//create new folder
								globalData.curDir, 
								"img" + filename, false
							);
						}).then(function () {
							$cordovaFile.moveFile(								//move image to new folder
								oldNameDir, 
								oldNameImage, 
								nameDir,
								nameImage
							);
						}).then(function () {
							self.writeTXT(nameDir, nameTXT, dataContent);		//create new data file in new folder
						}).then(function () {
							var metadata = {
								description: sentDescription,
								scores: null
							};
							metadata.description = sentDescription;
							metadata.scores = [[],[]];
							for(var i = 0; i < sentData.length; i++)
							{
								metadata.scores[0].push(0);
								metadata.scores[1].push(0);
							}
							self.writeTXT(nameDir, nameMeta, JSON.stringify(metadata));		//create new metadata file
						}).then(function () {
							$cordovaFile.removeDir(								//destroy old folder
								globalData.curDir,
								"img" + globalData.modifyName
							);
						}).then(function () {
							$cordovaFile.removeFile(globalData.curDir, "dir.txt");			//destroy old directory listing file
						}).then(function () {
							return self.writeTXT(globalData.curDir, "dir.txt", dirList);	//create new directory listing file
						}).then(function() {
							resolve("finish");
						});
					}
				});
			}
			
			else {
				if(globalData.modifyName == null) {
					globalData.labelArray.push(sentData);
					globalData.previewImages.push(Photo.image);
					globalData.dirList.push("img" + filename + "/");
					resolve("finish");
				}
				else {
					var index = globalData.dirList.indexOf(globalData.modifyName);
					globalData.labelArray[index] = sentData;
					globalData.previewImages[index] = Photo.image;
					globalData.dirList[index] = "img" + filename + "/";
					resolve("finish");
				}
			}
		});
	};
	
	
	this.saveScores = function() {
		return $q(function(resolve, reject) {
			$cordovaFile.removeFile(globalData.curDir + "img" + globalData.modifyName + "/", "Meta" + globalData.modifyName + ".txt")
			.then(function(success) {
				self.writeTXT(globalData.curDir + "img" + globalData.modifyName + "/", "Meta" + globalData.modifyName + ".txt", JSON.stringify(globalData.metadata));
			}).then(function(success) {
				resolve("finish");
			});
		});
	}
	
	
	self.writeTXT = function(fileDir, fileName, content) {		//required since android for some reason doesn't allow direct writing to data directory, only moving files
		return $q(function(resolve, reject) {
			$cordovaFile.writeFile(									//write txt packet of metadata to cache
					cordova.file.cacheDirectory, 
					fileName, 
					content, 
					true
				).then(function () {
					return $cordovaFile.moveFile(					//transfer txt packet from cache to specified location
						cordova.file.cacheDirectory, 
						fileName, 
						fileDir 
					);
				}).then(function() {
					resolve("finish");
				});
		});
	};
}])