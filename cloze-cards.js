// require fs
var fs = require('fs');

//export cloze
module.exports = clozeCard;

// constructor for cloze flashcards 
function clozeCard(text, cloze) {
    this.text = text;
    this.cloze = cloze;
    this.clozeDeleted = this.text.replace(this.cloze, '___');
    this.create = function() {
    	// appends flashcards to log.txt
        var data = {
            text: this.text,
            cloze: this.cloze,
            clozeDeleted: this.clozeDeleted,
            type: "cloze"
        };
        // add card to log.txt
        fs.appendFile("log.txt", JSON.stringify(data) + ';', "utf8", function(error) {
            // if there's an error, log it
            if (err) {
                console.log(err);
            }
        });
    };
}
