import { Workspace } from "@/types/workspace";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export async function apiCreateWorkspace(data: Partial<Workspace>): Promise<Workspace> {
  console.log("[API Placeholder] createWorkspace:", data);
  
  // TODO: Replace with real API
  // const res = await fetch(`${API_BASE}/workspaces`, {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify(data),
  // });
  // return await res.json();
  
  return {
    id: `ws-${Date.now()}`,
    name: data.name || "",
    description: data.description || "",
    color: data.color || "#7c3aed",
    ownerId: "user-1",
    members: ["user-1"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export async function apiUpdateWorkspace(id: string, updates: Partial<Workspace>): Promise<Workspace> {
  console.log("[API Placeholder] updateWorkspace:", id, updates);
  return { id, ...updates, updatedAt: new Date().toISOString() } as Workspace;
}

export async function apiDeleteWorkspace(id: string): Promise<{ success: boolean }> {
  console.log("[API Placeholder] deleteWorkspace:", id);
  return { success: true };
}

export async function apiGetWorkspace(id: string): Promise<Workspace> {
  console.log("[API Placeholder] getWorkspace:", id);
  
  // TODO: Replace with real API
  // const res = await fetch(`${API_BASE}/workspaces/${id}`);
  // return await res.json();
  
  return {
    id,
    name: "Sample Workspace",
    color: "#7c3aed",
    members: ["user-1"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export async function apiGetAllWorkspaces(): Promise<Workspace[]> {
  console.log("[API Placeholder] getAllWorkspaces");
  
  // TODO: Replace with real API
  // const res = await fetch(`${API_BASE}/workspaces`);
  // return await res.json();
  
  // Return empty array - workspaces will be created via UI
  return [];
}