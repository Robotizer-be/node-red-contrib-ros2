module.exports = function (RED) {
  return function (config) {
    const ROSLIB = require('roslib');

    RED.nodes.createNode(this, config);
    const node = this;

    node.server = RED.nodes.getNode(config.server);

    if (!node.server || !node.server.ros) {
      return;
    }

    // if topic has not been advertised yet, keep trying again
    function topicQuery() {
      node.server.ros.getTopicType(node.topic.name, (type) => {
        if (!type)
          setTimeout(() => { topicQuery() }, 1000);
        else {
          node.topic.type = type;
          node.topic.subscribe((message) => {
            node.send({ payload: message});
          });
          node.status({ fill: "green", shape: "dot", text: "connected" });
        }
      });
    }

    node.server.on('ros connected', () => {
      node.topic = new ROSLIB.Topic({
        ros: node.server.ros,
        name: config.topicname
      });

      topicQuery();
    });

    node.server.on('ros error', () => {
      node.status({ fill: "red", shape: "dot", text: "error" });
    });

    node.on("close", function () {
      if (!node.server.closing) {
        node.topic.unsubscribe();
      }
    });
  }
}
