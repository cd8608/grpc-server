var PROTO_PATH = __dirname + '/protos/location.proto';
var grpc = require('grpc');
var location_proto = grpc.load(PROTO_PATH).location;

var locationSchema = {
    name: 'location',
    type: 'record',
    fields: [
        {
            name: 'lon',
            type: 'double'
        }, {
            name: 'lat',
            type: 'double'
        }]
};

var avro = require('avsc');
var type = avro.parse(locationSchema);

var kafka = require('kafka-node');
var HighLevelProducer = kafka.HighLevelProducer;
var KeyedMessage = kafka.KeyedMessage;
var Client = kafka.Client;
const zookeeperAddress = process.env.ZOOKEEPER_ADDRESS;
const zookeeperTopic = process.env.ZOOKEEPER_TOPIC;

var client = new Client(zookeeperAddress, 'my-client-id', {
    sessionTimeout: 300,
    spinDelay: 100,
    retries: 2
});

client.on('error', function(error) {
    console.error(error);
});

function shareLocation(call, callback) {
    var producer = new HighLevelProducer(client);
    console.info('shareLocation started');

    var messageBuffer = type.toBuffer({
        lon: call.request.longitude,
        lat: call.request.latitude
    });

    var payload = [{
        topic: zookeeperTopic,
        messages: messageBuffer,
        attributes: 1
    }];

    console.info('Sending payload to Kafka: ', payload);
    producer.send(payload, function(error, result) {
        if (error) {
            console.error(error);
        } else {
            var formattedResult = result[0];
            console.log('result: ', result)
        }
    });

    var lonLat = call.request.longitude + ' - ' + call.request.latitude;
    console.info('Location shared: ' + lonLat);
    callback(null, {message: "Location shared: " + lonLat});
}

function main() {
  var server = new grpc.Server();
  server.addService(location_proto.Location.service, {shareLocation: shareLocation});
  server.bind('0.0.0.0:50051', grpc.ServerCredentials.createInsecure());
  server.start();
}

main();