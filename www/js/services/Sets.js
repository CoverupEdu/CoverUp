// SERVICE: Sets
// Contains information about labels and the photo on the screen.
app.service('Sets', [function() {
	this.image = [];
	this.set_labels = []
	this.name = "";
	this.subject	= "";
	
	this.setImage = function(x) {
		this.image.push(x);	
	}
	this.setLabels = function(x) {
		this.set_labels.push(x);
	}
}])