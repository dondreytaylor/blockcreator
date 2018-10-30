var TransactionFlag = function() {
};
TransactionFlag.prototype = new Part;
TransactionFlag.prototype.sizeInBytes = 2;
TransactionFlag.prototype.name = "TransactionFlag";


// Extracts relevant parts of hex array for consumption by calling script.
TransactionFlag.prototype.parseWith = function(hexPartsDependency) {
    var that = this;
    var sizeInBytes = typeof this.sizeInBytes === "number" ? this.sizeInBytes : 0;
    var promise = new Promise(function(resolve, reject) {
          var remainingHexArray = [].concat(that.hexArray);
          var parsedHex = remainingHexArray.slice(0, that.bytesToHalfBytes(sizeInBytes))
          if (parsedHex.join("") === "0001") {
              parsedHex =  remainingHexArray.splice(0, that.bytesToHalfBytes(sizeInBytes))
          }
          else {
              parsedHex = [];
          }
          // @return:
          //  - remainingHexArray: Remaining hexadecimal after parse
          //  - parsedHex: The hex of the extracted part of the byte array
          that.result = {name:that.name, remainingHexArray:remainingHexArray, parsedHex:parsedHex.join("")};
          resolve(that.result);
    });
    return promise;
};
