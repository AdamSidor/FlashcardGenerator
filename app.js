// require basic flashcard module
var BasicFlashcard = require('./basic-cards.js');
// require cloze flashcard module
var ClozeFlashcard = require('./cloze-cards.js');
// require inquirer for getting user input at command line
var inquirer = require('inquirer');
// require fs
var fs = require('fs');

//initial user choice
inquirer.prompt([{
    name: 'command',
    message: 'Add cards or view them?',
    type: 'list',
    choices: [{
        name: 'add-flashcard'
    }, {
        name: 'show-cards'
    }]
}]).then(function(answer) {
    if (answer.command === 'add-flashcard') {
        addCard();
    } else if (answer.command === 'show-cards') {
        showCards();
    }
});

var addCard = function() {
    // gets card choice
    inquirer.prompt([{
        name: 'cardType',
        message: 'Are you making a basic or cloze flashcard?',
        type: 'list',
        choices: [{
            name: 'basic-flashcard'
        }, {
            name: 'cloze-flashcard'
        }]
    }]).then(function(answer) {
        if (answer.cardType === 'basic-flashcard') {
            inquirer.prompt([{
                name: 'front',
                message: 'What is the question?',
                validate: function(input) {
                    if (input === '') {
                        console.log('enter question text');
                        return false;
                    } else {
                        return true;
                    }
                }
            }, {
                name: 'back',
                message: 'What is the answer?',
                validate: function(input) {
                    if (input === '') {
                        console.log('enter answer text');
                        return false;
                    } else {
                        return true;
                    }
                }
            }]).then(function(answer) {
                var newBasic = new BasicFlashcard(answer.front, answer.back);
                newBasic.create();
                nextChoice();
            });
        } else if (answer.cardType === 'cloze-flashcard') {
            inquirer.prompt([{
                name: 'text',
                message: 'What is the question text?',
                validate: function(input) {
                    if (input === '') {
                        console.log('enter question text');
                        return false;
                    } else {
                        return true;
                    }
                }
            }, {
                name: 'cloze',
                message: 'What is the cloze text?',
                validate: function(input) {
                    if (input === '') {
                        console.log('Enter the fill in the blank');
                        return false;
                    } else {
                        return true;
                    }
                }
            }]).then(function(answer) {
                var text = answer.text;
                var cloze = answer.cloze;
                if (text.includes(cloze)) {
                    var newCloze = new ClozeFlashcard(text, cloze);
                    newCloze.create();
                    nextChoice();
                } else {
                    console.log('The fill in the blank text is wrong');
                    addCard();
                }
            });
        }
    });
};

var nextChoice = function() {
    // next choice from user
    inquirer.prompt([{
        name: 'nextAction',
        message: 'Are you making a basic or cloze flashcard, viewing your cards, or trying to exit?',
        type: 'list',
        choices: [{
            name: 'create-new-card'
        }, {
            name: 'show-all-cards'
        }, {
            name: 'exit'
        }]
    }]).then(function(answer) {
        if (answer.nextAction === 'create-new-card') {
            addCard();
        } else if (answer.nextAction === 'show-all-cards') {
            showCards();
        } else if (answer.nextAction === 'exit') {
            return;
        }
    });
};

var showCards = function() {
    // read the log.txt file
    fs.readFile('./log.txt', 'utf8', function(error, data) {
        //logs the error
        if (error) {
            console.log('Error occurred: ' + error);
        }
        var questions = data.split(';');
        var notBlank = function(value) {
            return value;
        };
        questions = questions.filter(notBlank);
        var count = 0;
        showQuestion(questions, count);
    });
};

//shows the question from the text file
var showQuestion = function(array, index) {
    question = array[index];
    //goes through the text file
    var parsedQuestion = JSON.parse(question);
    var questionText;
    var correctReponse;
    if (parsedQuestion.type === 'basic') {
        questionText = parsedQuestion.front;
        correctReponse = parsedQuestion.back;
    } else if (parsedQuestion.type === 'cloze') {
        questionText = parsedQuestion.clozeDeleted;
        correctReponse = parsedQuestion.cloze;
    }
    inquirer.prompt([{
        name: 'response',
        message: questionText
    }]).then(function(answer) {
        if (answer.response === correctReponse) {
            console.log('Your answer was correct');
            if (index < array.length - 1) {
              showQuestion(array, index + 1);
            }
        } else {
            console.log('Your answer was in correct');
            if (index < array.length - 1) {
              showQuestion(array, index + 1);
            }
        }
    });
};