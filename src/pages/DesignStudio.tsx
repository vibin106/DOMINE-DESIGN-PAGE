import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Type, 
  Image as ImageIcon, 
  Layers, 
  Upload, 
  Sparkles,
  Layout,
  Palette,
  Heart,
  Package,
  X,
  Undo2,
  Redo2,
  ZoomIn,
  ZoomOut,
  Save,
  Download,
  ShoppingCart,
  Eye
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { MenuDropdown } from "@/components/design-studio/MenuDropdown";
import { TemplatesPanel } from "@/components/design-studio/TemplatesPanel";
import { TextPanel } from "@/components/design-studio/TextPanel";
import { IllustrationsPanel } from "@/components/design-studio/IllustrationsPanel";
import { ImagesPanel } from "@/components/design-studio/ImagesPanel";
import { TexturesPanel } from "@/components/design-studio/TexturesPanel";
import { AIPanel } from "@/components/design-studio/AIPanel";
import { EnhancedLayersPanel } from "@/components/design-studio/EnhancedLayersPanel";
import { UploadsPanel } from "@/components/design-studio/UploadsPanel";
import { BrandKitsPanel } from "@/components/design-studio/BrandKitsPanel";
import { Canvas } from "@/components/design-studio/Canvas";
import { ViewSwitcher } from "@/components/design-studio/ViewSwitcher";
import { TShirtColorPicker } from "@/components/design-studio/TShirtColorPicker";
import { ObjectControls } from "@/components/design-studio/ObjectControls";
import { useCanvasStore } from "@/store/canvasStore";

const DesignStudio = () => {
  const [selectedTool, setSelectedTool] = useState<string>("template");
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  
  const undo = useCanvasStore((state) => state.undo);
  const redo = useCanvasStore((state) => state.redo);
  const getAllViewsData = useCanvasStore((state) => state.getAllViewsData);

  const tools = [
    { id: "template", name: "Templates", icon: Layout },
    { id: "text", name: "Text", icon: Type },
    { id: "illustrations", name: "Illustrations", icon: Sparkles },
    { id: "images", name: "Images", icon: ImageIcon },
    { id: "textures", name: "Textures", icon: Palette },
    { id: "likes", name: "Likes", icon: Heart },
    { id: "brand", name: "Brand Kits", icon: Package },
    { id: "uploads", name: "Uploads", icon: Upload },
    { id: "ai", name: "Domine AI", icon: Sparkles },
    { id: "layers", name: "Layers", icon: Layers },
  ];

  const renderPanel = () => {
    switch (selectedTool) {
      case "template":
        return <TemplatesPanel />;
      case "text":
        return <TextPanel />;
      case "illustrations":
        return <IllustrationsPanel />;
      case "images":
        return <ImagesPanel />;
      case "textures":
        return <TexturesPanel />;
      case "ai":
        return <AIPanel />;
      case "layers":
        return <EnhancedLayersPanel />;
      case "uploads":
        return <UploadsPanel />;
      case "brand":
        return <BrandKitsPanel />;
      default:
        return <div className="p-4 text-muted-foreground">Select a tool to get started</div>;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Navbar */}
      <header className="h-14 border-b border-border bg-card flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <MenuDropdown />
          <span className="text-sm font-semibold text-foreground">Design a T-shirt</span>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-9 w-9" onClick={undo} title="Undo (Ctrl/Cmd+Z)">
            <Undo2 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-9 w-9" onClick={redo} title="Redo (Ctrl/Cmd+Y)">
            <Redo2 className="h-4 w-4" />
          </Button>
          <div className="h-6 w-px bg-border mx-1" />
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-sm text-foreground min-w-[3rem] text-center">100%</span>
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <ZoomIn className="h-4 w-4" />
          </Button>
          <div className="h-6 w-px bg-border mx-1" />
          <Button variant="ghost" size="sm" className="h-9">
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Button variant="ghost" size="sm" className="h-9">
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
          <Button variant="ghost" size="sm" className="h-9">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button className="h-9 bg-gradient-violet">
            Share
          </Button>
        </div>
      </header>
      
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Tool Icons */}
        <aside className="w-12 border-r border-border bg-card flex flex-col items-center py-3 gap-1">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Button
                key={tool.id}
                variant="ghost"
                size="icon"
                className={`w-10 h-10 rounded ${
                  selectedTool === tool.id 
                    ? "bg-primary/10 text-primary" 
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
                onClick={() => {
                  if (selectedTool === tool.id) {
                    setIsPanelOpen(!isPanelOpen);
                  } else {
                    setSelectedTool(tool.id);
                    setIsPanelOpen(true);
                  }
                }}
                title={tool.name}
              >
                <Icon className="w-5 h-5" />
              </Button>
            );
          })}
        </aside>

        {/* Tool Options Panel */}
        {isPanelOpen && (
          <aside className="w-80 border-r border-border bg-card overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="text-lg font-bold text-foreground">
                {tools.find(t => t.id === selectedTool)?.name}
              </h2>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setIsPanelOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {renderPanel()}
            </div>
          </aside>
        )}

        {/* Canvas - Center */}
        <main className="flex-1 bg-muted/20 overflow-auto min-h-0">
          <div className="h-full flex flex-col items-center justify-center p-8 gap-4">
            {/* View Switcher */}
            <ViewSwitcher />
            
            <div className="relative">
              {/* Canvas Area */}
              <div className="w-[500px] h-[600px] bg-card border-2 border-border rounded-lg shadow-lg flex items-center justify-center overflow-hidden relative">
                <Canvas />
              </div>

              {/* Bottom Toolbar */}
              <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-card border border-border rounded-lg px-4 py-2 shadow-lg">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={undo}>
                  <Undo2 className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={redo}>
                  <Redo2 className="h-4 w-4" />
                </Button>
                <div className="h-6 w-px bg-border mx-1" />
                <Button variant="ghost" size="sm" className="h-8">
                  100%
                </Button>
                <div className="h-6 w-px bg-border mx-1" />
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </main>

        {/* Right Sidebar - Project Info & Tools */}
        <aside className="w-80 border-l border-border bg-card p-4 overflow-y-auto">
          <div className="space-y-6">
            {/* Object Controls - NEW */}
            <ObjectControls />
            
            {/* T-shirt Color Picker */}
            <TShirtColorPicker />
            
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3">Project Colors</h3>
              <div className="space-y-2">
                {[
                  { color: "#000000", name: "000000", usage: "100%" },
                  { color: "#FFFFFF", name: "FFFFFF", usage: "100%" },
                  { color: "#9A7D52", name: "9A7D52", usage: "100%" },
                  { color: "#F7EBDE", name: "F7EBDE", usage: "100%" },
                ].map((item) => (
                  <div key={item.color} className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded border-2 border-border"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm text-foreground font-mono flex-1">{item.name}</span>
                    <span className="text-sm text-muted-foreground">{item.usage}</span>
                  </div>
                ))}
              </div>
              <Button variant="link" className="text-sm text-primary p-0 h-auto mt-2">
                Browse Color Palettes
              </Button>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3">Tools</h3>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start border-border"
                >
                  <Package className="w-4 h-4 mr-2" />
                  Mockup
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start border-border text-muted-foreground"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Add Smartboard
                </Button>
              </div>
            </div>

            <div className="pt-6 space-y-2 border-t border-border">
              <Button className="w-full bg-gradient-violet">
                <Save className="w-4 h-4 mr-2" />
                Save Design
              </Button>
              <Button className="w-full bg-gradient-orange">
                <ShoppingCart className="w-4 h-4 mr-2" />
                Add to Cart
              </Button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default DesignStudio;
