import * as express from 'express';
import * as bodyParser from 'body-parser'; 
import {CategoryModel} from './models/CategoryModel';
import {BudgetModel} from './models/BudgetModel';
import * as crypto from 'crypto';
import { UserModel } from './models/UserModel';
import * as cors from 'cors';

// Creates and configures an ExpressJS web server.
class App {

  // ref to Express instance
  public expressApp: express.Application;

  public Category : CategoryModel;

  public Budget : BudgetModel;
  public User : UserModel;
  
  public corsOptions = {
    origin: 'http://localhost:4200'
  }

  //Run configuration methods on the Express instance.
  constructor(mongoDBConnection:string)
  {
    this.expressApp = express();
    this.middleware();
    this.routes();
    this.expressApp.use(cors(this.corsOptions));
    
    this.Category = new CategoryModel(mongoDBConnection);
    this.Budget = new BudgetModel(mongoDBConnection);
    this.User = new UserModel(mongoDBConnection);
   }

  // Configure Express middleware.
  private middleware(): void {
    this.expressApp.use(bodyParser.json());
    this.expressApp.use(bodyParser.urlencoded({ extended: false }));
    this.expressApp.use( (req, res, next) => {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      next();
    });
  }



  // Configure API endpoints.
  private routes(): void {
    let router = express.Router();
   
    // ********** CATEGORY ROUTES **********

    // get all categories   
    router.get('/app/category/', async (req, res) => {
      console.log('Query All Categories');
      await this.Category.retrieveAllCategories(res);
  });

    //get one category    
    router.get('/app/category/:categoryId', async (req, res) =>{
      var id = parseInt(req.params.categoryId);
      console.log('Query to get one category with id:' + id);
      try 
      {
          await this.Category.retrieveCategory(res, id);
      } 
      catch (error) 
      {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while retrieving the category.' });
    }
    });

    // get count of all categories   
    router.get('/app/categorycount', async (req, res) => {
      console.log('Query the number of category elements in db');
      await this.Category.retrieveCategoryCount(res);
    });

    //create category  
    router.post('/app/category/', async (req, res) => 
    {
      const id = crypto.randomBytes(16).toString("hex");
      console.log(req.body);
      var jsonObj = req.body;
      //jsonObj.listId = id;
      try
      {
        await this.Category.model.create([jsonObj]);
        //res.send('{"id""' + id + '"}');
        res.send(jsonObj.name + ' category created successfully' )
      }
      catch(e)
      {
        console.error(e);
        console.log('object creation failed');
      }
    });

    // ********** BUDGET ROUTES **********

    //get all budget    
    router.get('/app/budget/', async (req, res) => {
      console.log('Query All budget');
      await this.Budget.retrieveAllBudget(req, res);
  });
 
    //get count of all budgets    
    router.get('/app/budgetcount', async (req, res) => {
      console.log('Query the number of budget elements in db');
      await this.Budget.retrieveBudgetCounts(res);
    });

    //get one budget
    router.get('/app/budget/:budgetId', async (req, res) =>{
      var id = parseInt(req.params.budgetId);
      console.log('Query to get one category with id:' + id);
      try 
      {
          await this.Budget.retrieveBudgetDetails(res, id);
      } 
      catch (error) 
      {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while retrieving the category.' });
    }
    });
    
    
    //create budget
    router.post('/app/budget/', async (req, res) => 
      {
        const id = crypto.randomBytes(16).toString("hex");
        console.log(req.body);
        var jsonObj = req.body;
       
        try
        {
          await this.Budget.model.create([jsonObj]);
          res.json({ message: "Budget for type Expense created successfully" });
        }
        catch(e)
        {
          console.error(e);
          console.log('object creation failed');
        }
      });

    // get report 
    router.get('/app/report/', async (req, res) => {
      try
      {
        await this.Budget.reportByMonthYear(req, res);
      }
      catch(e)
      {
        console.error(e);
        console.log('something error');
      }
    })

    this.expressApp.use('/', router);

    this.expressApp.use('/app/json/', express.static(__dirname+'/app/json'));
    this.expressApp.use('/images', express.static(__dirname+'/img'));
    //this.expressApp.use('/', express.static(__dirname+'/pages'));
    this.expressApp.use('/', express.static(__dirname+'/dist'));
    
    }

  }

export {App};