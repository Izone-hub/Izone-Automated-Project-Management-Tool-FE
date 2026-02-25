'use client';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { inviteService } from '@/services/invite.service';
import { WorkspaceInvitationResponse } from '@/types/invite';

function JoinWorkspaceContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  const [invite, setInvite] = useState<WorkspaceInvitationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isJoining, setIsJoining] = useState(false);

  useEffect(() => {
    if (!token) {
      setError('Invalid or missing invitation token.');
      setLoading(false);
      return;
    }

    inviteService.getInviteDetails(token)
      .then(setInvite)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [token]);

  const handleAccept = async () => {
    // Check if user is logged in
    const isLoggedIn = !!localStorage.getItem('token');
    if (!isLoggedIn) {
      router.push(`/login?redirect=/join-workspace?token=${token}`);
      return;
    }

    setIsJoining(true);
    try {
      const res = await inviteService.acceptInvite(token!);
      router.push(`/workspaces/${res.workspace_id}`);
    } catch (err: any) {
      setError(err.message);
      setIsJoining(false);
    }
  };

  if (loading) return <div className="flex justify-center mt-20">Loading invitation...</div>;

  if (error) return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-red-50 border border-red-200 rounded-lg text-center">
      <h2 className="text-xl font-bold text-red-700 mb-2">Invite Error</h2>
      <p className="text-red-600">{error}</p>
      <button onClick={() => router.push('/')} className="mt-4 text-blue-600 font-medium">Back to Home</button>
    </div>
  );

  return (
    <div className="max-w-md mx-auto mt-20 p-8 bg-white border border-gray-200 rounded-2xl shadow-xl text-center">
      <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
        </svg>
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">You're invited!</h1>
      <p className="text-gray-600 mb-6">
        You have been invited to join a workspace as a <span className="font-bold text-gray-900 capitalize">{invite?.role}</span>.
      </p>
      
      <button
        onClick={handleAccept}
        disabled={isJoining}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition shadow-lg shadow-blue-200 disabled:bg-gray-400"
      >
        {isJoining ? 'Joining...' : 'Accept & Join Workspace'}
      </button>
      
      <p className="mt-4 text-xs text-gray-400 italic">
        This invitation was sent to {invite?.email}
      </p>
    </div>
  );
}

// Next.js App Router requires Suspense for useSearchParams
export default function JoinWorkspacePage() {
  return (
    <Suspense fallback={<div className="text-center mt-20">Loading...</div>}>
      <JoinWorkspaceContent />
    </Suspense>
  );
}