// SERVICE: customFileIO
// Contains functions for file input/output.
app.service('customFileIO', ['$rootScope', '$cordovaFile', function($rootScope, $cordovaFile) {
    var self = this;
	
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
			
		});

	};
	
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