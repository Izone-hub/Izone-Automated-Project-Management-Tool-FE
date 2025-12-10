// import * as mock from "./mockApi";

// const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK !== "0";

// export async function createNewBoard(payload: Partial<Board>) {
//   if (USE_MOCK) return mock.createBoard(payload);
//   const res = await fetch("/api/workspaces/1/boards", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(payload),
//   });
//   return res.json();
// }

// export async function fetchBoards() {
//   if (USE_MOCK) return mock.getBoards();
//   const res = await fetch("/api/workspaces/1/boards");
//   return res.json();
// }
