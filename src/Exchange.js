import React, { memo, useEffect } from "react";
import { useRef } from "react";
import { useState } from "react";
import "./Exchange.css";

function Exchange() {
  const [amount, setAmount] = useState("");
  const box = useRef();
  const [result, setResult] = useState(0);
  const [rate, setRate] = useState(0);
  const [serviceDown, setServiceDown] = useState(1);
  const [currentDate, setCurrentDate] = useState("");

  let APIurl = `https://currency-exchange-4afx.onrender.com/baeldung/exchange/inr?rate=1`;

  const calculateAndShow = (amount, rate) => {
    // console.log(typeof (amount * rate));
    let netRate = (amount * rate).toFixed(2) + "";
    if (netRate.length >= 4) {
      let val = transform(netRate);
      setResult(val);
    } else setResult(netRate);
  };

  const changeAmount = (val) => {
    // setAmount(e.target.value);

    let currentAmount = val;
    let commasRemovedVal = currentAmount.replace(/,/gi, "");
    let sytaxedVal = commasRemovedVal.split(/(?=(?:\d{3})+$)/).join(",");

    console.log("syntaxedval - " + sytaxedVal);
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
    // console.log(typeof val);
    for (let i = val.length - 1; i >= 0; i--) {
      reverseVal += val[i];
    }
    return reverseVal;
  };

  const pressedBtn = (val) => {
    console.log(`${val} is pressed`);
    val = amount + val;
    changeAmount(val);
    console.log(`val = ${val} && amount = ${amount}`);
    vibrate({ duration: 100, interval: 50, count: 1 });
  };

  const vibrate = (options = { duration: 100, interval: 100, count: 1 }) => {
    // console.log("vibrate");
    if (arguments.length !== 1) {
      // throw new Error("Expected exactly one argument.");
    }

    if (Object.prototype.toString.call(options) !== "[object Object]") {
      // throw new TypeError("Expected first argument to be an object.");
    }

    if (
      typeof options.duration !== "number" ||
      !Number.isInteger(options.duration)
    ) {
      // throw new TypeError("Expected options.duration to be an integer.");
    }

    if (
      typeof options.interval !== "number" ||
      !Number.isInteger(options.interval)
    ) {
      // throw new TypeError("Expected options.interval to be an integer.");
    }

    if (typeof options.count !== "number" || !Number.isInteger(options.count)) {
      // throw new TypeError("Expected options.count to be an integer.");
    }

    if (options.duration < 0) {
      // throw new RangeError(
      //   "Expected options.duration to be greater or equal to zero."
      // );
    }

    if (options.interval < 0) {
      // throw new RangeError(
      //   "Expected options.interval to be greater or equal to zero."
      // );
    }

    if (options.count < 0) {
      // throw new RangeError(
      //   "Expected options.count to be greater or equal to zero."
      // );
    }

    if (!window) {
      return;
    }

    if (!window.navigator) {
      return;
    }

    if (!window.navigator.vibrate) {
      return;
    }

    const pattern = [];

    for (let index = 0; index < options.count; index++) {
      pattern.push(options.duration);
      pattern.push(options.interval);
    }

    window.navigator.vibrate(pattern);
  };

  const resetValue = () => {
    const val = "";
    setAmount(val);
    setResult(0);
  };

  const reloadAPI = () => {
    fetchCurrentValue(APIurl);
  };

  const fetchCurrentValue = async (url) => {
    var myHeaders = new Headers();
    // myHeaders.append("apikey", "KzbQK4nzsiwaMv4SamcG2WGRYIsFIUud");

    // myHeaders.append(
    //   "X-RapidAPI-Key",
    //   "66d517a5b7msh47407221adc4922p1dc441jsn613e685c5fc1"
    // );
    // myHeaders.append(
    //   "X-RapidAPI-Host",
    //   "currency-converter-by-api-ninjas.p.rapidapi.com"
    // );
    // myHeaders.append("Access-Control-Allow-Origin", "*");

    var requestOptions = {
      method: "POST",
      redirect: "follow",
      headers: myHeaders,
    };

    try {
      const res = await fetch(url, requestOptions);
      if (res.ok) {
        // console.log(res.json());
        const data = await res.json();
        console.log("data ====== ", data);
        // setRate(data.usd.inr);

        if (data.Status !== "OK") {
          setRate(82.82);
          setServiceDown(1);
        } else if (data.Status == "OK") {
          console.log(
            "Got success response from api with rate as ",
            data["Calculated Rate"]
          );

          setRate(data["Calculated Rate"]);
          setServiceDown(0);
          localStorage.setItem("amount", data["Calculated Rate"]);
          console.log("local storage updated");
        }
      }
    } catch (error) {
      console.log("Exception occureed while calling rest :: ", error);
      setRate(82.82);
      setServiceDown(1);
    }
  };

  const dateSetting = () => {
    const now = new Date();
    let date = now.getDate();
    let month = now.getMonth() + 1;
    let year = now.getFullYear();

    const previousDate = new Date(year, month - 1, date - 1);
    let formattedDate =
      previousDate.getFullYear() +
      "-" +
      (previousDate.getMonth() + 1) +
      "-" +
      previousDate.getDate();

    console.log("Previous date == ", formattedDate);
    setCurrentDate(formattedDate);
    console.log("Previous date has been set successfully");

    APIurl = `http://localhost:7886/baeldung/exchange/inr?rate=500`;
  };

  useEffect(() => {
    // dateSetting();
    // console.log(APIurl);
    if (localStorage.getItem("amount") == null) {
      fetchCurrentValue(APIurl);
    } else {
      setServiceDown(0);
      setRate(JSON.parse(localStorage.getItem("amount")));
    }
    // setAmount(amount);
  }, []);

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
        <span
          className="reloadBtn-container"
          onClick={() => {
            reloadAPI();
            resetValue();
          }}
        >
          <svg
            className="reloadBtn"
            xmlns="http://www.w3.org/2000/svg"
            height="24"
            viewBox="0 0 24 24"
            width="24"
            fill="transparent"
          >
            <path d="M0 0h24v24H0z" fill="" />
            <path
              d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"
              fill="white"
            />
          </svg>
        </span>
        <p className="priceValue">$1 - &#8377;{rate}</p>
      </div>

      <div className="amountContainer">
        <input
          className="amountInput"
          type="text"
          value={amount}
          readOnly
          ref={box}
        />
        <button
          className="resetInputBtn"
          onClick={() => {
            vibrate({ duration: 100, interval: 50, count: 1 });
            resetValue();
          }}
          type="reset"
        >
          &times;
        </button>
      </div>

      <div className="result-container">
        <h1>&#8377;{result}</h1>
      </div>

      <div className="calculator">
        <button
          className="btn"
          onClick={() => {
            pressedBtn("1");
          }}
        >
          1
        </button>
        <button
          className="btn"
          onClick={() => {
            pressedBtn("2");
          }}
        >
          2
        </button>
        <button className="btn" onClick={() => pressedBtn("3")}>
          3
        </button>
        <button className="btn" onClick={() => pressedBtn("4")}>
          4
        </button>
        <button className="btn" onClick={() => pressedBtn("5")}>
          5
        </button>
        <button className="btn" onClick={() => pressedBtn("6")}>
          6
        </button>
        <button className="btn" onClick={() => pressedBtn("7")}>
          7
        </button>
        <button className="btn" onClick={() => pressedBtn("8")}>
          8
        </button>
        <button className="btn" onClick={() => pressedBtn("9")}>
          9
        </button>
        <button className="btn" onClick={() => pressedBtn("0")}>
          0
        </button>
      </div>
    </div>
  );
}

export default Exchange;
