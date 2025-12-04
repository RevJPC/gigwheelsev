import { type ClientSchema, a, defineData } from '@aws-amplify/backend';
import { teslaConnect } from '../functions/tesla-connect/resource';
import { teslaSync } from '../functions/tesla-sync/resource';
import { teslaRegister } from '../functions/tesla-register/resource';

/*
 * Define your data schema
 * @see https://docs.amplify.aws/gen2/build-a-backend/data/data-modeling/
 */
const schema = a.schema({
    UserRole: a.enum(['CUSTOMER', 'EMPLOYEE', 'ADMIN']),
    VehicleStatus: a.enum(['AVAILABLE', 'RENTED', 'MAINTENANCE', 'CHARGING']),

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
        reservations: a.hasMany('Reservation', 'vehicleId'),
    }).authorization(allow => [allow.publicApiKey()]), // Open for now, refine later

    ReservationStatus: a.enum(['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED']),

    Reservation: a.model({
        vehicleId: a.id().required(),
        vehicle: a.belongsTo('Vehicle', 'vehicleId'),
        userId: a.string().required(), // Cognito Sub
        startTime: a.datetime().required(),
        endTime: a.datetime().required(),
        status: a.ref('ReservationStatus'),
        totalPrice: a.float(),
    }).authorization(allow => [allow.owner()]), // Only owner can see/edit

    TeslaIntegration: a.model({
        accessToken: a.string().required(),
        refreshToken: a.string().required(),
        expiresIn: a.integer(),
        tokenType: a.string(),
    }).authorization(allow => [allow.publicApiKey()]), // TODO: Restrict to Admin

    UserProfile: a.model({
        userId: a.string().required(), // Cognito sub
        email: a.string().required(),
        name: a.string(),
        role: a.ref('UserRole').required(),
    }).authorization(allow => [allow.publicApiKey()]), // TODO: Restrict properly

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
