import React, { useState, useEffect } from "react";
import { API, Storage } from "aws-amplify";
import { listTrades } from "./graphql/queries";
import TradeCard from "./TradeCard";
import { useHistory } from "react-router-dom";
import uuid from "react-uuid";

function HomePage() {
  let history = useHistory();
  const [trades, setTrades] = useState([]);

  useEffect(() => {
    getTrades();
  }, []);

  const getTrades = async () => {
    const response = await API.graphql({ query: listTrades });
    if (!response.data.listTrades.items) return;
    const tradesFromAPI = response.data.listTrades.items;
    await Promise.all(
      tradesFromAPI.map(async (trade) => {
        if (trade.image) {
          const file = await Storage.get(trade.image);
          trade.image = file;
        }
      })
    );
    response.data.listTrades.items.sort((a, b) => {
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
    setTrades(response.data.listTrades.items);
  };

  return (
    <div className="homepage">
      <nav>
        <button type="button" onClick={() => history.push("/createtrade")}>
          Create a New Trade
        </button>
      </nav>
      <div className="displaytrades">
        {trades.map((trade) => {
          return (
            <TradeCard
              {...trade}
              trades={trades}
              setTrades={setTrades}
              key={uuid()}
            />
          );
        })}
      </div>
    </div>
  );
}

export default HomePage;
