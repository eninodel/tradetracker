import React from "react";
import { useState } from "react";
import { API, Storage } from "aws-amplify";
import { createTrade } from "./graphql/mutations";
import { useHistory } from "react-router-dom";
import Form from "react-bootstrap/Form";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Button from "react-bootstrap/Button";

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
  strategy: "",
  expiration: "",
  numberOfLots: 1,
  note: "",
  image: "",
};

function CreateTrade() {
  let history = useHistory();
  const [formData, setFormData] = useState(intitialState);
  const [tradeClosed, setTradeClosed] = useState(false);
  const [validated, setValidated] = useState(false);

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
    const form = e.currentTarget;
    if (form.checkValidity() === false || formData.strategy === "") {
      setValidated(true);
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    if (
      !formData.ticker ||
      !formData.priceFilledPerLot ||
      !formData.marginBPRPerLot ||
      !formData.strategy ||
      !formData.expiration
    )
      return;
    e.preventDefault();
    await API.graphql({ query: createTrade, variables: { input: formData } });
    history.push("/");
  };

  return (
    <Form onSubmit={submitTrade} noValidate validated={validated}>
      <Form.Group className="form-group">
        <FloatingLabel label="Enter ticker">
          <Form.Control
            required
            placeholder="Enter ticker"
            value={formData.ticker}
            onChange={(e) => updateForm("ticker", e.target.value)}
          ></Form.Control>
        </FloatingLabel>
        <Form.Label>Enter date opened</Form.Label>
        <Form.Control
          required
          as="input"
          type="date"
          placeholder="date opend"
          value={formData.dateOpened}
          onChange={(e) => updateForm("dateOpened", e.target.value)}
        ></Form.Control>
        <Form.Check
          type="switch"
          label="Trade Closed?"
          value={tradeClosed}
          onChange={() => setTradeClosed(!tradeClosed)}
        />
        {tradeClosed && (
          <>
            <Form.Label>Enter date closed</Form.Label>
            <Form.Control
              as="input"
              type="date"
              value={formData.dateClosed}
              onChange={(e) => updateForm("dateClosed", e.target.value)}
            ></Form.Control>
            <FloatingLabel label="PNL">
              <Form.Control
                as="input"
                type="number"
                step="0.01"
                value={formData.PNL}
                placeholder="pnl"
                onChange={(e) => updateForm("PNL", e.target.value)}
              ></Form.Control>
            </FloatingLabel>
          </>
        )}
        <FloatingLabel label="Price Filled/Lot">
          <Form.Control
            required
            as="input"
            type="number"
            step="0.01"
            placeholder="pricefilled"
            value={formData.priceFilledPerLot}
            onChange={(e) => updateForm("priceFilledPerLot", e.target.value)}
          ></Form.Control>
        </FloatingLabel>
        <FloatingLabel label="Margin BPR/Lot">
          <Form.Control
            required
            as="input"
            type="number"
            step="0.01"
            placeholder="Margin"
            value={formData.marginBPRPerLot}
            onChange={(e) => updateForm("marginBPRPerLot", e.target.value)}
          ></Form.Control>
        </FloatingLabel>

        <Form.Select
          required
          value={formData.strategy}
          onChange={(e) => updateForm("strategy", e.target.value)}
        >
          <option>Select a Strategy</option>
          <option value="PUTCREDITSPREAD">Put Credit Spread</option>
          <option value="CALLCREDITSPREAD">Call Credit Spread</option>
          <option value="IRONCONDOR">Iron Condor</option>
          <option value="BUTTERFLY">Butterfly</option>
          <option value="NAKEDPUT">Naked Put</option>
          <option value="NAKEDCALL">Naked Call</option>
          <option value="CUSTOM">Custom</option>
        </Form.Select>
        <Form.Label>Enter Expiration</Form.Label>
        <Form.Control
          required
          as="input"
          type="date"
          placeholder="expiration"
          value={formData.expiration}
          onChange={(e) => updateForm("expiration", e.target.value)}
        ></Form.Control>
        <FloatingLabel label="Number of Lots">
          <Form.Control
            required
            as="input"
            type="number"
            step="1"
            placeholder="Lots"
            value={formData.numberOfLots}
            onChange={(e) => updateForm("numberOfLots", e.target.value)}
          ></Form.Control>
        </FloatingLabel>
        <FloatingLabel label="Note">
          <Form.Control
            as="textarea"
            placeholder="note"
            value={formData.note}
            onChange={(e) => updateForm("note", e.target.value)}
            style={{ height: "200px" }}
          ></Form.Control>
        </FloatingLabel>
        <Form.Label>Add Screenshot</Form.Label>
        <Form.Control
          type="file"
          onChange={(e) => updateImage(e)}
        ></Form.Control>
        <Button type="submit" onClick={submitTrade}>
          Create Trade
        </Button>
      </Form.Group>
    </Form>
  );
}

export default CreateTrade;
