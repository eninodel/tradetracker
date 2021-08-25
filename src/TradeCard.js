import React from "react";
import ModalImage from "react-modal-image";

let localDate = new Date();
const offset = localDate.getTimezoneOffset();
localDate = new Date(localDate.getTime() - offset * 60 * 1000);

function TradeCard({
  ticker,
  dateOpened,
  dateClosed,
  PNL,
  priceFilledPerLot,
  marginBPRPerLot,
  strategy,
  expiration,
  numberOfLots,
  note,
  image,
}) {
  const renderDateClosed = () => {
    if (!dateClosed) return <button type="button">Add Close Date</button>;
    else return <p>Date Closed: {dateClosed}</p>;
  };

  const strategyObject = {
    PUTCREDITSPREAD: "Put Credit Spread",
    CALLCREDITSPREAD: "Call Credit Spread",
    IRONCONDOR: "Iron Condor",
    BUTTERFLY: "Butterfly",
    NAKEDPUT: "Naked Put",
    NAKEDCALL: "Naked Call",
    CUSTOM: "Custom",
  };

  return (
    <div className="tradeCard">
      {image !== "" && <ModalImage small={image} medium={image} />}
      {/* {image !== "" && <img src={image} alt="screenshot" />} */}
      <h2>Ticker: {ticker}</h2>
      <p>Date Opened : {dateOpened}</p>
      {renderDateClosed()}
      {PNL && <p>{PNL}</p>}
      <p>Price Filled per Lot: {priceFilledPerLot}</p>
      <p>Margin BPR per Lot: {marginBPRPerLot}</p>
      <p>Strategy: {strategyObject[strategy]}</p>
      <p>Expiration: {expiration}</p>
      <p>Number of Lots: {numberOfLots}</p>
      <p>Note: {note}</p>
    </div>
  );
}

export default TradeCard;
