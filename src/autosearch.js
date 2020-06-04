
class AutoComplete {

    constructor(options) {
        this.input = document.querySelector(options.el);
        this.hiddenInput = document.getElementById("id-field");
        this.form = document.getElementById("autocomplete-wrapper");
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
        // Grab data from an API specified in the options
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
    
        var result = spots.sort((a, b) => {
            if (query == a.name.toLowerCase().slice(0, query.length) )  return 1;  
            else return -1
         });
         

        return result.reverse();   
    }

    appendToDOM(items) {
        // add the autocomplete list of items to the DOM
        const ul = document.createElement("ul"); 
        ul.id = "ulist";

        items = items.slice(0, this.max_results) 
        
        items.forEach(item => {
            const acItemLink = document.createElement("a");
            acItemLink.href = "";
            const acItem = document.createElement("li"); 
            acItemLink.dataset.spotId = item.id;
            acItemLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.hiddenInput.value = item.id;
                this.form.submit();
            })
            acItem.innerText = `${item[this.key]}, ${item[this.secondary_key]}`;
            acItem.classList.add("ac-result");
            ul.appendChild(acItemLink).appendChild(acItem);
            acItem.focus();
        })
        this.input.after(ul);
        ul.getElementsByTagName('a')[0].classList.add('active')
    }

    removeULfromDOM() {
        // remove the list of autocomple items from the DOM
        const ul = document.getElementById("ulist"); 
        if (ul) {
            ul.remove();
        }
    }

    incrementActiveItem(anchors, direction) {
        // when using the keyboard, move the active item up or down
        let current;
        for (let i=0; i<anchors.length; i++) {
            if (anchors[i].classList.contains('active')) {
                anchors[i].classList.remove('active')   
                if (direction == 'down') {
                    if (anchors[i] == anchors[anchors.length-1]) {
                        current = anchors[0]
                        current.classList.add('active');
                    } else {
                        current = anchors[i].nextElementSibling
                        current.classList.add('active');
                    }
                    this.input.value =  current.firstChild.innerText                    
                } else if (direction == 'up') {
                    if (anchors[i] == anchors[0]) {
                        current = anchors[anchors.length-1]
                        current.classList.add('active');
                    } else {
                        current = anchors[i].previousElementSibling
                        current.classList.add('active');
                    }
                    this.input.value =  current.firstChild.innerText    
                }
                
                return;
            }
        } 
    }
    
    init() {
        // initialize and add event handlers
        this.input.addEventListener('keydown', e => {
            
            if (e.key != 'ArrowRight' && e.key != 'ArrowLeft' &&
                e.key != 'ArrowUp' && e.key != 'ArrowDown' && e.key != "Enter") this.removeULfromDOM();
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

            const ul = document.getElementById("ulist"); 
            if (ul) {
                if (e.key == "ArrowDown") {
                    const anchors = ul.getElementsByTagName('a')
                    this.incrementActiveItem(anchors, 'down');
                } else if (e.key == "ArrowUp") {
                    const anchors = ul.getElementsByTagName('a')
                    this.incrementActiveItem(anchors, 'up');
                }
            }

            if (e.key == "Enter") {
                e.preventDefault();
                try {
                    let activeElement = document.getElementsByClassName('active')[0]                
                    this.hiddenInput.value = activeElement.dataset.spotId;
                    this.form.submit();
                }
                catch {
                    this.removeULfromDOM();   
                    const ul = document.createElement("ul");   
                    ul.id = "ulist";      
                    const acItemLink = document.createElement("a");
                    const acItem = document.createElement("li"); 
                    acItem.innerText = "No results"
                    ul.appendChild(acItemLink).appendChild(acItem);
                    this.input.after(ul);
                }
            }
        })

        this.form.onblur = this.removeULfromDOM;
        const parentThis = this;
        this.input.onfocus = function (e) {
            if (e.target.value.length >= this.threshold) {
                const items = parentThis.search(e.target.value.toLowerCase());
                if (Array.isArray(items) && items.length > 0) { parentThis.appendToDOM(items); }
            }
        }
    }
}
