import { CanvasObject } from '@/store/canvasStore';
import template1 from '@/assets/templates/template-1.png';
import template2 from '@/assets/templates/template-2.png';
// Removed template3 import since we're not using it anymore


type TemplateChild = Omit<CanvasObject, 'id' | 'children'>;


type TemplateElement = Omit<CanvasObject, 'id' | 'children'> & {
  children?: TemplateChild[];
};


export interface Template {
  id: string;
  title: string;
  thumbnail: string;
  category: string;
  elements: TemplateElement[];
}


export const sampleTemplates: Template[] = [
  {
    id: 'template-badge-1',
    title: 'Vintage Badge',
    thumbnail: template1,
    category: 'badges',
    elements: [
      {
        type: 'group',
        x: 250,
        y: 250,
        name: '',
        children: [
          {
            type: 'text',
            x: 0,
            y: 0,
            text: 'AUTHENTIC',
            fontSize: 32,
            fontFamily: 'Arial',
            fill: '#000000',
            name: ''
          },
          {
            type: 'text',
            x: 0,
            y: 40,
            text: 'QUALITY',
            fontSize: 48,
            fontFamily: 'Arial',
            fill: '#000000',
            name: ''
          },
          {
            type: 'text',
            x: 0,
            y: 95,
            text: 'EST. 2024',
            fontSize: 20,
            fontFamily: 'Arial',
            fill: '#666666',
            name: ''
          }
        ]
      }
    ]
  },
  {
    id: 'template-illustration-1',
    title: 'Mountain Scene',
    thumbnail: template2,
    category: 'illustrations',
    elements: [
      {
        type: 'group',
        x: 250,
        y: 250,
        name: '',
        children: [
          {
            type: 'image',
            x: 0,
            y: 0,
            width: 200,
            height: 150,
            src: template2,
            name: ''
          },
          {
            type: 'text',
            x: 50,
            y: 160,
            text: 'ADVENTURE',
            fontSize: 28,
            fontFamily: 'Arial',
            fill: '#2C5F2D',
            name: ''
          }
        ]
      }
    ]
  }
  // Removed "Stacked Type" template to fix the issue
];
