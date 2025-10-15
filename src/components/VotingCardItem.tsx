"use client";

import { useState, useEffect } from "react";
import { VotingCard, VoteStats, votesApi, commentsApi } from "@/services/api";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";

const supabase = createClient();

interface VotingCardItemProps {
  votingCard: VotingCard;
  isAdmin?: boolean;
  onDelete?: (id: string) => void;
}

export function VotingCardItem({
  votingCard,
  isAdmin = false,
  onDelete,
}: VotingCardItemProps) {
  const [voteStats, setVoteStats] = useState<VoteStats | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [comments, setComments] = useState(votingCard.comments || []);
  const [commentsLoaded, setCommentsLoaded] = useState(false);

  useEffect(() => {
    fetchVoteStats();
  }, [votingCard.id]);

  useEffect(() => {
    setComments(votingCard.comments || []);
  }, [votingCard.comments]);

  // Real-time subscriptions
  useEffect(() => {
    // Subscribe to vote changes for this voting card
    const votesChannel = supabase
      .channel(`votes-${votingCard.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "votes",
          filter: `voting_card_id=eq.${votingCard.id}`,
        },
        () => {
          fetchVoteStats();
        }
      )
      .subscribe();

    // Subscribe to comment changes for this voting card
    const commentsChannel = supabase
      .channel(`comments-${votingCard.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "comments",
          filter: `voting_card_id=eq.${votingCard.id}`,
        },
        async () => {
          // Silently update comments in background without loading state
          try {
            const data = await commentsApi.getByVotingCard(votingCard.id);
            setComments(data);
            setCommentsLoaded(true);
          } catch (error) {
            console.error("Failed to fetch comments:", error);
          }
        }
      )
      .subscribe();

    // Cleanup subscriptions on unmount
    return () => {
      supabase.removeChannel(votesChannel);
      supabase.removeChannel(commentsChannel);
    };
  }, [votingCard.id]);

  const fetchVoteStats = async () => {
    try {
      const data = await votesApi.getStats(votingCard.id);
      setVoteStats(data);
    } catch (error) {
      console.error("Failed to fetch vote stats:", error);
    }
  };

  const fetchComments = async () => {
    if (commentsLoaded) return; // Don't fetch if already loaded

    setCommentsLoading(true);
    try {
      const data = await commentsApi.getByVotingCard(votingCard.id);
      setComments(data);
      setCommentsLoaded(true);
    } catch (error) {
      console.error("Failed to fetch comments:", error);
      toast.error("Failed to load comments");
    } finally {
      setCommentsLoading(false);
    }
  };

  const handleVote = async (option: "agree" | "neutral" | "disagree") => {
    setLoading(true);
    try {
      await votesApi.create({ option, votingCardId: votingCard.id });
      setHasVoted(true);
      toast.success("Vote submitted successfully!");
      fetchVoteStats();
    } catch (error: any) {
      if (error.code === "23505") {
        // Unique constraint violation
        toast.error("You have already voted on this topic");
        setHasVoted(true);
      } else {
        toast.error("Failed to submit vote");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      await commentsApi.create({
        content: newComment,
        votingCardId: votingCard.id,
      });
      setNewComment("");
      toast.success("Comment added successfully!");
      setShowComments(true);
      setCommentsLoaded(true); // Mark as loaded since we'll get the new comment via real-time
      // Real-time subscription will handle updating the comments list
    } catch (error) {
      toast.error("Failed to add comment");
    }
  };

  const getVotePercentage = (count: number, total: number) => {
    return total > 0 ? Math.round((count / total) * 100) : 0;
  };

  return (
    <div className="card p-6">
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
              {votingCard.category}
            </span>
            <span className="text-sm text-gray-500">
              {new Date(votingCard.created_at).toLocaleDateString()}
            </span>
          </div>
          {isAdmin && onDelete && (
            <button
              onClick={() => onDelete(votingCard.id)}
              className="btn btn-danger"
            >
              Delete
            </button>
          )}
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {votingCard.title}
        </h3>
        <p className="text-gray-600">{votingCard.description}</p>
      </div>

      {!hasVoted && (
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-900 mb-3">
            Cast your vote:
          </h4>
          <div className="flex space-x-3">
            <button
              onClick={() => handleVote("agree")}
              disabled={loading}
              className="btn bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
            >
              Agree
            </button>
            <button
              onClick={() => handleVote("neutral")}
              disabled={loading}
              className="btn bg-yellow-600 text-white hover:bg-yellow-700 disabled:opacity-50"
            >
              Neutral
            </button>
            <button
              onClick={() => handleVote("disagree")}
              disabled={loading}
              className="btn bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
            >
              Disagree
            </button>
          </div>
        </div>
      )}

      {voteStats && (
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-900 mb-3">
            Voting Results:
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Agree</span>
              <div className="flex items-center space-x-2">
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{
                      width: `${getVotePercentage(
                        voteStats.agree,
                        voteStats.total
                      )}%`,
                    }}
                  ></div>
                </div>
                <span className="text-sm text-gray-900 w-12">
                  {getVotePercentage(voteStats.agree, voteStats.total)}%
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Neutral</span>
              <div className="flex items-center space-x-2">
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-yellow-600 h-2 rounded-full"
                    style={{
                      width: `${getVotePercentage(
                        voteStats.neutral,
                        voteStats.total
                      )}%`,
                    }}
                  ></div>
                </div>
                <span className="text-sm text-gray-900 w-12">
                  {getVotePercentage(voteStats.neutral, voteStats.total)}%
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Disagree</span>
              <div className="flex items-center space-x-2">
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-red-600 h-2 rounded-full"
                    style={{
                      width: `${getVotePercentage(
                        voteStats.disagree,
                        voteStats.total
                      )}%`,
                    }}
                  ></div>
                </div>
                <span className="text-sm text-gray-900 w-12">
                  {getVotePercentage(voteStats.disagree, voteStats.total)}%
                </span>
              </div>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Total votes: {voteStats.total}
          </p>
        </div>
      )}

      <div className="border-t pt-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-medium text-gray-900">
            Comments ({comments.length})
          </h4>
          <button
            onClick={async () => {
              if (!showComments) {
                setShowComments(true);
                await fetchComments();
              } else {
                setShowComments(false);
              }
            }}
            className="text-primary-600 hover:text-primary-500 text-sm"
            disabled={commentsLoading}
          >
            {commentsLoading ? "Loading..." : showComments ? "Hide" : "Show"}{" "}
            Comments
          </button>
        </div>

        <form onSubmit={handleAddComment} className="mb-3">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="input w-full h-20 resize-none"
            rows={3}
          />
          <button
            type="submit"
            disabled={!newComment.trim()}
            className="btn btn-primary mt-2 disabled:opacity-50"
          >
            Add Comment
          </button>
        </form>

        {showComments && (
          <div className="mt-4">
            {commentsLoading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              </div>
            ) : comments.length > 0 ? (
              <div className="space-y-3">
                {comments.map((comment) => (
                  <div key={comment.id} className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-900">
                        {comment.user?.name ||
                          comment.user?.email ||
                          "Anonymous"}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(comment.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700">{comment.content}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500 text-sm">
                No comments yet. Be the first to comment!
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
