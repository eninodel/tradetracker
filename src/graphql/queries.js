/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getTrade = /* GraphQL */ `
  query GetTrade($id: ID!) {
    getTrade(id: $id) {
      id
      ticker
      dateOpened
      dateClosed
      PNL
      priceFilledPerLot
      marginBPRPerLot
      strategy
      expiration
      numberOfLots
      note
      image
      createdAt
      updatedAt
    }
  }
`;
export const listTrades = /* GraphQL */ `
  query ListTrades(
    $filter: ModelTradeFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listTrades(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        ticker
        dateOpened
        dateClosed
        PNL
        priceFilledPerLot
        marginBPRPerLot
        strategy
        expiration
        numberOfLots
        note
        image
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
