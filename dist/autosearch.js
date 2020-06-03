"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var AutoComplete = /*#__PURE__*/function () {
  function AutoComplete(options) {
    var _this = this;

    _classCallCheck(this, AutoComplete);

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
      this.fetchData(options.api_endpoint).then(function (res) {
        return _this.dataObj = res;
      }).then(this.init());
    } else {
      throw new Error('You must include either a dataObj or api_endpoint option, and not both.');
    }
  }

  _createClass(AutoComplete, [{
    key: "fetchData",
    value: function () {
      var _fetchData = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(api_endpoint) {
        var data;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return fetch(api_endpoint).then(function (response) {
                  if (!response.ok) throw new Error('Unable to retrieve the autocomplete data from the server.');
                  return response;
                }).then(function (response) {
                  return response.json();
                });

              case 2:
                data = _context.sent;
                return _context.abrupt("return", data);

              case 4:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      function fetchData(_x) {
        return _fetchData.apply(this, arguments);
      }

      return fetchData;
    }()
  }, {
    key: "search",
    value: function search(query) {
      var _this2 = this;

      // Using regular expressions, returns an ordered 
      // list of item matching the search string
      var spots = this.dataObj.filter(function (dta) {
        var re = "".concat(query);
        var rgx = new RegExp(re, "i");
        var list = rgx.exec(dta[_this2.key] + dta[_this2.secondary_key]);
        return list;
      });
      var result = spots.sort(function () {
        return spots.index;
      });
      return result;
    }
  }, {
    key: "appendToDOM",
    value: function appendToDOM(items) {
      var _this3 = this;

      // add the autocomplete list items to the DOM
      var ul = document.createElement("ul");
      ul.id = "ulist";
      items.forEach(function (item) {
        var acItemLink = document.createElement("a");
        var acItem = document.createElement("li");
        acItemLink.href = "https://google.com";
        acItem.innerText = "".concat(item[_this3.key], ", ").concat(item[_this3.secondary_key]);
        acItem.classList.add("ac-result");
        ul.appendChild(acItemLink).appendChild(acItem);
        acItem.focus();
      });
      this.input.after(ul);
    }
  }, {
    key: "removeULfromDOM",
    value: function removeULfromDOM() {
      var ul = document.getElementById("ulist");

      if (ul) {
        ul.remove();
      }
    }
  }, {
    key: "init",
    value: function init() {
      var _this4 = this;

      // initialize and add event handlers
      this.input.addEventListener('keydown', function (e) {
        if (e.key != 'ArrowRight' && e.key != 'ArrowLeft') _this4.removeULfromDOM();
        var query = _this4.input.value + e.key;

        if (e.key == 'Backspace') {
          query = query.replace('Backspace', '');
          query = query.substring(0, query.length - 1);
        }

        if (query.length >= _this4.threshold) {
          var items = _this4.search(query.toLowerCase());

          if (Array.isArray(items) && items.length > 0) {
            _this4.appendToDOM(items);
          }
        }
      });
      document.getElementById("autocomplete-wrapper").onblur = this.removeULfromDOM;
      var parentThis = this;

      this.input.onfocus = function (e) {
        if (e.target.value.length >= this.threshold) {
          var items = parentThis.search(e.target.value.toLowerCase());

          if (Array.isArray(items) && items.length > 0) {
            parentThis.appendToDOM(items);
          }
        }
      };
    }
  }]);

  return AutoComplete;
}();