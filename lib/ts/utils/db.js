"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const utils_1 = require("./utils");
const utils_2 = require("./utils");
const url = utils_2.getEnvVar('MONGODB_URI');
const dbName = 'kyllur';
console.log('MDB:', url, dbName);
;
class Functions {
    static async get({ db, collection_name, query, limit = 10000, sort = {} }) {
        return await (db.collection(collection_name)
            .find(query)
            .sort(sort)
            .limit(limit)
            .toArray());
    }
    static async getOne({ db, collection_name, query }) {
        return await (db.collection(collection_name)
            .findOne(query));
    }
    static async createOne({ db, collection_name, data }) {
        return await (db.collection(collection_name)
            .insertOne(data));
    }
    static async createMany({ db, collection_name, data }) {
        return await (db.collection(collection_name)
            .insertMany(data));
    }
    static async deleteOne({ db, collection_name, query }) {
        return await (db.collection(collection_name)
            .deleteOne(query));
    }
    static async deleteMany({ db, collection_name, query }) {
        return await (db.collection(collection_name)
            .deleteMany(query));
    }
    static async updateOne({ db, collection_name, query, values }) {
        return await (db.collection(collection_name)
            .updateOne(query, values));
    }
    static async updateMany({ db, collection_name, query, values }) {
        return await (db.collection(collection_name)
            .updateMany(query, values));
    }
    static async join({ db, collection_name, aggregate }) {
        return await (db.collection(collection_name)
            .aggregate(aggregate)
            .toArray());
    }
}
__decorate([
    utils_2.decorators.interceptAsync({ before: (_, args) => console.log(`FUN: GET(${args[0].collection_name}: ${JSON.stringify(args[0].query)})`) }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], Functions, "get", null);
__decorate([
    utils_2.decorators.interceptAsync({ before: (_, args) => console.log(`FUN: GET_ONE(${args[0].query})`) }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], Functions, "getOne", null);
__decorate([
    utils_2.decorators.interceptAsync({ before: (_, args) => console.log(`FUN: CREATE_ONE(${JSON.stringify(args[0].data)})`) }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], Functions, "createOne", null);
__decorate([
    utils_2.decorators.interceptAsync({ before: (_, args) => console.log(`FUN: CREATE_MANY(${args[0].data})`) }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], Functions, "createMany", null);
__decorate([
    utils_2.decorators.interceptAsync({ before: (_, args) => console.log(`FUN: DELETE_ONE(${args[0].query})`) }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], Functions, "deleteOne", null);
__decorate([
    utils_2.decorators.interceptAsync({ before: (_, args) => console.log(`FUN: DELETE_MANY(${args[0].query})`) }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], Functions, "deleteMany", null);
__decorate([
    utils_2.decorators.interceptAsync({ before: (_, args) => console.log(`FUN: UPDATE_ONE(${args[0].query})`) }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], Functions, "updateOne", null);
__decorate([
    utils_2.decorators.interceptAsync({ before: (_, args) => console.log(`FUN: UPDATE_MANY(${args[0].query})`) }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], Functions, "updateMany", null);
__decorate([
    utils_2.decorators.interceptAsync({ before: (_, args) => console.log(`FUN: JOIN(${args[0].aggregate})`) }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], Functions, "join", null);
exports.Functions = Functions;
class DB {
    constructor(url, database) {
        this.url = url;
        this.database = database;
    }
    async getDBConnection() {
        return mongodb_1.MongoClient.connect(this.url, { useNewUrlParser: true, useUnifiedTopology: true });
    }
    ;
    async execQuery(func, collection_name, query, args = {}) {
        const client = await this.getDBConnection();
        const response = await func({ db: client.db(this.database), collection_name, query, ...args });
        return response;
    }
    ;
    async getCollections(onDone) {
        const client = await this.getDBConnection();
        const db = client.db(this.database);
        const colls = db.listCollections({}, { nameOnly: true });
        let collections = [];
        await utils_1.asyncIterate(colls, (item) => {
            if (item) {
                if (item.type === 'collection') {
                    collections.push(item.name);
                }
            }
        });
        onDone(collections);
    }
    ;
    async listenToChanges(collectionName, pipeline = []) {
        const client = await this.getDBConnection();
        const db = client.db(this.database);
        const collection = db.collection(collectionName);
        const stream = collection.watch(pipeline);
        const dbStream = new DBStream(stream, collectionName, async (collectionName) => {
            const data = await this.execQuery(Functions.get, collectionName, {});
            return data;
        });
        return dbStream;
    }
}
class DBStream {
    constructor(stream, collectionName, fetchData) {
        this.collectionName = collectionName;
        this.stream = stream;
        this.stream.on('change', (changedData) => (async () => this.dataChanged(changedData))());
        this.fetchData = fetchData;
    }
    setOnDataChanged(dataChangedListener) {
        this.dataChangedListener = dataChangedListener;
    }
    async dataChanged(changedData) {
        const data = await this.fetchData(this.collectionName);
        if (this.dataChangedListener) {
            this.dataChangedListener(data);
        }
    }
    closeStream() {
        (async () => await this.stream.close())();
    }
}
__decorate([
    utils_2.decorators.intercept({ before: (obj) => console.log(`DBS: Listening from data in ${obj.collectionName}`) }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function]),
    __metadata("design:returntype", void 0)
], DBStream.prototype, "setOnDataChanged", null);
__decorate([
    utils_2.decorators.interceptAsync({ before: (obj) => console.log(`DBS: Data changed in ${obj.collectionName}`) }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DBStream.prototype, "dataChanged", null);
__decorate([
    utils_2.decorators.intercept({ after: (obj) => console.log(`DBS: Closed Stream ${obj.collectionName}`) }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DBStream.prototype, "closeStream", null);
exports.DBStream = DBStream;
const instance = new DB(url, dbName);
Object.freeze(instance);
exports.default = instance;
