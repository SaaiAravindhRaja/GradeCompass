# Design Document

## Overview

GradeCompass is a single-page React application that provides students with an intuitive interface for tracking course grades and predicting future academic outcomes. The application features a clean, academic-inspired design with real-time calculations, dynamic visualizations, and responsive layout that works seamlessly across devices.

## Architecture

### Frontend Architecture
- **Framework**: React 18 with functional components and hooks
- **State Management**: React's built-in useState and useEffect hooks for client-side state
- **Styling**: TailwindCSS for utility-first responsive design
- **Charts**: Recharts library for interactive pie chart visualizations
- **Build Tool**: Vite for fast development and optimized production builds
- **Persistence**: Browser localStorage for data persistence between sessions

### Application Structure
```
src/
├── components/           # Reusable UI components
├── hooks/               # Custom React hooks
├── utils/               # Utility functions and calculations
├── types/               # TypeScript type definitions
├── constants/           # Application constants
└── styles/              # Global styles and Tailwind config
```

## Components and Interfaces

### Core Components

#### 1. App Component (`App.jsx`)
- **Purpose**: Root component managing global state and routing between courses
- **State**: 
  - `courses`: Array of course objects
  - `activeCourseId`: Currently selected course ID
  - `darkMode`: Theme preference
- **Responsibilities**:
  - Course management (create, delete, switch)
  - Theme management
  - Data persistence coordination

#### 2. CourseManager Component (`CourseManager.jsx`)
- **Purpose**: Handles course selection and creation
- **Props**: 
  - `courses`: Array of courses
  - `activeCourseId`: Current course
  - `onCourseSelect`: Course selection handler
  - `onCourseCreate`: Course creation handler
  - `onCourseDelete`: Course deletion handler
- **Features**:
  - Course dropdown/tabs
  - Add new course button
  - Course deletion with confirmation

#### 3. GradeForm Component (`GradeForm.jsx`)
- **Purpose**: Input form for grade components
- **Props**:
  - `components`: Array of grade components
  - `onComponentsChange`: Update handler
- **Features**:
  - Dynamic add/remove grade components
  - Real-time weight validation
  - Input validation and error display
  - Auto-save functionality

#### 4. GradeSummary Component (`GradeSummary.jsx`)
- **Purpose**: Displays current grade calculations and predictions
- **Props**:
  - `components`: Grade components data
  - `targetGrade`: User's target grade
  - `onTargetGradeChange`: Target grade update handler
- **Features**:
  - Current weighted average display
  - Target grade input
  - Required scores calculation
  - Achievement status indicators

#### 5. GradeChart Component (`GradeChart.jsx`)
- **Purpose**: Visual representation of grade breakdown
- **Props**:
  - `components`: Grade components for visualization
- **Features**:
  - Interactive pie chart using Recharts
  - Color-coded segments (completed vs pending)
  - Hover tooltips with detailed information
  - Responsive sizing

#### 6. TargetGradeInput Component (`TargetGradeInput.jsx`)
- **Purpose**: Specialized input for target grade with validation
- **Props**:
  - `value`: Current target grade
  - `onChange`: Update handler
  - `isAchievable`: Whether target is possible
- **Features**:
  - Percentage input with validation
  - Visual feedback for achievability
  - Common grade presets (A, B, C, etc.)

### Custom Hooks

#### 1. useGradeCalculator Hook
```javascript
const useGradeCalculator = (components) => {
  // Returns calculated values:
  // - currentGrade
  // - completedWeight
  // - remainingWeight
  // - isComplete
}
```

#### 2. useTargetGradePredictor Hook
```javascript
const useTargetGradePredictor = (components, targetGrade) => {
  // Returns prediction data:
  // - requiredAverage
  // - isAchievable
  // - recommendations
}
```

#### 3. useLocalStorage Hook
```javascript
const useLocalStorage = (key, defaultValue) => {
  // Handles localStorage persistence
  // Returns [value, setValue] like useState
}
```

## Data Models

### Course Model
```javascript
{
  id: string,           // Unique identifier
  name: string,         // Course name
  components: Component[], // Grade components
  targetGrade: number,  // Target grade percentage
  createdAt: Date,      // Creation timestamp
  updatedAt: Date       // Last update timestamp
}
```

### Component Model
```javascript
{
  id: string,           // Unique identifier
  name: string,         // Component name (e.g., "Midterm")
  weight: number,       // Weight percentage (0-100)
  score: number | null, // Achieved score (null if not completed)
  maxScore: number,     // Maximum possible score (default: 100)
  isCompleted: boolean  // Whether component is finished
}
```

### Calculation Results Model
```javascript
{
  currentGrade: number,     // Current weighted average
  completedWeight: number,  // Total weight of completed components
  remainingWeight: number,  // Total weight of pending components
  requiredAverage: number,  // Required average on remaining components
  isTargetAchievable: boolean, // Whether target grade is possible
  recommendations: string[] // Suggestions for improvement
}
```

## Error Handling

### Validation Strategy
1. **Input Validation**: Real-time validation on form inputs
2. **Weight Validation**: Ensure total weights don't exceed 100%
3. **Score Validation**: Validate score ranges and formats
4. **Calculation Errors**: Handle division by zero and invalid calculations

### Error Display
- **Inline Errors**: Show validation errors next to relevant inputs
- **Summary Errors**: Display overall validation status
- **Toast Notifications**: For system-level errors and confirmations
- **Fallback UI**: Graceful degradation when calculations fail

### Error Recovery
- **Auto-correction**: Automatically fix minor input issues
- **Reset Options**: Allow users to reset invalid data
- **Data Backup**: Maintain backup of last valid state

## Testing Strategy

### Unit Testing
- **Calculation Functions**: Test all grade calculation logic
- **Validation Functions**: Test input validation rules
- **Utility Functions**: Test helper functions and formatters
- **Custom Hooks**: Test hook behavior and state management

### Component Testing
- **Rendering Tests**: Ensure components render correctly
- **Interaction Tests**: Test user interactions and state changes
- **Props Testing**: Verify component behavior with different props
- **Error State Testing**: Test error handling and display

### Integration Testing
- **Data Flow**: Test data flow between components
- **Persistence**: Test localStorage integration
- **Calculations**: Test end-to-end calculation workflows
- **Responsive Design**: Test layout across different screen sizes

### User Acceptance Testing
- **Usability Testing**: Ensure intuitive user experience
- **Accessibility Testing**: Verify keyboard navigation and screen reader support
- **Performance Testing**: Test with large datasets and multiple courses
- **Cross-browser Testing**: Ensure compatibility across browsers

## UI/UX Design Specifications

### Design System

#### Color Palette
- **Primary**: Blue (#3B82F6) - for main actions and highlights
- **Secondary**: Green (#10B981) - for positive states and achievements
- **Warning**: Yellow (#F59E0B) - for borderline cases and warnings
- **Danger**: Red (#EF4444) - for errors and impossible targets
- **Neutral**: Gray scale (#F9FAFB to #111827) - for text and backgrounds

#### Typography
- **Headings**: Inter font family, weights 600-700
- **Body Text**: Inter font family, weights 400-500
- **Monospace**: JetBrains Mono for numerical displays

#### Spacing and Layout
- **Grid System**: 12-column responsive grid using Tailwind
- **Spacing Scale**: Tailwind's default spacing scale (4px base unit)
- **Breakpoints**: Mobile-first responsive design
  - Mobile: 320px - 768px
  - Tablet: 768px - 1024px
  - Desktop: 1024px+

### Component Design Patterns

#### Cards
- Rounded corners (8px border radius)
- Subtle shadows for depth
- White background with gray borders
- Consistent padding (16px-24px)

#### Forms
- Floating labels for better UX
- Clear validation states with colors and icons
- Consistent input heights (44px minimum for touch targets)
- Grouped related inputs with visual separation

#### Charts
- Consistent color scheme across all visualizations
- Interactive elements with hover states
- Responsive sizing that maintains aspect ratio
- Clear legends and labels

### Accessibility Features
- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Reader Support**: Proper ARIA labels and descriptions
- **Color Contrast**: WCAG AA compliant color combinations
- **Focus Management**: Clear focus indicators and logical tab order
- **Alternative Text**: Descriptive alt text for visual elements

### Responsive Behavior
- **Mobile**: Single column layout, stacked components
- **Tablet**: Two-column layout where appropriate
- **Desktop**: Multi-column layout with sidebar navigation
- **Touch Targets**: Minimum 44px touch targets on mobile
- **Viewport Adaptation**: Fluid typography and spacing

## Performance Considerations

### Optimization Strategies
- **Code Splitting**: Lazy load non-critical components
- **Memoization**: Use React.memo and useMemo for expensive calculations
- **Debouncing**: Debounce input handlers to reduce calculation frequency
- **Virtual Scrolling**: For large lists of courses or components

### Bundle Size Management
- **Tree Shaking**: Remove unused code from final bundle
- **Library Selection**: Choose lightweight alternatives where possible
- **Asset Optimization**: Optimize images and fonts
- **Compression**: Enable gzip compression for production

### Runtime Performance
- **Calculation Caching**: Cache expensive calculations
- **State Optimization**: Minimize unnecessary re-renders
- **Memory Management**: Clean up event listeners and timers
- **Progressive Enhancement**: Core functionality works without JavaScript