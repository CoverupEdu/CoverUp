// SERVICE: globalData
// Use this for global variables (i.e. in place of $rootScope). Variables must be declared here.
app.service('globalData', ['$rootScope', function($rootScope) {
	
	this.emitReady = function() {		
		var app = document.URL.indexOf( 'http://' ) === -1 && document.URL.indexOf( 'https://' ) === -1;
		if ( app ) {
			this.isDevice = true;
		} else {
			this.isDevice = false;
		}  
		$rootScope.$emit('appIsReady');
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
	this.showSets = true;
	this.isDevice;
	this.labelArray = [];
	this.showImage = false;
	this.metadata = new Object();
	this.pageLoadTime = 600;
}])