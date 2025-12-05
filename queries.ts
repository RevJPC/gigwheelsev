/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "./API";
type GeneratedQuery<InputType, OutputType> = string & {
  __generatedQueryInput: InputType;
  __generatedQueryOutput: OutputType;
};

export const getReservation = /* GraphQL */ `query GetReservation($id: ID!) {
  getReservation(id: $id) {
    createdAt
    endTime
    id
    owner
    startTime
    status
    totalPrice
    updatedAt
    userId
    vehicle {
      batteryLevel
      color
      createdAt
      firmwareVersion
      id
      imageUrl
      lastSyncedAt
      licensePlate
      locationLat
      locationLng
      make
      model
      odometer
      pricePerDay
      range
      status
      updatedAt
      vin
      year
      __typename
    }
    vehicleId
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetReservationQueryVariables,
  APITypes.GetReservationQuery
>;
export const getTeslaIntegration = /* GraphQL */ `query GetTeslaIntegration($id: ID!) {
  getTeslaIntegration(id: $id) {
    accessToken
    createdAt
    expiresIn
    id
    refreshToken
    tokenType
    updatedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetTeslaIntegrationQueryVariables,
  APITypes.GetTeslaIntegrationQuery
>;
export const getUserProfile = /* GraphQL */ `query GetUserProfile($id: ID!) {
  getUserProfile(id: $id) {
    createdAt
    email
    id
    name
    profilePictureUrl
    role
    status
    updatedAt
    userId
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetUserProfileQueryVariables,
  APITypes.GetUserProfileQuery
>;
export const getVehicle = /* GraphQL */ `query GetVehicle($id: ID!) {
  getVehicle(id: $id) {
    batteryLevel
    color
    createdAt
    firmwareVersion
    id
    imageUrl
    images {
      nextToken
      __typename
    }
    lastSyncedAt
    licensePlate
    locationLat
    locationLng
    make
    model
    odometer
    pricePerDay
    range
    reservations {
      nextToken
      __typename
    }
    status
    updatedAt
    vin
    year
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetVehicleQueryVariables,
  APITypes.GetVehicleQuery
>;
export const getVehicleImage = /* GraphQL */ `query GetVehicleImage($id: ID!) {
  getVehicleImage(id: $id) {
    caption
    createdAt
    id
    imageUrl
    isPrimary
    order
    updatedAt
    vehicle {
      batteryLevel
      color
      createdAt
      firmwareVersion
      id
      imageUrl
      lastSyncedAt
      licensePlate
      locationLat
      locationLng
      make
      model
      odometer
      pricePerDay
      range
      status
      updatedAt
      vin
      year
      __typename
    }
    vehicleId
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetVehicleImageQueryVariables,
  APITypes.GetVehicleImageQuery
>;
export const listReservations = /* GraphQL */ `query ListReservations(
  $filter: ModelReservationFilterInput
  $limit: Int
  $nextToken: String
) {
  listReservations(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      createdAt
      endTime
      id
      owner
      startTime
      status
      totalPrice
      updatedAt
      userId
      vehicleId
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListReservationsQueryVariables,
  APITypes.ListReservationsQuery
>;
export const listTeslaIntegrations = /* GraphQL */ `query ListTeslaIntegrations(
  $filter: ModelTeslaIntegrationFilterInput
  $limit: Int
  $nextToken: String
) {
  listTeslaIntegrations(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      accessToken
      createdAt
      expiresIn
      id
      refreshToken
      tokenType
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListTeslaIntegrationsQueryVariables,
  APITypes.ListTeslaIntegrationsQuery
>;
export const listUserProfiles = /* GraphQL */ `query ListUserProfiles(
  $filter: ModelUserProfileFilterInput
  $limit: Int
  $nextToken: String
) {
  listUserProfiles(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      createdAt
      email
      id
      name
      profilePictureUrl
      role
      status
      updatedAt
      userId
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListUserProfilesQueryVariables,
  APITypes.ListUserProfilesQuery
>;
export const listVehicleImages = /* GraphQL */ `query ListVehicleImages(
  $filter: ModelVehicleImageFilterInput
  $limit: Int
  $nextToken: String
) {
  listVehicleImages(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      caption
      createdAt
      id
      imageUrl
      isPrimary
      order
      updatedAt
      vehicleId
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListVehicleImagesQueryVariables,
  APITypes.ListVehicleImagesQuery
>;
export const listVehicles = /* GraphQL */ `query ListVehicles(
  $filter: ModelVehicleFilterInput
  $limit: Int
  $nextToken: String
) {
  listVehicles(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      batteryLevel
      color
      createdAt
      firmwareVersion
      id
      imageUrl
      lastSyncedAt
      licensePlate
      locationLat
      locationLng
      make
      model
      odometer
      pricePerDay
      range
      status
      updatedAt
      vin
      year
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListVehiclesQueryVariables,
  APITypes.ListVehiclesQuery
>;
export const teslaConnect = /* GraphQL */ `query TeslaConnect($code: String, $redirectUri: String) {
  teslaConnect(code: $code, redirectUri: $redirectUri)
}
` as GeneratedQuery<
  APITypes.TeslaConnectQueryVariables,
  APITypes.TeslaConnectQuery
>;
export const teslaRegister = /* GraphQL */ `query TeslaRegister($domain: String) {
  teslaRegister(domain: $domain)
}
` as GeneratedQuery<
  APITypes.TeslaRegisterQueryVariables,
  APITypes.TeslaRegisterQuery
>;
export const teslaSync = /* GraphQL */ `query TeslaSync {
  teslaSync
}
` as GeneratedQuery<APITypes.TeslaSyncQueryVariables, APITypes.TeslaSyncQuery>;
