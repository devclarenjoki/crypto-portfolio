'use strict';
const args = require('yargs').argv;
const axios = require('axios').default;

var cryptoCompare;
var usdValues;

var getLatestValPerTokenInUSD = function () {
    return new Promise(function (resolve) {
        
        var output = [];

        var btcOutput = { "token": "BTC", "amount": 0, "timestamp": 0 };
        var ethOutput = { "token": "ETH", "amount": 0, "timestamp": 0 };
        var xrpOutput = { "token": "XRP", "amount": 0, "timestamp": 0 };

        var lineReader = require('readline').createInterface({
            input: require('fs').createReadStream('transactions.csv')
        });

        lineReader.on('line', function (line) {

            var readCSV = {};
            var columnSplit = line.split(',');

            readCSV.timestamp = columnSplit[0];
            readCSV.transaction_type = columnSplit[1];
            readCSV.token = columnSplit[2];
            readCSV.amount = columnSplit[3];

            if (readCSV.token === 'ETH') {
                if (readCSV.timestamp > ethOutput.timestamp) {
                    ethOutput.amount = readCSV.amount;
                    ethOutput.timestamp = readCSV.timestamp;
                }
            }
            else if (readCSV.token === 'BTC') {

                if (readCSV.timestamp > btcOutput.timestamp) {
                    btcOutput.amount = readCSV.amount;
                    btcOutput.timestamp = readCSV.timestamp

                }
            }
            else if (readCSV.token === 'XRP') {

                if (readCSV.timestamp > xrpOutput.timestamp) {
                    xrpOutput.amount = readCSV.amount;
                    xrpOutput.timestamp = readCSV.timestamp;
                }
            }
        }

        );
        lineReader.on('close', function (line) {

            cryptoCompare = getUSDValues();

            cryptoCompare.then(function (result) {
                usdValues = result;
                ethOutput.amount = ethOutput.amount * usdValues.ETH.USD;
                btcOutput.amount = btcOutput.amount * usdValues.ETH.USD;
                xrpOutput.amount = xrpOutput.amount * usdValues.ETH.USD;

                output.push(ethOutput);
                output.push(btcOutput);
                output.push(xrpOutput);
                resolve(output);
            }, function (err) {
                console.log(err);
            })

        });
    });
}
var getPortfolioValPerToken = function () {
    console.log("cyptoLatest-->getPortfolioValPerToken");
    console.log("Date",args.date);
    return new Promise(function (resolve) {
        
        var output = [];

        var btcOutputArr = [];
        var ethOutputArr = [];
        var xrpOutputArr = [];

        var lineReader = require('readline').createInterface({
            input: require('fs').createReadStream('transactions.csv')
        });

        lineReader.on('line', function (line) {

            var jsonFromLine = {};
            var lineSplit = line.split(',');

            jsonFromLine.timestamp = lineSplit[0];
            jsonFromLine.transaction_type = lineSplit[1];
            jsonFromLine.token = lineSplit[2];
            jsonFromLine.amount = lineSplit[3];

            //converting date from timestamp
            var d = new Date(jsonFromLine.timestamp * 1000);
            var dateFromCSV = d.getDate() + '/' + (d.getMonth()+1) + '/' + d.getFullYear();
            
                if(jsonFromLine.token === 'ETH'){
                    if(args.date === dateFromCSV){
                        ethOutputArr.push({"token":jsonFromLine.token,"amount":jsonFromLine.amount * usdValues.ETH.USD})
                    }
                } else if (jsonFromLine.token === 'BTC'){
    
                    if(args.date === dateFromCSV){
                        btcOutputArr.push({"token":jsonFromLine.token,"amount":jsonFromLine.amount * usdValues.ETH.USD})
                    }
                }
                else if (jsonFromLine.token === 'XRP'){
    
                    if(args.date === dateFromCSV){
                        xrpOutputArr.push({"token":jsonFromLine.token,"amount":jsonFromLine.amount * usdValues.ETH.USD})
                    }
                }//end
        }

        )
    ;
        lineReader.on('close', function (line) {
                output.push(ethOutputArr);
                output.push(btcOutputArr);
                output.push(xrpOutputArr);
                resolve(output);

        });
        
    });
}


const getUSDValues = () => {
    return new Promise(function (resolve) {
        axios.get('https://min-api.cryptocompare.com/data/pricemulti?fsyms=ETH,DASH&tsyms=BTC,USD,EUR&api_key=7100fee518d828ff991b92d974ad4a59e316d8bea4ba038e16adfb0e7964593c')
            .then(function (response) {
                resolve(response.data);
            })
            .catch(function (error) {
                console.log(error);
            }
            );
    }
    );
}

function getByToken(array, prop, value){
    var token = [];
    for(var i = 0; i < array.length; i++){

        var obj = array[i];

        for(var key in obj){
            if(typeof(obj[key] == "object")){
                var item = obj[key];
                if(item[prop] == value){
                    token.push(item);
                }
            }
        }

    }    

    return token;

}

// based on the type of the parameters we pass as cmd, corresponding function will be called
if(args.token === undefined && args.date === undefined){
    console.log("Given no parameters, return the latest portfolio value per token in USD");
  getLatestValPerTokenInUSD().then(function (result) { console.log(result); });
}
else if (args.token != undefined && args.date === undefined){
    console.log("Given a token, return the latest portfolio value for that token in USD");
    getLatestValPerTokenInUSD().then(function (result) { 
        var resultPerToken =  result.filter(function(record) {
            return record.token === args.token;
            })
            console.log(resultPerToken);
     });
}
else if (args.date != undefined && args.token === undefined){
    console.log("Given a date, return the portfolio value per token in USD on that date");
    cryptoCompare = getUSDValues();
    cryptoCompare.then(function (result) {
     usdValues = result;
     getPortfolioValPerToken().then(function (result) { console.log(result); });
 }, function (err) {
     console.log(err);
 })
    
}
else if (args.token != undefined && args.date != undefined){
    console.log("Given a date and a token, return the portfolio value of that token in USD on that date");
    cryptoCompare = getUSDValues();
    cryptoCompare.then(function (usdVal) {
    usdValues = usdVal;
     getPortfolioValPerToken().then(function (result) { 
         
        var resultPerToken =  getByToken(result,"token",args.token);
            console.log(resultPerToken); 
        });
 }, function (err) {
     console.log(err);
 })
}