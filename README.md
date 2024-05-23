1. Create db folder in WebWizards Directory
    mkdir db
 
2. Run the mongod command to run the mongo server on port 3000
    mongod --port 3000 --dbpath ./db
 
3. Connect the same port on Mongo Compass
 
4. Run the mongo shell to perform actions on db
    mongosh --port 3000 --authenticationDatabase admin
 
5. In Mongo Shell load the data population script and create the db admin user for further node server connectivity
    load ('createDB/createBudget.js')
    load ('createDB/createAdminUser.js')
 
6. Verify that the data is populated on the compass
 
7. Compile the typescript files
    tsc
 
8. Run the node server
    node AppServer.js
