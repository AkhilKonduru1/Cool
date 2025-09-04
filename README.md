# Eventure - Adventure Discovery App 🗺️

A streamlined React Native app built with Expo that helps users discover exciting adventures and activities in their area.

## Features

- 🎯 **AI-Powered Adventure Generation**: Get personalized adventure suggestions based on mood, time, and budget
- 📍 **Location-Based Discovery**: Find adventures near your current location
- 🏆 **Gamification**: Track streaks, earn badges, and level up
- 👥 **Social Features**: Connect with friends and share adventures
- 💾 **Memory Capsule**: Save your favorite adventures for later

## Tech Stack

- **Frontend**: React Native with Expo
- **Navigation**: Expo Router with file-based routing
- **UI Components**: Custom components with LinearGradient
- **Backend**: Python Flask API
- **Database**: SQLite
- **AI Integration**: Groq API for adventure generation

## Get Started

1. Install dependencies

   ```bash
   npm install
   ```

2. Set up your Groq API key

   - Get your API key from [Groq Console](https://console.groq.com/)
   - Update `app.json` with your actual API key:
   ```json
   "extra": {
     "groqApiKey": "your_actual_api_key_here"
   }
   ```

3. Start the development server

   ```bash
   npx expo start
   ```

4. Open the app in your preferred environment:
   - [Expo Go](https://expo.dev/go) for quick testing
   - [iOS Simulator](https://docs.expo.dev/workflow/ios-simulator/)
   - [Android Emulator](https://docs.expo.dev/workflow/android-studio-emulator/)

## Project Structure

```
├── app/                    # Main app screens (Expo Router)
├── components/             # Reusable UI components
├── services/              # API and AI services
├── types/                 # TypeScript type definitions
├── backend/               # Python Flask backend
└── assets/                # Images and fonts
```

## Recent Improvements

- ✅ Removed unused dependencies (expo-maps, react-native-maps, etc.)
- ✅ Consolidated UI components for better maintainability
- ✅ Enhanced .gitignore with comprehensive patterns
- ✅ Optimized bundle size and performance
- ✅ Cleaned up code structure and imports

## Learn More

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [Expo Router Guide](https://docs.expo.dev/router/introduction/)

## Contributing

This project is part of the Cool repository collection. Feel free to explore and contribute!
