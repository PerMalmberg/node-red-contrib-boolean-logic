module.exports = function(RED) {
    function BooleanLogic(config) {
        RED.nodes.createNode(this,config);
		this.config = config;
        this.state = {};
		var node = this;
		
        this.on('input', function(msg) {
			var topic = msg.topic;
			var payload = msg.payload;
			
			if( topic !== undefined && payload !== undefined ) {
				var value = ToBoolean( payload );
				var state = node.state;
				
				state[topic] = value;
				
				// Do we have as many inputs as we expect?
				var keyCount = Object.keys(state).length;

				if( keyCount == node.config.inputCount ) {
					var res = CalculateResult();
				
					SetResult( res );
				}
				else if(keyCount > node.config.inputCount ) {
					node.warn( (node.config.name !== undefined && node.config.name.length > 0 ? node.config.name : "BooleanLogic") + " [" + node.config.operation + "]: More than the specified " + node.config.inputCount + " topics received, resetting.");
					node.state = {};
					SetResult( false );
				}
			}
        });
		
		function CalculateResult() {
			var res;
			
			if( node.config.operation == "XOR") {
				res = PerformXOR();
			}
			else {
				// We need a starting value to perform AND and OR operations.				
				var keys = Object.keys(node.state);
				res = node.state[keys[0]];
				
				for( var i = 1; i < keys.length; ++i ) {
					var key = keys[i];
					res = PerformSimpleOperation( node.config.operation, res, node.state[key] );
				}
			}
			
			return res;			
		}		
		
		function PerformXOR()
		{
			// XOR = exclusively one input is true. As such, we just count the number of true values and compare to 1.
			var trueCount = 0;
			
			for( var key in node.state ) {
				trueCount += node.state[key] ? 1 : 0;
			}
			
			return trueCount == 1;
		}
		
		function PerformSimpleOperation( operation, val1, val2 ) {
			var res;
			
			if( operation === "AND" ) {
				res = val1 && val2;
			}
			else if( operation === "OR" ) {
				res = val1 || val2;
			}
			else {
				node.error( "Unknown operation: " + operation );
			}
			
			return res;
		}
		
		function ToBoolean( value ) {
			var res = false;

			if (typeof value === 'boolean') {
				res = value;
			} 
			else if (typeof value === 'string') {
				res = value === "1" || value.toLowerCase() === "true";
			}
			else if (typeof value === 'number') {
				res = value !== 0 ? true : false;
			}
			else {
				node.warn("BooleanLogic: '" + value + "' is not convertable to a boolean");
			}

			return res;
		}
		
		function DisplayStatus(value) {
			node.status( {fill: value ? "green" : "red", shape: "dot", text: value ? "true" : "false" } );
		}
		
		function SetResult(value) {
			DisplayStatus(value);
			
			var msg = { 
				topic: "result",
				payload: value
			};
					
			node.send(msg);
		}
		
		// Reset status on creation (includes deploy), but do not send.
		DisplayStatus(false);
    }	
	
	
    RED.nodes.registerType("BooleanLogic",BooleanLogic);
}