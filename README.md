

## App Info
 
 grpc-server is the server for location proto services.
 
 ## Startup
  
 Commands to start grpc-server application:
 
 1. `npm install`
 2. `ZOOKEEPER_ADDRESS=localhost:2181 ZOOKEEPER_TOPIC=node-test3 npm start`
 
 Commands to start in docker environment:
 
 1. `docker build -t grpc-server:1.0.0 .`
 2. `docker-compose up -d`