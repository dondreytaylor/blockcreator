var TransactionInputs = function() {
};
TransactionInputs.prototype = new Part;
TransactionInputs.prototype.name = "TransactionInputs";


// Extracts relevant parts of hex array for consumption by calling script.
TransactionInputs.prototype.parseWith = function(hexPartsDependency) {
    var that = this;
    var promise = new Promise(function(resolve, reject) {
          var remainingHexArray = [].concat(that.hexArray);
          var inputCount = that.hexToDec(that.findDependencyByName("TransactionInputCount", hexPartsDependency).parsedHex)
          inputCount = isNaN(inputCount) ? 0 : inputCount;
          var inputs = [];
          for (var count=0; count < inputCount; count++) {

              // Previous Output
              var prevoutput = {name: "TransactionPrevOutput"};
              prevoutput.parsedHex = remainingHexArray.splice(0, that.bytesToHalfBytes(36)).join("");

              // Script Length
              var compactSize = that.getCompactSize(remainingHexArray);
              remainingHexArray = compactSize.remainingHexArray;


              var scriptLength = {name: "TransactionScriptLength"};
              scriptLength.parsedHex = compactSize.parsedHex;

              // Signature Script
              var signatureScript = {name: "TransactionSignatureScript"};
              signatureScript.parsedHex = remainingHexArray.splice(0, that.bytesToHalfBytes(that.hexToDec(scriptLength.parsedHex))).join("");

              // Sequence
              var sequence = {name: "TransactionSequence"};
              sequence.parsedHex = remainingHexArray.splice(0, that.bytesToHalfBytes(4)).join("");

              // Add input
              inputs.push([prevoutput, scriptLength, signatureScript, sequence]);
          }

          // @return:
          //  - remainingHexArray: Remaining hexadecimal after parse
          //  - parsedHex: The hex of the extracted part of the byte array
          that.result = {name:that.name, remainingHexArray:remainingHexArray, inputs:inputs};
          resolve(that.result);
    });
    return promise;
};
