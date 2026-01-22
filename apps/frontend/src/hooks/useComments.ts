// // hooks/useComments.ts
// import { useState, useEffect, useCallback } from "react";
// import { Comment } from "@/types/comment";
// import { commentsAPI } from "@/lib/api/comments";

// export function useComments(cardId: string) {
//   const [comments, setComments] = useState<Comment[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const fetchComments = useCallback(async () => {
//     if (!cardId) return;

//     setLoading(true);
//     setError(null);
//     try {
//       const data = await commentsAPI.getComments(cardId);
//       setComments(data);
//     } catch (err) {
//       const errorMessage = err instanceof Error ? err.message : "Failed to fetch comments";
//       setError(errorMessage);
//       console.error("Error fetching comments:", err);
//     } finally {
//       setLoading(false);
//     }
//   }, [cardId]);

//   const addComment = async (content: string) => {
//     try {
//       setError(null);
//       const newComment = await commentsAPI.createComment(cardId, content);
//       setComments((prev) => [...prev, newComment]);
//       return newComment;
//     } catch (err) {
//       const errorMessage = err instanceof Error ? err.message : "Failed to create comment";
//       setError(errorMessage);
//       throw err;
//     }
//   };

//   const editComment = async (commentId: string, content: string) => {
//     try {
//       setError(null);
//       const updated = await commentsAPI.updateComment(cardId, commentId, content);
//       setComments((prev) => prev.map(c => c.id === commentId ? updated : c));
//       return updated;
//     } catch (err) {
//       const errorMessage = err instanceof Error ? err.message : "Failed to update comment";
//       setError(errorMessage);
//       throw err;
//     }
//   };

//   const removeComment = async (commentId: string) => {
//     try {
//       setError(null);
//       await commentsAPI.deleteComment(cardId, commentId);
//       setComments((prev) => prev.filter(c => c.id !== commentId));
//     } catch (err) {
//       const errorMessage = err instanceof Error ? err.message : "Failed to delete comment";
//       setError(errorMessage);
//       throw err;
//     }
//   };

//   useEffect(() => {
//     fetchComments();
//   }, [fetchComments]);

//   return {
//     comments,
//     loading,
//     error,
//     fetchComments,
//     addComment,
//     editComment,
//     removeComment
//   };
// }




// "use client"

// import { useState, useEffect, useCallback } from "react"
// import type { Comment } from "@/types/comment"
// import { commentsAPI } from "@/lib/api/comments"

// interface UseCommentsReturn {
//   comments: Comment[]
//   loading: boolean
//   error: string | null
//   addComment: (content: string) => Promise<void>
//   editComment: (id: string, content: string) => Promise<void>
//   removeComment: (id: string) => Promise<void>
// }

// export function useComments(cardId: string): UseCommentsReturn {
//   const [comments, setComments] = useState<Comment[]>([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)

//   useEffect(() => {
//     if (!cardId) return

//     const fetchComments = async () => {
//       try {
//         setLoading(true)
//         setError(null)
//         const data = await commentsAPI.getComments(cardId)
//         setComments(data)
//       } catch (err) {
//         setError(err instanceof Error ? err.message : "Failed to load comments")
//         console.error("[v0] Error fetching comments:", err)
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchComments()
//   }, [cardId])

//   const addComment = useCallback(
//     async (content: string) => {
//       try {
//         const newComment = await commentsAPI.createComment(cardId, content)
//         setComments((prev) => [newComment, ...prev])
//       } catch (err) {
//         const message = err instanceof Error ? err.message : "Failed to add comment"
//         setError(message)
//         console.error("[v0] Error adding comment:", err)
//         throw err
//       }
//     },
//     [cardId],
//   )

//   const editComment = useCallback(
//     async (id: string, content: string) => {
//       try {
//         const updated = await commentsAPI.updateComment(cardId, id, content)
//         setComments((prev) => prev.map((c) => (c.id === id ? updated : c)))
//       } catch (err) {
//         const message = err instanceof Error ? err.message : "Failed to edit comment"
//         setError(message)
//         console.error("[v0] Error editing comment:", err)
//         throw err
//       }
//     },
//     [cardId],
//   )

//   const removeComment = useCallback(
//     async (id: string) => {
//       try {
//         await commentsAPI.deleteComment(cardId, id)
//         setComments((prev) => prev.filter((c) => c.id !== id))
//       } catch (err) {
//         const message = err instanceof Error ? err.message : "Failed to delete comment"
//         setError(message)
//         console.error("[v0] Error deleting comment:", err)
//         throw err
//       }
//     },
//     [cardId],
//   )

//   return {
//     comments,
//     loading,
//     error,
//     addComment,
//     editComment,
//     removeComment,
//   }
// }



"use client"

import { useState, useEffect, useCallback } from "react"
import type { Comment } from "@/types/comment"
import { commentsAPI } from "@/lib/api/comments"
import { authTokenManager } from  "@/lib/api/auth"

interface UseCommentsReturn {
  comments: Comment[]
  loading: boolean
  error: string | null
  addComment: (content: string) => Promise<void>
  editComment: (id: string, content: string) => Promise<void>
  removeComment: (id: string) => Promise<void>
}

export function useComments(cardId: string): UseCommentsReturn {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!cardId) return

    if (!authTokenManager.isLoggedIn()) {
      console.warn("[v0] User not logged in, cannot fetch comments")
      setError("Please log in to view comments")
      setLoading(false)
      return
    }

    const fetchComments = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await commentsAPI.getComments(cardId)
        setComments(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load comments")
        console.error("[v0] Error fetching comments:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchComments()
  }, [cardId])

  const addComment = useCallback(
    async (content: string) => {
      try {
        const newComment = await commentsAPI.createComment(cardId, content)
        setComments((prev) => [newComment, ...prev])
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to add comment"
        setError(message)
        console.error("[v0] Error adding comment:", err)
        throw err
      }
    },
    [cardId],
  )

  const editComment = useCallback(
    async (id: string, content: string) => {
      try {
        const updated = await commentsAPI.updateComment(cardId, id, content)
        setComments((prev) => prev.map((c) => (c.id === id ? updated : c)))
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to edit comment"
        setError(message)
        console.error("[v0] Error editing comment:", err)
        throw err
      }
    },
    [cardId],
  )

  const removeComment = useCallback(
    async (id: string) => {
      try {
        await commentsAPI.deleteComment(cardId, id)
        setComments((prev) => prev.filter((c) => c.id !== id))
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to delete comment"
        setError(message)
        console.error("[v0] Error deleting comment:", err)
        throw err
      }
    },
    [cardId],
  )

  return {
    comments,
    loading,
    error,
    addComment,
    editComment,
    removeComment,
  }
}
