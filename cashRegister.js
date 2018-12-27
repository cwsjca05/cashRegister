function checkCashRegister(price, cash, cid) {

  // "cid" stands for "cash in drawer"

  let change = cash-price;
  let totalCID = 0;
  let currencyArray = [["PENNY", 0.01], ["NICKEL", 0.05], ["DIME", 0.1], ["QUARTER", 0.25], ["ONE", 1], ["FIVE", 5], ["TEN", 10], ["TWENTY", 20], ["ONE HUNDRED", 100]];

  //Calculate the total amount of change in the drawer
  for (let i=0; i<9; i++){
    totalCID+=cid[i][1];
  }
  
  //If there is exactly enough to make change, just return the original cash in drawer object
  if (change===totalCID){
    return {status: "CLOSED", change: [...cid] };
  }
  
  //If there is not enough to make change, return as insufficient funds
  if (change > totalCID){
    return {status: "INSUFFICIENT_FUNDS", change: []};
  }
  
  // If there is enough to make change, but not empty the drawer, use a greedy algorithm to determine how to distribute the change from the drawer

  else {
  
    //  Create the change array as empty outside of any loops
    let changeArray = [];

    // The algorithm needs to iterate over each type of currency, but needs to stay in a currency until either all change has been given, or the register runs out of that currency.  This involves nesting a while-loop inside a for-loop; the latter checks currency types and the former checks amount of that currency

    for (let i=cid.length-1; i>=0; i--){
      
      
      while (change >= currencyArray[i][1] && cid[i][1] != 0 && change >= 0){

        // This first step is the one that caused me the most trouble.  You have to copy the values from currencyArray into a new array that you will reference later on.  If you just try to pass values straight from currencyArray into changeArray you will pass them by reference and it will be constantly overwriting itself.  Using slice() to make a copy each time through the while loop ensures only values are being passed and they are always correct

        let currencyValues = currencyArray.slice(0);
        
        // Update change and cash in drawer (cid) if money is being removed from till

        change = +((change-currencyArray[i][1]).toFixed(2));
        cid[i][1] = +((cid[i][1] - currencyArray[i][1]).toFixed(2));

        // Set the references to the name and value from the copied currencyArray

        let changeItemAmount = currencyValues[i][1];
        let changeItemName = currencyValues[i][0];

        // If this is the first time through the loop, changeArray is still empty.  Initialize it to dummy values and then overwrite them
        
          if (changeArray.length === 0){
            changeArray=[["name", 0]];
            changeArray[0][0]=changeItemName;
            changeArray[0][1]=changeItemAmount;
          }

          // If this is the second+ time through the loop on the same currency type, increment the changeArray value for that currency
          
          else if (changeArray[0][0] === currencyArray[i][0]){
            changeArray[0][1]+=changeItemAmount;
            changeArray[0][1].toFixed(2);
          }

          // If this the first time through the loop with a new currency, add the currency in by unshifting changeArray with dummy values and then overwriting them
          
          else {
            changeArray.unshift(["name", 0]);
            changeArray[0][1] += changeItemAmount;
            changeArray[0][1].toFixed(2);
            changeArray[0][0] = changeItemName;
          }
           
        }
      }
      // If you've run through the entire till and there is still change due, return insufficient funds
      if (change>0){
        return {status: "INSUFFICIENT_FUNDS", change: []};
      }

    // Because the loops need to run from greatest to least in order to be greedy, but the algorithm adds them to the beginning of changeArray in order to have a 0 index on each new addition, the result needs to be reversed so that it preserves greatest currency to least.
    
    changeArray.reverse();
    return {status: "OPEN", change: [...changeArray] };
  }
}


// Example cash-in-drawer array:
// [["PENNY", 1.01],
// ["NICKEL", 2.05],
// ["DIME", 3.1],
// ["QUARTER", 4.25],
// ["ONE", 90],
// ["FIVE", 55],
// ["TEN", 20],
// ["TWENTY", 60],
// ["ONE HUNDRED", 100]]

checkCashRegister(19.5, 20, [["PENNY", 1.01], ["NICKEL", 2.05], ["DIME", 3.1], ["QUARTER", 4.25], ["ONE", 90], ["FIVE", 55], ["TEN", 20], ["TWENTY", 60], ["ONE HUNDRED", 100]]);
