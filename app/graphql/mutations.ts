/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "./API";
type GeneratedMutation<InputType, OutputType> = string & {
  __generatedMutationInput: InputType;
  __generatedMutationOutput: OutputType;
};

export const createReservation = /* GraphQL */ `mutation CreateReservation(
  $condition: ModelReservationConditionInput
  $input: CreateReservationInput!
) {
  createReservation(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.CreateReservationMutationVariables,
  APITypes.CreateReservationMutation
>;
export const createTeslaIntegration = /* GraphQL */ `mutation CreateTeslaIntegration(
  $condition: ModelTeslaIntegrationConditionInput
  $input: CreateTeslaIntegrationInput!
) {
  createTeslaIntegration(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.CreateTeslaIntegrationMutationVariables,
  APITypes.CreateTeslaIntegrationMutation
>;
export const createUserProfile = /* GraphQL */ `mutation CreateUserProfile(
  $condition: ModelUserProfileConditionInput
  $input: CreateUserProfileInput!
) {
  createUserProfile(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.CreateUserProfileMutationVariables,
  APITypes.CreateUserProfileMutation
>;
export const createVehicle = /* GraphQL */ `mutation CreateVehicle(
  $condition: ModelVehicleConditionInput
  $input: CreateVehicleInput!
) {
  createVehicle(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.CreateVehicleMutationVariables,
  APITypes.CreateVehicleMutation
>;
export const createVehicleImage = /* GraphQL */ `mutation CreateVehicleImage(
  $condition: ModelVehicleImageConditionInput
  $input: CreateVehicleImageInput!
) {
  createVehicleImage(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.CreateVehicleImageMutationVariables,
  APITypes.CreateVehicleImageMutation
>;
export const deleteReservation = /* GraphQL */ `mutation DeleteReservation(
  $condition: ModelReservationConditionInput
  $input: DeleteReservationInput!
) {
  deleteReservation(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.DeleteReservationMutationVariables,
  APITypes.DeleteReservationMutation
>;
export const deleteTeslaIntegration = /* GraphQL */ `mutation DeleteTeslaIntegration(
  $condition: ModelTeslaIntegrationConditionInput
  $input: DeleteTeslaIntegrationInput!
) {
  deleteTeslaIntegration(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.DeleteTeslaIntegrationMutationVariables,
  APITypes.DeleteTeslaIntegrationMutation
>;
export const deleteUserProfile = /* GraphQL */ `mutation DeleteUserProfile(
  $condition: ModelUserProfileConditionInput
  $input: DeleteUserProfileInput!
) {
  deleteUserProfile(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.DeleteUserProfileMutationVariables,
  APITypes.DeleteUserProfileMutation
>;
export const deleteVehicle = /* GraphQL */ `mutation DeleteVehicle(
  $condition: ModelVehicleConditionInput
  $input: DeleteVehicleInput!
) {
  deleteVehicle(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.DeleteVehicleMutationVariables,
  APITypes.DeleteVehicleMutation
>;
export const deleteVehicleImage = /* GraphQL */ `mutation DeleteVehicleImage(
  $condition: ModelVehicleImageConditionInput
  $input: DeleteVehicleImageInput!
) {
  deleteVehicleImage(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.DeleteVehicleImageMutationVariables,
  APITypes.DeleteVehicleImageMutation
>;
export const updateReservation = /* GraphQL */ `mutation UpdateReservation(
  $condition: ModelReservationConditionInput
  $input: UpdateReservationInput!
) {
  updateReservation(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.UpdateReservationMutationVariables,
  APITypes.UpdateReservationMutation
>;
export const updateTeslaIntegration = /* GraphQL */ `mutation UpdateTeslaIntegration(
  $condition: ModelTeslaIntegrationConditionInput
  $input: UpdateTeslaIntegrationInput!
) {
  updateTeslaIntegration(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.UpdateTeslaIntegrationMutationVariables,
  APITypes.UpdateTeslaIntegrationMutation
>;
export const updateUserProfile = /* GraphQL */ `mutation UpdateUserProfile(
  $condition: ModelUserProfileConditionInput
  $input: UpdateUserProfileInput!
) {
  updateUserProfile(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.UpdateUserProfileMutationVariables,
  APITypes.UpdateUserProfileMutation
>;
export const updateVehicle = /* GraphQL */ `mutation UpdateVehicle(
  $condition: ModelVehicleConditionInput
  $input: UpdateVehicleInput!
) {
  updateVehicle(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.UpdateVehicleMutationVariables,
  APITypes.UpdateVehicleMutation
>;
export const updateVehicleImage = /* GraphQL */ `mutation UpdateVehicleImage(
  $condition: ModelVehicleImageConditionInput
  $input: UpdateVehicleImageInput!
) {
  updateVehicleImage(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.UpdateVehicleImageMutationVariables,
  APITypes.UpdateVehicleImageMutation
>;
