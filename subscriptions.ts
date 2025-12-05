/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "./API";
type GeneratedSubscription<InputType, OutputType> = string & {
  __generatedSubscriptionInput: InputType;
  __generatedSubscriptionOutput: OutputType;
};

export const onCreateReservation = /* GraphQL */ `subscription OnCreateReservation(
  $filter: ModelSubscriptionReservationFilterInput
  $owner: String
) {
  onCreateReservation(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnCreateReservationSubscriptionVariables,
  APITypes.OnCreateReservationSubscription
>;
export const onCreateTeslaIntegration = /* GraphQL */ `subscription OnCreateTeslaIntegration(
  $filter: ModelSubscriptionTeslaIntegrationFilterInput
) {
  onCreateTeslaIntegration(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnCreateTeslaIntegrationSubscriptionVariables,
  APITypes.OnCreateTeslaIntegrationSubscription
>;
export const onCreateUserProfile = /* GraphQL */ `subscription OnCreateUserProfile(
  $filter: ModelSubscriptionUserProfileFilterInput
) {
  onCreateUserProfile(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnCreateUserProfileSubscriptionVariables,
  APITypes.OnCreateUserProfileSubscription
>;
export const onCreateVehicle = /* GraphQL */ `subscription OnCreateVehicle($filter: ModelSubscriptionVehicleFilterInput) {
  onCreateVehicle(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnCreateVehicleSubscriptionVariables,
  APITypes.OnCreateVehicleSubscription
>;
export const onCreateVehicleImage = /* GraphQL */ `subscription OnCreateVehicleImage(
  $filter: ModelSubscriptionVehicleImageFilterInput
) {
  onCreateVehicleImage(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnCreateVehicleImageSubscriptionVariables,
  APITypes.OnCreateVehicleImageSubscription
>;
export const onDeleteReservation = /* GraphQL */ `subscription OnDeleteReservation(
  $filter: ModelSubscriptionReservationFilterInput
  $owner: String
) {
  onDeleteReservation(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteReservationSubscriptionVariables,
  APITypes.OnDeleteReservationSubscription
>;
export const onDeleteTeslaIntegration = /* GraphQL */ `subscription OnDeleteTeslaIntegration(
  $filter: ModelSubscriptionTeslaIntegrationFilterInput
) {
  onDeleteTeslaIntegration(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteTeslaIntegrationSubscriptionVariables,
  APITypes.OnDeleteTeslaIntegrationSubscription
>;
export const onDeleteUserProfile = /* GraphQL */ `subscription OnDeleteUserProfile(
  $filter: ModelSubscriptionUserProfileFilterInput
) {
  onDeleteUserProfile(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteUserProfileSubscriptionVariables,
  APITypes.OnDeleteUserProfileSubscription
>;
export const onDeleteVehicle = /* GraphQL */ `subscription OnDeleteVehicle($filter: ModelSubscriptionVehicleFilterInput) {
  onDeleteVehicle(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteVehicleSubscriptionVariables,
  APITypes.OnDeleteVehicleSubscription
>;
export const onDeleteVehicleImage = /* GraphQL */ `subscription OnDeleteVehicleImage(
  $filter: ModelSubscriptionVehicleImageFilterInput
) {
  onDeleteVehicleImage(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteVehicleImageSubscriptionVariables,
  APITypes.OnDeleteVehicleImageSubscription
>;
export const onUpdateReservation = /* GraphQL */ `subscription OnUpdateReservation(
  $filter: ModelSubscriptionReservationFilterInput
  $owner: String
) {
  onUpdateReservation(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateReservationSubscriptionVariables,
  APITypes.OnUpdateReservationSubscription
>;
export const onUpdateTeslaIntegration = /* GraphQL */ `subscription OnUpdateTeslaIntegration(
  $filter: ModelSubscriptionTeslaIntegrationFilterInput
) {
  onUpdateTeslaIntegration(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateTeslaIntegrationSubscriptionVariables,
  APITypes.OnUpdateTeslaIntegrationSubscription
>;
export const onUpdateUserProfile = /* GraphQL */ `subscription OnUpdateUserProfile(
  $filter: ModelSubscriptionUserProfileFilterInput
) {
  onUpdateUserProfile(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateUserProfileSubscriptionVariables,
  APITypes.OnUpdateUserProfileSubscription
>;
export const onUpdateVehicle = /* GraphQL */ `subscription OnUpdateVehicle($filter: ModelSubscriptionVehicleFilterInput) {
  onUpdateVehicle(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateVehicleSubscriptionVariables,
  APITypes.OnUpdateVehicleSubscription
>;
export const onUpdateVehicleImage = /* GraphQL */ `subscription OnUpdateVehicleImage(
  $filter: ModelSubscriptionVehicleImageFilterInput
) {
  onUpdateVehicleImage(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateVehicleImageSubscriptionVariables,
  APITypes.OnUpdateVehicleImageSubscription
>;
