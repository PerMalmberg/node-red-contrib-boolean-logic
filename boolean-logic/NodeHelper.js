// Licensed under the MIT license, see LICENSE file.
// Author: Per Malmberg (https://github.com/PerMalmberg)

var NodeHelper = function( node ) {
	var myNode = node;
	var self = this;

	this.ToBoolean = function( value ) {
		var res = false;

		if (typeof value === 'boolean') {
			res = value;
		} 
		else if (typeof value === 'string') {
			res = value === "1" || value.toLowerCase() === "true";
		}
		else if (typeof value === 'number') {
			res = value === 0 ? false : true;
		}

		return res;
	};

	this.DisplayStatus = function( value ) {
		myNode.status( 
			{ 
				fill: value ? "green" : "red", 
				shape: "dot", 
				text: value ? "true" : "false" 
			}
		);
	};
	
			
	this.SetResult = function( value ) {
		self.DisplayStatus( value );
		
		var msg = { 
			topic: "result",
			payload: value
		};

		myNode.send(msg);
	};
};
module.exports = NodeHelper;