"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const logger = require("morgan");
const bodyParser = require("body-parser");
class App {
    constructor() {
        this.express = express();
        this.setupMiddleware();
        this.setupRoutes();
    }
    static getInstance() {
        return App.instance;
    }
    setupMiddleware() {
        this.express.use(logger("dev"));
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({ extended: false }));
    }
    setupRoutes() {
        let router = express.Router();
        router.get("/", (request, response, next) => {
            response.json({ message: "Hello World!" });
        });
        this.express.use("/", router);
    }
    getExpressApplication() {
        return this.express;
    }
}
App.instance = new App();
exports.App = App;
