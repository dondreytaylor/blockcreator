var TransactionOutputs = function() {
};
TransactionOutputs.prototype = new Part;
TransactionOutputs.prototype.name = "TransactionOutputs";


// Extracts relevant parts of hex array for consumption by calling script.
TransactionOutputs.prototype.parseWith = function(hexPartsDependency) {
    var that = this;
    var promise = new Promise(function(resolve, reject) {
          var remainingHexArray = [].concat(that.hexArray);
          var outputCount = that.hexToDec(that.findDependencyByName("TransactionOutputCount", hexPartsDependency).parsedHex)
          outputCount = isNaN(outputCount) ? 0 : outputCount;
          var outputs = [];
          for (var count=0; count < outputCount; count++) {

              // Transaction Value
              var transactionValue = {name: "TransactionValue"};
              transactionValue.parsedHex = remainingHexArray.splice(0, that.bytesToHalfBytes(8)).join("");

              // Script Length
              var compactSize = that.getCompactSize(remainingHexArray);
              remainingHexArray = compactSize.remainingHexArray;

              var pubkeyScriptLength = {name: "TransactionPublicKeyScriptLength"};
              pubkeyScriptLength.parsedHex = compactSize.parsedHex;

              // Signature Script
              var pubkeyScript = {name: "TransactionPublicKeyScript"};
              pubkeyScript.parsedHex = remainingHexArray.splice(0, that.bytesToHalfBytes(that.hexToDec(pubkeyScriptLength.parsedHex))).join("");

              // Add input
              outputs.push([transactionValue, pubkeyScriptLength, pubkeyScript]);
          }

          // @return:
          //  - remainingHexArray: Remaining hexadecimal after parse
          //  - parsedHex: The hex of the extracted part of the byte array
          that.result = {name:that.name, remainingHexArray:remainingHexArray, outputs:outputs};
          resolve(that.result);
    });
    return promise;
};
