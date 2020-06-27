# Autocomplete Search

autocomplete-search is a simple search function for the browser. 

<img src="https://github.com/johnckealy/autocomplete-search/blob/master/demo.gif" alt="skewt" width="650px" height="300px">


## Installation

`npm install autocomplete-search`


## Getting started

To get up and running, add a div with the id of `el`, e.g.

`<div id="autocomplete"></div>`

then add the js code in a html `<script>` tag or in a `.js` file:

```
    new AutoComplete({
        el: "#autocomplete",                             // name of the DOM element to attach the searchbar to         
        threshold: 2,                                    // minimum number of characters to begin the search
        max_results: 7,                                  // number of elements in the dropdown list
        key: 'name',                                     // json object attribute to be used for the search
        secondary_key: 'country',                        // optional secondary json attribute to be used in the search
        api_endpoint: "http://api.example.funtimes/",    // API endpoint for retrieving the data
        // jsonData: testData                            // Include test data as a javascript object with the variable name 'testData'
    })
```

In place of `api_endpoint` you may use `jsonData`, formatted in `json` – you must provide only one of these parameters. 

## Authors

John C. Kealy