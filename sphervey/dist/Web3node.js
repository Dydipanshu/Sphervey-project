const Web3 = require('web3');
const express = require('express');
const app = express();

// connect to local blockchain node
const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));

// define survey contract ABI and address
const surveyABI = [{
        "constant": false,
        "inputs": [{ "name": "_answer", "type": "string" }],
        "name": "submitAnswer",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "getQuestion",
        "outputs": [{ "name": "", "type": "string" }],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    }
];
const surveyAddress = '0x1234567890123456789012345678901234567890';

// create contract instance
const surveyContract = new web3.eth.Contract(surveyABI, surveyAddress);

// handle form submission
app.post('/submit', (req, res) => {
  const answer = req.body.answer; // get answer from request body
  surveyContract.methods.submitAnswer(answer).send({ from: web3.eth.accounts[0] }); // submit answer to the blockchain
  res.send('Thank you for your response!');
});

// serve survey form
app.get('/', (req, res) => {
  surveyContract.methods.getQuestion().call().then(question => {
    res.send(`
      <form action="/submit" method="post">
        <label>${question}</label><br>
        <input type="text" name="answer"><br>
        <button type="submit">Submit</button>
      </form>
    `);
  });
});

app.listen(3000, () => console.log('Survey website listening on port 3000!'));

