# GradeCompass

GradeCompass is a polished, user-friendly web application designed to help students track their academic progress and predict future grade outcomes. The application allows students to input grade components for their courses, enter scores for completed assessments, and receive real-time feedback on their current grade and what scores they need on remaining components to achieve their target grades.

## Features

- Dynamic grade component management
- Real-time grade calculations
- Target grade prediction
- Visual grade breakdown with charts
- Multi-course management
- Responsive design for all devices
- Local storage persistence
- Dark mode support

## Tech Stack

- React 18 with TypeScript
- TailwindCSS for styling
- Recharts for data visualization
- Vite for build tooling
- Local Storage for data persistence

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn

### Installation

1. Clone the repository
2. Navigate to the project directory: `cd grade-compass`
3. Install dependencies: `npm install`
4. Start development server: `npm run dev`
5. Open your browser and navigate to `http://localhost:5173`

## Usage

1. Create a new course by entering a course name and clicking "Add Course"
2. Add grade components by entering component name, weight, and clicking "Add Component"
3. Enter scores for completed components
4. Set your target grade to see what scores you need on remaining components
5. Use the pie chart to visualize your grade breakdown
6. Add multiple courses and switch between them using the course selector

## Building for Production

To build the app for production:

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## License

This project is licensed under the MIT License - see the LICENSE file for details.