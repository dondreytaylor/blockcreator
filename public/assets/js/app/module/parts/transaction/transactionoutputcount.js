var TransactionOutputCount = function() {
};
TransactionOutputCount.prototype = new Part;
TransactionOutputCount.prototype.sizeInBytes = 1;
TransactionOutputCount.prototype.name = "TransactionOutputCount";

// Extracts relevant parts of hex array for consumption by calling script.
TransactionOutputCount.prototype.parseWith = function(hexPartsDependency) {
    var that = this;
    var sizeInBytes = typeof this.sizeInBytes === "number" ? this.sizeInBytes : 0;
    var promise = new Promise(function(resolve, reject) {
          that.result = that.getCompactSize(that.hexArray, sizeInBytes);
          that.result.name =that.name;
          resolve(that.result);
    });
    return promise;
};
