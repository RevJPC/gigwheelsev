import { generateClient } from "aws-amplify/data";
import type { Schema } from "../amplify/data/resource";
import { Amplify } from "aws-amplify";
import outputs from "../amplify_outputs.json";

Amplify.configure(outputs);

const client = generateClient<Schema>();

async function seedAvailability() {
    try {
        // 1. Get a vehicle
        const { data: vehicles } = await client.models.Vehicle.list();
        if (vehicles.length === 0) {
            console.log("No vehicles found. Please seed vehicles first.");
            return;
        }

        const vehicle = vehicles[0];
        console.log(`Seeding availability for vehicle: ${vehicle.make} ${vehicle.model} (${vehicle.id})`);

        // 2. Create a blocked slot for tomorrow from 10:00 to 14:00
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const startTime = new Date(tomorrow);
        startTime.setHours(10, 0, 0, 0);
        const endTime = new Date(tomorrow);
        endTime.setHours(14, 0, 0, 0);

        console.log(`Creating blocked slot: ${startTime.toISOString()} - ${endTime.toISOString()}`);

        const { data: newSlot, errors } = await client.models.VehicleAvailability.create({
            vehicleId: vehicle.id,
            startTime: startTime.toISOString(),
            endTime: endTime.toISOString(),
            isAvailable: false,
            reason: "Scheduled Maintenance (Seeded)",
        });

        if (errors) {
            console.error("Error creating slot:", errors);
        } else {
            console.log("Successfully created availability slot:", newSlot);
        }

    } catch (error) {
        console.error("An error occurred:", error);
    }
}

seedAvailability();
