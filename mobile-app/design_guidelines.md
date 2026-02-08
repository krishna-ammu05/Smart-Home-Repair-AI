# Smart Home Repair App - Design Guidelines

## Architecture Decisions

### Authentication
**Auth Required** - The app involves user accounts, repair history, technician booking, and data synchronization across devices.

**Implementation:**
- Use SSO for streamlined access
- Include Apple Sign-In (iOS requirement)
- Include Google Sign-In for Android/cross-platform
- Email/password as fallback option
- Login/Signup screens with privacy policy & terms of service links
- Account screen with log out and delete account options (delete nested under Settings > Account > Delete with double confirmation)

### Navigation Structure
**Tab Navigation** - The app has 5 distinct feature areas requiring easy access.

**Tab Bar Layout (5 tabs with center action):**
1. **Home** - Dashboard with recent repairs and quick actions
2. **History** - Past repairs and reports
3. **Scan** (Center, primary action) - Image/video upload for fault detection
4. **Technicians** - Directory and booking
5. **Profile** - Settings, account, and preferences

## Screen Specifications

### 1. Login/Signup Screen
- **Purpose:** Authenticate users and create accounts
- **Layout:**
  - Stack-only navigation (pre-auth flow)
  - No header (full-screen experience)
  - Centered logo/branding at top
  - SSO buttons (Apple, Google) above email/password option
  - Safe area insets: top: insets.top + Spacing.xl, bottom: insets.bottom + Spacing.xl
- **Components:** Input fields, social login buttons, "Forgot Password" link

### 2. Home Dashboard
- **Purpose:** Overview of app features, quick access to scan, recent activity
- **Layout:**
  - Transparent header with app logo, notifications icon (right)
  - Scrollable content area with cards for quick actions
  - Safe area insets: top: headerHeight + Spacing.xl, bottom: tabBarHeight + Spacing.xl
- **Components:** Greeting text, status cards, quick action buttons (Start Scan, View History, Find Technician)

### 3. Scan/Upload Screen (Center Tab)
- **Purpose:** Capture or upload images/videos of faulty appliances
- **Layout:**
  - Custom header with "Cancel" (left) and title
  - Main area: Camera preview or upload options
  - Floating action button for capture (with drop shadow)
  - Safe area insets: bottom: tabBarHeight + Spacing.xl
- **Components:** Camera view, gallery picker, capture button, upload progress indicator

### 4. Fault Detection Output
- **Purpose:** Display AI analysis results with detected faults
- **Layout:**
  - Standard header with back button, "Share" (right)
  - Scrollable content showing uploaded image, fault highlights, confidence scores
  - Safe area insets: top: Spacing.xl, bottom: tabBarHeight + Spacing.xl
- **Components:** Image with bounding boxes, fault labels, confidence percentages, "Get Repair Guide" CTA button

### 5. Repair Guidance Screen
- **Purpose:** Provide step-by-step interactive repair instructions
- **Layout:**
  - Header with back button, progress indicator, "Help" (right)
  - Scrollable step-by-step guide with visual aids
  - Bottom fixed area: "Previous" and "Next" buttons
  - Safe area insets: top: Spacing.xl, bottom: tabBarHeight + Spacing.2xl
- **Components:** Step cards with images/diagrams, checkboxes for completion, video thumbnails, "Call Technician" emergency button

### 6. Technician List
- **Purpose:** Browse and filter available technicians
- **Layout:**
  - Header with search bar, filter icon (right)
  - List view with technician cards
  - Safe area insets: top: headerHeight + Spacing.xl, bottom: tabBarHeight + Spacing.xl
- **Components:** Search bar, filter chips (specialty, rating, distance), technician cards (avatar, name, rating, specialty, distance)

### 7. Booking Confirmation
- **Purpose:** Finalize technician appointment
- **Layout:**
  - Header with back button and "Edit" (right)
  - Scrollable form with booking details
  - Submit button below form content
  - Safe area insets: top: Spacing.xl, bottom: tabBarHeight + Spacing.2xl
- **Components:** Date/time picker, address input, service description, cost estimate, "Confirm Booking" button

### 8. Repair History
- **Purpose:** View past repairs and outcomes
- **Layout:**
  - Header with title, filter icon (right)
  - List view grouped by date/status
  - Safe area insets: top: headerHeight + Spacing.xl, bottom: tabBarHeight + Spacing.xl
- **Components:** History cards (thumbnail, fault type, date, status badge, verification result), pull-to-refresh

### 9. Profile/Settings
- **Purpose:** Manage account, preferences, app settings
- **Layout:**
  - Header with title
  - Scrollable settings list
  - Safe area insets: top: headerHeight + Spacing.xl, bottom: tabBarHeight + Spacing.xl
- **Components:** User avatar (editable), display name, settings groups (Account, Notifications, Privacy, About), log out button

## Design System

### Color Palette
**Primary:** Trustworthy blue (#2563EB) - represents reliability and technology
**Secondary:** Safety orange (#F97316) - for warnings and critical actions
**Success:** Green (#10B981) - for verified repairs and completion
**Background:** Clean white (#FFFFFF) with light gray sections (#F9FAFB)
**Text:** Dark gray (#1F2937) for primary, medium gray (#6B7280) for secondary
**Error:** Red (#EF4444) for faults and errors

### Typography
- **Headers:** System bold, 24-28pt for screen titles
- **Subheaders:** System semibold, 18-20pt for section titles
- **Body:** System regular, 16pt for readable content
- **Caption:** System regular, 14pt for metadata and labels

### Visual Design
**Icons:**
- Use Feather icons from @expo/vector-icons for consistency
- Scan icon for center tab (camera or crosshair)
- Home, clock (history), users (technicians), user (profile) for other tabs
- NO emojis anywhere in the app

**Touchable Feedback:**
- All buttons have press state with reduced opacity (0.7)
- Floating action buttons use drop shadow: shadowOffset {width: 0, height: 2}, shadowOpacity: 0.10, shadowRadius: 2

**Cards:**
- Rounded corners (12px border radius)
- Subtle border or light shadow for separation
- Adequate padding (16px)

**Assets Required:**
1. **AI Analysis Placeholder:** Generic appliance/tool icon for empty states
2. **Repair Success Illustration:** Checkmark or success graphic for verified repairs
3. **Technician Default Avatar:** Professional placeholder for unverified profiles
4. **Onboarding Illustrations:** 3 simple graphics explaining scan → diagnose → repair flow

**Accessibility:**
- Minimum touch target size: 44x44 points
- High contrast between text and backgrounds (WCAG AA)
- Descriptive labels for all interactive elements
- Support for system font scaling
- VoiceOver/TalkBack compatibility for elderly users