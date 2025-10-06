import { Button } from "@/components/ui/button";
import { useCanvasStore } from "@/store/canvasStore";
import { TShirtView } from "@/store/canvasStore";

export const ViewSwitcher = () => {
  const currentView = useCanvasStore((state) => state.currentView);
  const setCurrentView = useCanvasStore((state) => state.setCurrentView);

  const views: { value: TShirtView; label: string }[] = [
    { value: 'front', label: 'Front' },
    { value: 'back', label: 'Back' }
  ];

  return (
    <div className="flex gap-2 bg-card border border-border rounded-lg p-1">
      {views.map((view) => (
        <Button
          key={view.value}
          variant={currentView === view.value ? "default" : "ghost"}
          size="sm"
          onClick={() => setCurrentView(view.value)}
          className={currentView === view.value ? "bg-primary" : ""}
        >
          {view.label}
        </Button>
      ))}
    </div>
  );
};
