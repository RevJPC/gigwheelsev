import { type ClientSchema, a, defineData } from '@aws-amplify/backend';
import { teslaConnect } from '../functions/tesla-connect/resource';
import { teslaSync } from '../functions/tesla-sync/resource';
import { teslaRegister } from '../functions/tesla-register/resource';
import { deleteUser } from '../functions/delete-user/resource';
import { sendChangeEmail } from '../functions/send-change-email/resource';

/*
 * Define your data schema
 * @see https://docs.amplify.aws/gen2/build-a-backend/data/data-modeling/
 * Updated: Added ProfileChangeRequest model and split name/address fields
 */
const schema = a.schema({
    UserRole: a.enum(['CUSTOMER', 'EMPLOYEE', 'ADMIN']),
    UserStatus: a.enum(['ACTIVE', 'SUSPENDED']),
    VehicleStatus: a.enum(['AVAILABLE', 'RENTED', 'MAINTENANCE', 'CHARGING']),
    ChangeRequestStatus: a.enum(['PENDING', 'APPROVED', 'REJECTED']),

    Vehicle: a.model({
        make: a.string().required(),
        model: a.string().required(),
        year: a.integer().required(),
        vin: a.string().required(),
        licensePlate: a.string(),
        batteryLevel: a.integer(), // 0-100
        range: a.float(), // miles
        status: a.ref('VehicleStatus'),
        locationLat: a.float(),
        locationLng: a.float(),
        pricePerDay: a.float(),
        color: a.string(),
        imageUrl: a.string(),
        firmwareVersion: a.string(),
        lastSyncedAt: a.datetime(),
        odometer: a.float(), // miles
        reservations: a.hasMany('Reservation', 'vehicleId'),
        images: a.hasMany('VehicleImage', 'vehicleId'),
        availability: a.hasMany('VehicleAvailability', 'vehicleId'),
    }).authorization(allow => [allow.publicApiKey()]), // Open for now, refine later

    VehicleImage: a.model({
        vehicleId: a.id().required(),
        vehicle: a.belongsTo('Vehicle', 'vehicleId'),
        imageUrl: a.string().required(),
        isPrimary: a.boolean().default(false),
        caption: a.string(),
        order: a.integer().default(0),
    }).authorization(allow => [allow.publicApiKey()]),

    ReservationStatus: a.enum(['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED']),

    Reservation: a.model({
        vehicleId: a.id().required(),
        vehicle: a.belongsTo('Vehicle', 'vehicleId'),
        userId: a.string().required(), // Cognito Sub
        startTime: a.datetime().required(),
        endTime: a.datetime().required(),
        status: a.ref('ReservationStatus'),
        totalPrice: a.float(),
    }).authorization(allow => [allow.publicApiKey()]), // TODO: Restrict to user's own reservations

    TeslaIntegration: a.model({
        accessToken: a.string().required(),
        refreshToken: a.string().required(),
        expiresIn: a.integer(),
        tokenType: a.string(),
    }).authorization(allow => [allow.publicApiKey()]), // TODO: Restrict to Admin

    UserProfile: a.model({
        userId: a.string().required(), // Cognito sub
        email: a.string().required(),
        firstName: a.string(),
        lastName: a.string(),
        role: a.ref('UserRole').required(),
        status: a.ref('UserStatus'),
        profilePictureUrl: a.string(),
        phoneNumber: a.string(),
        streetAddress: a.string(),
        city: a.string(),
        state: a.string(),
        zipCode: a.string(),
        licenseNumber: a.string(),
        insurancePolicyNumber: a.string(),
    }).authorization(allow => [allow.publicApiKey()]), // TODO: Restrict properly

    ProfileChangeRequest: a.model({
        userId: a.string().required(), // User whose profile will be changed
        requestedBy: a.string().required(), // Admin/Employee who requested
        newData: a.json().required(), // Proposed changes as JSON
        token: a.string().required(), // Unique confirmation token
        status: a.ref('ChangeRequestStatus').required(),
    }).authorization(allow => [allow.publicApiKey()]), // TODO: Restrict properly

    VehicleAvailability: a.model({
        vehicleId: a.id().required(),
        vehicle: a.belongsTo('Vehicle', 'vehicleId'),
        startTime: a.datetime().required(),
        endTime: a.datetime().required(),
        isAvailable: a.boolean().required().default(true), // true = available, false = blocked
        reason: a.string(), // Optional reason for blocking (maintenance, etc.)
    }).authorization(allow => [allow.publicApiKey()]), // TODO: Restrict to Admin/Employee

    teslaConnect: a.query()
        .arguments({
            code: a.string(),
            redirectUri: a.string()
        })
        .returns(a.json())
        .authorization(allow => [allow.publicApiKey()])
        .handler(a.handler.function(teslaConnect)),

    teslaSync: a.query()
        .returns(a.json())
        .authorization(allow => [allow.publicApiKey()])
        .handler(a.handler.function(teslaSync)),

    teslaRegister: a.query()
        .arguments({
            domain: a.string()
        })
        .returns(a.json())
        .authorization(allow => [allow.publicApiKey()])
        .handler(a.handler.function(teslaRegister)),

    deleteUser: a.mutation()
        .arguments({
            userId: a.string().required()
        })
        .returns(a.json())
        .authorization(allow => [allow.publicApiKey()]) // TODO: Restrict to Admin
        .handler(a.handler.function(deleteUser)),

    sendChangeEmail: a.mutation()
        .arguments({
            email: a.string().required(),
            token: a.string().required(),
            requestId: a.string().required(),
            changes: a.json().required()
        })
        .returns(a.json())
        .authorization(allow => [allow.publicApiKey()]) // TODO: Restrict to Admin
        .handler(a.handler.function(sendChangeEmail)),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
    schema,
    authorizationModes: {
        defaultAuthorizationMode: 'apiKey',
        apiKeyAuthorizationMode: {
            expiresInDays: 30,
        },
    },
});
