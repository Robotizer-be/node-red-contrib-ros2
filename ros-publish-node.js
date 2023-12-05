module.exports = function (RED) {
  return function (config) {
    const ROSLIB = require('roslib');

    RED.nodes.createNode(this, config);
    const node = this;

    node.server = RED.nodes.getNode(config.server);

    if (!node.server || !node.server.ros) {
      return;
    }

    node.on('input', (msg) => {
      node.topic.publish( msg.payload );
    });

    node.server.on('ros connected', () => {
      node.status({ fill: "green", shape: "dot", text: "connected" });

      node.topic = new ROSLIB.Topic({
        ros: node.server.ros,
        name: config.topicname,
        messageType: config.msgtype
      });

      node.topic.advertise();
    });

    node.server.on('ros error', () => {
      node.status({ fill: "red", shape: "dot", text: "error" });
    });
  }
}
