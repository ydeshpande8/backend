import * as Mongoose from "mongoose";
import { IOffersModel } from "../interfaces/IOffersModel";
import { DataAccess } from "../DataAccess";

let mongooseConnection = DataAccess.mongooseConnection;
let mongooseObj = DataAccess.mongooseInstance;

class OffersModel{
    public schema : any;
    public model : any;
    public dbConnectionString : string;
    public constructor(dbConnectionString : string) {
        this.dbConnectionString = dbConnectionString;
        this.createSchema();
        this.createModel();

    } 

    public async createModel(){
        try
        {  
            this.model = mongooseConnection.model<IOffersModel>("offers",this.schema)
        }
        catch(e){
            console.error(e)
        }
    }

    public createSchema(){
        this.schema = new Mongoose.Schema({userId : String ,  name : String , description : String} ,{collection : "offers"} )
    }

    public async getAllOffers(): Promise<IOffersModel[]> {
        try {
            return await this.model.find().exec();
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    public async getOfferById(id: string): Promise<IOffersModel | null> {
        try {
            return await this.model.findById(id).exec();
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
    

    public async createOffer(offerData: IOffersModel): Promise<IOffersModel> {
        try {
            const offer = new this.model(offerData);
            return await offer.save();
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

}
export{OffersModel}