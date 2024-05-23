"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const Mongoose = require("mongoose");
// let mongooseConnection = DataAccess.mongooseConnection;
// let mongooseObj = DataAccess.mongooseInstance;
class UserModel {
    constructor(dbConnectionString) {
        this.dbConnectionString = dbConnectionString;
        this.createSchema();
        this.createModel();
    }
    createModel() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield Mongoose.connect(this.dbConnectionString, { useNewUrlParser: true, useUnifiedTopology: true });
                this.schema.pre('save', function (next) {
                    return __awaiter(this, void 0, void 0, function* () {
                        try {
                            // Check if the document being saved is new
                            if (this.isNew) {
                                const lastUser = yield this.constructor.findOne({}, {}, { sort: { 'userId': -1 } });
                                // If there are no users, start userId from 1, else increment from the last user's userId
                                this.userId = lastUser ? lastUser.userId + 1 : 1;
                            }
                            next();
                        }
                        catch (error) {
                            next(error);
                        }
                    });
                });
                this.model = Mongoose.model("Users", this.schema);
                // this.model = mongooseConnection.model<IUserModel>("Users", this.schema)
            }
            catch (e) {
                console.error(e);
            }
        });
    }
    createSchema() {
        this.schema = new Mongoose.Schema({
            fname: { type: String, required: true },
            lname: { type: String, required: true },
            email: { type: String, required: true },
            password: { type: String, required: true },
            userId: { type: Number, required: false },
        }, { collection: "users" });
    }
    getAllUsers(response) {
        console.log("Get all users");
        var query = this.model.find({});
        query.exec((error, itemArray) => { response.json(itemArray); });
    }
    getUserById(id, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.model.findById(id);
                if (!user) {
                    response.status(404).json({ message: 'User not found' });
                }
                else {
                    response.json(user);
                }
            }
            catch (error) {
                console.error(error);
                response.status(500).json({ message: 'Internal server error' });
            }
        });
    }
    updateUserById(id, userData, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.model.findByIdAndUpdate(id, userData, { new: true });
                if (!user) {
                    response.status(404).json({ message: 'User not found' });
                }
                else {
                    response.json(user);
                }
            }
            catch (error) {
                console.error(error);
                response.status(500).json({ message: 'Internal server error' });
            }
        });
    }
}
exports.UserModel = UserModel;
//# sourceMappingURL=UserModel.js.map