"use client";

import Header from "../../../components/Header";
import KanbanBoard from "../../../components/KanbanBoard";
import { DragDropContext } from "react-beautiful-dnd";

const KanbanPage = () => {
  return (
    <div>
      <Header />
      <main className="p-4">
        <KanbanBoard />
      </main>
    </div>
  );
};

export default KanbanPage;
