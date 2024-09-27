import Header from '../../../components/Header';
import KanbanBoard from '../../../components/KanbanBoard';
import { DragDropContext } from 'react-beautiful-dnd';

const KanbanPage = () => {
  const onDragEnd = (result: any) => {
    // Handle drag-and-drop logic here
  };

  return (
    <div>
      <Header />
      <DragDropContext onDragEnd={onDragEnd}>
        <KanbanBoard />
      </DragDropContext>
    </div>
  );
};

export default KanbanPage;
