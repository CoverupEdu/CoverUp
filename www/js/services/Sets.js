// SERVICE: Sets
// Contains information about labels and the photo on the screen.
app.service('Sets', [function() {
	this.image = [];
	this.name = "";
	this.subject = "";
	
	this.setImage = function(x) {
		this.image = x;	
	}
}])