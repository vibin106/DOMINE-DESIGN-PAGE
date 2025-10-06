import { useRef, useEffect } from 'react';
import { Stage, Layer, Transformer, Image as KonvaImage, Text, Group } from 'react-konva';
import { useCanvasStore } from '@/store/canvasStore';
import { TShirtMockup } from './TShirtMockup';
import useImage from 'use-image';
import type Konva from 'konva';

// Component for rendering images and templates
const CanvasImageObject = ({ 
  shapeProps, 
  isSelected, 
  onSelect, 
  onChange 
}: { 
  shapeProps: any; 
  isSelected: boolean; 
  onSelect: () => void; 
  onChange: (newAttrs: any) => void;
}) => {
  const shapeRef = useRef<Konva.Image>(null);
  const [image] = useImage(shapeProps.src);

  useEffect(() => {
    if (isSelected && shapeRef.current) {
      const tr = shapeRef.current.getLayer()?.findOne('.transformer') as Konva.Transformer;
      if (tr) {
        tr.nodes([shapeRef.current]);
      }
    }
  }, [isSelected]);

  return (
    <KonvaImage
      image={image}
      ref={shapeRef}
      {...shapeProps}
      name="" // Remove tooltip
      draggable
      onClick={onSelect}
      onTap={onSelect}
      onDragEnd={(e) => {
        onChange({
          x: e.target.x(),
          y: e.target.y(),
        });
      }}
      onTransformEnd={(e) => {
        const node = shapeRef.current;
        if (node) {
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();

          onChange({
            x: node.x(),
            y: node.y(),
            rotation: node.rotation(),
            width: Math.max(5, node.width() * scaleX),
            height: Math.max(5, node.height() * scaleY),
            scaleX: 1,
            scaleY: 1,
          });
        }
      }}
    />
  );
};

// Component for rendering text
const CanvasTextObject = ({ 
  shapeProps, 
  isSelected, 
  onSelect, 
  onChange 
}: { 
  shapeProps: any; 
  isSelected: boolean; 
  onSelect: () => void; 
  onChange: (newAttrs: any) => void;
}) => {
  const shapeRef = useRef<Konva.Text>(null);

  useEffect(() => {
    if (isSelected && shapeRef.current) {
      const tr = shapeRef.current.getLayer()?.findOne('.transformer') as Konva.Transformer;
      if (tr) {
        tr.nodes([shapeRef.current]);
      }
    }
  }, [isSelected]);

  return (
    <Text
      ref={shapeRef}
      {...shapeProps}
      name="" // Remove tooltip
      draggable
      onClick={onSelect}
      onTap={onSelect}
      onDragEnd={(e) => {
        onChange({
          x: e.target.x(),
          y: e.target.y(),
        });
      }}
      onTransformEnd={(e) => {
        const node = shapeRef.current;
        if (node) {
          onChange({
            x: node.x(),
            y: node.y(),
            rotation: node.rotation(),
            scaleX: node.scaleX(),
            scaleY: node.scaleY(),
          });
        }
      }}
    />
  );
};

// Component for rendering groups
const CanvasGroupObject = ({ 
  shapeProps, 
  isSelected, 
  onSelect, 
  onChange 
}: { 
  shapeProps: any; 
  isSelected: boolean; 
  onSelect: () => void; 
  onChange: (newAttrs: any) => void;
}) => {
  const groupRef = useRef<Konva.Group>(null);

  useEffect(() => {
    if (isSelected && groupRef.current) {
      const tr = groupRef.current.getLayer()?.findOne('.transformer') as Konva.Transformer;
      if (tr) {
        tr.nodes([groupRef.current]);
      }
    }
  }, [isSelected]);

  const renderChild = (child: any, index: number) => {
    if (child.type === 'text') {
      return (
        <Text
          key={index}
          {...child}
          name="" // Remove tooltip
          listening={false}
        />
      );
    } else if (child.type === 'image') {
      const [image] = useImage(child.src);
      return (
        <KonvaImage
          key={index}
          image={image}
          {...child}
          name="" // Remove tooltip
          listening={false}
        />
      );
    }
    return null;
  };

  return (
    <Group
      ref={groupRef}
      {...shapeProps}
      name="" // Remove tooltip
      draggable={!shapeProps.locked}
      onClick={onSelect}
      onTap={onSelect}
      onDragEnd={(e) => {
        onChange({
          x: e.target.x(),
          y: e.target.y(),
        });
      }}
      onTransformEnd={(e) => {
        const node = groupRef.current;
        if (node) {
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();

          onChange({
            x: node.x(),
            y: node.y(),
            rotation: node.rotation(),
            scaleX,
            scaleY,
          });
        }
      }}
    >
      {shapeProps.children?.map(renderChild)}
    </Group>
  );
};

export const Canvas = () => {
  const currentView = useCanvasStore((state) => state.currentView);
  const views = useCanvasStore((state) => state.views);
  const selectedId = useCanvasStore((state) => state.selectedId);
  const setSelectedId = useCanvasStore((state) => state.setSelectedId);
  const updateObject = useCanvasStore((state) => state.updateObject);
  const removeObject = useCanvasStore((state) => state.removeObject);
  const duplicateObject = useCanvasStore((state) => state.duplicateObject);
  const undo = useCanvasStore((state) => state.undo);
  const redo = useCanvasStore((state) => state.redo);
  const saveHistory = useCanvasStore((state) => state.saveHistory);
  
  const transformerRef = useRef<Konva.Transformer>(null);
  const stageRef = useRef<Konva.Stage>(null);
  
  const currentViewData = views[currentView];
  const objects = currentViewData.objects;
  const tshirtColor = currentViewData.tshirtColor;

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const cmdKey = isMac ? e.metaKey : e.ctrlKey;

      if (cmdKey && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      } else if ((cmdKey && e.key === 'y') || (cmdKey && e.shiftKey && e.key === 'z')) {
        e.preventDefault();
        redo();
      } else if (cmdKey && e.key === 'd') {
        e.preventDefault();
        if (selectedId) duplicateObject(selectedId);
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedId) {
          e.preventDefault();
          removeObject(selectedId);
        }
      } else if (e.key.startsWith('Arrow') && selectedId) {
        e.preventDefault();
        const step = e.shiftKey ? 10 : 1;
        const obj = objects.find(o => o.id === selectedId);
        if (obj) {
          const updates: any = {};
          if (e.key === 'ArrowLeft') updates.x = (obj.x || 0) - step;
          if (e.key === 'ArrowRight') updates.x = (obj.x || 0) + step;
          if (e.key === 'ArrowUp') updates.y = (obj.y || 0) - step;
          if (e.key === 'ArrowDown') updates.y = (obj.y || 0) + step;
          updateObject(selectedId, updates);
          saveHistory();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedId, objects, undo, redo, duplicateObject, removeObject, updateObject, saveHistory]);

  const checkDeselect = (e: any) => {
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      setSelectedId(null);
    }
  };

  const handleObjectChange = (id: string, newAttrs: any) => {
    updateObject(id, newAttrs);
    saveHistory();
  };

  return (
    <div className="relative">
      <TShirtMockup view={currentView} color={tshirtColor} width={500} height={600} />
      <Stage
        ref={stageRef}
        width={500}
        height={600}
        onMouseDown={checkDeselect}
        onTouchStart={checkDeselect}
      >
        <Layer>
          {objects.map((obj) => {
            if (!obj.visible) return null;
            
            if (obj.type === 'group') {
              return (
                <CanvasGroupObject
                  key={obj.id}
                  shapeProps={{
                    x: obj.x,
                    y: obj.y,
                    rotation: obj.rotation || 0,
                    scaleX: obj.scaleX || 1,
                    scaleY: obj.scaleY || 1,
                    children: obj.children,
                    locked: obj.locked
                  }}
                  isSelected={obj.id === selectedId && !obj.locked}
                  onSelect={() => !obj.locked && setSelectedId(obj.id)}
                  onChange={(newAttrs) => handleObjectChange(obj.id, newAttrs)}
                />
              );
            } else if (obj.type === 'text') {
              return (
                <CanvasTextObject
                  key={obj.id}
                  shapeProps={{
                    x: obj.x,
                    y: obj.y,
                    text: obj.text,
                    fontSize: obj.fontSize,
                    fontFamily: obj.fontFamily,
                    fill: obj.fill,
                    rotation: obj.rotation || 0,
                    scaleX: obj.scaleX || 1,
                    scaleY: obj.scaleY || 1,
                  }}
                  isSelected={obj.id === selectedId && !obj.locked}
                  onSelect={() => !obj.locked && setSelectedId(obj.id)}
                  onChange={(newAttrs) => handleObjectChange(obj.id, newAttrs)}
                />
              );
            } else if (obj.type === 'image' || obj.type === 'template') {
              return (
                <CanvasImageObject
                  key={obj.id}
                  shapeProps={{
                    x: obj.x,
                    y: obj.y,
                    width: obj.width,
                    height: obj.height,
                    rotation: obj.rotation || 0,
                    scaleX: obj.scaleX || 1,
                    scaleY: obj.scaleY || 1,
                    src: obj.src,
                  }}
                  isSelected={obj.id === selectedId && !obj.locked}
                  onSelect={() => !obj.locked && setSelectedId(obj.id)}
                  onChange={(newAttrs) => handleObjectChange(obj.id, newAttrs)}
                />
              );
            }
            return null;
          })}
          <Transformer
            ref={transformerRef}
            name="transformer"
            boundBoxFunc={(oldBox, newBox) => {
              if (newBox.width < 5 || newBox.height < 5) {
                return oldBox;
              }
              return newBox;
            }}
          />
        </Layer>
      </Stage>
    </div>
  );
};
