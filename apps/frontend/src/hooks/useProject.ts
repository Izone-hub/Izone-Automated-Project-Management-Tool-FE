
// import { useState, useEffect } from 'react';

// export const useProjects = () => {
//   const [projects, setProjects] = useState([]);

//   useEffect(() => {
//     const saved = localStorage.getItem('projects');
//     if (saved) setProjects(JSON.parse(saved));
//   }, []);

//   const saveProjects = (newProjects) => {
//     setProjects(newProjects);
//     localStorage.setItem('projects', JSON.stringify(newProjects));
//   };

//   const createProject = (projectData) => {
//     const newProject = {
//       id: Date.now().toString(),
//       ...projectData,
//       createdAt: new Date().toISOString(),
//       isArchived: false
//     };
//     saveProjects([...projects, newProject]);
//     return newProject;
//   };

//   const updateProject = (id, updates) => {
//     const updated = projects.map(proj =>
//       proj.id === id ? { ...proj, ...updates } : proj
//     );
//     saveProjects(updated);
//   };

//   const archiveProject = (id) => {
//     updateProject(id, { isArchived: true });
//   };

//   const restoreProject = (id) => {
//     updateProject(id, { isArchived: false });
//   };

//   return {
//     projects,
//     createProject,
//     updateProject,
//     archiveProject,
//     restoreProject
//   };
// };







