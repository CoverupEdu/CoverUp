// SERVICE: Sets
// Contains information about labels and the photo on the screen.
app.service('Sets', [function() {
	this.image = [];
	this.set_labels = []
	this.names = [];
	this.subjects	= [];
	
	this.setImage = function(x) {
		this.image.push(x);	
	}
	this.setLabels = function(x) {
		this.set_labels.push(x);
	}
	this.setNames = function(x) {
		this.names.push(x);
	}
	this.setSubjects = function(x) {
		this.subjects.push(x);
	}
}])