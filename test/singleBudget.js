var chai = require('chai');
var chaiHttp = require('chai-http');

var expect = chai.expect;

var http = require('http');
chai.use(chaiHttp);

describe('Test Single Budget result', function () {

	var requestResult;
	var response;
    var budgetId = 1;
    var type = "Income";
    var note = "Bartender"
		 
    before(function (done) {
        chai.request("http://localhost:8080")
			.get("/app/budget/" + budgetId)
			.end(function (err, res) {
				requestResult = res.body;
				response = res;
                expect(err).to.be.null;
                expect(res).to.have.status(200);
				done();
			});
        });
    
    it('Should return a budget property with its type and note ', function (){
		expect(response).to.have.status(200);
		expect(response).to.have.headers;
        expect(response.body).to.have.property('type').equal(type);
        expect(response.body).to.have.property('note').equal(note);
    });	
	
});