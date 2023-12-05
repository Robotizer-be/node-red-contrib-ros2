

module.exports = function (RED) {
  return function (config) {
    const ROSLIB = require('roslib');

    RED.nodes.createNode(this, config);
    const node = this;

    node.closing = false;

    node.on('close', function () {
      // node.log('On Node Close');
      node.closing = true;
      if (node.tout)
        clearTimeout(node.tout);
      if (node.ros)
        node.ros.close();
    });

    function startconn() {
      // node.log('Start Conn');
      const ros = new ROSLIB.Ros({
        url: config.url
      });
      node.ros = ros;
      handleConnection(ros);
    }

    let trials = 0;

    function handleConnection(ros) {
      ros.on('connection', function () {
        node.emit('ros connected');
        node.log('On ROS Connection');

        trials = 0;
      });

      ros.on('error', function (error) {
        node.emit('ros error');
        // node.log('On ROS Error');
        node.log('Error connecting : ' + error);

        trials++;
      });

      ros.on('close', function () {
        node.emit('ros closed');
        // node.log('On ROS Close');

        if (!node.closing) {
          let timeout = (trials + 1) * 200;
          if (timeout > 5000)
            timeout = 5000;
          node.log('Reconnecting after ' + timeout + ' miliseconds');
          node.tout = setTimeout(() => {
            startconn();
          }, timeout);
        }
      });
    }

    startconn();
    node.closing = false;
  }
}
