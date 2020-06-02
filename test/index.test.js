const assert = chai.assert;

describe('Integration tests', function() {

    const auto = new AutoComplete({
        el: "#autocomplete",
        threshold: 0,
        max_results: 7,
        key: 'name',
        secondary_key: 'country',
        // api_endpoint: "http://localhost:8000/api/spots/",
        jsonData: testData
    })

    describe('Dropdown tests', function() {
        
        it('should append a dropdown of results to the DOM', function() {
            auto.appendToDOM(auto.dataObj)
            const results = document.getElementsByClassName("ac-result")
            assert.equal(results.length, testData.length);
        });
          
        it('should remove the dropdown', function() {
            auto.removeULfromDOM()
            const ul = document.getElementById("ulist")
            assert.isNull(ul);
        });

        it('should run a search query and return a result', function() {
          const result = auto.search('str')
          assert.equal(result[0].name.toLowerCase(), 'strandhill')
        });

    });
});
