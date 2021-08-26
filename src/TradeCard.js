import React from "react";
import { useState } from "react";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import ListGroupItem from "react-bootstrap/ListGroupItem";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Form from "react-bootstrap/Form";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import * as mutations from "./graphql/mutations";
import { API } from "aws-amplify";

let localDate = new Date();
const offset = localDate.getTimezoneOffset();
localDate = new Date(localDate.getTime() - offset * 60 * 1000);

function TradeCard({
  id,
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
  trades,
  setTrades,
}) {
  const [clickedDelete, setClickedDelete] = useState(false);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ dateClosed, PNL, note });

  const updateForm = (key, value) => {
    const newData = { ...formData };
    newData[key] = value;
    setFormData(newData);
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

  function shallowEqual(object1, object2) {
    const keys1 = Object.keys(object1);
    const keys2 = Object.keys(object2);

    if (keys1.length !== keys2.length) {
      return false;
    }

    for (let key of keys1) {
      if (object1[key] !== object2[key]) {
        return false;
      }
    }

    return true;
  }

  const updateTrade = async () => {
    if (shallowEqual({ dateClosed, PNL, note }, formData)) return;
    API.graphql({
      query: mutations.updateTrade,
      variables: { input: { ...formData, id } },
    });
    const currentTrade = trades.find((value) => {
      return value.id === id;
    });
    const index = trades.indexOf(currentTrade);
    const updatedTrade = { ...currentTrade, ...formData };
    trades[index] = updatedTrade;
    setTrades([...trades]);
    setEditing(false);
  };

  const handleDelete = async () => {
    API.graphql({
      query: mutations.deleteTrade,
      variables: { input: { id } },
    });
    trades.splice(
      trades.indexOf(
        trades.find((value) => {
          return value.id === id;
        })
      ),
      1
    );
    setTrades([...trades]);
  };

  const renderFooterButtons = () => {
    if (editing) {
      return (
        <>
          <Button variant="primary" onClick={() => setEditing(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={() => updateTrade()}>
            Save
          </Button>
        </>
      );
    }
    if (clickedDelete) {
      return (
        <>
          <Button variant="primary" onClick={() => setClickedDelete(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </>
      );
    } else {
      return (
        <>
          <Button variant="primary" onClick={() => setClickedDelete(true)}>
            Delete
          </Button>
          <Button variant="primary" onClick={() => setEditing(true)}>
            Edit
          </Button>
        </>
      );
    }
  };

  const editingCardBody = () => {
    return (
      <>
        {!dateClosed && (
          <>
            <Form.Label>Enter date closed</Form.Label>
            <Form.Control
              as="input"
              type="date"
              value={formData.dateClosed || undefined}
              onChange={(e) => updateForm("dateClosed", e.target.value)}
            ></Form.Control>
          </>
        )}
        {!PNL && (
          <FloatingLabel label="PNL">
            <Form.Control
              as="input"
              type="number"
              step="0.01"
              value={formData.PNL || undefined}
              placeholder="pnl"
              onChange={(e) => updateForm("PNL", e.target.value)}
            ></Form.Control>
          </FloatingLabel>
        )}
        <FloatingLabel label="Note">
          <Form.Control
            as="textarea"
            placeholder="note"
            value={formData.note}
            onChange={(e) => updateForm("note", e.target.value)}
            style={{ height: "200px" }}
          ></Form.Control>
        </FloatingLabel>
      </>
    );
  };

  const mainCardBody = () => {
    return (
      <>
        <Card.Title>${ticker}</Card.Title>
        <ListGroup>
          <ListGroupItem>Date Opened: {dateOpened}</ListGroupItem>
          {dateClosed && (
            <ListGroupItem>Date Closed: {dateClosed}</ListGroupItem>
          )}
          {PNL && <ListGroupItem>PNL: ${PNL}</ListGroupItem>}
          <ListGroupItem>Price Filled/Lot: ${priceFilledPerLot}</ListGroupItem>
          <ListGroupItem>Margin BPR/Lot: ${marginBPRPerLot}</ListGroupItem>
          <ListGroupItem>Strategy: {strategyObject[strategy]}</ListGroupItem>
          <ListGroupItem>
            Expiration: {expiration} (
            {Math.round(
              (new Date(expiration).getTime() - localDate.getTime()) /
                (24 * 60 * 60 * 1000)
            )}{" "}
            days away)
          </ListGroupItem>
          <ListGroupItem>Number of Lots: {numberOfLots}</ListGroupItem>
          {note && <ListGroupItem>Note: {note}</ListGroupItem>}
        </ListGroup>
      </>
    );
  };

  return (
    <Card className="shadow">
      {image !== "" && <Card.Img varient="top" src={image} />}
      <Card.Body>{editing ? editingCardBody() : mainCardBody()}</Card.Body>
      <Card.Footer>
        <ButtonGroup>{renderFooterButtons()}</ButtonGroup>
      </Card.Footer>
    </Card>
  );
}

export default TradeCard;
