import { Stage, Layer, Image, Circle, Text, Rect } from 'react-konva';
import { useState, useEffect } from 'react';
import Konva from 'konva';

interface Point {
  x: number;
  y: number;
  title: string;
  description: string;
  id: string;
}

const initialPoints: Point[] = [
  { id: '1', x: 100, y: 100, title: 'Point 1', description: 'This is an interesting location' },
  { id: '2', x: 200, y: 150, title: 'Point 2', description: 'Another fascinating spot' },
  { id: '3', x: 150, y: 200, title: 'Point 3', description: 'Something cool here' },
];

function App() {
  const [points, setPoints] = useState<Point[]>(initialPoints);
  const [draggedPoint, setDraggedPoint] = useState<Point | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newPointTitle, setNewPointTitle] = useState('');
  const [newPointDescription, setNewPointDescription] = useState('');
  const [image] = useState(new window.Image());
  const [selectedPoint, setSelectedPoint] = useState<Point | null>(null);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleWheel = (e: Konva.KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault();
    
    const scaleBy = 1.1;
    const stage = e.target.getStage();
    if (!stage) return;

    const oldScale = scale;
    const pointer = stage.getPointerPosition();
    if (!pointer) return;

    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    };

    const newScale = e.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy;

    setScale(newScale);
    setPosition({
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    });
  };

  useEffect(() => {
    image.src = 'https://picsum.photos/400/300';
  }, [image]);

  const handleDragStart = (e: Konva.KonvaEventObject<DragEvent>) => {
    const stage = e.target.getStage();
    if (!stage) return;
    stage.draggable(false);
    
    // Store the initial position of the template point
    const point = e.target as Konva.Circle;
    setDraggedPoint({
      id: 'template',
      x: point.x(),
      y: point.y(),
      title: 'New Point',
      description: 'Click to edit description'
    });
  };

  const handleDragEnd = (e: Konva.KonvaEventObject<DragEvent>) => {
    const stage = e.target.getStage();
    if (!stage) return;
    stage.draggable(true);

    const pos = stage.getPointerPosition();
    if (!pos || !draggedPoint) return;

    // Convert position to take into account stage scaling and position
    const scale = stage.scaleX();

    // Reset the template point to its original position
    const point = e.target as Konva.Circle;
    point.position({ x: 30, y: 20 });
    
    const x = (pos.x - stage.x()) / scale;
    const y = (pos.y - stage.y()) / scale;

    const newPoint: Point = {
      id: Date.now().toString(),
      x,
      y,
      title: 'New Point',
      description: 'Click to edit description'
    };

    setPoints([...points, newPoint]);
    setSelectedPoint(newPoint);
    setIsEditing(true);
  };

  return (
    <div style={{ display: 'flex', padding: '20px', gap: '20px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <Stage 
          width={400} 
          height={300} 
          onWheel={handleWheel}
          scaleX={scale}
          scaleY={scale}
          x={position.x}
          y={position.y}
          draggable
        >
          <Layer>
            <Image image={image} y={50} />
            
            {/* Template area */}
            <Rect
              x={0}
              y={0}
              width={400}
              height={40}
              fill="#f0f0f0"
              stroke="#ddd"
              strokeWidth={1}
            />
            <Circle
              x={30}
              y={20}
              radius={8}
              fill="#FF0000"
              stroke="#FFFFFF"
              strokeWidth={2}
              draggable
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            />
            <Text
              x={45}
              y={15}
              text="← Drag to add new point"
              fontSize={12}
              fill="#000000"
              align="left"
            />
            
            {/* Points on the image */}
            {points.map((point) => (
              <Circle
                key={point.id}
                x={point.x}
                y={point.y}
                radius={8}
                fill="#FF0000"
                stroke="#FFFFFF"
                strokeWidth={2}
                onClick={() => setSelectedPoint(point)}
                onTap={() => setSelectedPoint(point)}
                onMouseEnter={(e) => {
                  const container = e.target.getStage()?.container();
                  if (container) {
                    container.style.cursor = 'pointer';
                  }
                }}
                onMouseLeave={(e) => {
                  const container = e.target.getStage()?.container();
                  if (container) {
                    container.style.cursor = 'default';
                  }
                }}
              />
            ))}
          </Layer>
        </Stage>
      </div>

      <div style={{ 
        padding: '20px', 
        backgroundColor: '#f5f5f5', 
        borderRadius: '8px',
        minWidth: '200px'
      }}>
        {selectedPoint ? (
          isEditing ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <input
                value={newPointTitle || selectedPoint.title}
                onChange={(e) => setNewPointTitle(e.target.value)}
                placeholder="Point Title"
              />
              <textarea
                value={newPointDescription || selectedPoint.description}
                onChange={(e) => setNewPointDescription(e.target.value)}
                placeholder="Point Description"
                rows={4}
              />
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={() => {
                  const updatedPoints = points.map(p => 
                    p.id === selectedPoint.id 
                      ? { 
                          ...p, 
                          title: newPointTitle || p.title, 
                          description: newPointDescription || p.description 
                        } 
                      : p
                  );
                  setPoints(updatedPoints);
                  setIsEditing(false);
                  setNewPointTitle('');
                  setNewPointDescription('');
                }}>
                  Save
                </button>
                <button onClick={() => {
                  setIsEditing(false);
                  setNewPointTitle('');
                  setNewPointDescription('');
                }}>
                  Cancel
                </button>
                <button onClick={() => {
                  setPoints(points.filter(p => p.id !== selectedPoint.id));
                  setSelectedPoint(null);
                  setIsEditing(false);
                }}>
                  Delete
                </button>
              </div>
            </div>
          ) : (
            <>
              <h3>{selectedPoint.title}</h3>
              <p>{selectedPoint.description}</p>
              <button onClick={() => setIsEditing(true)}>Edit</button>
            </>
          )
        ) : (
          <p>Click on a point to see details</p>
        )}
      </div>
    </div>
  );
}

export default App;
