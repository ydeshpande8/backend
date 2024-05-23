import * as Mongoose from "mongoose";
import { IBudgetModel } from "../interfaces/IBudgetModel";
import { Schema } from "mongoose";


class BudgetModel{
    public schema : any;
    public innerSchema : any;
    public model : any;
    public dbConnectionString : string;

    public constructor(dbConnectionString : string) {
        this.dbConnectionString = dbConnectionString;
        this.createSchema();
        this.createModel();

    } 
    
    public createSchema() : void 
    {
        this.schema = new Mongoose.Schema(
            {
                categoryId: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
                userId: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
                // userId : Number,
                budgetId : { type: Number, required: false },
                amount :  { type: Number, required: true },
                date :  { type: Date, required: true },
                note :  { type: String, required: true },
                type:  { type: String, required: true }
            }
        
            ,{collection : "budget"} )
    }

    public async createModel(){
        try
        {
            await Mongoose.connect(this.dbConnectionString, {useNewUrlParser: true, useUnifiedTopology: true} as Mongoose.ConnectOptions);
            this.schema.pre('save', async function (next) {
                try {
                    // Check if the document being saved is new
                    if (this.isNew) {
                        const lastBudget = await this.constructor.findOne({}, {}, { sort: { 'budgetId': -1 } });
                        this.budgetId = lastBudget ? lastBudget.budgetId + 1 : 1;
                    }
                    next();
                } catch (error) {
                    next(error);
                }
            });
            
            this.model = Mongoose.model<IBudgetModel>("Budget",this.schema)
        }
        catch(e){
            console.error(e)
        }
    }

    public async retrieveAllBudget(req, response:any)
    {
        const queryParams = req.query;
        // var query = this.model.find(queryParams).populate("userId");
        var query = this.model.find(queryParams).populate({path : "userId", select : "fname lname"}).populate("categoryId");
        try 
        {
            const budgetArray = await query.exec();
            
            response.json(budgetArray);
        } 
        catch (error) {
            console.error(error);
            throw error;
        }
    }
    public async retrieveBudgetDetails(response:any, value:Number)
    {
        console.log("Hello in budget")
        var query = this.model.findOne({budgetId: value}).populate({path : "userId", select : "fname lname"}).populate("categoryId");
        try 
        {
            const categoryArray = await query.exec();
            response.json(categoryArray);
        } 
        catch (error) {
            console.error(error);
            throw error;
        }
    }


    public async retrieveBudgetCount(response:any, filter:Object) 
    {
        var query = this.model.findOne(filter);
        try 
        {
            const budgetList = await query.exec();
            if (budgetList == null)
                {
                    response.status(404);
                    response.json('{count: -1}');
                }
            else 
                {
                    console.log('List of Budget: ' + budgetList.budget.length);
                    response.json('{count:' + budgetList.budget.length + '}');
                    }
        } 
        catch (error) {
            console.error(error);
            throw error;
        }
    }

    public async retrieveBudgetCounts(response : any) 
    {
        console.log("retrieve Budget Count ...");
        var query = this.model.estimatedDocumentCount();
        try {
            const numberOfBudget = await query.exec();
            console.log("numberOfCategories: " + numberOfBudget);
            response.json(numberOfBudget);
        }
        catch (e) {
            console.error(e);
        }
    }

    public async reportByMonthYear(req: any, response: any) {
        try {
            const { month, year } = req.query;
            const aggregateQuery = [
                {
                    $match: {
                        $expr: {
                            $and: [
                                { $eq: [{ $month: "$date" }, parseInt(month)] }, // Match month
                                { $eq: [{ $year: "$date" }, parseInt(year)] } // Match year
                            ]
                        }
                    }
                },
                {
                    $group: {
                        _id: "$type", // Group by type
                        totalAmount: { $sum: "$amount" } // Calculate sum of amount for each type
                    }
                },
                {
                    $project: {
                        _id: 0, // Exclude _id field
                        type: "$_id", // Project type
                        totalAmount: 1 // Project totalAmount
                    }
                }
            ];
            const budgetByMonthYear = await this.model.aggregate(aggregateQuery).exec();
            response.json(budgetByMonthYear);

            /*
            [
                {
                    "type": "income",
                    "totalAmount": 1500
                },
                {
                    "type": "expense",
                    "totalAmount": 800
                }
            ]
            */
        }
        catch (error) {
            console.error(error);
            response.status(500).json({ message: 'Internal server error' });
        }

    }
}
export{BudgetModel}