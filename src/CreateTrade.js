import React from "react";
import { useState } from "react";
import { API, Storage } from "aws-amplify";
import { createTrade } from "./graphql/mutations";
import { useHistory } from "react-router-dom";

let localDate = new Date();
const offset = localDate.getTimezoneOffset();
localDate = new Date(localDate.getTime() - offset * 60 * 1000);

const intitialState = {
  ticker: "",
  dateOpened: localDate.toISOString().split("T")[0],
  dateClosed: undefined,
  PNL: undefined,
  priceFilledPerLot: "",
  marginBPRPerLot: "",
  strategy: "PUTCREDITSPREAD",
  expiration: "",
  numberOfLots: 1,
  note: "",
  image: "",
};

function CreateTrade() {
  let history = useHistory();
  const [formData, setFormData] = useState(intitialState);

  const updateImage = async (e) => {
    if (!e.target.files[0]) return;
    const file = e.target.files[0];
    setFormData({ ...formData, image: file.name });
    await Storage.put(file.name, file);
  };

  const updateForm = (key, value) => {
    const newData = { ...formData };
    newData[key] = value;
    setFormData(newData);
  };

  const submitTrade = async (e) => {
    e.preventDefault();
    if (
      !formData.ticker ||
      !formData.priceFilledPerLot ||
      !formData.marginBPRPerLot ||
      !formData.strategy ||
      !formData.expiration
    )
      return;
    await API.graphql({ query: createTrade, variables: { input: formData } });
    history.push("/");
  };

  return (
    <form action="submit">
      <input
        type="text"
        name="Ticker"
        placeholder="Add Ticker Here"
        required="required"
        value={formData.ticker}
        onChange={(e) => updateForm("ticker", e.target.value)}
      />
      <label htmlFor="dateOpened">Date Opened</label>
      <input
        type="date"
        name="dateOpened"
        id="dataOpened"
        required="required"
        value={formData.dateOpened}
        onChange={(e) => updateForm("dateOpened", e.target.value)}
      />
      <label htmlFor="dateClosed">Date Closed</label>
      <input
        type="date"
        name="dateClosed"
        id="dataClosed"
        value={formData.dateClosed}
        onChange={(e) => updateForm("dateClosed", e.target.value)}
      />
      <input
        type="text"
        name="pnl"
        id="pnl"
        placeholder="PNL"
        value={formData.PNL}
        onChange={(e) => updateForm("PNL", e.target.value)}
      />
      <input
        type="number"
        step="0.01"
        min="0.01"
        name="priceFilledPerLot"
        id="priceFilledPerLot"
        placeholder="Price Filled Per Lot"
        required="required"
        value={formData.priceFilledPerLot}
        onChange={(e) => updateForm("priceFilledPerLot", e.target.value)}
      />
      <input
        type="number"
        step="0.01"
        min="0.01"
        name="marginBPRPerLot"
        id="marginBPRPerLot"
        placeholder="Margin BPR/Lot"
        required="required"
        value={formData.marginBPRPerLot}
        onChange={(e) => updateForm("marginBPRPerLot", e.target.value)}
      />
      <select
        name="strategy"
        id="strategy"
        required="required"
        onChange={(e) => updateForm("strategy", e.target.value)}
      >
        <option value="PUTCREDITSPREAD">Put Credit Spread</option>
        <option value="CALLCREDITSPREAD">Call Credit Spread</option>
        <option value="IRONCONDOR">Iron Condor</option>
        <option value="BUTTERFLY">Butterfly</option>
        <option value="NAKEDPUT">Naked Put</option>
        <option value="NAKEDCALL">Naked Call</option>
        <option value="CUSTOM">Custom</option>
      </select>
      <label htmlFor="expiration">Expiration</label>
      <input
        type="date"
        name="expiration"
        id="expiration"
        required="required"
        value={formData.expiration}
        onChange={(e) => updateForm("expiration", e.target.value)}
      />
      <input
        type="number"
        name="numberOfLots"
        id="numberOfLots"
        min="1"
        required="required"
        value={formData.numberOfLots}
        onChange={(e) => updateForm("numberOfLots", e.target.value)}
      />
      <input
        type="text"
        name="note"
        id="note"
        placeholder="Note"
        value={formData.note}
        onChange={(e) => updateForm("note", e.target.value)}
      />
      <input
        type="file"
        name="image"
        id="image"
        placeholder="Upload an Image"
        onChange={updateImage}
      />
      <button type="submit" onClick={submitTrade}>
        Submit
      </button>
    </form>
  );
}

export default CreateTrade;
