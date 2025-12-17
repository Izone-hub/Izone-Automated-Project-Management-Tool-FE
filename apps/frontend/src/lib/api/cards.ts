

// // // function resolveApiBaseUrl(): string {
// // //   // Prefer explicit env; fallback to sensible defaults to avoid mixed-content issues.
// // //   if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL;
// // //   if (typeof window !== "undefined") {
// // //     const { protocol, hostname } = window.location;
// // //     // If opened from file:// (static build opened locally), fall back to localhost.
// // //     if (protocol === "file:") return "http://localhost:8000";
// // //     // If frontend is served over HTTPS, default to HTTPS backend on same host/port 443.
// // //     if (protocol === "https:") return `https://${hostname || "localhost"}`;
// // //     // Otherwise default to local dev backend (http).
// // //     return `http://${hostname || "localhost"}:8000`;
// // //   }
// // //   return "http://localhost:8000";
// // // }

// // // const API_BASE_URL = resolveApiBaseUrl();

// // // function getToken(): string | null {
// // //   if (typeof window === "undefined") return null;
// // //   return localStorage.getItem("auth_token");
// // // }

// // // function headers(): HeadersInit {
// // //   const token = getToken();
// // //   return {
// // //     "Content-Type": "application/json",
// // //     ...(token && { Authorization: `Bearer ${token}` }),
// // //   };
// // // }

// // // // Helper function to fetch user UUID from server
// // // async function fetchUserUuidFromServer(): Promise<string | null> {
// // //   try {
// // //     console.log("Fetching user UUID from server...");
    
// // //     const token = localStorage.getItem("auth_token");
// // //     if (!token) {
// // //       console.error("No auth token found");
// // //       return null;
// // //     }
    
// // //     // Try different endpoints
// // //     const endpoints = [
// // //       `${API_BASE_URL}/users/me`,
// // //       `${API_BASE_URL}/auth/me`,
// // //       `${API_BASE_URL}/profile`,
// // //       `${API_BASE_URL}/user`,
// // //     ];
    
// // //     for (const endpoint of endpoints) {
// // //       try {
// // //         const response = await fetch(endpoint, {
// // //           method: "GET",
// // //           headers: {
// // //             "Content-Type": "application/json",
// // //             Authorization: `Bearer ${token}`,
// // //           },
// // //         });
        
// // //         if (response.ok) {
// // //           const userData = await response.json();
// // //           console.log(`User data from ${endpoint}:`, userData);
          
// // //           // Try different field names for UUID
// // //           const uuid = userData?.id || userData?.uuid || userData?.user_id || userData?.sub;
          
// // //           if (uuid && typeof uuid === 'string' && uuid.includes('-')) {
// // //             console.log("Got UUID from API:", uuid);
// // //             localStorage.setItem("user_uuid", uuid);
// // //             return uuid;
// // //           }
          
// // //           // If we got user data but no UUID, check for email
// // //           if (userData?.email) {
// // //             console.log("Got user email, but no UUID. Email:", userData.email);
// // //             // We'll handle this case in the main function
// // //           }
// // //         }
// // //       } catch (endpointError) {
// // //         console.log(`Endpoint ${endpoint} failed:`, endpointError);
// // //         continue;
// // //       }
// // //     }
    
// // //     console.error("All endpoints failed to return UUID");
// // //     return null;
// // //   } catch (error) {
// // //     console.error("Error fetching user UUID:", error);
// // //     return null;
// // //   }
// // // }

// // // // UPDATED getUserId function with better error handling and server fallback
// // // // Made async to match boards.ts implementation
// // // async function getUserId(): Promise<string | null> {
// // //   if (typeof window === "undefined") return null;
  
// // //   console.log("=== DEBUG: getUserId() called (cards) ===");
  
// // //   const token = localStorage.getItem("auth_token");
  
// // //   // PRIORITY 1: If we have a token, always try to fetch from server first
// // //   // This ensures we get the most up-to-date and valid user ID
// // //   if (token) {
// // //     console.log("Token found, attempting to fetch user ID from server...");
// // //     const serverUuid = await fetchUserUuidFromServer();
// // //     if (serverUuid) {
// // //       console.log("✅ Got UUID from server:", serverUuid);
// // //       return serverUuid;
// // //     }
// // //   }
  
// // //   // PRIORITY 2: Check for cached UUID (but validate it's not the hardcoded dev UUID)
// // //   const cachedUuid = localStorage.getItem("user_uuid");
// // //   const hardcodedDevUuid = "fb1ef640-2cc3-48a8-af5c-502e57bd6c0c";
  
// // //   if (cachedUuid && cachedUuid.includes('-') && cachedUuid !== hardcodedDevUuid) {
// // //     console.log("Using cached UUID:", cachedUuid);
// // //     // Still try to verify it's valid by checking if we have a token
// // //     if (token) {
// // //       // If we have a token but server fetch failed, the cached UUID might be invalid
// // //       // But we'll use it as a fallback
// // //       console.warn("Using cached UUID, but server fetch failed. This might be invalid.");
// // //     }
// // //     return cachedUuid;
// // //   }
  
// // //   // PRIORITY 3: Check user object in localStorage
// // //   const userStr = localStorage.getItem("user");
// // //   let userEmail: string | null = null;
  
// // //   if (userStr) {
// // //     try {
// // //       const user = JSON.parse(userStr);
// // //       console.log("User object from localStorage:", user);
      
// // //       // Check for UUID in various field names
// // //       const possibleUuidFields = ['id', 'uuid', 'user_id', 'sub'];
// // //       for (const field of possibleUuidFields) {
// // //         const uuid = user?.[field];
// // //         if (uuid && typeof uuid === 'string' && uuid.includes('-') && uuid !== hardcodedDevUuid) {
// // //           console.log(`Found UUID in ${field}:`, uuid);
// // //           localStorage.setItem("user_uuid", uuid);
// // //           return uuid;
// // //         }
// // //       }
      
// // //       // Save email for later use
// // //       userEmail = user?.email || user?.id || null;
// // //       if (userEmail && userEmail.includes('@')) {
// // //         console.log("Found email in user object:", userEmail);
// // //       }
// // //     } catch (error) {
// // //       console.error("Failed to parse user object:", error);
// // //     }
// // //   }
  
// // //   // PRIORITY 4: Decode JWT token (if server fetch didn't work)
// // //   if (token) {
// // //     try {
// // //       const parts = token.split('.');
// // //       if (parts.length === 3) {
// // //         const payload = JSON.parse(atob(parts[1]));
// // //         console.log("JWT payload:", payload);
        
// // //         // Check for UUID in JWT
// // //         const jwtUuid = payload?.sub || payload?.user_id || payload?.id;
// // //         if (jwtUuid && typeof jwtUuid === 'string' && jwtUuid.includes('-') && jwtUuid !== hardcodedDevUuid) {
// // //           console.log("Found UUID in JWT:", jwtUuid);
// // //           localStorage.setItem("user_uuid", jwtUuid);
// // //           return jwtUuid;
// // //         }
        
// // //         // If no UUID in JWT, get email from JWT
// // //         if (!userEmail) {
// // //           userEmail = payload?.email;
// // //           if (userEmail && userEmail.includes('@')) {
// // //             console.log("Found email in JWT:", userEmail);
// // //           }
// // //         }
// // //       }
// // //     } catch (error) {
// // //       console.error("Failed to decode JWT:", error);
// // //     }
// // //   }
  
// // //   // PRIORITY 5: If we have an email but no UUID, try server fetch again
// // //   if (userEmail && userEmail.includes('@') && token) {
// // //     console.log("No UUID found locally. Email present:", userEmail);
// // //     console.log("Attempting to fetch UUID from server again...");
    
// // //     const serverUuid = await fetchUserUuidFromServer();
// // //     if (serverUuid) {
// // //       return serverUuid;
// // //     }
// // //   }
  
// // //   // LAST RESORT: Only use hardcoded UUID if explicitly set in env and no token exists
// // //   // This prevents using invalid UUIDs when we have authentication
// // //   if (!token) {
// // //     console.warn("No auth token found. Cannot fetch user ID from server.");
// // //     const isDevelopment = process.env.NODE_ENV === 'development' || window.location.hostname === 'localhost';
// // //     if (isDevelopment && process.env.NEXT_PUBLIC_DEV_USER_ID) {
// // //       const devUuid = process.env.NEXT_PUBLIC_DEV_USER_ID;
// // //       if (devUuid && devUuid.includes('-')) {
// // //         console.warn("DEVELOPMENT: Using env UUID:", devUuid);
// // //         localStorage.setItem("user_uuid", devUuid);
// // //         return devUuid;
// // //       }
// // //     }
// // //   }
  
// // //   console.error("No user UUID available. User might not be logged in or user ID not found in database.");
// // //   return null;
// // // }

// // // export interface Card {
// // //   id: string;
// // //   project_id: string;
// // //   name: string;
// // //   description: string;
// // //   due_date: string | null;
// // //   status: 'todo' | 'in-progress' | 'review' | 'done';
// // //   priority: 'low' | 'medium' | 'high' | 'urgent';
// // //   assignee_id: string | null;
// // //   position: number;
// // //   created_by: string;
// // //   created_at: string;
// // //   updated_at: string;
// // //   title?: string;
// // //   list_id?: string;
// // // }

// // // export interface CreateCardData {
// // //   project_id: string;
// // //   name: string;
// // //   description?: string;
// // //   due_date?: string;
// // //   status: 'todo' | 'in-progress' | 'review' | 'done';
// // //   priority: 'low' | 'medium' | 'high' | 'urgent';
// // //   assignee_id?: string;
// // //   position: number;
// // // }

// // // export interface UpdateCardData {
// // //   name?: string;
// // //   description?: string;
// // //   due_date?: string | null;
// // //   status?: 'todo' | 'in-progress' | 'review' | 'done';
// // //   priority?: 'low' | 'medium' | 'high' | 'urgent';
// // //   assignee_id?: string | null;
// // //   position?: number;
// // // }

// // // export const cardsAPI = {
// // //   async getBoardCards(boardId: string): Promise<Card[]> {
// // //     try {
// // //       const res = await fetch(
// // //         `${API_BASE_URL}/tasks/?project_id=${boardId}`,
// // //         { headers: headers() }
// // //       );

// // //       if (res.status === 401) {
// // //         localStorage.removeItem("auth_token");
// // //         localStorage.removeItem("user_uuid");
// // //         throw new Error("Session expired. Please login again.");
// // //       }

// // //       if (!res.ok) {
// // //         const error = await res.text();
// // //         throw new Error(error || "Failed to load cards");
// // //       }

// // //       const cards = await res.json();
// // //       return cards.map((card: any) => ({
// // //         ...card,
// // //         title: card.name,
// // //       }));
// // //     } catch (error) {
// // //       console.error("Error fetching cards:", error);
// // //       // Give clearer feedback for network/CORS failures
// // //       if (error instanceof TypeError) {
// // //         throw new Error(
// // //           `Cannot reach cards API at ${API_BASE_URL}. Check that the backend is running and CORS/HTTPS settings allow requests.`
// // //         );
// // //       }
// // //       throw error;
// // //     }
// // //   },

// // //   async getCard(cardId: string): Promise<Card> {
// // //     try {
// // //       const res = await fetch(`${API_BASE_URL}/tasks/${cardId}`, {
// // //         headers: headers(),
// // //       });

// // //       if (res.status === 401) {
// // //         localStorage.removeItem("auth_token");
// // //         localStorage.removeItem("user_uuid");
// // //         throw new Error("Session expired. Please login again.");
// // //       }

// // //       if (!res.ok) {
// // //         const error = await res.text();
// // //         throw new Error(error || "Failed to load card");
// // //       }

// // //       const card = await res.json();
// // //       return {
// // //         ...card,
// // //         title: card.name,
// // //       };
// // //     } catch (error) {
// // //       console.error("Error fetching card:", error);
// // //       throw error;
// // //     }
// // //   },

// // //   async createCard(data: CreateCardData): Promise<Card> {
// // //     try {
// // //       // Get user ID - now async to match boards.ts
// // //       const userId = await getUserId();
// // //       console.log("Creating card - User ID:", userId);
      
// // //       if (!userId) {
// // //         console.error("Authentication Error Details:");
// // //         console.log("user in localStorage:", localStorage.getItem("user"));
// // //         console.log("auth_token exists:", !!localStorage.getItem("auth_token"));
// // //         console.log("user_uuid exists:", !!localStorage.getItem("user_uuid"));
        
// // //         throw new Error("Please login to create a card. No user ID found.");
// // //       }

// // //       console.log("Creating card with User ID:", userId);
// // //       console.log("Card data:", data);
// // //       console.log("Full request URL:", `${API_BASE_URL}/tasks/?user_id=${userId}`);

// // //       const res = await fetch(
// // //         `${API_BASE_URL}/tasks/?user_id=${userId}`,
// // //         {
// // //           method: "POST",
// // //           headers: headers(),
// // //           body: JSON.stringify({
// // //             project_id: data.project_id,
// // //             name: data.name,
// // //             description: data.description || "",
// // //             due_date: data.due_date || null,
// // //             status: data.status || 'todo',
// // //             priority: data.priority || 'medium',
// // //             assignee_id: data.assignee_id || null,
// // //             position: data.position || 0,
// // //           }),
// // //         }
// // //       );

// // //       console.log("Response status:", res.status);

// // //       if (res.status === 401) {
// // //         localStorage.removeItem("auth_token");
// // //         localStorage.removeItem("user_uuid");
// // //         localStorage.removeItem("user");
// // //         throw new Error("Session expired. Please login again.");
// // //       }

// // //       if (!res.ok) {
// // //         let errorText = "Failed to create card";
// // //         try {
// // //           errorText = await res.text();
// // //           console.error("API error response body:", errorText);
          
// // //           // Handle specific error messages
// // //           if (errorText.includes("User not found") || errorText.includes('"detail":"User not found"')) {
// // //             // Clear cached UUID if it's invalid
// // //             console.error("❌ Invalid user UUID detected. Clearing cache...");
// // //             localStorage.removeItem("user_uuid");
// // //             localStorage.removeItem("user");
// // //             // Try to get fresh user ID from server
// // //             const freshUserId = await fetchUserUuidFromServer();
// // //             if (freshUserId) {
// // //               console.log("✅ Got fresh user ID, retrying request...");
// // //               // Retry the request with fresh user ID
// // //               const retryRes = await fetch(
// // //                 `${API_BASE_URL}/tasks/?user_id=${freshUserId}`,
// // //                 {
// // //                   method: "POST",
// // //                   headers: headers(),
// // //                   body: JSON.stringify({
// // //                     project_id: data.project_id,
// // //                     name: data.name,
// // //                     description: data.description || "",
// // //                     due_date: data.due_date || null,
// // //                     status: data.status || 'todo',
// // //                     priority: data.priority || 'medium',
// // //                     assignee_id: data.assignee_id || null,
// // //                     position: data.position || 0,
// // //                   }),
// // //                 }
// // //               );
              
// // //               if (retryRes.ok) {
// // //                 const card = await retryRes.json();
// // //                 console.log("✅ Card created successfully after retry:", card);
// // //                 return {
// // //                   ...card,
// // //                   title: card.name,
// // //                 };
// // //               }
// // //             }
// // //             errorText = "User not found in database. Please logout and login again to refresh your session.";
// // //           } else if (errorText.includes("project_id")) {
// // //             errorText = "Invalid board. Please refresh the page.";
// // //           }
// // //         } catch (e) {
// // //           console.error("Could not read error response:", e);
// // //           errorText = `HTTP ${res.status}: ${res.statusText}`;
// // //         }
// // //         throw new Error(errorText);
// // //       }

// // //       const card = await res.json();
// // //       console.log("✅ Card created successfully:", card);
      
// // //       return {
// // //         ...card,
// // //         title: card.name,
// // //       };
// // //     } catch (error: any) {
// // //       console.error("❌ Error creating card:", error);
      
// // //       // Enhanced error messages
// // //       if (error.message.includes("Failed to fetch")) {
// // //         throw new Error(
// // //           `Cannot connect to server at ${API_BASE_URL}. Make sure backend is running.`
// // //         );
// // //       }
      
// // //       if (error.message.includes("NetworkError")) {
// // //         throw new Error(
// // //           "Network error. Check your internet connection and make sure CORS is configured on the backend."
// // //         );
// // //       }
      
// // //       throw error;
// // //     }
// // //   },

// // //   async updateCard(cardId: string, data: UpdateCardData): Promise<Card> {
// // //     try {
// // //       const userId = await getUserId();
// // //       if (!userId) {
// // //         throw new Error("User not authenticated. Please login.");
// // //       }

// // //       const res = await fetch(
// // //         `${API_BASE_URL}/tasks/${cardId}?user_id=${userId}`,
// // //         {
// // //           method: "PATCH",
// // //           headers: headers(),
// // //           body: JSON.stringify(data),
// // //         }
// // //       );

// // //       if (res.status === 401) {
// // //         localStorage.removeItem("auth_token");
// // //         localStorage.removeItem("user_uuid");
// // //         throw new Error("Session expired. Please login again.");
// // //       }

// // //       if (!res.ok) {
// // //         const error = await res.text();
// // //         throw new Error(error || "Failed to update card");
// // //       }

// // //       const card = await res.json();
// // //       return {
// // //         ...card,
// // //         title: card.name,
// // //       };
// // //     } catch (error) {
// // //       console.error("Error updating card:", error);
// // //       throw error;
// // //     }
// // //   },

// // //   async deleteCard(cardId: string): Promise<void> {
// // //     try {
// // //       const userId = await getUserId();
// // //       if (!userId) {
// // //         throw new Error("User not authenticated");
// // //       }

// // //       const res = await fetch(
// // //         `${API_BASE_URL}/tasks/${cardId}?user_id=${userId}`,
// // //         {
// // //           method: "DELETE",
// // //           headers: headers(),
// // //         }
// // //       );

// // //       if (res.status === 401) {
// // //         localStorage.removeItem("auth_token");
// // //         localStorage.removeItem("user_uuid");
// // //         throw new Error("Session expired. Please login again.");
// // //       }

// // //       if (!res.ok) {
// // //         const error = await res.text();
// // //         throw new Error(error || "Failed to delete card");
// // //       }
// // //     } catch (error) {
// // //       console.error("Error deleting card:", error);
// // //       throw error;
// // //     }
// // //   },
// // // };


// // function resolveApiBaseUrl(): string {
// //   // Prefer explicit env; fallback to sensible defaults to avoid mixed-content issues.
// //   if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL;
// //   if (typeof window !== "undefined") {
// //     const { protocol, hostname } = window.location;
// //     // If opened from file:// (static build opened locally), fall back to localhost.
// //     if (protocol === "file:") return "http://localhost:8000";
// //     // If frontend is served over HTTPS, default to HTTPS backend on same host/port 443.
// //     if (protocol === "https:") return `https://${hostname || "localhost"}`;
// //     // Otherwise default to local dev backend (http).
// //     return `http://${hostname || "localhost"}:8000`;
// //   }
// //   return "http://localhost:8000";
// // }

// // const API_BASE_URL = resolveApiBaseUrl();

// // function getToken(): string | null {
// //   if (typeof window === "undefined") return null;
// //   return localStorage.getItem("auth_token");
// // }

// // function headers(): HeadersInit {
// //   const token = getToken();
// //   return {
// //     "Content-Type": "application/json",
// //     ...(token && { Authorization: `Bearer ${token}` }),
// //   };
// // }

// // // Simplified user ID fetching - focus on one reliable approach
// // async function getUserId(): Promise<string | null> {
// //   if (typeof window === "undefined") return null;
  
// //   console.log("=== DEBUG: getUserId() called ===");
  
// //   // Check for token first - if no token, user is not authenticated
// //   const token = localStorage.getItem("auth_token");
// //   if (!token) {
// //     console.log("No auth token found");
// //     return null;
// //   }
  
// //   // Try to decode JWT token first (most reliable)
// //   try {
// //     const parts = token.split('.');
// //     if (parts.length === 3) {
// //       const payload = JSON.parse(atob(parts[1]));
// //       console.log("JWT payload:", payload);
      
// //       // Check for UUID in standard JWT fields
// //       const jwtUuid = payload?.sub || payload?.user_id || payload?.id;
// //       if (jwtUuid && typeof jwtUuid === 'string' && jwtUuid.includes('-')) {
// //         console.log("✅ Found UUID in JWT:", jwtUuid);
// //         localStorage.setItem("user_uuid", jwtUuid);
// //         return jwtUuid;
// //       }
// //     }
// //   } catch (error) {
// //     console.error("Failed to decode JWT:", error);
// //   }
  
// //   // If JWT doesn't have UUID, try fetching from server
// //   try {
// //     console.log("Fetching user info from server...");
// //     const response = await fetch(`${API_BASE_URL}/users/me`, {
// //       method: "GET",
// //       headers: {
// //         "Content-Type": "application/json",
// //         Authorization: `Bearer ${token}`,
// //       },
// //     });
    
// //     if (response.ok) {
// //       const userData = await response.json();
// //       console.log("User data from API:", userData);
      
// //       // Try different field names for UUID
// //       const uuid = userData?.id || userData?.uuid || userData?.user_id;
      
// //       if (uuid && typeof uuid === 'string') {
// //         console.log("✅ Got UUID from API:", uuid);
// //         localStorage.setItem("user_uuid", uuid);
// //         return uuid;
// //       }
// //     } else if (response.status === 401) {
// //       console.error("Token expired or invalid");
// //       localStorage.removeItem("auth_token");
// //       localStorage.removeItem("user_uuid");
// //     }
// //   } catch (error) {
// //     console.error("Error fetching user info:", error);
// //   }
  
// //   // Last resort: development fallback (only in development mode)
// //   if (process.env.NODE_ENV === 'development' || window.location.hostname === 'localhost') {
// //     const devUuid = localStorage.getItem("user_uuid") || process.env.NEXT_PUBLIC_DEV_USER_ID;
// //     if (devUuid && typeof devUuid === 'string') {
// //       console.warn("⚠️ DEVELOPMENT: Using fallback UUID:", devUuid);
// //       return devUuid;
// //     }
// //   }
  
// //   console.error("No valid user ID found");
// //   return null;
// // }

// // export interface Card {
// //   id: string;
// //   project_id: string;
// //   name: string;
// //   description: string;
// //   due_date: string | null;
// //   status: 'todo' | 'in-progress' | 'review' | 'done';
// //   priority: 'low' | 'medium' | 'high' | 'urgent';
// //   assignee_id: string | null;
// //   position: number;
// //   created_by: string;
// //   created_at: string;
// //   updated_at: string;
// //   title?: string;
// //   list_id?: string;
// // }

// // export interface CreateCardData {
// //   project_id: string;
// //   name: string;
// //   description?: string;
// //   due_date?: string;
// //   status: 'todo' | 'in-progress' | 'review' | 'done';
// //   priority: 'low' | 'medium' | 'high' | 'urgent';
// //   assignee_id?: string;
// //   position: number;
// // }

// // export interface UpdateCardData {
// //   name?: string;
// //   description?: string;
// //   due_date?: string | null;
// //   status?: 'todo' | 'in-progress' | 'review' | 'done';
// //   priority?: 'low' | 'medium' | 'high' | 'urgent';
// //   assignee_id?: string | null;
// //   position?: number;
// // }

// // export const cardsAPI = {
// //   async getBoardCards(boardId: string): Promise<Card[]> {
// //     try {
// //       const res = await fetch(
// //         `${API_BASE_URL}/tasks/?project_id=${boardId}`,
// //         { headers: headers() }
// //       );

// //       if (res.status === 401) {
// //         localStorage.removeItem("auth_token");
// //         localStorage.removeItem("user_uuid");
// //         throw new Error("Session expired. Please login again.");
// //       }

// //       if (res.status === 404) {
// //         throw new Error("Board not found");
// //       }

// //       if (!res.ok) {
// //         const error = await res.text();
// //         throw new Error(error || `Failed to load cards: ${res.status}`);
// //       }

// //       const cards = await res.json();
// //       return Array.isArray(cards) 
// //         ? cards.map((card: any) => ({
// //             ...card,
// //             title: card.name,
// //           }))
// //         : [];
// //     } catch (error) {
// //       console.error("Error fetching cards:", error);
// //       if (error instanceof TypeError) {
// //         throw new Error(
// //           `Cannot reach API at ${API_BASE_URL}. Check that the backend is running.`
// //         );
// //       }
// //       throw error;
// //     }
// //   },

// //   async getCard(cardId: string): Promise<Card> {
// //     try {
// //       const res = await fetch(`${API_BASE_URL}/tasks/${cardId}`, {
// //         headers: headers(),
// //       });

// //       if (res.status === 401) {
// //         localStorage.removeItem("auth_token");
// //         localStorage.removeItem("user_uuid");
// //         throw new Error("Session expired. Please login again.");
// //       }

// //       if (res.status === 404) {
// //         throw new Error("Card not found");
// //       }

// //       if (!res.ok) {
// //         const error = await res.text();
// //         throw new Error(error || "Failed to load card");
// //       }

// //       const card = await res.json();
// //       return {
// //         ...card,
// //         title: card.name,
// //       };
// //     } catch (error) {
// //       console.error("Error fetching card:", error);
// //       throw error;
// //     }
// //   },

// //   async createCard(data: CreateCardData): Promise<Card> {
// //     try {
// //       const userId = await getUserId();
// //       console.log("Creating card with User ID:", userId);
      
// //       if (!userId) {
// //         throw new Error("Please login to create a card");
// //       }

// //       const requestBody = {
// //         project_id: data.project_id,
// //         name: data.name,
// //         description: data.description || "",
// //         due_date: data.due_date || null,
// //         status: data.status,
// //         priority: data.priority,
// //         assignee_id: data.assignee_id || null,
// //         position: data.position,
// //       };

// //       const res = await fetch(
// //         `${API_BASE_URL}/tasks/`,
// //         {
// //           method: "POST",
// //           headers: headers(),
// //           body: JSON.stringify(requestBody),
// //         }
// //       );

// //       if (res.status === 401) {
// //         localStorage.removeItem("auth_token");
// //         localStorage.removeItem("user_uuid");
// //         throw new Error("Session expired. Please login again.");
// //       }

// //       if (!res.ok) {
// //         let errorText = "Failed to create card";
// //         try {
// //           const errorData = await res.json();
// //           errorText = errorData.detail || errorData.message || JSON.stringify(errorData);
// //         } catch (e) {
// //           errorText = await res.text();
// //         }
// //         throw new Error(errorText);
// //       }

// //       const card = await res.json();
// //       console.log("✅ Card created successfully:", card);
      
// //       return {
// //         ...card,
// //         title: card.name,
// //       };
// //     } catch (error: any) {
// //       console.error("❌ Error creating card:", error);
      
// //       if (error.message.includes("Failed to fetch")) {
// //         throw new Error(
// //           `Cannot connect to server at ${API_BASE_URL}. Make sure backend is running.`
// //         );
// //       }
      
// //       throw error;
// //     }
// //   },

// //   async updateCard(cardId: string, data: UpdateCardData): Promise<Card> {
// //     try {
// //       const userId = await getUserId();
// //       if (!userId) {
// //         throw new Error("User not authenticated. Please login.");
// //       }

// //       const res = await fetch(
// //         `${API_BASE_URL}/tasks/${cardId}`,
// //         {
// //           method: "PATCH",
// //           headers: headers(),
// //           body: JSON.stringify(data),
// //         }
// //       );

// //       if (res.status === 401) {
// //         localStorage.removeItem("auth_token");
// //         localStorage.removeItem("user_uuid");
// //         throw new Error("Session expired. Please login again.");
// //       }

// //       if (res.status === 404) {
// //         throw new Error("Card not found");
// //       }

// //       if (!res.ok) {
// //         const error = await res.text();
// //         throw new Error(error || "Failed to update card");
// //       }

// //       const card = await res.json();
// //       return {
// //         ...card,
// //         title: card.name,
// //       };
// //     } catch (error) {
// //       console.error("Error updating card:", error);
// //       throw error;
// //     }
// //   },

// //   async deleteCard(cardId: string): Promise<void> {
// //     try {
// //       const userId = await getUserId();
// //       if (!userId) {
// //         throw new Error("User not authenticated");
// //       }

// //       const res = await fetch(
// //         `${API_BASE_URL}/tasks/${cardId}`,
// //         {
// //           method: "DELETE",
// //           headers: headers(),
// //         }
// //       );

// //       if (res.status === 401) {
// //         localStorage.removeItem("auth_token");
// //         localStorage.removeItem("user_uuid");
// //         throw new Error("Session expired. Please login again.");
// //       }

// //       if (res.status === 404) {
// //         throw new Error("Card not found");
// //       }

// //       if (!res.ok) {
// //         const error = await res.text();
// //         throw new Error(error || "Failed to delete card");
// //       }
// //     } catch (error) {
// //       console.error("Error deleting card:", error);
// //       throw error;
// //     }
// //   },
// // };







// // function resolveApiBaseUrl(): string {
// //   // Prefer explicit env; fallback to sensible defaults to avoid mixed-content issues.
// //   if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL;
// //   if (typeof window !== "undefined") {
// //     const { protocol, hostname } = window.location;
// //     // If opened from file:// (static build opened locally), fall back to localhost.
// //     if (protocol === "file:") return "http://localhost:8000";
// //     // If frontend is served over HTTPS, default to HTTPS backend on same host/port 443.
// //     if (protocol === "https:") return `https://${hostname || "localhost"}`;
// //     // Otherwise default to local dev backend (http).
// //     return `http://${hostname || "localhost"}:8000`;
// //   }
// //   return "http://localhost:8000";
// // }

// // const API_BASE_URL = resolveApiBaseUrl();

// // function getToken(): string | null {
// //   if (typeof window === "undefined") return null;
// //   return localStorage.getItem("auth_token");
// // }

// // function headers(): HeadersInit {
// //   const token = getToken();
// //   return {
// //     "Content-Type": "application/json",
// //     ...(token && { Authorization: `Bearer ${token}` }),
// //   };
// // }

// // // Helper function to fetch user UUID from server
// // async function fetchUserUuidFromServer(): Promise<string | null> {
// //   try {
// //     console.log("Fetching user UUID from server...");
    
// //     const token = localStorage.getItem("auth_token");
// //     if (!token) {
// //       console.error("No auth token found");
// //       return null;
// //     }
    
// //     // Try different endpoints
// //     const endpoints = [
// //       `${API_BASE_URL}/users/me`,
// //       `${API_BASE_URL}/auth/me`,
// //       `${API_BASE_URL}/profile`,
// //       `${API_BASE_URL}/user`,
// //     ];
    
// //     for (const endpoint of endpoints) {
// //       try {
// //         const response = await fetch(endpoint, {
// //           method: "GET",
// //           headers: {
// //             "Content-Type": "application/json",
// //             Authorization: `Bearer ${token}`,
// //           },
// //         });
        
// //         if (response.ok) {
// //           const userData = await response.json();
// //           console.log(`User data from ${endpoint}:`, userData);
          
// //           // Try different field names for UUID
// //           const uuid = userData?.id || userData?.uuid || userData?.user_id || userData?.sub;
          
// //           if (uuid && typeof uuid === 'string' && uuid.includes('-')) {
// //             console.log("Got UUID from API:", uuid);
// //             localStorage.setItem("user_uuid", uuid);
// //             return uuid;
// //           }
          
// //           // If we got user data but no UUID, check for email
// //           if (userData?.email) {
// //             console.log("Got user email, but no UUID. Email:", userData.email);
// //             // We'll handle this case in the main function
// //           }
// //         }
// //       } catch (endpointError) {
// //         console.log(`Endpoint ${endpoint} failed:`, endpointError);
// //         continue;
// //       }
// //     }
    
// //     console.error("All endpoints failed to return UUID");
// //     return null;
// //   } catch (error) {
// //     console.error("Error fetching user UUID:", error);
// //     return null;
// //   }
// // }

// // // UPDATED getUserId function with better error handling and server fallback
// // // Made async to match boards.ts implementation
// // async function getUserId(): Promise<string | null> {
// //   if (typeof window === "undefined") return null;
  
// //   console.log("=== DEBUG: getUserId() called (cards) ===");
  
// //   const token = localStorage.getItem("auth_token");
  
// //   // PRIORITY 1: If we have a token, always try to fetch from server first
// //   // This ensures we get the most up-to-date and valid user ID
// //   if (token) {
// //     console.log("Token found, attempting to fetch user ID from server...");
// //     const serverUuid = await fetchUserUuidFromServer();
// //     if (serverUuid) {
// //       console.log("✅ Got UUID from server:", serverUuid);
// //       return serverUuid;
// //     }
// //   }
  
// //   // PRIORITY 2: Check for cached UUID (but validate it's not the hardcoded dev UUID)
// //   const cachedUuid = localStorage.getItem("user_uuid");
// //   const hardcodedDevUuid = "fb1ef640-2cc3-48a8-af5c-502e57bd6c0c";
  
// //   if (cachedUuid && cachedUuid.includes('-') && cachedUuid !== hardcodedDevUuid) {
// //     console.log("Using cached UUID:", cachedUuid);
// //     // Still try to verify it's valid by checking if we have a token
// //     if (token) {
// //       // If we have a token but server fetch failed, the cached UUID might be invalid
// //       // But we'll use it as a fallback
// //       console.warn("Using cached UUID, but server fetch failed. This might be invalid.");
// //     }
// //     return cachedUuid;
// //   }
  
// //   // PRIORITY 3: Check user object in localStorage
// //   const userStr = localStorage.getItem("user");
// //   let userEmail: string | null = null;
  
// //   if (userStr) {
// //     try {
// //       const user = JSON.parse(userStr);
// //       console.log("User object from localStorage:", user);
      
// //       // Check for UUID in various field names
// //       const possibleUuidFields = ['id', 'uuid', 'user_id', 'sub'];
// //       for (const field of possibleUuidFields) {
// //         const uuid = user?.[field];
// //         if (uuid && typeof uuid === 'string' && uuid.includes('-') && uuid !== hardcodedDevUuid) {
// //           console.log(`Found UUID in ${field}:`, uuid);
// //           localStorage.setItem("user_uuid", uuid);
// //           return uuid;
// //         }
// //       }
      
// //       // Save email for later use
// //       userEmail = user?.email || user?.id || null;
// //       if (userEmail && userEmail.includes('@')) {
// //         console.log("Found email in user object:", userEmail);
// //       }
// //     } catch (error) {
// //       console.error("Failed to parse user object:", error);
// //     }
// //   }
  
// //   // PRIORITY 4: Decode JWT token (if server fetch didn't work)
// //   if (token) {
// //     try {
// //       const parts = token.split('.');
// //       if (parts.length === 3) {
// //         const payload = JSON.parse(atob(parts[1]));
// //         console.log("JWT payload:", payload);
        
// //         // Check for UUID in JWT
// //         const jwtUuid = payload?.sub || payload?.user_id || payload?.id;
// //         if (jwtUuid && typeof jwtUuid === 'string' && jwtUuid.includes('-') && jwtUuid !== hardcodedDevUuid) {
// //           console.log("Found UUID in JWT:", jwtUuid);
// //           localStorage.setItem("user_uuid", jwtUuid);
// //           return jwtUuid;
// //         }
        
// //         // If no UUID in JWT, get email from JWT
// //         if (!userEmail) {
// //           userEmail = payload?.email;
// //           if (userEmail && userEmail.includes('@')) {
// //             console.log("Found email in JWT:", userEmail);
// //           }
// //         }
// //       }
// //     } catch (error) {
// //       console.error("Failed to decode JWT:", error);
// //     }
// //   }
  
// //   // PRIORITY 5: If we have an email but no UUID, try server fetch again
// //   if (userEmail && userEmail.includes('@') && token) {
// //     console.log("No UUID found locally. Email present:", userEmail);
// //     console.log("Attempting to fetch UUID from server again...");
    
// //     const serverUuid = await fetchUserUuidFromServer();
// //     if (serverUuid) {
// //       return serverUuid;
// //     }
// //   }
  
// //   // LAST RESORT: Only use hardcoded UUID if explicitly set in env and no token exists
// //   // This prevents using invalid UUIDs when we have authentication
// //   if (!token) {
// //     console.warn("No auth token found. Cannot fetch user ID from server.");
// //     const isDevelopment = process.env.NODE_ENV === 'development' || window.location.hostname === 'localhost';
// //     if (isDevelopment && process.env.NEXT_PUBLIC_DEV_USER_ID) {
// //       const devUuid = process.env.NEXT_PUBLIC_DEV_USER_ID;
// //       if (devUuid && devUuid.includes('-')) {
// //         console.warn("DEVELOPMENT: Using env UUID:", devUuid);
// //         localStorage.setItem("user_uuid", devUuid);
// //         return devUuid;
// //       }
// //     }
// //   }
  
// //   console.error("No user UUID available. User might not be logged in or user ID not found in database.");
// //   return null;
// // }

// // export interface Card {
// //   id: string;
// //   project_id: string;
// //   name: string;
// //   description: string;
// //   due_date: string | null;
// //   status: 'todo' | 'in-progress' | 'review' | 'done';
// //   priority: 'low' | 'medium' | 'high' | 'urgent';
// //   assignee_id: string | null;
// //   position: number;
// //   created_by: string;
// //   created_at: string;
// //   updated_at: string;
// //   title?: string;
// //   list_id?: string;
// // }

// // export interface CreateCardData {
// //   project_id: string;
// //   name: string;
// //   description?: string;
// //   due_date?: string;
// //   status: 'todo' | 'in-progress' | 'review' | 'done';
// //   priority: 'low' | 'medium' | 'high' | 'urgent';
// //   assignee_id?: string;
// //   position: number;
// // }

// // export interface UpdateCardData {
// //   name?: string;
// //   description?: string;
// //   due_date?: string | null;
// //   status?: 'todo' | 'in-progress' | 'review' | 'done';
// //   priority?: 'low' | 'medium' | 'high' | 'urgent';
// //   assignee_id?: string | null;
// //   position?: number;
// // }

// // export const cardsAPI = {
// //   async getBoardCards(boardId: string): Promise<Card[]> {
// //     try {
// //       const res = await fetch(
// //         `${API_BASE_URL}/tasks/?project_id=${boardId}`,
// //         { headers: headers() }
// //       );

// //       if (res.status === 401) {
// //         localStorage.removeItem("auth_token");
// //         localStorage.removeItem("user_uuid");
// //         throw new Error("Session expired. Please login again.");
// //       }

// //       if (!res.ok) {
// //         const error = await res.text();
// //         throw new Error(error || "Failed to load cards");
// //       }

// //       const cards = await res.json();
// //       return cards.map((card: any) => ({
// //         ...card,
// //         title: card.name,
// //       }));
// //     } catch (error) {
// //       console.error("Error fetching cards:", error);
// //       // Give clearer feedback for network/CORS failures
// //       if (error instanceof TypeError) {
// //         throw new Error(
// //           `Cannot reach cards API at ${API_BASE_URL}. Check that the backend is running and CORS/HTTPS settings allow requests.`
// //         );
// //       }
// //       throw error;
// //     }
// //   },

// //   async getCard(cardId: string): Promise<Card> {
// //     try {
// //       const res = await fetch(`${API_BASE_URL}/tasks/${cardId}`, {
// //         headers: headers(),
// //       });

// //       if (res.status === 401) {
// //         localStorage.removeItem("auth_token");
// //         localStorage.removeItem("user_uuid");
// //         throw new Error("Session expired. Please login again.");
// //       }

// //       if (!res.ok) {
// //         const error = await res.text();
// //         throw new Error(error || "Failed to load card");
// //       }

// //       const card = await res.json();
// //       return {
// //         ...card,
// //         title: card.name,
// //       };
// //     } catch (error) {
// //       console.error("Error fetching card:", error);
// //       throw error;
// //     }
// //   },

// //   async createCard(data: CreateCardData): Promise<Card> {
// //     try {
// //       // Get user ID - now async to match boards.ts
// //       const userId = await getUserId();
// //       console.log("Creating card - User ID:", userId);
      
// //       if (!userId) {
// //         console.error("Authentication Error Details:");
// //         console.log("user in localStorage:", localStorage.getItem("user"));
// //         console.log("auth_token exists:", !!localStorage.getItem("auth_token"));
// //         console.log("user_uuid exists:", !!localStorage.getItem("user_uuid"));
        
// //         throw new Error("Please login to create a card. No user ID found.");
// //       }

// //       console.log("Creating card with User ID:", userId);
// //       console.log("Card data:", data);
// //       console.log("Full request URL:", `${API_BASE_URL}/tasks/?user_id=${userId}`);

// //       const res = await fetch(
// //         `${API_BASE_URL}/tasks/?user_id=${userId}`,
// //         {
// //           method: "POST",
// //           headers: headers(),
// //           body: JSON.stringify({
// //             project_id: data.project_id,
// //             name: data.name,
// //             description: data.description || "",
// //             due_date: data.due_date || null,
// //             status: data.status || 'todo',
// //             priority: data.priority || 'medium',
// //             assignee_id: data.assignee_id || null,
// //             position: data.position || 0,
// //           }),
// //         }
// //       );

// //       console.log("Response status:", res.status);

// //       if (res.status === 401) {
// //         localStorage.removeItem("auth_token");
// //         localStorage.removeItem("user_uuid");
// //         localStorage.removeItem("user");
// //         throw new Error("Session expired. Please login again.");
// //       }

// //       if (!res.ok) {
// //         let errorText = "Failed to create card";
// //         try {
// //           errorText = await res.text();
// //           console.error("API error response body:", errorText);
          
// //           // Handle specific error messages
// //           if (errorText.includes("User not found") || errorText.includes('"detail":"User not found"')) {
// //             // Clear cached UUID if it's invalid
// //             console.error("❌ Invalid user UUID detected. Clearing cache...");
// //             localStorage.removeItem("user_uuid");
// //             localStorage.removeItem("user");
// //             // Try to get fresh user ID from server
// //             const freshUserId = await fetchUserUuidFromServer();
// //             if (freshUserId) {
// //               console.log("✅ Got fresh user ID, retrying request...");
// //               // Retry the request with fresh user ID
// //               const retryRes = await fetch(
// //                 `${API_BASE_URL}/tasks/?user_id=${freshUserId}`,
// //                 {
// //                   method: "POST",
// //                   headers: headers(),
// //                   body: JSON.stringify({
// //                     project_id: data.project_id,
// //                     name: data.name,
// //                     description: data.description || "",
// //                     due_date: data.due_date || null,
// //                     status: data.status || 'todo',
// //                     priority: data.priority || 'medium',
// //                     assignee_id: data.assignee_id || null,
// //                     position: data.position || 0,
// //                   }),
// //                 }
// //               );
              
// //               if (retryRes.ok) {
// //                 const card = await retryRes.json();
// //                 console.log("✅ Card created successfully after retry:", card);
// //                 return {
// //                   ...card,
// //                   title: card.name,
// //                 };
// //               }
// //             }
// //             errorText = "User not found in database. Please logout and login again to refresh your session.";
// //           } else if (errorText.includes("project_id")) {
// //             errorText = "Invalid board. Please refresh the page.";
// //           }
// //         } catch (e) {
// //           console.error("Could not read error response:", e);
// //           errorText = `HTTP ${res.status}: ${res.statusText}`;
// //         }
// //         throw new Error(errorText);
// //       }

// //       const card = await res.json();
// //       console.log("✅ Card created successfully:", card);
      
// //       return {
// //         ...card,
// //         title: card.name,
// //       };
// //     } catch (error: any) {
// //       console.error("❌ Error creating card:", error);
      
// //       // Enhanced error messages
// //       if (error.message.includes("Failed to fetch")) {
// //         throw new Error(
// //           `Cannot connect to server at ${API_BASE_URL}. Make sure backend is running.`
// //         );
// //       }
      
// //       if (error.message.includes("NetworkError")) {
// //         throw new Error(
// //           "Network error. Check your internet connection and make sure CORS is configured on the backend."
// //         );
// //       }
      
// //       throw error;
// //     }
// //   },

// //   async updateCard(cardId: string, data: UpdateCardData): Promise<Card> {
// //     try {
// //       const userId = await getUserId();
// //       if (!userId) {
// //         throw new Error("User not authenticated. Please login.");
// //       }

// //       const res = await fetch(
// //         `${API_BASE_URL}/tasks/${cardId}?user_id=${userId}`,
// //         {
// //           method: "PATCH",
// //           headers: headers(),
// //           body: JSON.stringify(data),
// //         }
// //       );

// //       if (res.status === 401) {
// //         localStorage.removeItem("auth_token");
// //         localStorage.removeItem("user_uuid");
// //         throw new Error("Session expired. Please login again.");
// //       }

// //       if (!res.ok) {
// //         const error = await res.text();
// //         throw new Error(error || "Failed to update card");
// //       }

// //       const card = await res.json();
// //       return {
// //         ...card,
// //         title: card.name,
// //       };
// //     } catch (error) {
// //       console.error("Error updating card:", error);
// //       throw error;
// //     }
// //   },

// //   async deleteCard(cardId: string): Promise<void> {
// //     try {
// //       const userId = await getUserId();
// //       if (!userId) {
// //         throw new Error("User not authenticated");
// //       }

// //       const res = await fetch(
// //         `${API_BASE_URL}/tasks/${cardId}?user_id=${userId}`,
// //         {
// //           method: "DELETE",
// //           headers: headers(),
// //         }
// //       );

// //       if (res.status === 401) {
// //         localStorage.removeItem("auth_token");
// //         localStorage.removeItem("user_uuid");
// //         throw new Error("Session expired. Please login again.");
// //       }

// //       if (!res.ok) {
// //         const error = await res.text();
// //         throw new Error(error || "Failed to delete card");
// //       }
// //     } catch (error) {
// //       console.error("Error deleting card:", error);
// //       throw error;
// //     }
// //   },
// // };








// // // src/lib/api/cards.ts

// // /* =======================
// //    API Base URL Configuration
// // ======================= */

// // // Define API_BASE_URL with better fallback logic
// // const getApiBaseUrl = (): string => {
// //   // 1. Always use environment variable if set
// //   if (process.env.NEXT_PUBLIC_API_URL) {
// //     console.log("✅ Using API URL from env:", process.env.NEXT_PUBLIC_API_URL);
// //     return process.env.NEXT_PUBLIC_API_URL;
// //   }
  
// //   // 2. For server-side rendering
// //   if (typeof window === "undefined") {
// //     return "http://localhost:8000";
// //   }
  
// //   // 3. Client-side logic
// //   const { protocol, hostname, port } = window.location;
  
// //   // Check if we're in development
// //   const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1';
  
// //   if (isLocalhost) {
// //     console.log("💻 Development mode detected");
// //     return "http://localhost:8000";
// //   }
  
// //   // For production, use current origin
// //   return window.location.origin;
// // };

// // const API_BASE_URL = getApiBaseUrl();
// // console.log("🎯 Cards API - API_BASE_URL:", API_BASE_URL);

// // // Test backend connection on module load
// // if (typeof window !== "undefined") {
// //   console.log("🔍 Testing backend connection...");
// //   fetch(`${API_BASE_URL}/`, { 
// //     method: 'HEAD',
// //     mode: 'no-cors' // Use no-cors to avoid CORS issues for this test
// //   })
// //   .then(() => console.log("✅ Backend appears reachable"))
// //   .catch(() => console.warn("⚠️ Backend might not be running at", API_BASE_URL));
// // }

// // /* =======================
// //    Auth Token Functions
// // ======================= */

// // function getToken(): string | null {
// //   if (typeof window === "undefined") return null;
// //   return localStorage.getItem("auth_token");
// // }

// // function headers(): HeadersInit {
// //   const token = getToken();
// //   return {
// //     "Content-Type": "application/json",
// //     ...(token && { Authorization: `Bearer ${token}` }),
// //   };
// // }

// // /* =======================
// //    Enhanced Fetch with Better Error Handling
// // ======================= */

// // const safeFetch = async (url: string, options: RequestInit = {}): Promise<Response> => {
// //   console.log("🌐 Fetching:", url);
  
// //   try {
// //     const response = await fetch(url, {
// //       ...options,
// //       mode: 'cors',
// //       credentials: 'include',
// //     });
    
// //     return response;
// //   } catch (error: any) {
// //     console.error("❌ Network error:", error);
    
// //     // More specific error messages
// //     if (error.message.includes('Failed to fetch')) {
// //       throw new Error(
// //         `Cannot connect to server. Possible issues:\n` +
// //         `1. Backend server is not running at ${API_BASE_URL}\n` +
// //         `2. CORS is not configured on the backend\n` +
// //         `3. Network firewall blocking the connection\n\n` +
// //         `Try: curl ${API_BASE_URL}/ to test backend connectivity`
// //       );
// //     }
    
// //     throw error;
// //   }
// // };

// // /* =======================
// //    User ID Helper Functions
// // ======================= */

// // // Helper function to fetch user UUID from server
// // async function fetchUserUuidFromServer(): Promise<string | null> {
// //   try {
// //     console.log("Fetching user UUID from server...");
    
// //     const token = localStorage.getItem("auth_token");
// //     if (!token) {
// //       console.error("No auth token found");
// //       return null;
// //     }
    
// //     // Try the main endpoint first
// //     const endpoint = `${API_BASE_URL}/users/me`;
    
// //     try {
// //       const response = await safeFetch(endpoint, {
// //         method: "GET",
// //         headers: {
// //           "Content-Type": "application/json",
// //           Authorization: `Bearer ${token}`,
// //         },
// //       });
      
// //       if (response.ok) {
// //         const userData = await response.json();
// //         console.log(`User data from API:`, userData);
        
// //         // Try different field names for UUID
// //         const uuid = userData?.id || userData?.uuid || userData?.user_id || userData?.sub;
        
// //         if (uuid && typeof uuid === 'string') {
// //           console.log("✅ Got UUID from API:", uuid);
// //           localStorage.setItem("user_uuid", uuid);
// //           return uuid;
// //         }
// //       }
// //     } catch (error) {
// //       console.error("Failed to fetch user UUID:", error);
// //     }
    
// //     return null;
// //   } catch (error) {
// //     console.error("Error in fetchUserUuidFromServer:", error);
// //     return null;
// //   }
// // }

// // // Simplified getUserId function
// // async function getUserId(): Promise<string | null> {
// //   if (typeof window === "undefined") return null;
  
// //   console.log("=== DEBUG: getUserId() called ===");
  
// //   const token = localStorage.getItem("auth_token");
  
// //   // 1. Check localStorage cache first
// //   const cachedUuid = localStorage.getItem("user_uuid");
// //   if (cachedUuid && cachedUuid.includes('-')) {
// //     console.log("Using cached UUID:", cachedUuid);
// //     return cachedUuid;
// //   }
  
// //   // 2. Try to fetch from server if we have a token
// //   if (token) {
// //     const serverUuid = await fetchUserUuidFromServer();
// //     if (serverUuid) {
// //       return serverUuid;
// //     }
// //   }
  
// //   // 3. Try to decode JWT token
// //   if (token) {
// //     try {
// //       const parts = token.split('.');
// //       if (parts.length === 3) {
// //         const payload = JSON.parse(atob(parts[1]));
// //         console.log("JWT payload:", payload);
        
// //         const jwtUuid = payload?.sub || payload?.user_id || payload?.id;
// //         if (jwtUuid && typeof jwtUuid === 'string') {
// //           console.log("Found UUID in JWT:", jwtUuid);
// //           localStorage.setItem("user_uuid", jwtUuid);
// //           return jwtUuid;
// //         }
// //       }
// //     } catch (error) {
// //       console.error("Failed to decode JWT:", error);
// //     }
// //   }
  
// //   // 4. Development fallback
// //   if (process.env.NODE_ENV === 'development' || window.location.hostname === 'localhost') {
// //     const devUuid = process.env.NEXT_PUBLIC_DEV_USER_ID || "dev-user-id";
// //     console.warn("⚠️ DEVELOPMENT: Using fallback user ID:", devUuid);
// //     localStorage.setItem("user_uuid", devUuid);
// //     return devUuid;
// //   }
  
// //   console.error("No user ID found");
// //   return null;
// // }

// // /* =======================
// //    Card Types
// // ======================= */

// // export interface Card {
// //   id: string;
// //   project_id: string;
// //   name: string;
// //   description: string;
// //   due_date: string | null;
// //   status: 'todo' | 'in-progress' | 'review' | 'done';
// //   priority: 'low' | 'medium' | 'high' | 'urgent';
// //   assignee_id: string | null;
// //   position: number;
// //   created_by: string;
// //   created_at: string;
// //   updated_at: string;
// //   title?: string;
// //   list_id?: string;
// // }

// // export interface CreateCardData {
// //   project_id: string;
// //   name: string;
// //   description?: string;
// //   due_date?: string;
// //   status: 'todo' | 'in-progress' | 'review' | 'done';
// //   priority: 'low' | 'medium' | 'high' | 'urgent';
// //   assignee_id?: string;
// //   position: number;
// // }

// // export interface UpdateCardData {
// //   name?: string;
// //   description?: string;
// //   due_date?: string | null;
// //   status?: 'todo' | 'in-progress' | 'review' | 'done';
// //   priority?: 'low' | 'medium' | 'high' | 'urgent';
// //   assignee_id?: string | null;
// //   position?: number;
// // }

// // /* =======================
// //    Cards API Methods with Better Error Handling
// // ======================= */

// // export const cardsAPI = {
// //   async getBoardCards(boardId: string): Promise<Card[]> {
// //     try {
// //       console.log("📋 Fetching cards for board:", boardId);
// //       console.log("🌐 URL:", `${API_BASE_URL}/tasks/?project_id=${boardId}`);
      
// //       const res = await safeFetch(
// //         `${API_BASE_URL}/tasks/?project_id=${boardId}`,
// //         { headers: headers() }
// //       );

// //       if (res.status === 401) {
// //         localStorage.removeItem("auth_token");
// //         localStorage.removeItem("user_uuid");
// //         throw new Error("Session expired. Please login again.");
// //       }

// //       if (!res.ok) {
// //         const errorText = await res.text();
// //         console.error("API Error:", res.status, errorText);
// //         throw new Error(errorText || `Failed to load cards: ${res.status}`);
// //       }

// //       const cards = await res.json();
// //       console.log(`✅ Loaded ${cards?.length || 0} cards`);
      
// //       return Array.isArray(cards) 
// //         ? cards.map((card: any) => ({
// //             ...card,
// //             title: card.name,
// //           }))
// //         : [];
// //     } catch (error: any) {
// //       console.error("❌ Error fetching cards:", error.message);
// //       throw error;
// //     }
// //   },

// //   async getCard(cardId: string): Promise<Card> {
// //     try {
// //       const res = await safeFetch(`${API_BASE_URL}/tasks/${cardId}`, {
// //         headers: headers(),
// //       });

// //       if (res.status === 401) {
// //         localStorage.removeItem("auth_token");
// //         localStorage.removeItem("user_uuid");
// //         throw new Error("Session expired. Please login again.");
// //       }

// //       if (!res.ok) {
// //         const error = await res.text();
// //         throw new Error(error || "Failed to load card");
// //       }

// //       const card = await res.json();
// //       return {
// //         ...card,
// //         title: card.name,
// //       };
// //     } catch (error) {
// //       console.error("Error fetching card:", error);
// //       throw error;
// //     }
// //   },

// //   async createCard(data: CreateCardData): Promise<Card> {
// //     console.group("📝 Creating Card");
    
// //     try {
// //       // Get user ID
// //       const userId = await getUserId();
// //       console.log("👤 User ID:", userId);
      
// //       if (!userId) {
// //         throw new Error("Please login to create a card.");
// //       }

// //       // Build request
// //       const requestBody = {
// //         project_id: data.project_id,
// //         name: data.name,
// //         description: data.description || "",
// //         due_date: data.due_date || null,
// //         status: data.status || 'todo',
// //         priority: data.priority || 'medium',
// //         assignee_id: data.assignee_id || null,
// //         position: data.position || 0,
// //       };

// //       const url = `${API_BASE_URL}/tasks/?user_id=${userId}`;
// //       console.log("🌐 Request URL:", url);
// //       console.log("📦 Request Body:", requestBody);

// //       const res = await safeFetch(url, {
// //         method: "POST",
// //         headers: headers(),
// //         body: JSON.stringify(requestBody),
// //       });

// //       console.log("📥 Response Status:", res.status);

// //       if (res.status === 401) {
// //         localStorage.removeItem("auth_token");
// //         localStorage.removeItem("user_uuid");
// //         throw new Error("Session expired. Please login again.");
// //       }

// //       if (!res.ok) {
// //         let errorText = `HTTP ${res.status}: ${res.statusText}`;
        
// //         try {
// //           const errorData = await res.json();
// //           console.error("Backend error response:", errorData);
          
// //           if (errorData.detail) {
// //             if (Array.isArray(errorData.detail)) {
// //               errorText = errorData.detail.map((err: any) => 
// //                 `${err.loc?.join('.')}: ${err.msg}`
// //               ).join(', ');
// //             } else {
// //               errorText = errorData.detail;
// //             }
// //           } else if (errorData.message) {
// //             errorText = errorData.message;
// //           }
// //         } catch {
// //           // If JSON parsing fails, try text
// //           try {
// //             const text = await res.text();
// //             if (text) errorText = text;
// //           } catch {
// //             // Keep default error message
// //           }
// //         }
        
// //         throw new Error(`Failed to create card: ${errorText}`);
// //       }

// //       const card = await res.json();
// //       console.log("✅ Card created successfully:", card);
// //       console.groupEnd();
      
// //       return {
// //         ...card,
// //         title: card.name,
// //       };
// //     } catch (error: any) {
// //       console.error("❌ Error creating card:", error.message);
// //       console.groupEnd();
// //       throw error;
// //     }
// //   },

// //   async updateCard(cardId: string, data: UpdateCardData): Promise<Card> {
// //     try {
// //       const userId = await getUserId();
// //       if (!userId) {
// //         throw new Error("User not authenticated. Please login.");
// //       }

// //       const res = await safeFetch(
// //         `${API_BASE_URL}/tasks/${cardId}?user_id=${userId}`,
// //         {
// //           method: "PATCH",
// //           headers: headers(),
// //           body: JSON.stringify(data),
// //         }
// //       );

// //       if (res.status === 401) {
// //         localStorage.removeItem("auth_token");
// //         localStorage.removeItem("user_uuid");
// //         throw new Error("Session expired. Please login again.");
// //       }

// //       if (!res.ok) {
// //         const error = await res.text();
// //         throw new Error(error || "Failed to update card");
// //       }

// //       const card = await res.json();
// //       return {
// //         ...card,
// //         title: card.name,
// //       };
// //     } catch (error) {
// //       console.error("Error updating card:", error);
// //       throw error;
// //     }
// //   },

// //   async deleteCard(cardId: string): Promise<void> {
// //     try {
// //       const userId = await getUserId();
// //       if (!userId) {
// //         throw new Error("User not authenticated");
// //       }

// //       const res = await safeFetch(
// //         `${API_BASE_URL}/tasks/${cardId}?user_id=${userId}`,
// //         {
// //           method: "DELETE",
// //           headers: headers(),
// //         }
// //       );

// //       if (res.status === 401) {
// //         localStorage.removeItem("auth_token");
// //         localStorage.removeItem("user_uuid");
// //         throw new Error("Session expired. Please login again.");
// //       }

// //       if (!res.ok) {
// //         const error = await res.text();
// //         throw new Error(error || "Failed to delete card");
// //       }
// //     } catch (error) {
// //       console.error("Error deleting card:", error);
// //       throw error;
// //     }
// //   },
  
// //   // Clear cached user UUID
// //   clearCachedUserUuid(): void {
// //     localStorage.removeItem("user_uuid");
// //   },
  
// //   // Manually set user UUID
// //   setCachedUserUuid(uuid: string): void {
// //     if (uuid && uuid.includes('-')) {
// //       localStorage.setItem("user_uuid", uuid);
// //     }
// //   },
  
// //   // Test backend connection
// //   async testBackendConnection(): Promise<boolean> {
// //     try {
// //       console.log("🔍 Testing backend connection to:", API_BASE_URL);
      
// //       // Try a simple HEAD request
// //       const response = await fetch(API_BASE_URL, {
// //         method: 'HEAD',
// //         mode: 'no-cors' // Use no-cors to avoid CORS issues
// //       });
      
// //       console.log("✅ Backend appears reachable");
// //       return true;
// //     } catch (error) {
// //       console.error("❌ Cannot connect to backend:", error);
// //       return false;
// //     }
// //   }
// // };





// // src/lib/api/cards.ts

// /* =======================
//    API Base URL Configuration
// ======================= */

// const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// console.log("🎯 Cards API - API_BASE_URL:", API_BASE_URL);

// /* =======================
//    Check Backend Connectivity
// ======================= */

// let isBackendAvailable = false;

// // Check backend connectivity on module load
// if (typeof window !== 'undefined') {
//   console.log("🔍 Checking backend connectivity...");
  
//   // Simple test to see if backend is reachable
//   fetch(`${API_BASE_URL}/`, { 
//     method: 'GET',
//     mode: 'no-cors' // Use no-cors to avoid CORS issues
//   })
//     .then(() => {
//       console.log("✅ Backend is reachable");
//       isBackendAvailable = true;
//     })
//     .catch(() => {
//       console.warn("⚠️ Backend is not reachable. Using mock data for development.");
//       isBackendAvailable = false;
//     });
// }

// /* =======================
//    Development Mock Data
// ======================= */

// const getMockCards = (boardId: string): Card[] => {
//   console.log("🎭 Generating mock cards for board:", boardId);
  
//   return [
//     {
//       id: `mock-card-${Date.now()}-1`,
//       project_id: boardId,
//       name: "Design Homepage",
//       description: "Create responsive homepage design",
//       due_date: new Date(Date.now() + 86400000 * 3).toISOString(),
//       status: "todo",
//       priority: "high",
//       assignee_id: null,
//       position: 0,
//       created_by: "system",
//       created_at: new Date().toISOString(),
//       updated_at: new Date().toISOString(),
//       title: "Design Homepage"
//     },
//     {
//       id: `mock-card-${Date.now()}-2`,
//       project_id: boardId,
//       name: "API Integration",
//       description: "Integrate with backend API",
//       due_date: new Date(Date.now() + 86400000 * 5).toISOString(),
//       status: "in-progress",
//       priority: "medium",
//       assignee_id: null,
//       position: 1,
//       created_by: "system",
//       created_at: new Date().toISOString(),
//       updated_at: new Date().toISOString(),
//       title: "API Integration"
//     },
//     {
//       id: `mock-card-${Date.now()}-3`,
//       project_id: boardId,
//       name: "Fix Login Bug",
//       description: "Resolve authentication issue",
//       due_date: new Date(Date.now() + 86400000).toISOString(),
//       status: "review",
//       priority: "urgent",
//       assignee_id: null,
//       position: 2,
//       created_by: "system",
//       created_at: new Date().toISOString(),
//       updated_at: new Date().toISOString(),
//       title: "Fix Login Bug"
//     },
//     {
//       id: `mock-card-${Date.now()}-4`,
//       project_id: boardId,
//       name: "Write Documentation",
//       description: "Document API endpoints",
//       due_date: new Date(Date.now() + 86400000 * 7).toISOString(),
//       status: "done",
//       priority: "low",
//       assignee_id: null,
//       position: 3,
//       created_by: "system",
//       created_at: new Date().toISOString(),
//       updated_at: new Date().toISOString(),
//       title: "Write Documentation"
//     }
//   ];
// };

// /* =======================
//    Simple Fetch Wrapper
// ======================= */

// const safeFetch = async (url: string, options: RequestInit = {}): Promise<Response> => {
//   try {
//     const response = await fetch(url, {
//       ...options,
//       headers: {
//         'Content-Type': 'application/json',
//         ...(options.headers || {}),
//       },
//     });
//     return response;
//   } catch (error) {
//     console.error("❌ Network error for:", url, error);
//     throw error;
//   }
// };

// /* =======================
//    Auth Token Functions
// ======================= */

// function getToken(): string | null {
//   if (typeof window === "undefined") return null;
//   return localStorage.getItem("auth_token");
// }

// function headers(): HeadersInit {
//   const token = getToken();
//   const baseHeaders: HeadersInit = {
//     "Content-Type": "application/json",
//   };
  
//   if (token) {
//     return {
//       ...baseHeaders,
//       "Authorization": `Bearer ${token}`,
//     };
//   }
  
//   return baseHeaders;
// }

// /* =======================
//    User ID Helper Functions
// ======================= */

// async function getUserId(): Promise<string | null> {
//   if (typeof window === "undefined") return null;
  
//   // 1. Check localStorage cache
//   const cachedUuid = localStorage.getItem("user_uuid");
//   if (cachedUuid && cachedUuid.includes('-')) {
//     return cachedUuid;
//   }
  
//   // 2. Try to decode JWT token
//   const token = localStorage.getItem("auth_token");
//   if (token) {
//     try {
//       const parts = token.split('.');
//       if (parts.length === 3) {
//         const payload = JSON.parse(atob(parts[1]));
//         const jwtUuid = payload?.sub || payload?.user_id || payload?.id;
//         if (jwtUuid && typeof jwtUuid === 'string') {
//           localStorage.setItem("user_uuid", jwtUuid);
//           return jwtUuid;
//         }
//       }
//     } catch (error) {
//       console.error("Failed to decode JWT:", error);
//     }
//   }
  
//   // 3. Development fallback
//   if (process.env.NODE_ENV === 'development' || window.location.hostname === 'localhost') {
//     const devUuid = "dev-user-" + Date.now();
//     console.log("⚠️ DEVELOPMENT: Using fallback user ID:", devUuid);
//     localStorage.setItem("user_uuid", devUuid);
//     return devUuid;
//   }
  
//   return null;
// }

// /* =======================
//    Card Types
// ======================= */

// export interface Card {
//   id: string;
//   project_id: string;
//   name: string;
//   description: string;
//   due_date: string | null;
//   status: 'todo' | 'in-progress' | 'review' | 'done';
//   priority: 'low' | 'medium' | 'high' | 'urgent';
//   assignee_id: string | null;
//   position: number;
//   created_by: string;
//   created_at: string;
//   updated_at: string;
//   title?: string;
//   list_id?: string;
// }

// export interface CreateCardData {
//   project_id: string;
//   name: string;
//   description?: string;
//   due_date?: string;
//   status: 'todo' | 'in-progress' | 'review' | 'done';
//   priority: 'low' | 'medium' | 'high' | 'urgent';
//   assignee_id?: string;
//   position: number;
// }

// export interface UpdateCardData {
//   name?: string;
//   description?: string;
//   due_date?: string | null;
//   status?: 'todo' | 'in-progress' | 'review' | 'done';
//   priority?: 'low' | 'medium' | 'high' | 'urgent';
//   assignee_id?: string | null;
//   position?: number;
// }

// /* =======================
//    Cards API Methods with Mock Fallback
// ======================= */

// export const cardsAPI = {
//   async getBoardCards(boardId: string): Promise<Card[]> {
//     console.log("📋 Fetching cards for board:", boardId);
    
//     if (!boardId) {
//       throw new Error("Board ID is required");
//     }
    
//     // Check if we're in development mode
//     const isDevelopment = process.env.NODE_ENV === 'development' || 
//                          window.location.hostname === 'localhost';
    
//     // If backend is not available and we're in development, use mock data
//     if (!isBackendAvailable && isDevelopment) {
//       console.warn("⚠️ Backend not available. Using mock cards for development.");
//       return getMockCards(boardId);
//     }
    
//     try {
//       console.log("🌐 Attempting to fetch from:", `${API_BASE_URL}/tasks/?project_id=${boardId}`);
      
//       const res = await safeFetch(
//         `${API_BASE_URL}/tasks/?project_id=${boardId}`,
//         { headers: headers() }
//       );

//       if (res.status === 401) {
//         localStorage.removeItem("auth_token");
//         localStorage.removeItem("user_uuid");
//         throw new Error("Session expired. Please login again.");
//       }

//       if (!res.ok) {
//         const errorText = await res.text();
//         console.error("API Error:", res.status, errorText);
        
//         // If we get a server error in development, fall back to mock data
//         if (isDevelopment && res.status >= 500) {
//           console.warn("Server error, using mock data for development");
//           return getMockCards(boardId);
//         }
        
//         throw new Error(errorText || `Failed to load cards: ${res.status}`);
//       }

//       const cards = await res.json();
//       console.log(`✅ Loaded ${cards?.length || 0} real cards from backend`);
      
//       return Array.isArray(cards) 
//         ? cards.map((card: any) => ({
//             ...card,
//             title: card.name,
//           }))
//         : [];
        
//     } catch (error: any) {
//       console.error("❌ Error fetching cards:", error.message);
      
//       // In development, fall back to mock data for network errors
//       if (isDevelopment && (error instanceof TypeError || error.message?.includes('Failed to fetch'))) {
//         console.warn("⚠️ Network error. Using mock cards for development.");
//         return getMockCards(boardId);
//       }
      
//       // For production or other errors, throw
//       if (error instanceof TypeError) {
//         throw new Error(
//           `Cannot connect to the server. Please check:\n` +
//           `• Backend is running at ${API_BASE_URL}\n` +
//           `• Your internet connection\n` +
//           `• CORS configuration on backend`
//         );
//       }
      
//       throw error;
//     }
//   },

//   async getCard(cardId: string): Promise<Card> {
//     try {
//       const res = await safeFetch(`${API_BASE_URL}/tasks/${cardId}`, {
//         headers: headers(),
//       });

//       if (res.status === 401) {
//         localStorage.removeItem("auth_token");
//         localStorage.removeItem("user_uuid");
//         throw new Error("Session expired. Please login again.");
//       }

//       if (!res.ok) {
//         const error = await res.text();
//         throw new Error(error || "Failed to load card");
//       }

//       const card = await res.json();
//       return {
//         ...card,
//         title: card.name,
//       };
//     } catch (error) {
//       console.error("Error fetching card:", error);
//       throw error;
//     }
//   },

//   async createCard(data: CreateCardData): Promise<Card> {
//     console.log("📝 Creating card:", data);
    
//     // Check if we're in development mode
//     const isDevelopment = process.env.NODE_ENV === 'development' || 
//                          window.location.hostname === 'localhost';
    
//     // If backend is not available and we're in development, create mock card
//     if (!isBackendAvailable && isDevelopment) {
//       console.warn("⚠️ Backend not available. Creating mock card for development.");
      
//       const mockCard: Card = {
//         id: `mock-card-${Date.now()}`,
//         project_id: data.project_id,
//         name: data.name,
//         description: data.description || "",
//         due_date: data.due_date || null,
//         status: data.status || 'todo',
//         priority: data.priority || 'medium',
//         assignee_id: data.assignee_id || null,
//         position: data.position || 0,
//         created_by: "mock-user",
//         created_at: new Date().toISOString(),
//         updated_at: new Date().toISOString(),
//         title: data.name,
//       };
      
//       console.log("✅ Mock card created:", mockCard);
//       return mockCard;
//     }
    
//     try {
//       const userId = await getUserId();
//       console.log("👤 User ID:", userId);
      
//       if (!userId) {
//         throw new Error("Please login to create a card.");
//       }

//       const requestBody = {
//         project_id: data.project_id,
//         title: data.name,
//         description: data.description || "",
//         due_date: data.due_date || null,
//         status: data.status || 'todo',
//         priority: data.priority || 'medium',
//         assignee_id: data.assignee_id || null,
//         position: data.position || 0,
//       };

//       const url = `${API_BASE_URL}/tasks/?user_id=${userId}`;
//       console.log("🌐 Request URL:", url);

//       const res = await safeFetch(url, {
//         method: "POST",
//         headers: headers(),
//         body: JSON.stringify(requestBody),
//       });

//       console.log("📥 Response Status:", res.status);

//       if (res.status === 401) {
//         localStorage.removeItem("auth_token");
//         localStorage.removeItem("user_uuid");
//         throw new Error("Session expired. Please login again.");
//       }

//       if (!res.ok) {
//         let errorText = `HTTP ${res.status}: ${res.statusText}`;
        
//         try {
//           const errorData = await res.json();
//           errorText = errorData.detail || errorData.message || errorText;
//         } catch {
//           // Keep default error message
//         }
        
//         throw new Error(`Failed to create card: ${errorText}`);
//       }

//       const card = await res.json();
//       console.log("✅ Card created successfully:", card);
      
//       return {
//         ...card,
//         title: card.name,
//       };
//     } catch (error: any) {
//       console.error("❌ Error creating card:", error.message);
      
//       // In development, fall back to mock data for network errors
//       if (isDevelopment && (error instanceof TypeError || error.message?.includes('Failed to fetch'))) {
//         console.warn("⚠️ Network error. Creating mock card for development.");
        
//         const mockCard: Card = {
//           id: `mock-card-${Date.now()}`,
//           project_id: data.project_id,
//           name: data.name,
//           description: data.description || "",
//           due_date: data.due_date || null,
//           status: data.status || 'todo',
//           priority: data.priority || 'medium',
//           assignee_id: data.assignee_id || null,
//           position: data.position || 0,
//           created_by: "mock-user",
//           created_at: new Date().toISOString(),
//           updated_at: new Date().toISOString(),
//           title: data.name,
//         };
        
//         return mockCard;
//       }
      
//       throw error;
//     }
//   },

//   async updateCard(cardId: string, data: UpdateCardData): Promise<Card> {
//     try {
//       const userId = await getUserId();
//       if (!userId) {
//         throw new Error("User not authenticated. Please login.");
//       }

//       const updateData: any = { ...data };
      
//       if (updateData.name !== undefined) {
//         updateData.title = updateData.name;
//         delete updateData.name;
//       }

//       const res = await safeFetch(
//         `${API_BASE_URL}/tasks/${cardId}?user_id=${userId}`,
//         {
//           method: "PATCH",
//           headers: headers(),
//           body: JSON.stringify(updateData),
//         }
//       );

//       if (res.status === 401) {
//         localStorage.removeItem("auth_token");
//         localStorage.removeItem("user_uuid");
//         throw new Error("Session expired. Please login again.");
//       }

//       if (!res.ok) {
//         const error = await res.text();
//         throw new Error(error || "Failed to update card");
//       }

//       const card = await res.json();
//       return {
//         ...card,
//         title: card.name,
//       };
//     } catch (error) {
//       console.error("Error updating card:", error);
//       throw error;
//     }
//   },

//   async deleteCard(cardId: string): Promise<void> {
//     try {
//       const userId = await getUserId();
//       if (!userId) {
//         throw new Error("User not authenticated");
//       }

//       const res = await safeFetch(
//         `${API_BASE_URL}/tasks/${cardId}?user_id=${userId}`,
//         {
//           method: "DELETE",
//           headers: headers(),
//         }
//       );

//       if (res.status === 401) {
//         localStorage.removeItem("auth_token");
//         localStorage.removeItem("user_uuid");
//         throw new Error("Session expired. Please login again.");
//       }

//       if (!res.ok) {
//         const error = await res.text();
//         throw new Error(error || "Failed to delete card");
//       }
//     } catch (error) {
//       console.error("Error deleting card:", error);
//       throw error;
//     }
//   },
  
//   // Test backend connection
//   async testBackend(): Promise<void> {
//     console.log("🔍 Testing backend connection...");
    
//     try {
//       const response = await fetch(`${API_BASE_URL}/`, {
//         method: 'GET',
//         mode: 'no-cors'
//       });
//       console.log("✅ Backend is reachable");
//       isBackendAvailable = true;
//     } catch (error) {
//       console.error("❌ Cannot connect to backend:", API_BASE_URL);
//       console.log("💡 Make sure backend is running: uvicorn main:app --reload --port 8000");
//       isBackendAvailable = false;
//     }
//   },
  
//   // Check backend status
//   isBackendReachable(): boolean {
//     return isBackendAvailable;
//   },
  
//   // Clear cached data
//   clearCache(): void {
//     localStorage.removeItem("user_uuid");
//   }
// };




// src/lib/api/cards.ts

/* =======================
   API Base URL Configuration
======================= */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
console.log("🎯 Cards API - API_BASE_URL:", API_BASE_URL);

/* =======================
   Auth Token Functions
======================= */
function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("auth_token");
}

function headers(): HeadersInit {
  const token = getToken();
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

/* =======================
   User ID Helper Functions
======================= */
async function fetchUserUuidFromServer(): Promise<string | null> {
  try {
    const token = getToken();
    if (!token) return null;

    const res = await fetch(`${API_BASE_URL}/users/me`, {
      method: "GET",
      headers: headers(),
    });

    if (!res.ok) return null;
    const data = await res.json();
    const uuid = data?.id || data?.uuid || data?.user_id || data?.sub;
    if (uuid) localStorage.setItem("user_uuid", uuid);
    return uuid || null;
  } catch {
    return null;
  }
}

async function getUserId(): Promise<string | null> {
  if (typeof window === "undefined") return null;

  const cached = localStorage.getItem("user_uuid");
  if (cached) return cached;

  const token = getToken();
  if (token) {
    const uuidFromServer = await fetchUserUuidFromServer();
    if (uuidFromServer) return uuidFromServer;

    // Try decoding JWT
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const jwtUuid = payload?.sub || payload?.user_id || payload?.id;
      if (jwtUuid) {
        localStorage.setItem("user_uuid", jwtUuid);
        return jwtUuid;
      }
    } catch {}
  }

  // Development fallback
  if (process.env.NODE_ENV === "development" || window.location.hostname === "localhost") {
    const devUuid = process.env.NEXT_PUBLIC_DEV_USER_ID || "test-user-id";
    localStorage.setItem("user_uuid", devUuid);
    return devUuid;
  }

  return null;
}

/* =======================
   Development Mock Data
======================= */
const getMockCards = (boardId: string) => [
  {
    id: `mock-card-${Date.now()}-1`,
    project_id: boardId,
    name: "Design Homepage",
    description: "Create responsive homepage design",
    due_date: new Date(Date.now() + 3 * 86400000).toISOString(),
    status: "todo",
    priority: "high",
    assignee_id: null,
    position: 0,
    created_by: "system",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    title: "Design Homepage",
  },
  {
    id: `mock-card-${Date.now()}-2`,
    project_id: boardId,
    name: "API Integration",
    description: "Integrate with backend API",
    due_date: new Date(Date.now() + 5 * 86400000).toISOString(),
    status: "in-progress",
    priority: "medium",
    assignee_id: null,
    position: 1,
    created_by: "system",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    title: "API Integration",
  },
];

/* =======================
   Card Types
======================= */
export interface Card {
  id: string;
  project_id: string;
  name: string;
  description: string;
  due_date: string | null;
  status: 'todo' | 'in-progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignee_id: string | null;
  position: number;
  created_by: string;
  created_at: string;
  updated_at: string;
  title?: string;
  list_id?: string;
}

export interface CreateCardData {
  project_id: string;
  name: string;
  description?: string;
  due_date?: string;
  status: 'todo' | 'in-progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignee_id?: string;
  position: number;
}

export interface UpdateCardData {
  name?: string;
  description?: string;
  due_date?: string | null;
  status?: 'todo' | 'in-progress' | 'review' | 'done';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  assignee_id?: string | null;
  position?: number;
}

/* =======================
   Cards API
======================= */
export const cardsAPI = {
  async getBoardCards(boardId: string): Promise<Card[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/tasks/?project_id=${boardId}`, { headers: headers() });
      if (!res.ok) {
        if (process.env.NODE_ENV === "development" || window.location.hostname === "localhost") {
          return getMockCards(boardId);
        }
        throw new Error(`Failed to load cards, status: ${res.status}`);
      }
      const cards = await res.json();
      return Array.isArray(cards) ? cards.map(c => ({ ...c, title: c.name })) : [];
    } catch (err) {
      console.warn("Using mock cards due to fetch error:", err);
      return getMockCards(boardId);
    }
  },

  async getCard(cardId: string): Promise<Card> {
    const res = await fetch(`${API_BASE_URL}/tasks/${cardId}`, { headers: headers() });
    if (!res.ok) throw new Error(`Failed to get card: ${res.status}`);
    const card = await res.json();
    return { ...card, title: card.name };
  },

  async createCard(data: CreateCardData): Promise<Card> {
    const userId = await getUserId();
    if (!userId) throw new Error("User not logged in");
    const res = await fetch(`${API_BASE_URL}/tasks/?user_id=${userId}`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      if (process.env.NODE_ENV === "development") {
        return getMockCards(data.project_id)[0];
      }
      throw new Error(`Failed to create card: ${res.status}`);
    }
    const card = await res.json();
    return { ...card, title: card.name };
  },

  async updateCard(cardId: string, data: UpdateCardData): Promise<Card> {
    const userId = await getUserId();
    if (!userId) throw new Error("User not logged in");
    const res = await fetch(`${API_BASE_URL}/tasks/${cardId}?user_id=${userId}`, {
      method: "PATCH",
      headers: headers(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`Failed to update card: ${res.status}`);
    const card = await res.json();
    return { ...card, title: card.name };
  },

  async deleteCard(cardId: string): Promise<void> {
    const userId = await getUserId();
    if (!userId) throw new Error("User not logged in");
    const res = await fetch(`${API_BASE_URL}/tasks/${cardId}?user_id=${userId}`, {
      method: "DELETE",
      headers: headers(),
    });
    if (!res.ok) throw new Error(`Failed to delete card: ${res.status}`);
  },

  async testConnection(): Promise<{ success: boolean; message: string }> {
    try {
      await fetch(`${API_BASE_URL}/`, { method: 'GET', mode: 'no-cors' });
      return { success: true, message: `Backend reachable at ${API_BASE_URL}` };
    } catch {
      return { success: false, message: `Cannot connect to backend at ${API_BASE_URL}` };
    }
  },

  clearCache(): void {
    localStorage.removeItem("user_uuid");
  },
};
