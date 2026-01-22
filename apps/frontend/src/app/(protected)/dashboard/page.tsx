// src/app/dashboard/page.tsx
'use client';
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useWorkspaces } from "@/hooks/useWorkspace";
import WorkspaceForm from "@/components/workspace/WorkspaceForm";
import { WorkspaceCard } from "@/components/workspace/WorkspaceCard";
import { Plus, RefreshCw } from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const { workspaces, loading, error, isAuthenticated, reload, boardCounts } = useWorkspaces();
  const [showForm, setShowForm] = useState(false);

  // Remove the entire useEffect with manual authentication check
  // Keep only the redirection logic based on the hook's authentication state
  useEffect(() => {
    // Redirect to login if not authenticated via hook
    if (!loading && !isAuthenticated && error?.includes("login")) {
      router.push("/login?redirect=/dashboard");
    }
  }, [loading, isAuthenticated, error, router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // Remove this entire conditional block that shows the "Login to Continue" button
  // if (!isAuthenticated) {
  //   return (
  //     <div className="p-6 text-center">
  //       <p className="text-red-600 mb-4">{error}</p>
  //       <button
  //         onClick={() => router.push("/login?redirect=/dashboard")}
  //         className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
  //       >
  //         Login to Continue
  //       </button>
  //     </div>
  //   );
  // }

  // Also remove the handleWorkspaceClick function with local storage checks
  // as it's not used in the current code

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Rest of your JSX remains exactly the same */}
      {/* Header */}
      <div className="bg-white border-b border-gray-200 mb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Your Workspaces</h1>
              <p className="text-gray-600 text-sm mt-1">
                Manage all your workspaces and projects
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={reload}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
              <button
                onClick={() => setShowForm(prev => !prev)}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                <Plus className="w-4 h-4" />
                Create Workspace
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {showForm && (
          <div className="mb-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Create New Workspace</h2>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              <WorkspaceForm onSuccess={() => {
                reload();
                setShowForm(false);
              }} />
            </div>
          </div>
        )}

        {error && !error.includes("login") && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {workspaces.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-8 14H7v-2h4v2zm0-6H7v-2h4v4zm0-6H7V7h4v4zm6 12h-4v-2h4v2zm0-6h-4v-2h4v2zm0-6h-4V7h4v4z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">No workspaces yet</h3>
            <p className="text-gray-600 mb-6">Create your first workspace to start organizing your projects</p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Create Workspace
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workspaces.map(workspace => (
              <WorkspaceCard 
                key={workspace.id} 
                workspace={{
                  ...workspace,
                  memberCount: 1, // At minimum, the owner is a member
                  boardCount: boardCounts[workspace.id] || 0,
                  visibility: 'private',
                  color: '#0079bf'
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}












// // 'use client';
// // import React, { useState, useEffect } from "react";
// // import { useRouter } from "next/navigation";
// // import { useWorkspaces } from "@/hooks/useWorkspace";
// // import WorkspaceForm from "@/components/workspace/WorkspaceForm";
// // import { WorkspaceCard } from "@/components/workspace/WorkspaceCard";
// // import { Plus, RefreshCw } from "lucide-react";

// // export default function DashboardPage() {
// //   const router = useRouter();
// //   const { workspaces, loading, error, isAuthenticated, reload } = useWorkspaces();
// //   const [showForm, setShowForm] = useState(false);

// //   useEffect(() => {
// //     // Check authentication on load
// //     const token = localStorage.getItem('auth_token');
// //     const user = localStorage.getItem('user');
    
// //     if (!token || !user) {
// //       router.push('/login?redirect=/dashboard');
// //       return;
// //     }
    
// //     // 🔥 Validate token belongs to current user
// //     try {
// //       const parsedUser = JSON.parse(user);
// //       // You could add additional validation here
// //       console.log('Current user:', parsedUser.email);
// //     } catch {
// //       // Clear corrupted user data
// //       localStorage.removeItem('user');
// //       router.push('/login?redirect=/dashboard');
// //     }
// //   }, [router]);

// //   // Redirect to login if not authenticated via hook
// //   useEffect(() => {
// //     if (!loading && !isAuthenticated && error?.includes("login")) {
// //       router.push("/login?redirect=/dashboard");
// //     }
// //   }, [loading, isAuthenticated, error, router]);

// //   if (loading) {
// //     return (
// //       <div className="flex justify-center items-center min-h-screen">
// //         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
// //       </div>
// //     );
// //   }

// //   if (!isAuthenticated) {
// //     return (
// //       <div className="p-6 text-center">
// //         <p className="text-red-600 mb-4">{error}</p>
// //         <button
// //           onClick={() => router.push("/login?redirect=/dashboard")}
// //           className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
// //         >
// //           Login to Continue
// //         </button>
// //       </div>
// //     );
// //   }

// //   // Also add a check before redirecting to workspaces
// //   const handleWorkspaceClick = (workspaceId: string) => {
// //     // Store last workspace for current user only
// //     const user = localStorage.getItem('user');
// //     if (user) {
// //       localStorage.setItem('lastWorkspaceId', workspaceId);
// //       router.push(`/workspace/${workspaceId}`);
// //     } else {
// //       router.push('/login');
// //     }
// //   };

// //   return (
// //     <div className="min-h-screen bg-gray-50">
// //       {/* Header */}
// //       <div className="bg-white border-b border-gray-200 mb-6">
// //         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
// //           <div className="flex justify-between items-center">
// //             <div>
// //               <h1 className="text-2xl font-bold text-gray-900">Your Workspaces</h1>
// //               <p className="text-gray-600 text-sm mt-1">
// //                 Manage all your workspaces and projects
// //               </p>
// //             </div>
// //             <div className="flex gap-3">
// //               <button
// //                 onClick={reload}
// //                 className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
// //               >
// //                 <RefreshCw className="w-4 h-4" />
// //                 Refresh
// //               </button>
// //               <button
// //                 onClick={() => setShowForm(prev => !prev)}
// //                 className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
// //               >
// //                 <Plus className="w-4 h-4" />
// //                 Create Workspace
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Main Content */}
// //       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
// //         {showForm && (
// //           <div className="mb-8">
// //             <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
// //               <div className="flex justify-between items-center mb-4">
// //                 <h2 className="text-lg font-semibold text-gray-900">Create New Workspace</h2>
// //                 <button
// //                   onClick={() => setShowForm(false)}
// //                   className="text-gray-500 hover:text-gray-700"
// //                 >
// //                   ✕
// //                 </button>
// //               </div>
// //               <WorkspaceForm onSuccess={() => {
// //                 reload();
// //                 setShowForm(false);
// //               }} />
// //             </div>
// //           </div>
// //         )}

// //         {error && !error.includes("login") && (
// //           <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
// //             {error}
// //           </div>
// //         )}

// //         {workspaces.length === 0 ? (
// //           <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
// //             <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
// //               <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
// //                 <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-8 14H7v-2h4v2zm0-6H7v-2h4v4zm0-6H7V7h4v4zm6 12h-4v-2h4v2zm0-6h-4v-2h4v2zm0-6h-4V7h4v4z" />
// //               </svg>
// //             </div>
// //             <h3 className="text-lg font-medium text-gray-800 mb-2">No workspaces yet</h3>
// //             <p className="text-gray-600 mb-6">Create your first workspace to start organizing your projects</p>
// //             <button
// //               onClick={() => setShowForm(true)}
// //               className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
// //             >
// //               Create Workspace
// //             </button>
// //           </div>
// //         ) : (
// //           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
// //             {workspaces.map(workspace => (
// //               <div key={workspace.id} onClick={() => handleWorkspaceClick(workspace.id)}>
// //                 <WorkspaceCard 
// //                   workspace={{
// //                     ...workspace,
// //                     memberCount: 0,
// //                     boardCount: 0,
// //                     visibility: 'private',
// //                     color: '#0079bf'
// //                   }}
// //                 />
// //               </div>
// //             ))}
// //           </div>
// //         )}
// //       </div>
// //     </div>
// //   );
// // }












// // src/app/dashboard/page.tsx
// 'use client';
// import React, { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { useWorkspaces } from "@/hooks/useWorkspace";
// import WorkspaceForm from "@/components/workspace/WorkspaceForm";
// import { WorkspaceCard } from "@/components/workspace/WorkspaceCard";
// import { Plus, RefreshCw } from "lucide-react";

// export default function DashboardPage() {
//   const router = useRouter();
//   const { workspaces, loading, error, isAuthenticated, reload } = useWorkspaces();
//   const [showForm, setShowForm] = useState(false);

//   useEffect(() => {
//     // Redirect to login if not authenticated
//     if (!loading && !isAuthenticated && error?.includes("login")) {
//       router.push("/login?redirect=/dashboard");
//     }
//   }, [loading, isAuthenticated, error, router]);

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center min-h-screen">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
//       </div>
//     );
//   }

//   if (!isAuthenticated) {
//     return (
//       <div className="p-6 text-center">
//         <p className="text-red-600 mb-4">{error}</p>
//         <button
//           onClick={() => router.push("/login?redirect=/dashboard")}
//           className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
//         >
//           Login to Continue
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <div className="bg-white border-b border-gray-200 mb-6">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
//           <div className="flex justify-between items-center">
//             <div>
//               <h1 className="text-2xl font-bold text-gray-900">Your Workspaces</h1>
//               <p className="text-gray-600 text-sm mt-1">
//                 Manage all your workspaces and projects
//               </p>
//             </div>
//             <div className="flex gap-3">
//               <button
//                 onClick={reload}
//                 className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
//               >
//                 <RefreshCw className="w-4 h-4" />
//                 Refresh
//               </button>
//               <button
//                 onClick={() => setShowForm(prev => !prev)}
//                 className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
//               >
//                 <Plus className="w-4 h-4" />
//                 Create Workspace
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
//         {showForm && (
//           <div className="mb-8">
//             <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//               <div className="flex justify-between items-center mb-4">
//                 <h2 className="text-lg font-semibold text-gray-900">Create New Workspace</h2>
//                 <button
//                   onClick={() => setShowForm(false)}
//                   className="text-gray-500 hover:text-gray-700"
//                 >
//                   ✕
//                 </button>
//               </div>
//               <WorkspaceForm onSuccess={() => {
//                 reload();
//                 setShowForm(false);
//               }} />
//             </div>
//           </div>
//         )}

//         {error && !error.includes("login") && (
//           <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
//             {error}
//           </div>
//         )}

//         {workspaces.length === 0 ? (
//           <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
//             <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
//               <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
//                 <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-8 14H7v-2h4v2zm0-6H7v-2h4v4zm0-6H7V7h4v4zm6 12h-4v-2h4v2zm0-6h-4v-2h4v2zm0-6h-4V7h4v4z" />
//               </svg>
//             </div>
//             <h3 className="text-lg font-medium text-gray-800 mb-2">No workspaces yet</h3>
//             <p className="text-gray-600 mb-6">Create your first workspace to start organizing your projects</p>
//             <button
//               onClick={() => setShowForm(true)}
//               className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
//             >
//               Create Workspace
//             </button>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {workspaces.map(workspace => (
//               <WorkspaceCard 
//                 key={workspace.id} 
//                 workspace={{
//                   ...workspace,
//                   memberCount: 0, // Add actual member count from API
//                   boardCount: 0,  // Add actual board count from API
//                   visibility: 'private', // Default or from API
//                   color: '#0079bf' // Default color
//                 }}
//               />
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }





















