import React, { useEffect, useState } from "react";
import "./Exchange.css";

function Exchange() {
  // let APIurl =
  //   "https://api.apilayer.com/exchangerates_data/convert?to=INR&from=USD&amount=1";

  let APIurl = "https://reqres.in/api/users";

  const [amount, setAmount] = useState("");
  const [result, setResult] = useState(0);
  const [rate, setRate] = useState(0);

  const calculateAndShow = (amount, rate) => {
    console.log(typeof (amount * rate));
    let netRate = (amount * rate).toFixed(2) + "";
    if (netRate.length >= 4) {
      let val = transform(netRate);
      setResult(val);
    } else setResult(netRate);
  };

  const changeAmount = (e) => {
    setAmount(e.target.value);

    let currentAmount = e.target.value;
    let commasRemovedVal = currentAmount.replace(/,/gi, "");
    let sytaxedVal = commasRemovedVal.split(/(?=(?:\d{3})+$)/).join(",");

    console.log(sytaxedVal);
    setAmount(sytaxedVal);

    calculateAndShow(commasRemovedVal, rate);
  };

  const transform = (val) => {
    let correctedVal = val.substring(0, val.length - 3);
    let split = val.split(".");

    //reversing amount
    let reverseVal = reversefcn(correctedVal);
    let notationedAppliedVal = applyingCommas(reverseVal);
    console.log(notationedAppliedVal);
    reverseVal = reversefcn(notationedAppliedVal);
    return reverseVal + "." + split[1];
  };

  const applyingCommas = (val) => {
    let newVal = "";
    let flag = 0;
    for (let i = 0; i < val.length; i++) {
      if (flag !== 1 && (i + 1) % 3 === 0 && i + 1 !== val.length) {
        newVal += val[i] + ",";
        flag = 1;
      } else if (flag === 1 && i % 2 === 0 && i + 1 !== val.length) {
        newVal += val[i] + ",";
      } else {
        newVal += val[i];
      }
    }

    return newVal;
  };

  const reversefcn = (val) => {
    let reverseVal = "";
    val += "";
    console.log(typeof val);
    for (let i = val.length - 1; i >= 0; i--) {
      reverseVal += val[i];
    }
    return reverseVal;
  };

  const fetchCurrentValue = async (url) => {
    var myHeaders = new Headers();
    myHeaders.append("apikey", "KzbQK4nzsiwaMv4SamcG2WGRYIsFIUud");

    var requestOptions = {
      method: "GET",
      redirect: "follow",
      headers: myHeaders,
    };

    let response = "";

    try {
      const res = await fetch(url, requestOptions);
      const data = await res.json();
      setRate(data.info.rate.toFixed(2));
    } catch (error) {
      setRate(82.82);
      console.log(error);
    }

    //  console.log(response.info.rate);
  };

  useEffect(() => {
    fetchCurrentValue(APIurl);
  }, []);

  return (
    <div className="main-container">
      <div className="header">
        <h2>Currency Rate</h2>
        <p> $1 - &#8377; {rate} INR</p>
      </div>

      <div className="amountContainer">
        <input
          className="amountInput"
          type="text"
          value={amount}
          onChange={changeAmount}
        />
      </div>

      <div className="result-cotainer">
        <h1>&#8377;{result}</h1>
      </div>
    </div>
  );
}

export default Exchange;
