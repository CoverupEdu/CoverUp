// SERVICE: Photo
// Contains all of the functions for taking and saving photos.
// Injects: $q
app.service('Photo', ['globalData', '$q', function(globalData, $q) {
    this.image = "";
    
    this.setImage = function(img) {
        this.image = img;
    };

    this.getPicture = function (options) {
        var q = $q.defer();

        navigator.camera.getPicture(function (result) {
            q.resolve(result);
        }, function (err) {
            q.reject(err);
        }, options);

        return q.promise;
    };

}])