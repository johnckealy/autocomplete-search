
class AutoComplete {

    constructor(options) {
        this.input = document.querySelector(options.el);
        this.threshold = options.threshold;
        this.query = '';
        this.max_results = options.max_results;
        this.key = options.key;
        if (options.secondary_key) {
            this.secondary_key = options.secondary_key;
        } else {
            this.secondary_key = '';
        }

        if (options.jsonData && !options.api_endpoint) {
            this.dataObj = options.jsonData;
            this.init();
        } else if (options.api_endpoint && !options.jsonData) {
            this.fetchData(options.api_endpoint).then(res => this.dataObj = res).then(this.init())
        } else {
            throw new Error('You must include either a dataObj or api_endpoint option, and not both.')
        }   
    }

    async fetchData(api_endpoint) {
        let data = await fetch(api_endpoint)
                            .then(response => {
                                if (!response.ok) throw new Error('Unable to retrieve the autocomplete data from the server.');
                                return response;
                            })
                            .then(response => response.json());
        return data
    }

    search(query) {
        // Using regular expressions, returns an ordered 
        // list of item matching the search string
        const spots = this.dataObj.filter(dta => {
            let re = `${query}`;
            let rgx = new RegExp(re, "i");
            let list = rgx.exec(dta[this.key]+dta[this.secondary_key]);
            return list;
        });
        let result = spots.sort(() => {
            return spots.index;
        })
        return result;   
    }

    appendToDOM(items) {
        // add the autocomplete list items to the DOM
        const ul = document.createElement("ul"); 
        ul.id = "ulist";
        items.forEach(item => {
            const acItemLink = document.createElement("a"); 
            const acItem = document.createElement("li"); 
            acItemLink.href = "https://google.com";
            acItem.innerText = `${item[this.key]}, ${item[this.secondary_key]}`;
            acItem.classList.add("ac-result");
            ul.appendChild(acItemLink).appendChild(acItem);
            acItem.focus();
        })
        this.input.after(ul);
    }

    removeULfromDOM() {
        const ul = document.getElementById("ulist"); 
        if (ul) {
            ul.remove();
        }
    }
    
    init() {
        // initialize and add event handlers
        this.input.addEventListener('keydown', e => {
            
            if (e.key != 'ArrowRight' && e.key != 'ArrowLeft') this.removeULfromDOM();
            let query = this.input.value + e.key;
            if (e.key == 'Backspace') {
                query = query.replace('Backspace','');
                query = query.substring(0, query.length - 1);
            }
            if (query.length >= this.threshold) {
                const items = this.search(query.toLowerCase());
                if (Array.isArray(items) && items.length > 0) {
                    this.appendToDOM(items);
                }
            }
        })
        document.getElementById("autocomplete-wrapper").onblur = this.removeULfromDOM;
        const parentThis = this;
        this.input.onfocus = function (e) {
            if (e.target.value.length >= this.threshold) {
                const items = parentThis.search(e.target.value.toLowerCase());
                if (Array.isArray(items) && items.length > 0) { parentThis.appendToDOM(items); }
            }
        }
    }
}