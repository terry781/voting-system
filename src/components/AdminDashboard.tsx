"use client";

import { useState, useEffect } from "react";
import { VotingCard, votingCardsApi } from "@/services/api";
import { CreateVotingCardForm } from "./CreateVotingCardForm";
import { VotingCardItem } from "./VotingCardItem";
import toast from "react-hot-toast";

export function AdminDashboard() {
  const [votingCards, setVotingCards] = useState<VotingCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    fetchVotingCards();
  }, []);

  const fetchVotingCards = async () => {
    try {
      const data = await votingCardsApi.getAll();
      setVotingCards(data);
    } catch (error) {
      toast.error("Failed to fetch voting cards");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSuccess = () => {
    setShowCreateForm(false);
    fetchVotingCards();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this voting card?")) return;

    try {
      await votingCardsApi.delete(id);
      toast.success("Voting card deleted successfully");
      fetchVotingCards();
    } catch (error) {
      toast.error("Failed to delete voting card");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Admin Dashboard</h2>
          <p className="text-gray-600">Manage voting topics and view results</p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="btn btn-primary"
        >
          Create New Topic
        </button>
      </div>

      {showCreateForm && (
        <CreateVotingCardForm
          onSuccess={handleCreateSuccess}
          onCancel={() => setShowCreateForm(false)}
        />
      )}

      <div className="grid gap-6">
        {votingCards.map((card) => (
          <VotingCardItem
            key={card.id}
            votingCard={card}
            isAdmin={true}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {votingCards.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No voting topics created yet
          </h3>
          <p className="text-gray-500 mb-4">
            Create your first voting topic to get started.
          </p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="btn btn-primary"
          >
            Create First Topic
          </button>
        </div>
      )}
    </div>
  );
}
