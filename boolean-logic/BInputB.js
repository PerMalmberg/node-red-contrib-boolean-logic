// Licensed under the MIT license, see LICENSE file.
// Author: Danny Drieß
module.exports = function(RED) {
    function inputB(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        this.on('input', function(msg) {
            msg.topic = "B";
            node.send(msg);
        });
    }
    RED.nodes.registerType("BInputB",inputB);
}
