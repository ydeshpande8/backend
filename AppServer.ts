// import * as dotenv from 'dotenv';
// import {App} from './App';


import * as dotenv from 'dotenv';
import {App} from './App';

dotenv.config();

const dbProtocol = process.env.DB_PROTOCOL;
const port = process.env.PORT;
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
//const mongoDBConnection = 'mongodb://' + dbUser + ':' + encodeURIComponent(dbPassword) + process.env.DB_INFO;

const mongoDBConnection = dbProtocol + dbUser + ':' + encodeURIComponent(dbPassword) + process.env.DB_INFO;
console.log("server db connection URL " + mongoDBConnection);

let server: any = new App(mongoDBConnection).expressApp;
server.listen(port);
console.log("server running in port " + port);