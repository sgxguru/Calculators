var totalIntToDate = 0;
var RemainingPrincipal;
var totalIntOrigionalLoan = 0;
var overlayResults1 = "";
var overlayResults2 = "";
function overlay() {
    var results = "";
    if (overlayResults1) {
        results += overlayResults1;
    }
    if (overlayResults2) {
        results += overlayResults2;
    }
    document.getElementById("overlayResults").innerHTML = results;
}
function copyAmt() {
    if (RemainingPrincipal) {
        document.getElementById("principal2").value = RemainingPrincipal.toFixed(2);
    }
}
function getValues() {
    //button click gets values from inputs
    var balance = parseFloat(document.getElementById("principal").value);
    var interestRate =
        parseFloat(document.getElementById("interest").value / 100.0);
    var terms = parseInt(document.getElementById("terms").value);
    var numPayments = parseInt(document.getElementById("paid").value);
    if (!numPayments) {
        numPayments = 0;
    }
    //set the div string
    var div = document.getElementById("Result");

    //in case of a re-calc, clear out the div!
    div.innerHTML = "";

    //validate inputs - display error if invalid, otherwise, display table
    var balVal = validateInputs(balance);
    var intrVal = validateInputs(interestRate);
    var termVal = validateInputs(terms);
    var numPay = validateInputs(numPayments);

    if (balVal && intrVal && termVal) {
        //Returns div string if inputs are valid
        div.innerHTML += amort(balance, interestRate, terms, true, numPayments);
        overlay();
    }
    else {
        //returns error if inputs are invalid
        div.innerHTML += "Please Check your inputs and retry - invalid values.";
    }
}
function getValues2() {
    //button click gets values from inputs
    var balance = parseFloat(document.getElementById("principal2").value);
    var interestRate =
        parseFloat(document.getElementById("interest2").value / 100.0);
    var terms = parseInt(document.getElementById("terms2").value);

    //set the div string
    var div = document.getElementById("Result2");

    //in case of a re-calc, clear out the div!
    div.innerHTML = "";

    //validate inputs - display error if invalid, otherwise, display table
    var balVal = validateInputs(balance);
    var intrVal = validateInputs(interestRate);
    var termVal = validateInputs(terms);

    if (balVal && intrVal && termVal) {
        //Returns div string if inputs are valid
        div.innerHTML += amort(balance, interestRate, terms, false, null);
        overlay();
    }
    else {
        //returns error if inputs are invalid
        div.innerHTML += "Please Check your inputs and retry - invalid values.";
    }
}
/**
 * Amort function:
 * Calculates the necessary elements of the loan using the supplied user input
 * and then displays each months updated amortization schedule on the page
*/
function amort(balance, interestRate, terms, origional, numPayments) {
    if (origional) {
        totalIntToDate = 0;
    }
    //Calculate the per month interest rate
    var monthlyRate = interestRate / 12;

    //Calculate the payment
    var payment = balance * (monthlyRate / (1 - Math.pow(
        1 + monthlyRate, -terms)));
    var totalInt = (payment * terms) - balance;
    //begin building the return string for the display of the amort table
    var result = "Loan amount: $" + formatMoney(balance) + "<br />" +
        "Interest rate: " + (interestRate * 100).toFixed(2) + "%<br />" +
        "Number of months: " + terms + "<br />" +
        "Monthly payment: $" + formatMoney(payment) + "<br />" +
        "Total Int Paid $" + formatMoney(totalInt) + "<br />"+
        "Total paid: $" + formatMoney(payment * terms) + "<br /><br />";

    //add header row for table to return string
    result += "<table border='1'><tr><th>Month #</th><th>Balance</th>" +
        "<th>Interest</th><th>Principal</th>";
    if (!numPayments) {
        RemainingPrincipal = balance;
    }
    /**
     * Loop that calculates the monthly Loan amortization amounts then adds 
     * them to the return string 
     */
    for (var count = 0; count < terms; ++count) {
        //in-loop interest amount holder
        var interest = 0;

        //in-loop monthly principal amount holder
        var monthlyPrincipal = 0;

        //start a new table row on each loop iteration
        result += "<tr align=center>";

        //display the month number in col 1 using the loop count variable
        result += "<td>" + (count + 1) + "</td>";


        //code for displaying in loop balance
        result += "<td> $" + formatMoney(balance) + "</td>";

        //calc the in-loop interest amount and display
        interest = balance * monthlyRate;
        result += "<td> $" + formatMoney(interest) + "</td>";

        //calc the in-loop monthly principal and display
        monthlyPrincipal = payment - interest;
        result += "<td> $" + formatMoney(monthlyPrincipal) + "</td>";

        //end the table row on each iteration of the loop	
        result += "</tr>";

        //update the balance for each loop iteration
        balance = balance - monthlyPrincipal;

        if (origional && count < numPayments) {
            totalIntToDate += interest;
            RemainingPrincipal = balance;
            console.log(totalIntToDate);
            console.log(RemainingPrincipal);
        }
    }

    //Final piece added to return string before returning it - closes the table
    result += "</table>";
    var result2="";
    if (origional) {
        result2 += "Total Int paid origional loan: $" + formatMoney(totalIntToDate) + "<br /><br />";
        result2 += "Remaining Principal original loan: $" + formatMoney(RemainingPrincipal) + "&nbsp;&nbsp;<button id='copy' class='button' onclick='copyAmt()'>Copy</button><br /><br />";
        result2 += "Remaining Interest original loan: $" + formatMoney((totalInt - totalIntToDate)) + "<br /><br />";
        overlayResults1 = result2;
        totalIntOrigionalLoan = totalInt;
    } else {
        result2 += "Total overall paid: $" + formatMoney(totalIntToDate + totalInt) + "<br /><br />";
        var savings = (totalIntOrigionalLoan - (totalIntToDate + totalInt));
        if (savings > 0) {
            result2 += "<div style='color:#006400;font-weight:700'>";
        } else {
            result2 += "<div style='color:red;font-weight:700'>";
        }
        result2 += "Savings: $" + formatMoney(savings) + "<br /><br />";
        result2 += "</div>";
        overlayResults2 = result2;
    }
    //returns the concatenated string to the page
    return result;
}

regExpEscape = function (s) { //escapes user input
    return String(s).replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g, '\\$1').
        replace(/\x08/g, '\\x08');
};
function validateInputs(value) {
    //var numbers = /^[0-9]+$/;
    var numbers = /[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)/;
    console.log(value);
    //some code here to validate inputs
    if ((value == null) || (value == "")) {
        return false;
    }
    else if (!numbers.test(value)) {
        console.log("failed");
        return false;
    }
    else {
        return true;
    }
}
function formatMoney(n, c, d, t) {
    var c = isNaN(c = Math.abs(c)) ? 2 : c,
        d = d == undefined ? "." : d,
        t = t == undefined ? "," : t,
        s = n < 0 ? "-" : "",
        i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c))),
        j = (j = i.length) > 3 ? j % 3 : 0;

    return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
};
