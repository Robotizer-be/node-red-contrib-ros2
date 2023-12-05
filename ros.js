module.exports = function (RED) {
	var RosSubscribeNode = require('./ros-subscribe-node')(RED);
	var RosPublishNode = require('./ros-publish-node')(RED);
	var RosServiceCallNode = require('./ros-call-service-node')(RED);
	var RosServiceAdvNode = require('./ros-adv-service-node')(RED);
	var RosServiceRepsNode = require('./ros-resp-service-node')(RED);
	var RosServerNode = require('./ros-server-node')(RED);
	var RosActionClientNode = require('./ros-action-client-node')(RED);

	RED.nodes.registerType("ros-subscribe", RosSubscribeNode);
	RED.nodes.registerType("ros-publish", RosPublishNode);
	RED.nodes.registerType("ros-call-service", RosServiceCallNode);
	RED.nodes.registerType("ros-adv-service", RosServiceAdvNode);
	RED.nodes.registerType("ros-resp-service", RosServiceRepsNode);
	RED.nodes.registerType("ros-server", RosServerNode);
	RED.nodes.registerType("ros-action-client", RosActionClientNode);
}
