import * as Mongoose from "mongoose";
import { IUserModel } from "../interfaces/IUserModel";
import { DataAccess } from "../DataAccess";

// let mongooseConnection = DataAccess.mongooseConnection;
// let mongooseObj = DataAccess.mongooseInstance;

class UserModel {
    public schema : any;
    public model : any;
    public dbConnectionString : string;
    
    public constructor(dbConnectionString : string) 
    {
        this.dbConnectionString = dbConnectionString;
        this.createSchema();
        this.createModel();
    }

    public async createModel() 
    {
        try{
            await Mongoose.connect(this.dbConnectionString, {useNewUrlParser: true, useUnifiedTopology: true} as Mongoose.ConnectOptions);
            this.schema.pre('save', async function (next) {
                try {
                    // Check if the document being saved is new
                    if (this.isNew) {
                        const lastUser = await this.constructor.findOne({}, {}, { sort: { 'userId': -1 } });
                        // If there are no users, start userId from 1, else increment from the last user's userId
                        this.userId = lastUser ? lastUser.userId + 1 : 1;
                    }
                    next();
                } catch (error) {
                    next(error);
                }
            });

            this.model = Mongoose.model<IUserModel>("Users",this.schema)
            // this.model = mongooseConnection.model<IUserModel>("Users", this.schema)
        }
        catch(e){
            console.error(e)
        }
    }

    public createSchema(): void
    {
        this.schema = new Mongoose.Schema(
            {
                fname: { type: String, required: true },
                lname: { type: String, required: true },
                email: { type: String, required: true },
                password: { type: String, required: true },
                userId: { type: Number, required: false},
            }, { collection : "users" });
    }

    public getAllUsers(response : any)
    {
        console.log("Get all users")
        var query = this.model.find({})
        query.exec((error,itemArray)=>{response.json(itemArray)})
    }
    

    public async getUserById(id: string, response: any) {
        try {
            const user = await this.model.findById(id);
            if (!user) {
                response.status(404).json({ message: 'User not found' });
            } else {
                response.json(user);
            }
        } catch (error) {
            console.error(error);
            response.status(500).json({ message: 'Internal server error' });
        }
    }

    public async updateUserById(id: string, userData: Partial<IUserModel>, response: any) {
        try {
            const user = await this.model.findByIdAndUpdate(id, userData, { new: true });
            if (!user) {
                response.status(404).json({ message: 'User not found' });
            } else {
                response.json(user);
            }
        } catch (error) {
            console.error(error);
            response.status(500).json({ message: 'Internal server error' });
        }
    }

}
export{UserModel}