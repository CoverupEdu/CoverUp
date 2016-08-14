// SERVICE: globalData
// Use this for global variables (i.e. in place of $rootScope). Variables must be declared here.
app.service('globalData', ['$rootScope', function($rootScope) {
	
	this.emitReady = function() {		//not strictly related to file io but just here for convenience
		this.curDir = cordova.file.dataDirectory; //debug dir: "file:///storage/emulated/0/Android/data/com.ionicframework.coverup924061/files/";
		customFileIO.loadDirList();
	}
	
	this.canEditLabel;
	this.curLabel;
	this.popOpen;
	this.dirList;
	this.previewImages;
	this.curDir;
	this.modifyName;
	this.sourceDirectory;
	this.sourceFileName;
	this.moveOrCopy;
	
}])