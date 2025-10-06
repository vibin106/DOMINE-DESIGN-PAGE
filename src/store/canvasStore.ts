import { create } from 'zustand';

export type CanvasObjectType = 'text' | 'image' | 'template' | 'group';
export type TShirtView = 'front' | 'left' | 'right' | 'back';

export interface CanvasObject {
  id: string;
  type: CanvasObjectType;
  x: number;
  y: number;
  width?: number;
  height?: number;
  rotation?: number;
  scaleX?: number;
  scaleY?: number;
  visible?: boolean;
  locked?: boolean;
  name?: string;
  // For text
  text?: string;
  fontSize?: number;
  fontFamily?: string;
  fill?: string;
  // For images and templates
  src?: string;
  // For groups
  children?: CanvasObject[];
}

interface ViewState {
  objects: CanvasObject[];
  tshirtColor: string;
}

interface CanvasStore {
  currentView: TShirtView;
  views: Record<TShirtView, ViewState>;
  selectedId: string | null;
  history: Record<TShirtView, ViewState[]>;
  historyIndex: Record<TShirtView, number>;
  
  // View management
  setCurrentView: (view: TShirtView) => void;
  setTShirtColor: (color: string, applyToAll?: boolean) => void;
  
  // Object management
  addObject: (object: Omit<CanvasObject, 'id'>) => void;
  updateObject: (id: string, updates: Partial<CanvasObject>) => void;
  removeObject: (id: string) => void;
  duplicateObject: (id: string) => void;
  setSelectedId: (id: string | null) => void;
  
  // Group management
  ungroupObject: (id: string) => void;
  
  // Layer management
  moveObjectUp: (id: string) => void;
  moveObjectDown: (id: string) => void;
  moveObjectToTop: (id: string) => void;
  moveObjectToBottom: (id: string) => void;
  
  // History
  undo: () => void;
  redo: () => void;
  saveHistory: () => void;
  
  // Export
  getViewData: () => ViewState;
  getAllViewsData: () => Record<TShirtView, ViewState>;
}

const initialViewState: ViewState = {
  objects: [],
  tshirtColor: '#FFFFFF'
};

export const useCanvasStore = create<CanvasStore>((set, get) => ({
  currentView: 'front',
  views: {
    front: { ...initialViewState },
    left: { ...initialViewState },
    right: { ...initialViewState },
    back: { ...initialViewState }
  },
  selectedId: null,
  history: {
    front: [{ ...initialViewState }],
    left: [{ ...initialViewState }],
    right: [{ ...initialViewState }],
    back: [{ ...initialViewState }]
  },
  historyIndex: {
    front: 0,
    left: 0,
    right: 0,
    back: 0
  },
  
  setCurrentView: (view) => set((state) => {
  // Save history for current view before switching
  const currentHistory = state.history[state.currentView];
  const currentIndex = state.historyIndex[state.currentView];
  const newHistory = currentHistory.slice(0, currentIndex + 1);
  newHistory.push({ ...state.views[state.currentView] });
  
  return {
    currentView: view,
    selectedId: null,
    history: {
      ...state.history,
      [state.currentView]: newHistory
    },
    historyIndex: {
      ...state.historyIndex,
      [state.currentView]: newHistory.length - 1
    }
  };
}),

  setTShirtColor: (color, applyToAll = false) => set((state) => {
    if (applyToAll) {
      const newViews = Object.fromEntries(
        Object.entries(state.views).map(([view, viewState]) => [
          view,
          { ...viewState, tshirtColor: color }
        ])
      );
      return { views: newViews };
    } else {
      return {
        views: {
          ...state.views,
          [state.currentView]: {
            ...state.views[state.currentView],
            tshirtColor: color
          }
        }
      };
    }
  }),

  
  addObject: (object) => set((state) => {
    const newObject = { 
      ...object, 
      id: `obj-${Date.now()}-${Math.random()}`,
      visible: true,
      locked: false,
      name: object.name || `${object.type} ${state.views[state.currentView].objects.length + 1}`
    };
    const newObjects = [...state.views[state.currentView].objects, newObject];
    const newViews = {
      ...state.views,
      [state.currentView]: {
        ...state.views[state.currentView],
        objects: newObjects
      }
    };
    return { views: newViews };
  }),
  
  updateObject: (id, updates) => set((state) => {
    const updateObjectRecursive = (obj: CanvasObject): CanvasObject => {
      if (obj.id === id) {
        return { ...obj, ...updates };
      }
      if (obj.children) {
        return {
          ...obj,
          children: obj.children.map(updateObjectRecursive)
        };
      }
      return obj;
    };
    
    const newObjects = state.views[state.currentView].objects.map(updateObjectRecursive);
    return {
      views: {
        ...state.views,
        [state.currentView]: {
          ...state.views[state.currentView],
          objects: newObjects
        }
      }
    };
  }),
  
  removeObject: (id) => set((state) => {
    const removeObjectRecursive = (objects: CanvasObject[]): CanvasObject[] => {
      return objects
        .filter(obj => obj.id !== id)
        .map(obj => obj.children ? { ...obj, children: removeObjectRecursive(obj.children) } : obj);
    };
    
    const newObjects = removeObjectRecursive(state.views[state.currentView].objects);
    return {
      views: {
        ...state.views,
        [state.currentView]: {
          ...state.views[state.currentView],
          objects: newObjects
        }
      },
      selectedId: state.selectedId === id ? null : state.selectedId
    };
  }),
  
  duplicateObject: (id) => set((state) => {
    const findObject = (objects: CanvasObject[]): CanvasObject | null => {
      for (const obj of objects) {
        if (obj.id === id) return obj;
        if (obj.children) {
          const found = findObject(obj.children);
          if (found) return found;
        }
      }
      return null;
    };
    
    const obj = findObject(state.views[state.currentView].objects);
    if (!obj) return state;
    
    const duplicate = {
      ...obj,
      id: `obj-${Date.now()}-${Math.random()}`,
      x: obj.x + 20,
      y: obj.y + 20,
      name: `${obj.name} copy`
    };
    
    const newObjects = [...state.views[state.currentView].objects, duplicate];
    return {
      views: {
        ...state.views,
        [state.currentView]: {
          ...state.views[state.currentView],
          objects: newObjects
        }
      },
      selectedId: duplicate.id
    };
  }),
  
  setSelectedId: (id) => set({ selectedId: id }),
  
  ungroupObject: (id) => set((state) => {
    const ungroupRecursive = (objects: CanvasObject[]): CanvasObject[] => {
      return objects.flatMap(obj => {
        if (obj.id === id && obj.type === 'group' && obj.children) {
          return obj.children.map(child => ({
            ...child,
            x: obj.x + (child.x || 0),
            y: obj.y + (child.y || 0)
          }));
        }
        if (obj.children) {
          return [{ ...obj, children: ungroupRecursive(obj.children) }];
        }
        return [obj];
      });
    };
    
    const newObjects = ungroupRecursive(state.views[state.currentView].objects);
    return {
      views: {
        ...state.views,
        [state.currentView]: {
          ...state.views[state.currentView],
          objects: newObjects
        }
      },
      selectedId: null
    };
  }),
  
  moveObjectUp: (id) => set((state) => {
    const objects = [...state.views[state.currentView].objects];
    const index = objects.findIndex(obj => obj.id === id);
    if (index < objects.length - 1) {
      [objects[index], objects[index + 1]] = [objects[index + 1], objects[index]];
    }
    return {
      views: {
        ...state.views,
        [state.currentView]: {
          ...state.views[state.currentView],
          objects
        }
      }
    };
  }),
  
  moveObjectDown: (id) => set((state) => {
    const objects = [...state.views[state.currentView].objects];
    const index = objects.findIndex(obj => obj.id === id);
    if (index > 0) {
      [objects[index], objects[index - 1]] = [objects[index - 1], objects[index]];
    }
    return {
      views: {
        ...state.views,
        [state.currentView]: {
          ...state.views[state.currentView],
          objects
        }
      }
    };
  }),
  
  moveObjectToTop: (id) => set((state) => {
    const objects = [...state.views[state.currentView].objects];
    const index = objects.findIndex(obj => obj.id === id);
    if (index !== -1) {
      const [obj] = objects.splice(index, 1);
      objects.push(obj);
    }
    return {
      views: {
        ...state.views,
        [state.currentView]: {
          ...state.views[state.currentView],
          objects
        }
      }
    };
  }),
  
  moveObjectToBottom: (id) => set((state) => {
    const objects = [...state.views[state.currentView].objects];
    const index = objects.findIndex(obj => obj.id === id);
    if (index !== -1) {
      const [obj] = objects.splice(index, 1);
      objects.unshift(obj);
    }
    return {
      views: {
        ...state.views,
        [state.currentView]: {
          ...state.views[state.currentView],
          objects
        }
      }
    };
  }),
  
  saveHistory: () => set((state) => {
    const currentHistory = state.history[state.currentView];
    const currentIndex = state.historyIndex[state.currentView];
    const newHistory = currentHistory.slice(0, currentIndex + 1);
    newHistory.push({ ...state.views[state.currentView] });
    
    return {
      history: {
        ...state.history,
        [state.currentView]: newHistory
      },
      historyIndex: {
        ...state.historyIndex,
        [state.currentView]: newHistory.length - 1
      }
    };
  }),
  
  undo: () => set((state) => {
    const currentIndex = state.historyIndex[state.currentView];
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      return {
        views: {
          ...state.views,
          [state.currentView]: { ...state.history[state.currentView][newIndex] }
        },
        historyIndex: {
          ...state.historyIndex,
          [state.currentView]: newIndex
        },
        selectedId: null
      };
    }
    return state;
  }),
  
  redo: () => set((state) => {
    const currentIndex = state.historyIndex[state.currentView];
    const historyLength = state.history[state.currentView].length;
    if (currentIndex < historyLength - 1) {
      const newIndex = currentIndex + 1;
      return {
        views: {
          ...state.views,
          [state.currentView]: { ...state.history[state.currentView][newIndex] }
        },
        historyIndex: {
          ...state.historyIndex,
          [state.currentView]: newIndex
        },
        selectedId: null
      };
    }
    return state;
  }),
  
  getViewData: () => get().views[get().currentView],
  
  getAllViewsData: () => get().views
}));
