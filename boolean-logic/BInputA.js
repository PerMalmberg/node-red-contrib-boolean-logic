// Licensed under the MIT license, see LICENSE file.
// Author: Danny Drieß
module.exports = function(RED) {
    function inputA(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        this.on('input', function(msg) {
            msg.topic = "A";
            node.send(msg);
        });
    }
    RED.nodes.registerType("BInputA",inputA);
}
