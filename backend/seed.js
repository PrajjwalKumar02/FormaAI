const mongoose = require("mongoose");
const dotenv = require("dotenv");
const FormSchema = require("./models/FormSchema");

dotenv.config();

// 3-level deep branching Insurance Claim schema
// Level 1: incidentType (always shown)
// Level 2: collisionType (shown only if incidentType = collision)
// Level 3: airbagDeployed (shown only if incidentType = collision AND collisionType = vehicle)
const sampleSchema = {
  name: "InsuranceClaim",
  version: 2,
  fields: [
    // LEVEL 1 - always shown
    {
      name: "vehicleBrand",
      type: "enum",
      label: "Vehicle Brand",
      description: "Select the make of the vehicle involved in the incident",
      required: true,
      enum: ["Honda City", "Toyota Camry", "Ford Focus", "Other"],
    },
    {
      name: "incidentType",
      type: "enum",
      label: "Incident Type",
      required: true,
      enum: ["animal_collision", "theft", "collision", "natural_disaster"],
    },
    {
      name: "damage",
      type: "string",
      label: "Damage description",
      required: true,
    },
    {
      name: "road",
      type: "string",
      label: "Road / Highway",
      required: true,
    },

    // LEVEL 2 - shown only if incidentType = animal_collision
    {
      name: "animalType",
      type: "string",
      label: "Animal type",
      required: false,
      showIf: {
        logic: "AND",
        conditions: [
          { field: "incidentType", operator: "equals", value: "animal_collision" },
        ],
      },
    },

    // LEVEL 2 - shown only if incidentType = collision
    {
      name: "collisionType",
      type: "enum",
      label: "Type of collision",
      required: false,
      enum: ["vehicle", "wall", "pole", "other"],
      showIf: {
        logic: "AND",
        conditions: [
          { field: "incidentType", operator: "equals", value: "collision" },
        ],
      },
    },

    // LEVEL 3 - shown only if incidentType = collision AND collisionType = vehicle
    {
      name: "airbagDeployed",
      type: "enum",
      label: "Was airbag deployed?",
      required: false,
      enum: ["yes", "no", "unknown"],
      showIf: {
        logic: "AND",
        conditions: [
          { field: "incidentType", operator: "equals", value: "collision" },
          { field: "collisionType", operator: "equals", value: "vehicle" },
        ],
      },
    },
  ],
};

const healthcareSchema = {
  name: "HealthcareClaim",
  version: 1,
  fields: [
    {
      name: "patientName",
      type: "string",
      label: "Patient Full Name",
      required: true,
    },
    {
      name: "treatmentType",
      type: "enum",
      label: "Type of Treatment",
      required: true,
      enum: ["consultation", "surgery", "medication", "therapy"],
    },
    {
      name: "hospitalStay",
      type: "boolean",
      label: "Was there an overnight hospital stay?",
      required: true,
    },
    {
      name: "dischargeDate",
      type: "date",
      label: "Date of Discharge",
      required: false,
      showIf: {
        logic: "AND",
        conditions: [
          { field: "hospitalStay", operator: "equals", value: true },
        ],
      },
    }
  ],
};

const runSeed = async () => {
  try {
    const dbUri = process.env.MONGODB_URI;
    if (!dbUri) {
      console.error("❌ MONGODB_URI is missing in .env file");
      process.exit(1);
    }
    await mongoose.connect(dbUri);
    
    // Seed Insurance Claim
    await FormSchema.deleteMany({ name: "InsuranceClaim" });
    const createdInsurance = await FormSchema.create(sampleSchema);
    console.log("✅ Seeded InsuranceClaim schema successfully!");
    
    // Seed Healthcare Claim
    await FormSchema.deleteMany({ name: "HealthcareClaim" });
    const createdHealthcare = await FormSchema.create(healthcareSchema);
    console.log("✅ Seeded HealthcareClaim schema successfully!");
    
  } catch (error) {
    console.error("❌ Error seeding database:", error);
  } finally {
    await mongoose.disconnect();
  }
};

runSeed();
