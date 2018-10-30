var TransactionWitness = function() {
};
TransactionWitness.prototype = new Part;
TransactionWitness.prototype.name = "TransactionWitness";


// Extracts relevant parts of hex array for consumption by calling script.
TransactionWitness.prototype.parseWith = function(hexPartsDependency) {
    var that = this;
    var promise = new Promise(function(resolve, reject) {
          var remainingHexArray = [].concat(that.hexArray);
          var parsedHex = [];
          var flagHex = that.findDependencyByName("TransactionFlag", hexPartsDependency).parsedHex;
          var inputCount = that.hexToDec(that.findDependencyByName("TransactionInputCount", hexPartsDependency).parsedHex)
          inputCount = isNaN(inputCount) ? 0 : inputCount;
          var witnesses = [];

          if (flagHex === "0001" && inputCount > 0) {
              for (var count=0; count < inputCount; count++) {
                  var compactSize = that.getCompactSize(remainingHexArray);
                  remainingHexArray = compactSize.remainingHexArray;

                  var stackSizeHex = compactSize.parsedHex
                  var stackSize = that.hexToDec(compactSize.parsedHex);
                  stackSize = isNaN(stackSize) ? 0 : stackSize;

                  parsedHex.push(stackSizeHex);

                  var stack = [];
                  for (var stackCount=0; stackCount < stackSize; stackCount++) {
                      compactSize = that.getCompactSize(remainingHexArray);
                      remainingHexArray = compactSize.remainingHexArray;

                      var componentSize = compactSize.parsedHex;
                      var componentData = remainingHexArray.splice(0, that.bytesToHalfBytes(that.hexToDec(componentSize))).join("")
                      stack.push({componentSize:componentSize, componentData:componentData});

                      parsedHex.push(componentSize);
                      parsedHex.push(componentData);

                  }
                  witnesses.push({size: stackSizeHex, stack: stack});
              }
          }

          // @return:
          //  - remainingHexArray: Remaining hexadecimal after parse
          //  - parsedHex: The hex of the extracted part of the byte array
          that.result = {name:that.name, remainingHexArray:remainingHexArray, parsedHex:parsedHex.join(""), witnesses:witnesses};
          resolve(that.result);
    });
    return promise;
};
