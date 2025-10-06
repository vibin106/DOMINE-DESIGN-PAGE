# Domine - T-Shirt Design Studio

A modern, professional t-shirt design application built with React, TypeScript, and Vite. Create custom designs with an intuitive interface featuring templates, text, images, and real-time editing capabilities.

![Domine Design Studio](https://img.shields.io/badge/version-1.0.0-blue)
![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-3178C6?logo=typescript)
![License](https://img.shields.io/badge/license-MIT-green)

## 🎨 Features

### Design Tools
- **Multi-View Canvas** - Design front, back, left, and right views of t-shirts
- **Template Library** - 10+ pre-designed templates ready to use
- **Text Editor** - Add and customize text with multiple fonts and colors
- **Image Upload** - Upload and place custom images
- **Illustrations & Graphics** - Built-in graphics library
- **AI Integration** - Domine AI for intelligent design suggestions

### Advanced Editing
- **Resize & Scale** - Precise control with slider and buttons (10%-300%)
- **Rotation** - 360° rotation with 1° precision
- **Flip Controls** - Horizontal and vertical flipping
- **Layer Management** - Move objects forward/backward in layer stack
- **Undo/Redo** - Full history management per view
- **Keyboard Shortcuts** - Professional workflow support

### T-Shirt Customization
- **Color Picker** - 6 preset colors + custom color selector
- **Multi-View Persistence** - Designs saved separately for each view
- **Live Preview** - Real-time design preview on t-shirt mockup
- **Export Options** - Save and download designs

## 🚀 Tech Stack

- **Frontend Framework**: React 18.3.1
- **Language**: TypeScript 5.8.3
- **Build Tool**: Vite 5.4.19
- **Canvas Library**: React Konva 18.2.14
- **State Management**: Zustand 5.0.8
- **UI Components**: Radix UI + shadcn/ui
- **Styling**: Tailwind CSS 3.4.17
- **Icons**: Lucide React 0.462.0

## 📦 Installation

### Prerequisites
- Node.js 18.x or higher
- npm 9.x or higher

### Setup

1. **Clone the repository**
   \`\`\`bash
   git clone https://github.com/vibinwork106/DOMINE.git
   cd DOMINE
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Start development server**
   \`\`\`bash
   npm run dev
   \`\`\`

4. **Open in browser**
   Navigate to \`http://localhost:5173\`

## 🛠️ Build for Production

\`\`\`bash
# Build the application
npm run build

# Preview production build
npm run preview
\`\`\`

## 📁 Project Structure

\`\`\`
domine-design-studio/

package.json

vite.config.ts

tsconfig.json

tailwind.config.ts

src/

src/pages/

src/pages/designstudio.tsx

src/components/

src/components/design-studio/

src/components/design-studio/Canvas.tsx

src/components/design-studio/ObjectControls.tsx

src/components/design-studio/TShirtMockup.tsx

src/components/design-studio/TShirtColorPicker.tsx

src/components/design-studio/ViewSwitcher.tsx

src/components/design-studio/TemplatesPanel.tsx

src/components/design-studio/TextPanel.tsx

src/components/ui/

src/store/

src/store/canvasStore.ts

src/data/

src/data/sampleTemplates.ts

src/assets/

src/assets/tshirt-mockup.png

src/assets/templates/
\`\`\`

## 🎮 Usage

### Basic Workflow

1. **Select a View** - Choose Front, Back, Left, or Right
2. **Choose a Tool** - Templates, Text, Images, or Illustrations
3. **Add Elements** - Click templates or drag elements to canvas
4. **Edit Objects** - Select an object to see editing controls
5. **Customize** - Adjust size, rotation, position, and colors
6. **Save** - Export your design or save for later

## 🎨 Customization

### Adding Templates

1. Add PNG images to \`src/assets/templates/\`
2. Import in \`TemplatesPanel.tsx\`:
   \`\`\`typescript
   import template11 from "@/assets/templates/template-11.png";
   \`\`\`
3. Add to templates array:
   \`\`\`typescript
   { id: 11, name: "Your Template", src: template11, category: "Graphics" }
   \`\`\`

### Changing T-Shirt Colors

Edit \`TShirtColorPicker.tsx\`:
\`\`\`typescript
const presetColors = [
  { name: 'White', value: '#FFFFFF' },
  { name: 'Black', value: '#000000' },
  // Add more colors...
];
\`\`\`

## 🔧 Configuration

### Vite Configuration
Located in \`vite.config.ts\` - configured with path aliases and React SWC

### TypeScript Configuration
Located in \`tsconfig.json\` - strict mode enabled with path mappings

### Tailwind Configuration
Located in \`tailwind.config.ts\` - custom color scheme and animations

## 📦 Dependencies

### Core Dependencies
\`\`\`json
{
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "react-konva": "^18.2.14",
  "konva": "^9.3.22",
  "zustand": "^5.0.8",
  "react-router-dom": "^6.30.1"
}
\`\`\`

### UI Libraries
\`\`\`json
{
  "@radix-ui/react-*": "Various versions",
  "tailwindcss": "^3.4.17",
  "lucide-react": "^0.462.0"
}
\`\`\`

### Build Tools
\`\`\`json
{
  "vite": "^5.4.19",
  "typescript": "^5.8.3",
  "@vitejs/plugin-react-swc": "^3.11.0"
}
\`\`\`

## 🐛 Troubleshooting

### Issue: Templates not loading
- Ensure all template images exist in \`src/assets/templates/\`
- Check import paths in \`TemplatesPanel.tsx\`
- Verify file extensions are \`.png\` or \`.jpg\`

### Issue: Colors not working correctly
- Use PNG with transparent background for t-shirt mockup
- Ensure mockup image is named \`tshirt-mockup.png\`
- Check \`TShirtMockup.tsx\` color rendering logic

### Issue: Objects disappearing when switching views
- Ensure \`setCurrentView\` in \`canvasStore.ts\` saves history
- Check that view persistence logic is implemented correctly

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (\`git checkout -b feature/amazing-feature\`)
3. Commit your changes (\`git commit -m 'Add amazing feature'\`)
4. Push to the branch (\`git push origin feature/amazing-feature\`)
5. Open a Pull Request

## 👨‍💻 Author

**Vibin**
- GitHub: [@vibinwork106](https://github.com/vibinwork106)
- Project: [DOMINE](https://github.com/vibinwork106/DOMINE)

## 🙏 Acknowledgments

- shadcn/ui for the beautiful component library
- Radix UI for accessible primitives
- Konva.js for powerful canvas capabilities
- Tailwind CSS for rapid styling

**Built with ❤️ by Vibin | Powered by React + TypeScript + Vite**
