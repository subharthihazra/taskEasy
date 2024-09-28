"use client";

import Header from "@/components/Header";
import KanbanBoard from "../../../components/KanbanBoard";

const KanbanPage = () => {
  return (
    <>
      <Header curpage="kanban" />
      <div>
        <main>
          <KanbanBoard />
        </main>
      </div>
    </>
  );
};

export default KanbanPage;
