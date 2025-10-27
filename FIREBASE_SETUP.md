# Firebase Setup Guide for MingleMakers

## Prerequisites
- A Google account
- Access to [Firebase Console](https://console.firebase.google.com/)

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add Project"
3. Enter project name: `minglemakers` (or your preferred name)
4. Follow the setup wizard (you can disable Google Analytics if not needed)

## Step 2: Enable Authentication

1. In your Firebase project, go to **Build → Authentication**
2. Click "Get Started"
3. Enable the following sign-in methods:
   - **Email/Password**: Click on it and toggle "Enable" → Save
   - **Google**: Click on it, toggle "Enable", enter your project support email → Save

## Step 3: Create Firestore Database

1. Go to **Build → Firestore Database**
2. Click "Create Database"
3. Choose production mode (or test mode for development)
4. Select a location closest to your users (e.g., asia-south1 for India)
5. Click "Enable"

## Step 4: Get Your Firebase Config

1. Go to **Project Settings** (gear icon)
2. Scroll down to "Your apps"
3. Click the web icon `</>`
4. Register your app with nickname: `minglemakers-web`
5. Copy the `firebaseConfig` object

## Step 5: Configure Environment Variables

1. Create a `.env` file in your project root
2. Copy the following template and replace with your values:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## Step 6: Configure Firestore Security Rules

In Firestore Database → Rules, paste the following:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own document
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Step 7: Test Your Setup

1. Run your development server: `npm run dev`
2. Navigate to `/signin`
3. Try creating an account with email/password
4. Check Firebase Console → Authentication to see the new user
5. Check Firestore Database → users collection to see the user document

## Firestore Document Structure

### users/{uid}
```json
{
  "role": "artisan" | "supplier",
  "clusters": ["handloom", "pottery", ...]
}
```

## Troubleshooting

### Authentication Errors
- Verify all environment variables are correct
- Check that Email/Password and Google auth are enabled in Firebase Console

### Firestore Permission Errors
- Ensure security rules are properly set
- Check that user is authenticated before writing to Firestore

### Environment Variables Not Loading
- Make sure `.env` file is in project root
- Restart your development server after adding/changing `.env` variables
- Variable names must start with `VITE_` to be accessible in Vite

## Production Deployment

When deploying to production:
1. Add your production domain to Firebase → Authentication → Settings → Authorized domains
2. Update environment variables in your hosting platform with production Firebase config
3. Update Firestore security rules for production use

## Support

For more information, visit:
- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Authentication Docs](https://firebase.google.com/docs/auth)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)
