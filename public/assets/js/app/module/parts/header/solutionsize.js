var HeaderSolutionSize = function() {
};
HeaderSolutionSize.prototype = new Part;
HeaderSolutionSize.prototype.sizeInBytes = 1;
HeaderSolutionSize.prototype.name = "HeaderSolutionSize";

// Extracts relevant parts of hex array for consumption by calling script.
HeaderSolutionSize.prototype.parseWith = function(hexPartsDependency) {
    var that = this;
    var sizeInBytes = typeof this.sizeInBytes === "number" ? this.sizeInBytes : 0;
    var promise = new Promise(function(resolve, reject) {
          that.result = that.getCompactSize(that.hexArray, sizeInBytes);
          that.result.name =that.name;
          resolve(that.result);
    });
    return promise;
};
