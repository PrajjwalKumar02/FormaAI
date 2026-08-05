const mongoose = require("mongoose");
const dotenv = require("dotenv");
const FormSchema = require("./models/FormSchema");

dotenv.config();

const sampleSchema = {
  name: "InsuranceClaim",
  version: 1,
  fields: [
    {
      name: "vehicleBrand",
      type: "enum",
      label: "Vehicle Brand",
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
    {
      name: "animalType",
      type: "string",
      label: "Animal type (if animal_collision)",
      required: false,
      showIf: {
        field: "incidentType",
        operator: "equals",
        value: "animal_collision",
      },
    },
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
    await FormSchema.deleteMany({ name: "InsuranceClaim" });
    const created = await FormSchema.create(sampleSchema);
    console.log("✅ Seeded InsuranceClaim schema successfully!");
    console.log("Schema ID:", created._id);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
  } finally {
    await mongoose.disconnect();
  }
};

runSeed();
