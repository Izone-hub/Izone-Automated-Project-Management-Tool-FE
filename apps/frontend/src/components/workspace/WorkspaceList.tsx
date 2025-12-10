import { useEffect } from "react";
import { useWorkspaces } from "@/hooks/useWorkspace";

export const WorkspaceList = () => {
  const { workspaces, loadWorkspaces, loading, error } = useWorkspace();

  useEffect(() => {
    loadWorkspaces();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <ul>
      {workspaces.map(ws => (
        <li key={ws.id}>
          <strong>{ws.name}</strong>
          {ws.description && <p>{ws.description}</p>}
        </li>
      ))}
    </ul>
  );
};












