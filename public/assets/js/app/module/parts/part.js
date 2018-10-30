function Part(hexArray, sizeInBytes) {
    this.hexArray = (hexArray instanceof Array) ? hexArray : [];
    this.sizeInBytes = typeof sizeInBytes === "number" ? sizeInBytes : 0;
};


////////////////////////////////////
///////// HELPER FUNCTIONS /////////
////////////////////////////////////

// Converts a decimal number to a hexadecimal number
Part.prototype.decToHex = function(decimal) {
    return decimal.toString(16);
};

// Converts a hexadecimal number to a decimal number
Part.prototype.hexToDec = function(hex) {
    return parseInt(hex, 16).toString(10);
};

// Converts a hexadecimal number to a binary number
Part.prototype.hexToBin = function(hex) {
    return (parseInt(hex, 16).toString(2)).padStart(8, '0');
};

// Convert half bits to bytes
Part.prototype.bytesToHalfBytes = function(bytes) {
    return bytes * 2;
};

// Changes hexadecimal number into little
// endian number ordering
Part.prototype.littleEndian = function(hexValue) {
    var hex = (hexValue || "").split("");
    var hexArray = [];
    if (hex.length % 2 == 0) {
        for (var i=0; i < hex.length; i += 2) {
            hexArray.push(hex[i] + "" + hex[i+1]);
        }
        hexArray.reverse();
        return hexArray.join("");
    }
    else {
      return hexValue;
    }
};

// Simple search function for dependency list given a name
Part.prototype.findDependencyByName = function(name, dependencies) {
    for (var index in dependencies) {
        if (dependencies[index].name === name) {
          return dependencies[index];
        }
    }
    return {};
};

// Retrieves compact size
Part.prototype.getCompactSize = function(hexArray, sizeInBytes) {
    var sizeInBytes = typeof sizeInBytes === "number" ? sizeInBytes : 1;
    var remainingHexArray = [].concat(hexArray);
    var parsedHex = remainingHexArray.slice(0, this.bytesToHalfBytes(sizeInBytes))
    var hexAsDecimal = this.hexToDec(parsedHex.join(""));

    switch (true) {
       case hexAsDecimal < 253:
          sizeInBytes = 1;
          break;

        case hexAsDecimal == 253:
           sizeInBytes = 3;
          break;

        case hexAsDecimal == 254:
           sizeInBytes = 5;
          break;

        case hexAsDecimal == 255:
           sizeInBytes = 9;
          break;

        default:
           sizeInBytes = 9;
          break;
    };


    parsedHex = remainingHexArray.splice(0, this.bytesToHalfBytes(sizeInBytes));
    if (parsedHex.length > this.bytesToHalfBytes(1)) {
        parsedHex = this.littleEndian(parsedHex.slice(2, parsedHex.length).join("")).split("");
    }

    // @return:
    //  - remainingHexArray: Remaining hexadecimal after parse
    //  - parsedHex: The hex of the extracted part of the byte array
    return {remainingHexArray:remainingHexArray, parsedHex: parsedHex.join("")};
};


///////////////////////////////////
///////// PARSE FUNCTIONS /////////
///////////////////////////////////

// Name of hex part
Part.prototype.name = "";

// Result of hex parse
Part.prototype.result = {};

// An array of extracted parts of the provided hex array
Part.prototype.hexSegments = [];

// Sets current hex
Part.prototype.setHex = function(hexArray) {
      this.hexSegments = [];
      this.hexArray = (hexArray instanceof Array) ? hexArray : [];
      this.result = {};
};

// Extracts relevant parts of hex array for consumption by calling script.
// The following is an outline for what this function should provide for any
// prototype extending this object.
Part.prototype.parseWith = function(hexPartsDependency) {
    var that = this;
    this.result = {};
    var sizeInBytes = typeof this.sizeInBytes === "number" ? this.sizeInBytes : 0;
    var promise = new Promise(function(resolve, reject) {
          var remainingHexArray = [].concat(that.hexArray);
          var parsedHex =  remainingHexArray.splice(0, that.bytesToHalfBytes(sizeInBytes))
          // @return:
          //  - remainingHexArray: Remaining hexadecimal after parse
          //  - parsedHex: The hex of the extracted part of the byte array
          that.result = {name:that.name, remainingHexArray:remainingHexArray, parsedHex:parsedHex.join("")};
          resolve(that.result);
    });
    return promise;
};
