module.exports = function (RED) {

  return function (config) {
    const ROSLIB = require('roslib');

    RED.nodes.createNode(this, config);
    const node = this;

    node.server = RED.nodes.getNode(config.server);

    if (!node.server || !node.server.ros) {
      return;
    }

    // Advertising a Service
    // ---------------------

    node.server.on('ros connected', () => {
      node.status({ fill: "green", shape: "dot", text: "Connected and Service Advertised" });
      // First, we create a Service client with details of the service's name and service type.
      serviceServer = new ROSLIB.Service({
        name: config.servicename,
        serviceType: config.srvtype
      });

      node.server.ros.callOnConnection({
        op: 'advertise_service',
        type: serviceServer.serviceType,
        service: serviceServer.name
      });
      serviceServer.isAdvertised = true;

      const ctx = this;
      node.server.ros.on(serviceServer.name, (ctx) => {
        node.status({ fill: "blue", shape: "dot", text: "Received Call" });
        node.send({ payload: ctx });
      });

    });

    node.server.on('ros error', () => {
      node.status({ fill: "red", shape: "dot", text: "error" });
    });
  }
}
