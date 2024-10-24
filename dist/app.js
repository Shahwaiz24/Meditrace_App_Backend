"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app_loger_1 = __importDefault(require("./App Loger/app_loger"));
const database_1 = __importDefault(require("./config/database"));
const Routing_1 = __importDefault(require("./Routing/Routing"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
// app.use(FirebaseConfig.initializeFirebaseApp);
app.use(app_loger_1.default);
app.use('/v1/api', Routing_1.default);
const port = parseInt(process.env.PORT, 10) || 5000;
app.listen(port, async () => {
    await database_1.default.connectToDatabase();
    console.log(`Server is running on port ${port}`);
});
exports.default = app;
