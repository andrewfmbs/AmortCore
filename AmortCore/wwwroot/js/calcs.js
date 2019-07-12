function findInterestRate(amount, payment, numPay) {
    //David Cantrell method of finding interest rate   
    var log1 = Math.log(1 + (1 / numPay));
    var log2 = Math.log(2);
    var finalLog = (log1 / log2);
    var nextStep = Math.pow((1 + (payment / amount)), (1 / finalLog));
    var thirdStep = Math.pow(nextStep - 1, finalLog);
    var final = 1200 * (thirdStep - 1);
    return final;
}

function calcAPR(loanAmount, numPay, payment, costs, origRate) {
    var stockFees = 2000;
    var finalCosts = stockFees + costs;
    var finalAmount = loanAmount - finalCosts;
    var apr = findInterestRate(finalAmount, payment, numPay);
    $("#spAPRRate").html(fixVal(apr, 0, 3) + "%");
    $("#spOrigRate").html(fixVal(origRate, 0, 3) + "%");
    $("#spAPRTotal").html("$" + commaSeparateNumber(fixVal(loanAmount, 0, 0, " ")));
    $("#spAPRNumpay").html(numPay);
    if (costs == 0) {
        $("#spAPRAfford").show();
    } else {
        $("#spAPRAfford").hide();
    }
    $("#spAPRFees").html("$" + commaSeparateNumber(fixVal(finalCosts, 0, 0, " ")));
    return apr;
}

function amortLoan(amt, rate, term, optPrinPay, lumpObj, payPerYer, payReturn, numPayStart, total) {
    //lumObj needs to have prop amount and paymentNum
    //checks if param isn't null || undefined, if it is, give it a value after the ||
    optPrinPay = optPrinPay || { amt: 0, start: 1 };
    lumpObj = lumpObj || { amt: 0, start: 1 };
    payPerYer = payPerYer || 12;
    payReturn = payReturn || term;
    numPayStart = numPayStart || 1;
    total = total || 0;
    var full = [];
    var remain = Number(amt);
    var numPay = payPerYer * Number(term);
    var returnNow = (payPerYer * Number(payReturn)) - 1;
    var perRate = (rate / 100 / payPerYer);
    var payNum = numPayStart;
    var initAmt = remain;
    var payment = Number(((initAmt * perRate) / (1 - Math.pow((1 + perRate), -numPay))));
    var lOpt = 0;
    var lLump = 0;
    for (var i = 0; i < numPay; i++) {
        var int = remain * perRate;
        var prin = (payment - int);

        lOpt = (payNum >= optPrinPay.start) ? optPrinPay.amt : 0;
        lLump = (payNum == lumpObj.start) ? lumpObj.amt : 0;

        prin = prin + lOpt + lLump;
        total += prin + int;
        remain -= prin;

        var yrObj = {
            principal: prin,
            interest: int,
            payment: payment,//Math.round(prin) + Math.round(int),
            total: total,
            balance: remain,
            num: payNum
        };
        full.push(yrObj);
        payNum++;
        if (i == returnNow || remain <= 0) {
            if (remain < 0) {
                full[full.length - 1].balance = 0;
            }
            break;
        }
    }
    var returnObj = {
        amort: full,
        details: [{
            amount: amt,
            rate: rate,
            term: term,
            apr: (calcAPR(amt, numPay, payment, 0, rate)).toFixed(3),
        }]
    };
    return returnObj;
}