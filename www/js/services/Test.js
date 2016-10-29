// SERVICE: Test
// Contains functions employed by both test routines.
app.service('Test', ['$state', 'globalData', 'customFileIO', function($state, globalData, customFileIO) {
	
	var self = this;
	this.test_popover;
	
	this.onResults = false;
	this.onFind;
	
	this.testCorrect = [];
	this.testIncorrect = [];
	
    self.callReturn = function(type) {
		this.onResults = false;
		console.log(globalData.metadata);
		console.log(self.testIncorrect);
		console.log(type);
		for(var i = 0; i < self.testIncorrect.length; i++){
			globalData.metadata.scores[type][self.testIncorrect[i]]++;
		}
		console.log(globalData.metadata.scores);
		customFileIO.saveScores()
		.then(function(success) {
			self.test_popover.hide();
			self.test_popover.remove();
			$state.go('index');
		})
	}
}])