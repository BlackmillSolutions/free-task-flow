import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import TaskCard from './TaskCard';
import { FaPlus } from 'react-icons/fa';

interface KanbanColumn {
  id: string;
  title: string;
  tasks: any[];
  color: string;
  limit?: number;
}

const KanbanView: React.FC = () => {
  const [columns, setColumns] = useState<KanbanColumn[]>([
    {
      id: 'todo',
      title: 'To Do',
      color: '#007bff',
      limit: 5,
      tasks: [
        {
          id: '1',
          title: 'Design New Landing Page',
          status: 'To Do',
          statusColor: '#007bff',
          priority: 'high',
          dueDate: '2024-02-10',
          assignee: 'John Doe',
          description: 'Create a modern and responsive landing page design.',
          progress: 0,
          attachments: 2,
          comments: 3,
        },
      ],
    },
    {
      id: 'inProgress',
      title: 'In Progress',
      color: '#ffc107',
      limit: 3,
      tasks: [
        {
          id: '2',
          title: 'API Integration',
          status: 'In Progress',
          statusColor: '#ffc107',
          priority: 'medium',
          dueDate: '2024-02-15',
          assignee: 'Jane Smith',
          description: 'Integrate payment gateway API.',
          progress: 50,
          attachments: 1,
          comments: 5,
        },
      ],
    },
    {
      id: 'done',
      title: 'Done',
      color: '#28a745',
      tasks: [
        {
          id: '3',
          title: 'Bug Fixes',
          status: 'Done',
          statusColor: '#28a745',
          priority: 'low',
          dueDate: '2024-02-08',
          assignee: 'Peter Jones',
          description: 'Fix reported bugs in the mobile app.',
          progress: 100,
          attachments: 0,
          comments: 8,
        },
      ],
    },
  ]);

  const onDragEnd = (result: any) => {
    const { source, destination } = result;

    // Dropped outside the list
    if (!destination) {
      return;
    }

    // Find source and destination columns
    const sourceColumn = columns.find((col) => col.id === source.droppableId);
    const destColumn = columns.find((col) => col.id === destination.droppableId);

    if (sourceColumn && destColumn) {
      const sourceTasks = [...sourceColumn.tasks];
      const destTasks = source.droppableId === destination.droppableId
        ? sourceTasks
        : [...destColumn.tasks];

      // Remove from source
      const [removed] = sourceTasks.splice(source.index, 1);

      // Check WIP limit
      if (destColumn.limit && destTasks.length >= destColumn.limit && source.droppableId !== destination.droppableId) {
        // TODO: Show error notification
        return;
      }

      // Add to destination
      destTasks.splice(destination.index, 0, {
        ...removed,
        status: destColumn.title,
        statusColor: destColumn.color,
      });

      // Update columns
      setColumns(columns.map(col => {
        if (col.id === source.droppableId) {
          return { ...col, tasks: sourceTasks };
        }
        if (col.id === destination.droppableId) {
          return { ...col, tasks: destTasks };
        }
        return col;
      }));
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto p-4">
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex space-x-4">
            {columns.map((column) => (
              <div
                key={column.id}
                className="flex flex-col bg-gray-100 rounded-lg p-4 min-w-[300px]"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <h3 className="font-medium text-gray-900">{column.title}</h3>
                    <span className="ml-2 text-sm text-gray-500">
                      {column.tasks.length}{column.limit ? `/${column.limit}` : ''}
                    </span>
                  </div>
                  <button className="p-1 hover:bg-gray-200 rounded-full">
                    <FaPlus className="text-gray-500" />
                  </button>
                </div>

                {/* Column Content */}
                <Droppable droppableId={column.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`flex-1 ${
                        snapshot.isDraggingOver ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className="space-y-3">
                        {column.tasks.map((task, index) => (
                          <Draggable
                            key={task.id}
                            draggableId={task.id}
                            index={index}
                          >
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                style={{
                                  ...provided.draggableProps.style,
                                  opacity: snapshot.isDragging ? 0.8 : 1,
                                }}
                              >
                                <TaskCard {...task} />
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    </div>
                  )}
                </Droppable>
              </div>
            ))}
          </div>
        </DragDropContext>
      </div>
    </div>
  );
};

export default KanbanView;
