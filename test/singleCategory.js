var chai = require('chai');
var chaiHttp = require('chai-http');

var expect = chai.expect;

var http = require('http');
chai.use(chaiHttp);

describe('Test Single Category result', function () {

	var requestResult;
	var response;
    var categoryId = 1;
    var name = "Food";
    var description = "This category will contain expenses and incomes on Food."
		 
    before(function (done) {
        chai.request("http://localhost:8080")
			.get("/app/category/" + categoryId)
			.end(function (err, res) {
				requestResult = res.body;
				response = res;
                expect(err).to.be.null;
                expect(res).to.have.status(200);
				done();
			});
        });
    
    it('Should return a category property with its name and description ', function (){
		expect(response).to.have.status(200);
		expect(response).to.have.headers;
        expect(response.body).to.have.property('name').equal(name);
        expect(response.body).to.have.property('description').equal(description);
    });	
	
});