# Interactive Image Points with Konva

A React application that demonstrates interactive image annotation using Konva.js. Users can add, edit, and delete points of interest on an image with zoom and pan capabilities.

## Features

- 🖼️ Interactive image viewer with zoom and pan
- 📍 Add points of interest via drag and drop
- ✏️ Edit point titles and descriptions
- 🔍 Zoom in/out using mouse wheel
- 🖱️ Pan around when zoomed in
- 🗑️ Delete unwanted points

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <your-repo-url>
cd konva-demo
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

## Usage

### Adding Points
1. Find the red circle template in the toolbar at the top
2. Drag it onto the image where you want to add a point
3. Enter a title and description in the sidebar

### Editing Points
1. Click any existing point to view its details
2. Click the "Edit" button to modify
3. Update the title and description
4. Click "Save" to keep changes or "Cancel" to discard

### Navigation
- Use the mouse wheel to zoom in/out
- Click and drag to pan around when zoomed in
- Points scale with the zoom level

## Built With

- [React](https://reactjs.org/) - UI Framework
- [Konva.js](https://konvajs.org/) - Canvas Library
- [TypeScript](https://www.typescriptlang.org/) - Type Safety
- [Vite](https://vitejs.dev/) - Build Tool

## License

This project is licensed under the MIT License - see the LICENSE file for details
