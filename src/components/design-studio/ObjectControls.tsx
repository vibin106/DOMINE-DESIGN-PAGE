import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { 
  Trash2, 
  ChevronLeft, 
  ChevronRight,
  ZoomIn,
  ZoomOut,
  RotateCw,
  FlipHorizontal,
  FlipVertical
} from "lucide-react";
import { useCanvasStore } from "@/store/canvasStore";
import { toast } from "sonner";

export const ObjectControls = () => {
  const selectedId = useCanvasStore((state) => state.selectedId);
  const currentView = useCanvasStore((state) => state.currentView);
  const objects = useCanvasStore((state) => state.views[currentView].objects);
  const updateObject = useCanvasStore((state) => state.updateObject);
  const removeObject = useCanvasStore((state) => state.removeObject);
  const moveObjectUp = useCanvasStore((state) => state.moveObjectUp);
  const moveObjectDown = useCanvasStore((state) => state.moveObjectDown);
  const saveHistory = useCanvasStore((state) => state.saveHistory);
  const setSelectedId = useCanvasStore((state) => state.setSelectedId);

  const selectedObject = objects.find(obj => obj.id === selectedId);
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);

  // Update local state when selection changes
  useEffect(() => {
    if (selectedObject) {
      setScale(selectedObject.scaleX || 1);
      setRotation(selectedObject.rotation || 0);
    }
  }, [selectedObject]);

  if (!selectedObject) {
    return (
      <Card className="p-4 bg-card border-border">
        <p className="text-sm text-muted-foreground text-center">
          Select an object on the canvas to edit
        </p>
      </Card>
    );
  }

  const handleScaleChange = (value: number[]) => {
    const newScale = value[0];
    setScale(newScale);
    updateObject(selectedId!, {
      scaleX: newScale,
      scaleY: newScale
    });
    saveHistory();
  };

  const handleRotationChange = (value: number[]) => {
    const newRotation = value[0];
    setRotation(newRotation);
    updateObject(selectedId!, { rotation: newRotation });
    saveHistory();
  };

  const handleDelete = () => {
    removeObject(selectedId!);
    setSelectedId(null);
    saveHistory();
    toast.success("Object removed");
  };

  const handleFlipHorizontal = () => {
    const currentScaleX = selectedObject.scaleX || 1;
    updateObject(selectedId!, { scaleX: currentScaleX * -1 });
    saveHistory();
  };

  const handleFlipVertical = () => {
    const currentScaleY = selectedObject.scaleY || 1;
    updateObject(selectedId!, { scaleY: currentScaleY * -1 });
    saveHistory();
  };

  const handleMoveForward = () => {
    moveObjectUp(selectedId!);
    saveHistory();
    toast.success("Moved forward");
  };

  const handleMoveBackward = () => {
    moveObjectDown(selectedId!);
    saveHistory();
    toast.success("Moved backward");
  };

  return (
    <Card className="p-4 bg-card border-border space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3">
          Edit Object
        </h3>
        <p className="text-xs text-muted-foreground mb-4">
          {selectedObject.name || 'Untitled'}
        </p>
      </div>

      {/* Scale Control */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-sm">Scale</Label>
          <span className="text-xs text-muted-foreground">
            {Math.round(scale * 100)}%
          </span>
        </div>
        <Slider
          value={[scale]}
          onValueChange={handleScaleChange}
          min={0.1}
          max={3}
          step={0.1}
          className="w-full"
        />
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => handleScaleChange([Math.max(0.1, scale - 0.1)])}
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => handleScaleChange([Math.min(3, scale + 0.1)])}
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Rotation Control */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-sm">Rotation</Label>
          <span className="text-xs text-muted-foreground">
            {Math.round(rotation)}°
          </span>
        </div>
        <Slider
          value={[rotation]}
          onValueChange={handleRotationChange}
          min={0}
          max={360}
          step={1}
          className="w-full"
        />
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={() => handleRotationChange([(rotation + 90) % 360])}
        >
          <RotateCw className="h-4 w-4 mr-2" />
          Rotate 90°
        </Button>
      </div>

      {/* Flip Controls */}
      <div className="space-y-2">
        <Label className="text-sm">Flip</Label>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={handleFlipHorizontal}
          >
            <FlipHorizontal className="h-4 w-4 mr-2" />
            Horizontal
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={handleFlipVertical}
          >
            <FlipVertical className="h-4 w-4 mr-2" />
            Vertical
          </Button>
        </div>
      </div>

      {/* Layer Controls */}
      <div className="space-y-2">
        <Label className="text-sm">Layer Order</Label>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={handleMoveBackward}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={handleMoveForward}
          >
            Forward
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>

      {/* Delete Button */}
      <div className="pt-4 border-t border-border">
        <Button
          variant="destructive"
          size="sm"
          className="w-full"
          onClick={handleDelete}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Remove from T-shirt
        </Button>
      </div>
    </Card>
  );
};
