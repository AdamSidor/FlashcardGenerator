// require fs
var fs = require("fs");

//export basic
module.exports = basicCard;

// constructor for basic flashcards
function basicCard(front, back) {
    this.front = front;
    this.back = back;
    this.createBasic = function() {
        // appends flashcards to log.txt
        var data = {
            front: this.front,
            back: this.back,
            type: 'basic',
        };
        // append card to log.txt
        fs.appendFile('log.txt', JSON.stringify(data) + ';', 'utf8', function(err) {
            // if there's an error, log it
            if (err) {
                console.log(err);
            }
        });
    };
}