import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useCanvasStore } from "@/store/canvasStore";
import { toast } from "sonner";

// Import template images
import template1 from "@/assets/templates/template-1.png";
import template2 from "@/assets/templates/template-2.png";
import template3 from "@/assets/templates/template-3.png";
import template4 from "@/assets/templates/template-4.png";
import template5 from "@/assets/templates/template-5.png";
import template6 from "@/assets/templates/template-6.png";
import template7 from "@/assets/templates/template-7.png";
import template8 from "@/assets/templates/template-8.png";
import template9 from "@/assets/templates/template-9.png";
import template10 from "@/assets/templates/template-10.png";

const categories = ["Marketing", "Merchandise", "Social"];

const templates = [
  { id: 1, name: "Jolly Design", src: template1, category: "Merchandise" },
  { id: 2, name: "Tamil Typography", src: template2, category: "Merchandise" },
  { id: 3, name: "Sollu Style", src: template3, category: "Marketing" },
  { id: 4, name: "Tech Design", src: template4, category: "Marketing" },
  { id: 5, name: "Thamizhan", src: template5, category: "Social" },
  { id: 6, name: "Thanni Can", src: template6, category: "Social" },
  { id: 7, name: "Red Bull Style", src: template7, category: "Merchandise" },
  { id: 8, name: "Avlodhan", src: template8, category: "Social" },
  { id: 9, name: "Irunga Bhai", src: template9, category: "Marketing" },
  { id: 10, name: "Typography Mix", src: template10, category: "Merchandise" },
];

export const TemplatesPanel = () => {
  const addObject = useCanvasStore((state) => state.addObject);
  const saveHistory = useCanvasStore((state) => state.saveHistory);

  const handleTemplateClick = (template: typeof templates[0]) => {
    addObject({
      type: 'image',
      x: 150,
      y: 200,
      width: 200,
      height: 200,
      src: template.src,
      name: template.name,
    });
    saveHistory();
    toast.success(`Added "${template.name}" to canvas`);
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search"
          className="pl-10 bg-background border-border"
        />
      </div>

      <div className="flex gap-2">
        {categories.map((cat) => (
          <Button
            key={cat}
            variant="outline"
            size="sm"
            className="text-xs border-border hover:bg-muted"
          >
            {cat}
          </Button>
        ))}
      </div>

      {/* REMOVED GROUPED TEMPLATES SECTION */}

      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-foreground">Popular</h3>
          <Button variant="link" className="text-xs text-primary p-0 h-auto">
            Show All
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {templates.slice(0, 6).map((template) => (
            <Card
              key={template.id}
              className="aspect-square bg-muted hover:bg-muted/70 cursor-pointer transition-all hover:shadow-glow border-border overflow-hidden group"
              onClick={() => handleTemplateClick(template)}
            >
              <img 
                src={template.src} 
                alt={template.name}
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
              />
            </Card>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-foreground">T-Shirts</h3>
          <Button variant="link" className="text-xs text-primary p-0 h-auto">
            Show All
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {templates.slice(6, 10).map((template) => (
            <Card
              key={template.id}
              className="aspect-square bg-muted hover:bg-muted/70 cursor-pointer transition-all hover:shadow-glow border-border overflow-hidden group"
              onClick={() => handleTemplateClick(template)}
            >
              <img 
                src={template.src} 
                alt={template.name}
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
              />
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
