# Database Setup (Member 4)

## Models (`backend/models/`)
- `User.js` - User accounts & authentication
- `FormSchema.js` - Form fields, types, and showIf conditional logic
- `Draft.js` - Saved incomplete forms (Save & Resume)
- `Submission.js` - Final submitted form responses
- `AIExtraction.js` - Logs for AI extractions

## How to Seed Sample Data
1. Make sure `MONGODB_URI` is set in `backend/.env`.
2. Run the seed script:
```bash
cd backend
node seed.js
```
