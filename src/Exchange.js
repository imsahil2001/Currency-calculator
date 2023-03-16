import React, { useEffect, useState } from "react";
import "./Exchange.css";

function Exchange() {
  let APIurl =
    "https://currency-converter-by-api-ninjas.p.rapidapi.com/v1/convertcurrency?have=USD&want=INR&amount=1";

  // let APIurl = "https://reqres.in/api/users";

  const [amount, setAmount] = useState("");
  const [result, setResult] = useState(0);
  const [rate, setRate] = useState(0);
  const [serviceDown, setServiceDown] = useState(1);

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
    // myHeaders.append("apikey", "KzbQK4nzsiwaMv4SamcG2WGRYIsFIUud");

    myHeaders.append(
      "X-RapidAPI-Key",
      "66d517a5b7msh47407221adc4922p1dc441jsn613e685c5fc1"
    );
    myHeaders.append(
      "X-RapidAPI-Host",
      "currency-converter-by-api-ninjas.p.rapidapi.com"
    );
    myHeaders.append("Access-Control-Allow-Origin", "*");

    var requestOptions = {
      method: "GET",
      redirect: "follow",
      headers: myHeaders,
    };

    try {
      const res = await fetch(url, requestOptions);
      if (res.ok) {
        const data = await res.json();
        console.log(data);
        setRate(data.new_amount);
        setServiceDown(0);
      }
    } catch (error) {
      setRate(82.82);
      setServiceDown(1);
      console.log(error);
    }

    //  console.log(response.info.rate);
  };

  useEffect(() => {
    fetchCurrentValue(APIurl);
  }, [APIurl]);

  return (
    <div className="main-container">
      <div className="header">
        <h2>
          Currency Rate
          {serviceDown === 1 ? (
            <img
              className="serviceDownImg"
              src="/images/down arrow 2.png"
              alt="service Down arrow"
            />
          ) : (
            ""
          )}
        </h2>
        <p className="priceValue">$1 - &#8377;{rate}</p>
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
