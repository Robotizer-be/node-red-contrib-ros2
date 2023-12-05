module.exports = function (RED) {
  return function (config) {
    const ROSLIB = require('roslib');

    RED.nodes.createNode(this, config);
    const node = this;

    node.server = RED.nodes.getNode(config.server);

    if (!node.server || !node.server.ros) {
      return;
    }

    const actionClient = new ROSLIB.ActionClient({
      ros: node.server.ros,
      serverName: config.servername,
      actionName: config.actionname
    });

    node.on('input', (msg) => {
      let goal = new ROSLIB.Goal({
        actionClient: actionClient,
        goalMessage: msg.payload
      });
  
      goal.on('feedback', function (feedback) {
        node.send([{payload: feedback},]);
      });
  
      goal.on('result', function (result) {
        node.send([, {payload: result}]);
      });
      
      goal.send();
    });

    node.server.on('ros connected', () => {
      node.status({ fill: "green", shape: "dot", text: "connected" });
    });

    node.server.on('ros error', () => {
      node.status({ fill: "red", shape: "dot", text: "error" });
    });

  }
}
