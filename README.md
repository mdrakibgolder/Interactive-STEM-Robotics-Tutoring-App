# Interactive STEM & Robotics Tutoring App

An educational mobile app that blends digital tutoring with real-world, hands-on learning.
The app uses the phone camera to analyze robotics setups, handwritten logic, and hardware sketches, then provides real-time contextual feedback with gamified progress.

## 🔗 GitHub

- Repository: https://github.com/mdrakibgolder/Interactive-STEM-Robotics-Tutoring-App

## ✨ Core Features

- **Track-based tutoring**
  - Robotics
  - Coding Logic
  - Computer Architecture
- **Interactive lesson cards** with objectives, guided steps, and XP rewards
- **Camera-powered analysis pipeline**
  - Captures a snapshot of learner work
  - Runs on-device image signal analysis
  - Produces structured scoring + feedback recommendations
- **Gamification engine**
  - XP + level progression
  - Skill tiers
  - Badge unlock system
- **Progress dashboard**
  - Completed lesson counts
  - Scan session metrics
  - Average score and next-step coaching

## 🧱 Tech Stack

- **Framework:** React Native + Expo (TypeScript)
- **Camera:** `expo-camera`
- **Image analysis utilities:** `expo-image-manipulator`
- **State model:** Local app state (hooks-based)

## 📁 Project Structure

```text
stem-app/
├─ App.tsx
├─ app.json
├─ package.json
└─ src/
   ├─ data/
   │  └─ curriculum.ts
   ├─ engine/
   │  └─ analysis.ts
   └─ types.ts
```

## 🚀 Getting Started

### 1) Install dependencies

```bash
npm install
```

### 2) Start development server

```bash
npm start
```

### 3) Run on device

- Install **Expo Go** on Android/iOS
- Scan the QR code shown in terminal

## ⚙️ Important Windows Path Note

If your folder name includes special characters like `&`, standard Expo shim calls can break on Windows shells.
This project already includes a script workaround in `package.json`:

```json
"start": "node ./node_modules/expo/bin/cli start"
```

So using `npm start` is the recommended command.

## 📸 Camera Permissions

Permissions are configured in `app.json`:

- iOS usage description (`NSCameraUsageDescription`)
- Android `CAMERA` permission

## 🧠 How Analysis Works (MVP)

Current implementation uses lightweight signal extraction from captured image data to generate:

- Structural Alignment score
- Execution Consistency score
- Technical Precision score
- Overall score + strengths + recommendations

This is designed as an MVP-friendly CV pipeline and can later be upgraded to OpenCV/TFLite models.

## 🛣️ Suggested Next Upgrades

- Persistent storage for XP, badges, and report history (`AsyncStorage`)
- Real OpenCV/TFLite model integration for component/diagram detection
- User accounts and cloud sync
- Teacher/parent dashboard

## 📄 License

No license file has been added yet. Add one if you plan public reuse.
