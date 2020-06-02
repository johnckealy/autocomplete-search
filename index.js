
class AutoComplete {

    constructor(options) {
        this.input = document.querySelector(options.el);
        this.threshold = options.threshold;
        this.query = '';
        this.api_endpoint =  options.api_endpoint;
        this.max_results = options.max_results;
        this.key = options.key;
        this.secondary_key = options.secondary_key;

        this.fetchData().then(res => this.data_obj = res).then(this.init());
        
    }

    fetchData() {
        return new Promise((resolve,reject) => {
            const source = fetch(this.api_endpoint )
            source.then(res => resolve(res.json()))     
        })
    }

    search(query) {
        // Using regular expressions, returns an ordered 
        // list of item matching the search string
        const spots = this.data_obj.filter(dta => {
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
            acItemLink.href = "#"
            acItem.innerText = `${item[this.key]}, ${item[this.secondary_key]}`
            ul.appendChild(acItemLink).appendChild(acItem)
            acItem.focus()
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
            // if ()
            this.removeULfromDOM()
            let query = this.input.value + e.key
            if (e.key == 'Backspace') {
                query = query.replace('Backspace','')
                query = query.substring(0, query.length - 1);
            }
            if (query.length > this.threshold) {
                const items = this.search(query.toLowerCase());
                this.appendToDOM(items);
            }
        })
    }
}




