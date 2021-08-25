/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createTrade = /* GraphQL */ `
  mutation CreateTrade(
    $input: CreateTradeInput!
    $condition: ModelTradeConditionInput
  ) {
    createTrade(input: $input, condition: $condition) {
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
export const updateTrade = /* GraphQL */ `
  mutation UpdateTrade(
    $input: UpdateTradeInput!
    $condition: ModelTradeConditionInput
  ) {
    updateTrade(input: $input, condition: $condition) {
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
export const deleteTrade = /* GraphQL */ `
  mutation DeleteTrade(
    $input: DeleteTradeInput!
    $condition: ModelTradeConditionInput
  ) {
    deleteTrade(input: $input, condition: $condition) {
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
