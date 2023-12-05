module.exports = function (RED) {

  return function (config) {
    // const ROSLIB = require('roslib');
    RED.nodes.createNode(this, config);
    const node = this;

    node.server = RED.nodes.getNode(config.server);

    if (!node.server || !node.server.ros) {
      return;
    }

    node.on('input', (msg) => {
      // console.log(msg.payload);

      if (msg.payload.id) {
        const call = {
          op: 'service_response',
          service: config.servicename,
          values: msg.payload.msg,
          result: true
        }

        call.id = msg.payload.id;
        console.log(call);
        node.server.ros.callOnConnection(call);
      }
    });

    node.server.on('ros connected', () => {
      node.status({ fill: "green", shape: "dot", text: "Connected" });
    });

    node.server.on('ros error', () => {
      node.status({ fill: "red", shape: "dot", text: "error" });
    });
  }
}
