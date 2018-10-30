'use strict';

angular.module('Application.Controllers', [])

.controller("BlockEditor", ["$scope", "$compile", "$timeout", function($scope, $compile, $timeout) {

      var hexToBin = function(input) {
          var char = function(x) {
              return String.fromCharCode(x&255)
          }
        	var i = 0;
        	var len = input.length;
        	var output = '';
        	for(;;) {
        		for(;;) {
        			   if (i>=len) return output;
        			      var c = input.charAt(i);
                    if ((c>='0' && c<='9') || (c>='A' && c<='Z') || (c>='a' && c<='z')) break;
        			         i++;
        		}
            output += char(parseInt(input.substr(i,2),16));
        		i += 2;
        		if (i>=len) return output;
        	}
        }

      var littleEndian = function(hexValue) {
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

      $scope.copyElement = function(element, location) {
            var $element = $(element).last().clone();
            $element.find("input").val("");
            $element.find("textarea").val("");
            $element.addClass("removable");
            var $location = $(location);
            $location.append($compile($element)($scope));
      };

      $("#blockeditor").on("input", function() {
          var block = [];
          $("input").each(function() {
              if ($(this).val()) {
                  block.push( $(this).val() );
              }
          });
          $timeout(function() {
              var binary = CryptoJS.enc.Latin1.parse(hexToBin(block.slice(0,9).join("")))
              $scope.blockhash = littleEndian(CryptoJS.SHA256(CryptoJS.SHA256(binary)).toString());
              $scope.rawblock = block.join("");
          });
      })

      $scope.$watch("rawblock", function() {
          //var block = new Block();
          //block.parse($scope.rawblock);
      })
}])
