function BlockBase() {
};

BlockBase.prototype.template = {};

BlockBase.prototype.template.header = [];

BlockBase.prototype.template.transactionCount = {};

BlockBase.prototype.template.transaction = [];

BlockBase.prototype.parsed = {};

BlockBase.prototype.parsed.remainingHexArray = [];

BlockBase.prototype.parsed.header = [];

BlockBase.prototype.parsed.transactionCount = {};

BlockBase.prototype.parsed.transactions = [];

BlockBase.prototype.parse = function(rawBlockHex) {
    var that = this;
    this.parsed.header = [];
    this.parsed.transactions = [];
    if (typeof rawBlockHex === "string") {

        // Disect Block Header
        var disectHeader = function(hexArray, dependencyParts, callback) {
            var headerTemplate = that.template.header;
            while (headerTemplate.length != that.parsed.header.length) {
                  var part = headerTemplate[that.parsed.header.length];
                  if (part instanceof Part) {
                      part.setHex(hexArray);
                      part.parseWith(dependencyParts);
                      hexArray = part.result.remainingHexArray;
                      that.parsed.remainingHexArray = part.result.remainingHexArray;
                      delete part.result.remainingHexArray;
                      that.parsed.header.push(part.result);
                  }
            }

            typeof callback === "function" ? callback() : null;
        };

        // Disect Block Transaction count
        var disectTransactionCount = function(hexArray, callback) {
            var part = that.template.transactionCount;
            part.setHex([].concat(hexArray));
            part.parseWith([]).then(function(result) {
                that.parsed.transactionCount = result;
                that.parsed.remainingHexArray = result.remainingHexArray;
                typeof callback === "function" ? callback() : null;
            });
        };

        // Disect Block Transactions
        var disectTransactions = function(hexArray, callback) {
            var transactionCount = parseInt(that.parsed.transactionCount.parsedHex, 16).toString(10)
            transactionCount = isNaN(transactionCount) ? 0 : transactionCount;
            for (var count =0; count < transactionCount; count++) {
                  var parts = that.template.transaction
                  var transaction = [];
                  for (var part in parts) {
                      if (parts[part] instanceof Part) {
                        var dependencyParts = transaction;
                        parts[part].setHex(hexArray);
                        parts[part].parseWith(dependencyParts);
                        hexArray = parts[part].result.remainingHexArray;
                        that.parsed.remainingHexArray = parts[part].result.remainingHexArray;
                        delete parts[part].result.remainingHexArray;
                        transaction.push(parts[part].result);
                      }
                  }
                  if (transaction.length > 0) {
                    that.parsed.transactions.push(transaction);
                  }
            }
            typeof callback === "function" ? callback() : null;
        };

        disectHeader(rawBlockHex.split(""), this.parsed.header, function() {
            disectTransactionCount(that.parsed.remainingHexArray, function() {
                disectTransactions(that.parsed.remainingHexArray, function() {
                    console.log(that.parsed);
                })
            });
        })
    }
};
