var HeaderSolution = function() {
};
HeaderSolution.prototype = new Part;
HeaderSolution.prototype.name = "HeaderSolution";

// Extracts relevant parts of hex array for consumption by calling script.
HeaderSolution.prototype.parseWith = function(hexPartsDependency) {
    var that = this;
    var promise = new Promise(function(resolve, reject) {
          var remainingHexArray = [].concat(that.hexArray);
          var sizeInBytes = that.hexToDec(that.findDependencyByName("HeaderSolutionSize", hexPartsDependency).parsedHex);
          var parsedHex = remainingHexArray.splice(0, that.bytesToHalfBytes(sizeInBytes))

          // @return:
          //  - remainingHexArray: Remaining hexadecimal after parse
          //  - parsedHex: The hex of the extracted part of the byte array
          that.result = {name:that.name, remainingHexArray:remainingHexArray, parsedHex:parsedHex.join("")};
          resolve(that.result);
    });
    return promise;
};
