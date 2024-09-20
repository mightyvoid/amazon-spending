import React, { useState } from "react";
import "./amazonSpend.css";
import Papa from "papaparse";
import AmazonOrderReqImg from "../images/amazonSS01.png";
import AmazonFilesImg from "../images/amazonSS02.png";

export default function AmazonSpend() {
  const [spendingCalc, setSpendingCalc] = useState({
    totalSpend: "",
    totalSpend2023: "",
    highestPurchase: "",
  });

  const changeHandler = (event) => {
    // Passing file data (event.target.files[0]) to parse using Papa.parse
    Papa.parse(event.target.files[0], {
      header: true,
      skipEmptyLines: true,
      complete: function (results) {
        let totalSpend = 0;
        results.data.forEach((item) => {
          totalSpend =
            totalSpend + parseInt(item["Total Owed"].replace(",", ""));
        });
        let totalSpend2023 = 0;
        let filterOrder2023 = results.data.filter((item) =>
          item["Order Date"].includes("2023")
        );
        filterOrder2023.forEach((item) => {
          totalSpend2023 =
            totalSpend2023 + parseInt(item["Total Owed"].replace(",", ""));
        });

        let orders = results.data;

        // Initialize variables to hold the maximum total owed and corresponding order object
        let maxTotalOwed = -Infinity;
        let orderWithMaxTotalOwed = null;

        // Iterate through the orders array
        for (let i = 0; i < orders.length; i++) {
          // Convert "Total Owed" to a number
          let totalOwed = parseInt(orders[i]["Total Owed"].replace(",", ""));

          // Check if the current order has a higher "Total Owed" value
          if (totalOwed > maxTotalOwed) {
            maxTotalOwed = totalOwed;
            orderWithMaxTotalOwed = orders[i];
          }
        }
        
        setSpendingCalc({
            totalSpend:totalSpend,
            totalSpend2023:totalSpend2023,
            highestPurchase: orderWithMaxTotalOwed?.['Product Name']
          })

        console.log(totalSpend);
        console.log(totalSpend2023);
      },
    });
  };

  return (
    <div className="container-fluid">
      <h1 className="m-5">Amazon Spending Analyser Demo</h1>
      <h6>upload the file below, refresh if unable to do so.</h6>
      <div className="row justify-content-center">
        <div className="col-lg-6">
          <input
            type="file"
            name="file"
            onChange={changeHandler}
            className="form-control"
          ></input>
        </div>
      </div>
      <div className="row  m-5 outputRow card ">
        <div className="col-lg-6">
          <h4>
            Your Total Inr Spent in Amazon is : {spendingCalc.totalSpend}{" "}
          </h4>
          <h4>
            Your Total Inr Spent in Amazon this year(2023):
            {spendingCalc.totalSpend2023}
          </h4>
          <h4>
            You paid highest for this item : {spendingCalc.highestPurchase}
          </h4>
        </div>
      </div>

      <div className="row justify-content-center m-5">
        <div className="col-lg-6">
          <h6>
            #Click on the image to go to this amazon site and request the order
            history csv.
          </h6>
          <a
            href={
              "https://www.amazon.in/hz/privacy-central/data-requests/preview.html"
            }
            target="_blank"
          >
            <img
              src={AmazonOrderReqImg}
              style={{ height: "25vh", width: "100%" }}
            ></img>
          </a>
        </div>
        <div className="col-lg-6">
          <h6>
            #Once received, upload the RetailOrderHistory file in file input.
          </h6>
          <img
            src={AmazonFilesImg}
            style={{ height: "30vh", width: "100%" }}
          ></img>
        </div>
      </div>
    </div>
  );
}
