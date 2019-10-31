A simple example of how to connect Node + Express + Mongo + React + WS. The app doesn't have much, it just monitors anything that happens in the collection "test" of the "reactive" db and sends it to the clients. The Mongo documents should have an unique name attribute

## Running

### Server

```
yarn install
yarn start
```


### Client
```
cd front
yarn install
yarn start
```

Then the server will be running in http://localhost:3001 and the client in http://localhost:3000. 

### Mongo

*You will need to have Mongo running with replicaset enabled* 

```
mongod --replSet rs

mongo
rs.initiate()
```

