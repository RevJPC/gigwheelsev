/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type Reservation = {
  __typename: "Reservation",
  createdAt: string,
  endTime: string,
  id: string,
  owner?: string | null,
  startTime: string,
  status?: ReservationStatus | null,
  totalPrice?: number | null,
  updatedAt: string,
  userId: string,
  vehicle?: Vehicle | null,
  vehicleId: string,
};

export enum ReservationStatus {
  CANCELLED = "CANCELLED",
  COMPLETED = "COMPLETED",
  CONFIRMED = "CONFIRMED",
  PENDING = "PENDING",
}


export type Vehicle = {
  __typename: "Vehicle",
  batteryLevel?: number | null,
  color?: string | null,
  createdAt: string,
  firmwareVersion?: string | null,
  id: string,
  imageUrl?: string | null,
  images?: ModelVehicleImageConnection | null,
  lastSyncedAt?: string | null,
  licensePlate?: string | null,
  locationLat?: number | null,
  locationLng?: number | null,
  make: string,
  model: string,
  odometer?: number | null,
  pricePerDay?: number | null,
  range?: number | null,
  reservations?: ModelReservationConnection | null,
  status?: VehicleStatus | null,
  updatedAt: string,
  vin: string,
  year: number,
};

export type ModelVehicleImageConnection = {
  __typename: "ModelVehicleImageConnection",
  items:  Array<VehicleImage | null >,
  nextToken?: string | null,
};

export type VehicleImage = {
  __typename: "VehicleImage",
  caption?: string | null,
  createdAt: string,
  id: string,
  imageUrl: string,
  isPrimary?: boolean | null,
  order?: number | null,
  updatedAt: string,
  vehicle?: Vehicle | null,
  vehicleId: string,
};

export type ModelReservationConnection = {
  __typename: "ModelReservationConnection",
  items:  Array<Reservation | null >,
  nextToken?: string | null,
};

export enum VehicleStatus {
  AVAILABLE = "AVAILABLE",
  CHARGING = "CHARGING",
  MAINTENANCE = "MAINTENANCE",
  RENTED = "RENTED",
}


export type TeslaIntegration = {
  __typename: "TeslaIntegration",
  accessToken: string,
  createdAt: string,
  expiresIn?: number | null,
  id: string,
  refreshToken: string,
  tokenType?: string | null,
  updatedAt: string,
};

export type UserProfile = {
  __typename: "UserProfile",
  createdAt: string,
  email: string,
  id: string,
  name?: string | null,
  profilePictureUrl?: string | null,
  role: UserRole,
  status?: UserStatus | null,
  updatedAt: string,
  userId: string,
};

export enum UserRole {
  ADMIN = "ADMIN",
  CUSTOMER = "CUSTOMER",
  EMPLOYEE = "EMPLOYEE",
}


export enum UserStatus {
  ACTIVE = "ACTIVE",
  SUSPENDED = "SUSPENDED",
}


export type ModelReservationFilterInput = {
  and?: Array< ModelReservationFilterInput | null > | null,
  createdAt?: ModelStringInput | null,
  endTime?: ModelStringInput | null,
  id?: ModelIDInput | null,
  not?: ModelReservationFilterInput | null,
  or?: Array< ModelReservationFilterInput | null > | null,
  owner?: ModelStringInput | null,
  startTime?: ModelStringInput | null,
  status?: ModelReservationStatusInput | null,
  totalPrice?: ModelFloatInput | null,
  updatedAt?: ModelStringInput | null,
  userId?: ModelStringInput | null,
  vehicleId?: ModelIDInput | null,
};

export type ModelStringInput = {
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  beginsWith?: string | null,
  between?: Array< string | null > | null,
  contains?: string | null,
  eq?: string | null,
  ge?: string | null,
  gt?: string | null,
  le?: string | null,
  lt?: string | null,
  ne?: string | null,
  notContains?: string | null,
  size?: ModelSizeInput | null,
};

export enum ModelAttributeTypes {
  _null = "_null",
  binary = "binary",
  binarySet = "binarySet",
  bool = "bool",
  list = "list",
  map = "map",
  number = "number",
  numberSet = "numberSet",
  string = "string",
  stringSet = "stringSet",
}


export type ModelSizeInput = {
  between?: Array< number | null > | null,
  eq?: number | null,
  ge?: number | null,
  gt?: number | null,
  le?: number | null,
  lt?: number | null,
  ne?: number | null,
};

export type ModelIDInput = {
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  beginsWith?: string | null,
  between?: Array< string | null > | null,
  contains?: string | null,
  eq?: string | null,
  ge?: string | null,
  gt?: string | null,
  le?: string | null,
  lt?: string | null,
  ne?: string | null,
  notContains?: string | null,
  size?: ModelSizeInput | null,
};

export type ModelReservationStatusInput = {
  eq?: ReservationStatus | null,
  ne?: ReservationStatus | null,
};

export type ModelFloatInput = {
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  between?: Array< number | null > | null,
  eq?: number | null,
  ge?: number | null,
  gt?: number | null,
  le?: number | null,
  lt?: number | null,
  ne?: number | null,
};

export type ModelTeslaIntegrationFilterInput = {
  accessToken?: ModelStringInput | null,
  and?: Array< ModelTeslaIntegrationFilterInput | null > | null,
  createdAt?: ModelStringInput | null,
  expiresIn?: ModelIntInput | null,
  id?: ModelIDInput | null,
  not?: ModelTeslaIntegrationFilterInput | null,
  or?: Array< ModelTeslaIntegrationFilterInput | null > | null,
  refreshToken?: ModelStringInput | null,
  tokenType?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type ModelIntInput = {
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  between?: Array< number | null > | null,
  eq?: number | null,
  ge?: number | null,
  gt?: number | null,
  le?: number | null,
  lt?: number | null,
  ne?: number | null,
};

export type ModelTeslaIntegrationConnection = {
  __typename: "ModelTeslaIntegrationConnection",
  items:  Array<TeslaIntegration | null >,
  nextToken?: string | null,
};

export type ModelUserProfileFilterInput = {
  and?: Array< ModelUserProfileFilterInput | null > | null,
  createdAt?: ModelStringInput | null,
  email?: ModelStringInput | null,
  id?: ModelIDInput | null,
  name?: ModelStringInput | null,
  not?: ModelUserProfileFilterInput | null,
  or?: Array< ModelUserProfileFilterInput | null > | null,
  profilePictureUrl?: ModelStringInput | null,
  role?: ModelUserRoleInput | null,
  status?: ModelUserStatusInput | null,
  updatedAt?: ModelStringInput | null,
  userId?: ModelStringInput | null,
};

export type ModelUserRoleInput = {
  eq?: UserRole | null,
  ne?: UserRole | null,
};

export type ModelUserStatusInput = {
  eq?: UserStatus | null,
  ne?: UserStatus | null,
};

export type ModelUserProfileConnection = {
  __typename: "ModelUserProfileConnection",
  items:  Array<UserProfile | null >,
  nextToken?: string | null,
};

export type ModelVehicleImageFilterInput = {
  and?: Array< ModelVehicleImageFilterInput | null > | null,
  caption?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  id?: ModelIDInput | null,
  imageUrl?: ModelStringInput | null,
  isPrimary?: ModelBooleanInput | null,
  not?: ModelVehicleImageFilterInput | null,
  or?: Array< ModelVehicleImageFilterInput | null > | null,
  order?: ModelIntInput | null,
  updatedAt?: ModelStringInput | null,
  vehicleId?: ModelIDInput | null,
};

export type ModelBooleanInput = {
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  eq?: boolean | null,
  ne?: boolean | null,
};

export type ModelVehicleFilterInput = {
  and?: Array< ModelVehicleFilterInput | null > | null,
  batteryLevel?: ModelIntInput | null,
  color?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  firmwareVersion?: ModelStringInput | null,
  id?: ModelIDInput | null,
  imageUrl?: ModelStringInput | null,
  lastSyncedAt?: ModelStringInput | null,
  licensePlate?: ModelStringInput | null,
  locationLat?: ModelFloatInput | null,
  locationLng?: ModelFloatInput | null,
  make?: ModelStringInput | null,
  model?: ModelStringInput | null,
  not?: ModelVehicleFilterInput | null,
  odometer?: ModelFloatInput | null,
  or?: Array< ModelVehicleFilterInput | null > | null,
  pricePerDay?: ModelFloatInput | null,
  range?: ModelFloatInput | null,
  status?: ModelVehicleStatusInput | null,
  updatedAt?: ModelStringInput | null,
  vin?: ModelStringInput | null,
  year?: ModelIntInput | null,
};

export type ModelVehicleStatusInput = {
  eq?: VehicleStatus | null,
  ne?: VehicleStatus | null,
};

export type ModelVehicleConnection = {
  __typename: "ModelVehicleConnection",
  items:  Array<Vehicle | null >,
  nextToken?: string | null,
};

export type ModelReservationConditionInput = {
  and?: Array< ModelReservationConditionInput | null > | null,
  createdAt?: ModelStringInput | null,
  endTime?: ModelStringInput | null,
  not?: ModelReservationConditionInput | null,
  or?: Array< ModelReservationConditionInput | null > | null,
  owner?: ModelStringInput | null,
  startTime?: ModelStringInput | null,
  status?: ModelReservationStatusInput | null,
  totalPrice?: ModelFloatInput | null,
  updatedAt?: ModelStringInput | null,
  userId?: ModelStringInput | null,
  vehicleId?: ModelIDInput | null,
};

export type CreateReservationInput = {
  endTime: string,
  id?: string | null,
  startTime: string,
  status?: ReservationStatus | null,
  totalPrice?: number | null,
  userId: string,
  vehicleId: string,
};

export type ModelTeslaIntegrationConditionInput = {
  accessToken?: ModelStringInput | null,
  and?: Array< ModelTeslaIntegrationConditionInput | null > | null,
  createdAt?: ModelStringInput | null,
  expiresIn?: ModelIntInput | null,
  not?: ModelTeslaIntegrationConditionInput | null,
  or?: Array< ModelTeslaIntegrationConditionInput | null > | null,
  refreshToken?: ModelStringInput | null,
  tokenType?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type CreateTeslaIntegrationInput = {
  accessToken: string,
  expiresIn?: number | null,
  id?: string | null,
  refreshToken: string,
  tokenType?: string | null,
};

export type ModelUserProfileConditionInput = {
  and?: Array< ModelUserProfileConditionInput | null > | null,
  createdAt?: ModelStringInput | null,
  email?: ModelStringInput | null,
  name?: ModelStringInput | null,
  not?: ModelUserProfileConditionInput | null,
  or?: Array< ModelUserProfileConditionInput | null > | null,
  profilePictureUrl?: ModelStringInput | null,
  role?: ModelUserRoleInput | null,
  status?: ModelUserStatusInput | null,
  updatedAt?: ModelStringInput | null,
  userId?: ModelStringInput | null,
};

export type CreateUserProfileInput = {
  email: string,
  id?: string | null,
  name?: string | null,
  profilePictureUrl?: string | null,
  role: UserRole,
  status?: UserStatus | null,
  userId: string,
};

export type ModelVehicleConditionInput = {
  and?: Array< ModelVehicleConditionInput | null > | null,
  batteryLevel?: ModelIntInput | null,
  color?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  firmwareVersion?: ModelStringInput | null,
  imageUrl?: ModelStringInput | null,
  lastSyncedAt?: ModelStringInput | null,
  licensePlate?: ModelStringInput | null,
  locationLat?: ModelFloatInput | null,
  locationLng?: ModelFloatInput | null,
  make?: ModelStringInput | null,
  model?: ModelStringInput | null,
  not?: ModelVehicleConditionInput | null,
  odometer?: ModelFloatInput | null,
  or?: Array< ModelVehicleConditionInput | null > | null,
  pricePerDay?: ModelFloatInput | null,
  range?: ModelFloatInput | null,
  status?: ModelVehicleStatusInput | null,
  updatedAt?: ModelStringInput | null,
  vin?: ModelStringInput | null,
  year?: ModelIntInput | null,
};

export type CreateVehicleInput = {
  batteryLevel?: number | null,
  color?: string | null,
  firmwareVersion?: string | null,
  id?: string | null,
  imageUrl?: string | null,
  lastSyncedAt?: string | null,
  licensePlate?: string | null,
  locationLat?: number | null,
  locationLng?: number | null,
  make: string,
  model: string,
  odometer?: number | null,
  pricePerDay?: number | null,
  range?: number | null,
  status?: VehicleStatus | null,
  vin: string,
  year: number,
};

export type ModelVehicleImageConditionInput = {
  and?: Array< ModelVehicleImageConditionInput | null > | null,
  caption?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  imageUrl?: ModelStringInput | null,
  isPrimary?: ModelBooleanInput | null,
  not?: ModelVehicleImageConditionInput | null,
  or?: Array< ModelVehicleImageConditionInput | null > | null,
  order?: ModelIntInput | null,
  updatedAt?: ModelStringInput | null,
  vehicleId?: ModelIDInput | null,
};

export type CreateVehicleImageInput = {
  caption?: string | null,
  id?: string | null,
  imageUrl: string,
  isPrimary?: boolean | null,
  order?: number | null,
  vehicleId: string,
};

export type DeleteReservationInput = {
  id: string,
};

export type DeleteTeslaIntegrationInput = {
  id: string,
};

export type DeleteUserProfileInput = {
  id: string,
};

export type DeleteVehicleInput = {
  id: string,
};

export type DeleteVehicleImageInput = {
  id: string,
};

export type UpdateReservationInput = {
  endTime?: string | null,
  id: string,
  startTime?: string | null,
  status?: ReservationStatus | null,
  totalPrice?: number | null,
  userId?: string | null,
  vehicleId?: string | null,
};

export type UpdateTeslaIntegrationInput = {
  accessToken?: string | null,
  expiresIn?: number | null,
  id: string,
  refreshToken?: string | null,
  tokenType?: string | null,
};

export type UpdateUserProfileInput = {
  email?: string | null,
  id: string,
  name?: string | null,
  profilePictureUrl?: string | null,
  role?: UserRole | null,
  status?: UserStatus | null,
  userId?: string | null,
};

export type UpdateVehicleInput = {
  batteryLevel?: number | null,
  color?: string | null,
  firmwareVersion?: string | null,
  id: string,
  imageUrl?: string | null,
  lastSyncedAt?: string | null,
  licensePlate?: string | null,
  locationLat?: number | null,
  locationLng?: number | null,
  make?: string | null,
  model?: string | null,
  odometer?: number | null,
  pricePerDay?: number | null,
  range?: number | null,
  status?: VehicleStatus | null,
  vin?: string | null,
  year?: number | null,
};

export type UpdateVehicleImageInput = {
  caption?: string | null,
  id: string,
  imageUrl?: string | null,
  isPrimary?: boolean | null,
  order?: number | null,
  vehicleId?: string | null,
};

export type ModelSubscriptionReservationFilterInput = {
  and?: Array< ModelSubscriptionReservationFilterInput | null > | null,
  createdAt?: ModelSubscriptionStringInput | null,
  endTime?: ModelSubscriptionStringInput | null,
  id?: ModelSubscriptionIDInput | null,
  or?: Array< ModelSubscriptionReservationFilterInput | null > | null,
  owner?: ModelStringInput | null,
  startTime?: ModelSubscriptionStringInput | null,
  status?: ModelSubscriptionStringInput | null,
  totalPrice?: ModelSubscriptionFloatInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  userId?: ModelSubscriptionStringInput | null,
  vehicleId?: ModelSubscriptionIDInput | null,
};

export type ModelSubscriptionStringInput = {
  beginsWith?: string | null,
  between?: Array< string | null > | null,
  contains?: string | null,
  eq?: string | null,
  ge?: string | null,
  gt?: string | null,
  in?: Array< string | null > | null,
  le?: string | null,
  lt?: string | null,
  ne?: string | null,
  notContains?: string | null,
  notIn?: Array< string | null > | null,
};

export type ModelSubscriptionIDInput = {
  beginsWith?: string | null,
  between?: Array< string | null > | null,
  contains?: string | null,
  eq?: string | null,
  ge?: string | null,
  gt?: string | null,
  in?: Array< string | null > | null,
  le?: string | null,
  lt?: string | null,
  ne?: string | null,
  notContains?: string | null,
  notIn?: Array< string | null > | null,
};

export type ModelSubscriptionFloatInput = {
  between?: Array< number | null > | null,
  eq?: number | null,
  ge?: number | null,
  gt?: number | null,
  in?: Array< number | null > | null,
  le?: number | null,
  lt?: number | null,
  ne?: number | null,
  notIn?: Array< number | null > | null,
};

export type ModelSubscriptionTeslaIntegrationFilterInput = {
  accessToken?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionTeslaIntegrationFilterInput | null > | null,
  createdAt?: ModelSubscriptionStringInput | null,
  expiresIn?: ModelSubscriptionIntInput | null,
  id?: ModelSubscriptionIDInput | null,
  or?: Array< ModelSubscriptionTeslaIntegrationFilterInput | null > | null,
  refreshToken?: ModelSubscriptionStringInput | null,
  tokenType?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
};

export type ModelSubscriptionIntInput = {
  between?: Array< number | null > | null,
  eq?: number | null,
  ge?: number | null,
  gt?: number | null,
  in?: Array< number | null > | null,
  le?: number | null,
  lt?: number | null,
  ne?: number | null,
  notIn?: Array< number | null > | null,
};

export type ModelSubscriptionUserProfileFilterInput = {
  and?: Array< ModelSubscriptionUserProfileFilterInput | null > | null,
  createdAt?: ModelSubscriptionStringInput | null,
  email?: ModelSubscriptionStringInput | null,
  id?: ModelSubscriptionIDInput | null,
  name?: ModelSubscriptionStringInput | null,
  or?: Array< ModelSubscriptionUserProfileFilterInput | null > | null,
  profilePictureUrl?: ModelSubscriptionStringInput | null,
  role?: ModelSubscriptionStringInput | null,
  status?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  userId?: ModelSubscriptionStringInput | null,
};

export type ModelSubscriptionVehicleFilterInput = {
  and?: Array< ModelSubscriptionVehicleFilterInput | null > | null,
  batteryLevel?: ModelSubscriptionIntInput | null,
  color?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  firmwareVersion?: ModelSubscriptionStringInput | null,
  id?: ModelSubscriptionIDInput | null,
  imageUrl?: ModelSubscriptionStringInput | null,
  lastSyncedAt?: ModelSubscriptionStringInput | null,
  licensePlate?: ModelSubscriptionStringInput | null,
  locationLat?: ModelSubscriptionFloatInput | null,
  locationLng?: ModelSubscriptionFloatInput | null,
  make?: ModelSubscriptionStringInput | null,
  model?: ModelSubscriptionStringInput | null,
  odometer?: ModelSubscriptionFloatInput | null,
  or?: Array< ModelSubscriptionVehicleFilterInput | null > | null,
  pricePerDay?: ModelSubscriptionFloatInput | null,
  range?: ModelSubscriptionFloatInput | null,
  status?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  vin?: ModelSubscriptionStringInput | null,
  year?: ModelSubscriptionIntInput | null,
};

export type ModelSubscriptionVehicleImageFilterInput = {
  and?: Array< ModelSubscriptionVehicleImageFilterInput | null > | null,
  caption?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  id?: ModelSubscriptionIDInput | null,
  imageUrl?: ModelSubscriptionStringInput | null,
  isPrimary?: ModelSubscriptionBooleanInput | null,
  or?: Array< ModelSubscriptionVehicleImageFilterInput | null > | null,
  order?: ModelSubscriptionIntInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  vehicleId?: ModelSubscriptionIDInput | null,
};

export type ModelSubscriptionBooleanInput = {
  eq?: boolean | null,
  ne?: boolean | null,
};

export type GetReservationQueryVariables = {
  id: string,
};

export type GetReservationQuery = {
  getReservation?:  {
    __typename: "Reservation",
    createdAt: string,
    endTime: string,
    id: string,
    owner?: string | null,
    startTime: string,
    status?: ReservationStatus | null,
    totalPrice?: number | null,
    updatedAt: string,
    userId: string,
    vehicle?:  {
      __typename: "Vehicle",
      batteryLevel?: number | null,
      color?: string | null,
      createdAt: string,
      firmwareVersion?: string | null,
      id: string,
      imageUrl?: string | null,
      lastSyncedAt?: string | null,
      licensePlate?: string | null,
      locationLat?: number | null,
      locationLng?: number | null,
      make: string,
      model: string,
      odometer?: number | null,
      pricePerDay?: number | null,
      range?: number | null,
      status?: VehicleStatus | null,
      updatedAt: string,
      vin: string,
      year: number,
    } | null,
    vehicleId: string,
  } | null,
};

export type GetTeslaIntegrationQueryVariables = {
  id: string,
};

export type GetTeslaIntegrationQuery = {
  getTeslaIntegration?:  {
    __typename: "TeslaIntegration",
    accessToken: string,
    createdAt: string,
    expiresIn?: number | null,
    id: string,
    refreshToken: string,
    tokenType?: string | null,
    updatedAt: string,
  } | null,
};

export type GetUserProfileQueryVariables = {
  id: string,
};

export type GetUserProfileQuery = {
  getUserProfile?:  {
    __typename: "UserProfile",
    createdAt: string,
    email: string,
    id: string,
    name?: string | null,
    profilePictureUrl?: string | null,
    role: UserRole,
    status?: UserStatus | null,
    updatedAt: string,
    userId: string,
  } | null,
};

export type GetVehicleQueryVariables = {
  id: string,
};

export type GetVehicleQuery = {
  getVehicle?:  {
    __typename: "Vehicle",
    batteryLevel?: number | null,
    color?: string | null,
    createdAt: string,
    firmwareVersion?: string | null,
    id: string,
    imageUrl?: string | null,
    images?:  {
      __typename: "ModelVehicleImageConnection",
      nextToken?: string | null,
    } | null,
    lastSyncedAt?: string | null,
    licensePlate?: string | null,
    locationLat?: number | null,
    locationLng?: number | null,
    make: string,
    model: string,
    odometer?: number | null,
    pricePerDay?: number | null,
    range?: number | null,
    reservations?:  {
      __typename: "ModelReservationConnection",
      nextToken?: string | null,
    } | null,
    status?: VehicleStatus | null,
    updatedAt: string,
    vin: string,
    year: number,
  } | null,
};

export type GetVehicleImageQueryVariables = {
  id: string,
};

export type GetVehicleImageQuery = {
  getVehicleImage?:  {
    __typename: "VehicleImage",
    caption?: string | null,
    createdAt: string,
    id: string,
    imageUrl: string,
    isPrimary?: boolean | null,
    order?: number | null,
    updatedAt: string,
    vehicle?:  {
      __typename: "Vehicle",
      batteryLevel?: number | null,
      color?: string | null,
      createdAt: string,
      firmwareVersion?: string | null,
      id: string,
      imageUrl?: string | null,
      lastSyncedAt?: string | null,
      licensePlate?: string | null,
      locationLat?: number | null,
      locationLng?: number | null,
      make: string,
      model: string,
      odometer?: number | null,
      pricePerDay?: number | null,
      range?: number | null,
      status?: VehicleStatus | null,
      updatedAt: string,
      vin: string,
      year: number,
    } | null,
    vehicleId: string,
  } | null,
};

export type ListReservationsQueryVariables = {
  filter?: ModelReservationFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListReservationsQuery = {
  listReservations?:  {
    __typename: "ModelReservationConnection",
    items:  Array< {
      __typename: "Reservation",
      createdAt: string,
      endTime: string,
      id: string,
      owner?: string | null,
      startTime: string,
      status?: ReservationStatus | null,
      totalPrice?: number | null,
      updatedAt: string,
      userId: string,
      vehicleId: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListTeslaIntegrationsQueryVariables = {
  filter?: ModelTeslaIntegrationFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListTeslaIntegrationsQuery = {
  listTeslaIntegrations?:  {
    __typename: "ModelTeslaIntegrationConnection",
    items:  Array< {
      __typename: "TeslaIntegration",
      accessToken: string,
      createdAt: string,
      expiresIn?: number | null,
      id: string,
      refreshToken: string,
      tokenType?: string | null,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListUserProfilesQueryVariables = {
  filter?: ModelUserProfileFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListUserProfilesQuery = {
  listUserProfiles?:  {
    __typename: "ModelUserProfileConnection",
    items:  Array< {
      __typename: "UserProfile",
      createdAt: string,
      email: string,
      id: string,
      name?: string | null,
      profilePictureUrl?: string | null,
      role: UserRole,
      status?: UserStatus | null,
      updatedAt: string,
      userId: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListVehicleImagesQueryVariables = {
  filter?: ModelVehicleImageFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListVehicleImagesQuery = {
  listVehicleImages?:  {
    __typename: "ModelVehicleImageConnection",
    items:  Array< {
      __typename: "VehicleImage",
      caption?: string | null,
      createdAt: string,
      id: string,
      imageUrl: string,
      isPrimary?: boolean | null,
      order?: number | null,
      updatedAt: string,
      vehicleId: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListVehiclesQueryVariables = {
  filter?: ModelVehicleFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListVehiclesQuery = {
  listVehicles?:  {
    __typename: "ModelVehicleConnection",
    items:  Array< {
      __typename: "Vehicle",
      batteryLevel?: number | null,
      color?: string | null,
      createdAt: string,
      firmwareVersion?: string | null,
      id: string,
      imageUrl?: string | null,
      lastSyncedAt?: string | null,
      licensePlate?: string | null,
      locationLat?: number | null,
      locationLng?: number | null,
      make: string,
      model: string,
      odometer?: number | null,
      pricePerDay?: number | null,
      range?: number | null,
      status?: VehicleStatus | null,
      updatedAt: string,
      vin: string,
      year: number,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type TeslaConnectQueryVariables = {
  code?: string | null,
  redirectUri?: string | null,
};

export type TeslaConnectQuery = {
  teslaConnect?: string | null,
};

export type TeslaRegisterQueryVariables = {
  domain?: string | null,
};

export type TeslaRegisterQuery = {
  teslaRegister?: string | null,
};

export type TeslaSyncQueryVariables = {
};

export type TeslaSyncQuery = {
  teslaSync?: string | null,
};

export type CreateReservationMutationVariables = {
  condition?: ModelReservationConditionInput | null,
  input: CreateReservationInput,
};

export type CreateReservationMutation = {
  createReservation?:  {
    __typename: "Reservation",
    createdAt: string,
    endTime: string,
    id: string,
    owner?: string | null,
    startTime: string,
    status?: ReservationStatus | null,
    totalPrice?: number | null,
    updatedAt: string,
    userId: string,
    vehicle?:  {
      __typename: "Vehicle",
      batteryLevel?: number | null,
      color?: string | null,
      createdAt: string,
      firmwareVersion?: string | null,
      id: string,
      imageUrl?: string | null,
      lastSyncedAt?: string | null,
      licensePlate?: string | null,
      locationLat?: number | null,
      locationLng?: number | null,
      make: string,
      model: string,
      odometer?: number | null,
      pricePerDay?: number | null,
      range?: number | null,
      status?: VehicleStatus | null,
      updatedAt: string,
      vin: string,
      year: number,
    } | null,
    vehicleId: string,
  } | null,
};

export type CreateTeslaIntegrationMutationVariables = {
  condition?: ModelTeslaIntegrationConditionInput | null,
  input: CreateTeslaIntegrationInput,
};

export type CreateTeslaIntegrationMutation = {
  createTeslaIntegration?:  {
    __typename: "TeslaIntegration",
    accessToken: string,
    createdAt: string,
    expiresIn?: number | null,
    id: string,
    refreshToken: string,
    tokenType?: string | null,
    updatedAt: string,
  } | null,
};

export type CreateUserProfileMutationVariables = {
  condition?: ModelUserProfileConditionInput | null,
  input: CreateUserProfileInput,
};

export type CreateUserProfileMutation = {
  createUserProfile?:  {
    __typename: "UserProfile",
    createdAt: string,
    email: string,
    id: string,
    name?: string | null,
    profilePictureUrl?: string | null,
    role: UserRole,
    status?: UserStatus | null,
    updatedAt: string,
    userId: string,
  } | null,
};

export type CreateVehicleMutationVariables = {
  condition?: ModelVehicleConditionInput | null,
  input: CreateVehicleInput,
};

export type CreateVehicleMutation = {
  createVehicle?:  {
    __typename: "Vehicle",
    batteryLevel?: number | null,
    color?: string | null,
    createdAt: string,
    firmwareVersion?: string | null,
    id: string,
    imageUrl?: string | null,
    images?:  {
      __typename: "ModelVehicleImageConnection",
      nextToken?: string | null,
    } | null,
    lastSyncedAt?: string | null,
    licensePlate?: string | null,
    locationLat?: number | null,
    locationLng?: number | null,
    make: string,
    model: string,
    odometer?: number | null,
    pricePerDay?: number | null,
    range?: number | null,
    reservations?:  {
      __typename: "ModelReservationConnection",
      nextToken?: string | null,
    } | null,
    status?: VehicleStatus | null,
    updatedAt: string,
    vin: string,
    year: number,
  } | null,
};

export type CreateVehicleImageMutationVariables = {
  condition?: ModelVehicleImageConditionInput | null,
  input: CreateVehicleImageInput,
};

export type CreateVehicleImageMutation = {
  createVehicleImage?:  {
    __typename: "VehicleImage",
    caption?: string | null,
    createdAt: string,
    id: string,
    imageUrl: string,
    isPrimary?: boolean | null,
    order?: number | null,
    updatedAt: string,
    vehicle?:  {
      __typename: "Vehicle",
      batteryLevel?: number | null,
      color?: string | null,
      createdAt: string,
      firmwareVersion?: string | null,
      id: string,
      imageUrl?: string | null,
      lastSyncedAt?: string | null,
      licensePlate?: string | null,
      locationLat?: number | null,
      locationLng?: number | null,
      make: string,
      model: string,
      odometer?: number | null,
      pricePerDay?: number | null,
      range?: number | null,
      status?: VehicleStatus | null,
      updatedAt: string,
      vin: string,
      year: number,
    } | null,
    vehicleId: string,
  } | null,
};

export type DeleteReservationMutationVariables = {
  condition?: ModelReservationConditionInput | null,
  input: DeleteReservationInput,
};

export type DeleteReservationMutation = {
  deleteReservation?:  {
    __typename: "Reservation",
    createdAt: string,
    endTime: string,
    id: string,
    owner?: string | null,
    startTime: string,
    status?: ReservationStatus | null,
    totalPrice?: number | null,
    updatedAt: string,
    userId: string,
    vehicle?:  {
      __typename: "Vehicle",
      batteryLevel?: number | null,
      color?: string | null,
      createdAt: string,
      firmwareVersion?: string | null,
      id: string,
      imageUrl?: string | null,
      lastSyncedAt?: string | null,
      licensePlate?: string | null,
      locationLat?: number | null,
      locationLng?: number | null,
      make: string,
      model: string,
      odometer?: number | null,
      pricePerDay?: number | null,
      range?: number | null,
      status?: VehicleStatus | null,
      updatedAt: string,
      vin: string,
      year: number,
    } | null,
    vehicleId: string,
  } | null,
};

export type DeleteTeslaIntegrationMutationVariables = {
  condition?: ModelTeslaIntegrationConditionInput | null,
  input: DeleteTeslaIntegrationInput,
};

export type DeleteTeslaIntegrationMutation = {
  deleteTeslaIntegration?:  {
    __typename: "TeslaIntegration",
    accessToken: string,
    createdAt: string,
    expiresIn?: number | null,
    id: string,
    refreshToken: string,
    tokenType?: string | null,
    updatedAt: string,
  } | null,
};

export type DeleteUserProfileMutationVariables = {
  condition?: ModelUserProfileConditionInput | null,
  input: DeleteUserProfileInput,
};

export type DeleteUserProfileMutation = {
  deleteUserProfile?:  {
    __typename: "UserProfile",
    createdAt: string,
    email: string,
    id: string,
    name?: string | null,
    profilePictureUrl?: string | null,
    role: UserRole,
    status?: UserStatus | null,
    updatedAt: string,
    userId: string,
  } | null,
};

export type DeleteVehicleMutationVariables = {
  condition?: ModelVehicleConditionInput | null,
  input: DeleteVehicleInput,
};

export type DeleteVehicleMutation = {
  deleteVehicle?:  {
    __typename: "Vehicle",
    batteryLevel?: number | null,
    color?: string | null,
    createdAt: string,
    firmwareVersion?: string | null,
    id: string,
    imageUrl?: string | null,
    images?:  {
      __typename: "ModelVehicleImageConnection",
      nextToken?: string | null,
    } | null,
    lastSyncedAt?: string | null,
    licensePlate?: string | null,
    locationLat?: number | null,
    locationLng?: number | null,
    make: string,
    model: string,
    odometer?: number | null,
    pricePerDay?: number | null,
    range?: number | null,
    reservations?:  {
      __typename: "ModelReservationConnection",
      nextToken?: string | null,
    } | null,
    status?: VehicleStatus | null,
    updatedAt: string,
    vin: string,
    year: number,
  } | null,
};

export type DeleteVehicleImageMutationVariables = {
  condition?: ModelVehicleImageConditionInput | null,
  input: DeleteVehicleImageInput,
};

export type DeleteVehicleImageMutation = {
  deleteVehicleImage?:  {
    __typename: "VehicleImage",
    caption?: string | null,
    createdAt: string,
    id: string,
    imageUrl: string,
    isPrimary?: boolean | null,
    order?: number | null,
    updatedAt: string,
    vehicle?:  {
      __typename: "Vehicle",
      batteryLevel?: number | null,
      color?: string | null,
      createdAt: string,
      firmwareVersion?: string | null,
      id: string,
      imageUrl?: string | null,
      lastSyncedAt?: string | null,
      licensePlate?: string | null,
      locationLat?: number | null,
      locationLng?: number | null,
      make: string,
      model: string,
      odometer?: number | null,
      pricePerDay?: number | null,
      range?: number | null,
      status?: VehicleStatus | null,
      updatedAt: string,
      vin: string,
      year: number,
    } | null,
    vehicleId: string,
  } | null,
};

export type UpdateReservationMutationVariables = {
  condition?: ModelReservationConditionInput | null,
  input: UpdateReservationInput,
};

export type UpdateReservationMutation = {
  updateReservation?:  {
    __typename: "Reservation",
    createdAt: string,
    endTime: string,
    id: string,
    owner?: string | null,
    startTime: string,
    status?: ReservationStatus | null,
    totalPrice?: number | null,
    updatedAt: string,
    userId: string,
    vehicle?:  {
      __typename: "Vehicle",
      batteryLevel?: number | null,
      color?: string | null,
      createdAt: string,
      firmwareVersion?: string | null,
      id: string,
      imageUrl?: string | null,
      lastSyncedAt?: string | null,
      licensePlate?: string | null,
      locationLat?: number | null,
      locationLng?: number | null,
      make: string,
      model: string,
      odometer?: number | null,
      pricePerDay?: number | null,
      range?: number | null,
      status?: VehicleStatus | null,
      updatedAt: string,
      vin: string,
      year: number,
    } | null,
    vehicleId: string,
  } | null,
};

export type UpdateTeslaIntegrationMutationVariables = {
  condition?: ModelTeslaIntegrationConditionInput | null,
  input: UpdateTeslaIntegrationInput,
};

export type UpdateTeslaIntegrationMutation = {
  updateTeslaIntegration?:  {
    __typename: "TeslaIntegration",
    accessToken: string,
    createdAt: string,
    expiresIn?: number | null,
    id: string,
    refreshToken: string,
    tokenType?: string | null,
    updatedAt: string,
  } | null,
};

export type UpdateUserProfileMutationVariables = {
  condition?: ModelUserProfileConditionInput | null,
  input: UpdateUserProfileInput,
};

export type UpdateUserProfileMutation = {
  updateUserProfile?:  {
    __typename: "UserProfile",
    createdAt: string,
    email: string,
    id: string,
    name?: string | null,
    profilePictureUrl?: string | null,
    role: UserRole,
    status?: UserStatus | null,
    updatedAt: string,
    userId: string,
  } | null,
};

export type UpdateVehicleMutationVariables = {
  condition?: ModelVehicleConditionInput | null,
  input: UpdateVehicleInput,
};

export type UpdateVehicleMutation = {
  updateVehicle?:  {
    __typename: "Vehicle",
    batteryLevel?: number | null,
    color?: string | null,
    createdAt: string,
    firmwareVersion?: string | null,
    id: string,
    imageUrl?: string | null,
    images?:  {
      __typename: "ModelVehicleImageConnection",
      nextToken?: string | null,
    } | null,
    lastSyncedAt?: string | null,
    licensePlate?: string | null,
    locationLat?: number | null,
    locationLng?: number | null,
    make: string,
    model: string,
    odometer?: number | null,
    pricePerDay?: number | null,
    range?: number | null,
    reservations?:  {
      __typename: "ModelReservationConnection",
      nextToken?: string | null,
    } | null,
    status?: VehicleStatus | null,
    updatedAt: string,
    vin: string,
    year: number,
  } | null,
};

export type UpdateVehicleImageMutationVariables = {
  condition?: ModelVehicleImageConditionInput | null,
  input: UpdateVehicleImageInput,
};

export type UpdateVehicleImageMutation = {
  updateVehicleImage?:  {
    __typename: "VehicleImage",
    caption?: string | null,
    createdAt: string,
    id: string,
    imageUrl: string,
    isPrimary?: boolean | null,
    order?: number | null,
    updatedAt: string,
    vehicle?:  {
      __typename: "Vehicle",
      batteryLevel?: number | null,
      color?: string | null,
      createdAt: string,
      firmwareVersion?: string | null,
      id: string,
      imageUrl?: string | null,
      lastSyncedAt?: string | null,
      licensePlate?: string | null,
      locationLat?: number | null,
      locationLng?: number | null,
      make: string,
      model: string,
      odometer?: number | null,
      pricePerDay?: number | null,
      range?: number | null,
      status?: VehicleStatus | null,
      updatedAt: string,
      vin: string,
      year: number,
    } | null,
    vehicleId: string,
  } | null,
};

export type OnCreateReservationSubscriptionVariables = {
  filter?: ModelSubscriptionReservationFilterInput | null,
  owner?: string | null,
};

export type OnCreateReservationSubscription = {
  onCreateReservation?:  {
    __typename: "Reservation",
    createdAt: string,
    endTime: string,
    id: string,
    owner?: string | null,
    startTime: string,
    status?: ReservationStatus | null,
    totalPrice?: number | null,
    updatedAt: string,
    userId: string,
    vehicle?:  {
      __typename: "Vehicle",
      batteryLevel?: number | null,
      color?: string | null,
      createdAt: string,
      firmwareVersion?: string | null,
      id: string,
      imageUrl?: string | null,
      lastSyncedAt?: string | null,
      licensePlate?: string | null,
      locationLat?: number | null,
      locationLng?: number | null,
      make: string,
      model: string,
      odometer?: number | null,
      pricePerDay?: number | null,
      range?: number | null,
      status?: VehicleStatus | null,
      updatedAt: string,
      vin: string,
      year: number,
    } | null,
    vehicleId: string,
  } | null,
};

export type OnCreateTeslaIntegrationSubscriptionVariables = {
  filter?: ModelSubscriptionTeslaIntegrationFilterInput | null,
};

export type OnCreateTeslaIntegrationSubscription = {
  onCreateTeslaIntegration?:  {
    __typename: "TeslaIntegration",
    accessToken: string,
    createdAt: string,
    expiresIn?: number | null,
    id: string,
    refreshToken: string,
    tokenType?: string | null,
    updatedAt: string,
  } | null,
};

export type OnCreateUserProfileSubscriptionVariables = {
  filter?: ModelSubscriptionUserProfileFilterInput | null,
};

export type OnCreateUserProfileSubscription = {
  onCreateUserProfile?:  {
    __typename: "UserProfile",
    createdAt: string,
    email: string,
    id: string,
    name?: string | null,
    profilePictureUrl?: string | null,
    role: UserRole,
    status?: UserStatus | null,
    updatedAt: string,
    userId: string,
  } | null,
};

export type OnCreateVehicleSubscriptionVariables = {
  filter?: ModelSubscriptionVehicleFilterInput | null,
};

export type OnCreateVehicleSubscription = {
  onCreateVehicle?:  {
    __typename: "Vehicle",
    batteryLevel?: number | null,
    color?: string | null,
    createdAt: string,
    firmwareVersion?: string | null,
    id: string,
    imageUrl?: string | null,
    images?:  {
      __typename: "ModelVehicleImageConnection",
      nextToken?: string | null,
    } | null,
    lastSyncedAt?: string | null,
    licensePlate?: string | null,
    locationLat?: number | null,
    locationLng?: number | null,
    make: string,
    model: string,
    odometer?: number | null,
    pricePerDay?: number | null,
    range?: number | null,
    reservations?:  {
      __typename: "ModelReservationConnection",
      nextToken?: string | null,
    } | null,
    status?: VehicleStatus | null,
    updatedAt: string,
    vin: string,
    year: number,
  } | null,
};

export type OnCreateVehicleImageSubscriptionVariables = {
  filter?: ModelSubscriptionVehicleImageFilterInput | null,
};

export type OnCreateVehicleImageSubscription = {
  onCreateVehicleImage?:  {
    __typename: "VehicleImage",
    caption?: string | null,
    createdAt: string,
    id: string,
    imageUrl: string,
    isPrimary?: boolean | null,
    order?: number | null,
    updatedAt: string,
    vehicle?:  {
      __typename: "Vehicle",
      batteryLevel?: number | null,
      color?: string | null,
      createdAt: string,
      firmwareVersion?: string | null,
      id: string,
      imageUrl?: string | null,
      lastSyncedAt?: string | null,
      licensePlate?: string | null,
      locationLat?: number | null,
      locationLng?: number | null,
      make: string,
      model: string,
      odometer?: number | null,
      pricePerDay?: number | null,
      range?: number | null,
      status?: VehicleStatus | null,
      updatedAt: string,
      vin: string,
      year: number,
    } | null,
    vehicleId: string,
  } | null,
};

export type OnDeleteReservationSubscriptionVariables = {
  filter?: ModelSubscriptionReservationFilterInput | null,
  owner?: string | null,
};

export type OnDeleteReservationSubscription = {
  onDeleteReservation?:  {
    __typename: "Reservation",
    createdAt: string,
    endTime: string,
    id: string,
    owner?: string | null,
    startTime: string,
    status?: ReservationStatus | null,
    totalPrice?: number | null,
    updatedAt: string,
    userId: string,
    vehicle?:  {
      __typename: "Vehicle",
      batteryLevel?: number | null,
      color?: string | null,
      createdAt: string,
      firmwareVersion?: string | null,
      id: string,
      imageUrl?: string | null,
      lastSyncedAt?: string | null,
      licensePlate?: string | null,
      locationLat?: number | null,
      locationLng?: number | null,
      make: string,
      model: string,
      odometer?: number | null,
      pricePerDay?: number | null,
      range?: number | null,
      status?: VehicleStatus | null,
      updatedAt: string,
      vin: string,
      year: number,
    } | null,
    vehicleId: string,
  } | null,
};

export type OnDeleteTeslaIntegrationSubscriptionVariables = {
  filter?: ModelSubscriptionTeslaIntegrationFilterInput | null,
};

export type OnDeleteTeslaIntegrationSubscription = {
  onDeleteTeslaIntegration?:  {
    __typename: "TeslaIntegration",
    accessToken: string,
    createdAt: string,
    expiresIn?: number | null,
    id: string,
    refreshToken: string,
    tokenType?: string | null,
    updatedAt: string,
  } | null,
};

export type OnDeleteUserProfileSubscriptionVariables = {
  filter?: ModelSubscriptionUserProfileFilterInput | null,
};

export type OnDeleteUserProfileSubscription = {
  onDeleteUserProfile?:  {
    __typename: "UserProfile",
    createdAt: string,
    email: string,
    id: string,
    name?: string | null,
    profilePictureUrl?: string | null,
    role: UserRole,
    status?: UserStatus | null,
    updatedAt: string,
    userId: string,
  } | null,
};

export type OnDeleteVehicleSubscriptionVariables = {
  filter?: ModelSubscriptionVehicleFilterInput | null,
};

export type OnDeleteVehicleSubscription = {
  onDeleteVehicle?:  {
    __typename: "Vehicle",
    batteryLevel?: number | null,
    color?: string | null,
    createdAt: string,
    firmwareVersion?: string | null,
    id: string,
    imageUrl?: string | null,
    images?:  {
      __typename: "ModelVehicleImageConnection",
      nextToken?: string | null,
    } | null,
    lastSyncedAt?: string | null,
    licensePlate?: string | null,
    locationLat?: number | null,
    locationLng?: number | null,
    make: string,
    model: string,
    odometer?: number | null,
    pricePerDay?: number | null,
    range?: number | null,
    reservations?:  {
      __typename: "ModelReservationConnection",
      nextToken?: string | null,
    } | null,
    status?: VehicleStatus | null,
    updatedAt: string,
    vin: string,
    year: number,
  } | null,
};

export type OnDeleteVehicleImageSubscriptionVariables = {
  filter?: ModelSubscriptionVehicleImageFilterInput | null,
};

export type OnDeleteVehicleImageSubscription = {
  onDeleteVehicleImage?:  {
    __typename: "VehicleImage",
    caption?: string | null,
    createdAt: string,
    id: string,
    imageUrl: string,
    isPrimary?: boolean | null,
    order?: number | null,
    updatedAt: string,
    vehicle?:  {
      __typename: "Vehicle",
      batteryLevel?: number | null,
      color?: string | null,
      createdAt: string,
      firmwareVersion?: string | null,
      id: string,
      imageUrl?: string | null,
      lastSyncedAt?: string | null,
      licensePlate?: string | null,
      locationLat?: number | null,
      locationLng?: number | null,
      make: string,
      model: string,
      odometer?: number | null,
      pricePerDay?: number | null,
      range?: number | null,
      status?: VehicleStatus | null,
      updatedAt: string,
      vin: string,
      year: number,
    } | null,
    vehicleId: string,
  } | null,
};

export type OnUpdateReservationSubscriptionVariables = {
  filter?: ModelSubscriptionReservationFilterInput | null,
  owner?: string | null,
};

export type OnUpdateReservationSubscription = {
  onUpdateReservation?:  {
    __typename: "Reservation",
    createdAt: string,
    endTime: string,
    id: string,
    owner?: string | null,
    startTime: string,
    status?: ReservationStatus | null,
    totalPrice?: number | null,
    updatedAt: string,
    userId: string,
    vehicle?:  {
      __typename: "Vehicle",
      batteryLevel?: number | null,
      color?: string | null,
      createdAt: string,
      firmwareVersion?: string | null,
      id: string,
      imageUrl?: string | null,
      lastSyncedAt?: string | null,
      licensePlate?: string | null,
      locationLat?: number | null,
      locationLng?: number | null,
      make: string,
      model: string,
      odometer?: number | null,
      pricePerDay?: number | null,
      range?: number | null,
      status?: VehicleStatus | null,
      updatedAt: string,
      vin: string,
      year: number,
    } | null,
    vehicleId: string,
  } | null,
};

export type OnUpdateTeslaIntegrationSubscriptionVariables = {
  filter?: ModelSubscriptionTeslaIntegrationFilterInput | null,
};

export type OnUpdateTeslaIntegrationSubscription = {
  onUpdateTeslaIntegration?:  {
    __typename: "TeslaIntegration",
    accessToken: string,
    createdAt: string,
    expiresIn?: number | null,
    id: string,
    refreshToken: string,
    tokenType?: string | null,
    updatedAt: string,
  } | null,
};

export type OnUpdateUserProfileSubscriptionVariables = {
  filter?: ModelSubscriptionUserProfileFilterInput | null,
};

export type OnUpdateUserProfileSubscription = {
  onUpdateUserProfile?:  {
    __typename: "UserProfile",
    createdAt: string,
    email: string,
    id: string,
    name?: string | null,
    profilePictureUrl?: string | null,
    role: UserRole,
    status?: UserStatus | null,
    updatedAt: string,
    userId: string,
  } | null,
};

export type OnUpdateVehicleSubscriptionVariables = {
  filter?: ModelSubscriptionVehicleFilterInput | null,
};

export type OnUpdateVehicleSubscription = {
  onUpdateVehicle?:  {
    __typename: "Vehicle",
    batteryLevel?: number | null,
    color?: string | null,
    createdAt: string,
    firmwareVersion?: string | null,
    id: string,
    imageUrl?: string | null,
    images?:  {
      __typename: "ModelVehicleImageConnection",
      nextToken?: string | null,
    } | null,
    lastSyncedAt?: string | null,
    licensePlate?: string | null,
    locationLat?: number | null,
    locationLng?: number | null,
    make: string,
    model: string,
    odometer?: number | null,
    pricePerDay?: number | null,
    range?: number | null,
    reservations?:  {
      __typename: "ModelReservationConnection",
      nextToken?: string | null,
    } | null,
    status?: VehicleStatus | null,
    updatedAt: string,
    vin: string,
    year: number,
  } | null,
};

export type OnUpdateVehicleImageSubscriptionVariables = {
  filter?: ModelSubscriptionVehicleImageFilterInput | null,
};

export type OnUpdateVehicleImageSubscription = {
  onUpdateVehicleImage?:  {
    __typename: "VehicleImage",
    caption?: string | null,
    createdAt: string,
    id: string,
    imageUrl: string,
    isPrimary?: boolean | null,
    order?: number | null,
    updatedAt: string,
    vehicle?:  {
      __typename: "Vehicle",
      batteryLevel?: number | null,
      color?: string | null,
      createdAt: string,
      firmwareVersion?: string | null,
      id: string,
      imageUrl?: string | null,
      lastSyncedAt?: string | null,
      licensePlate?: string | null,
      locationLat?: number | null,
      locationLng?: number | null,
      make: string,
      model: string,
      odometer?: number | null,
      pricePerDay?: number | null,
      range?: number | null,
      status?: VehicleStatus | null,
      updatedAt: string,
      vin: string,
      year: number,
    } | null,
    vehicleId: string,
  } | null,
};
