module.exports = function (RED) {
  return function (config) {
    const ROSLIB = require('roslib');

    RED.nodes.createNode(this, config);
    const node = this;

    node.server = RED.nodes.getNode(config.server);

    if (!node.server || !node.server.ros) {
      return;
    }
    const serviceClient = new ROSLIB.Service({
      name: config.servicename,
      serviceType: config.srvtype
    });

    node.on('input', (msg) => {
      //console.log(msg.payload);
      serviceClient.ros = node.server.ros;
      serviceClient.callService(msg.payload, function (result) {
        msg.payload = result;
        node.send(msg);
      });
    });

    node.server.on('ros connected', () => {
      node.status({ fill: "green", shape: "dot", text: "connected" });
    });

    node.server.on('ros error', () => {
      node.status({ fill: "red", shape: "dot", text: "error" });
    });

  }
}
