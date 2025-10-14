"use client";

import { useState, useEffect } from "react";
import { VotingCard, votingCardsApi } from "@/services/api";
import { VotingCardItem } from "./VotingCardItem";
import toast from "react-hot-toast";

export function VotingCardsList() {
  const [votingCards, setVotingCards] = useState<VotingCard[]>([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (votingCards.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No voting topics available
        </h3>
        <p className="text-gray-500">Check back later for new voting topics.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Available Topics
        </h2>
        <p className="text-gray-600">Vote on topics and share your thoughts</p>
      </div>

      <div className="grid gap-6">
        {votingCards.map((card) => (
          <VotingCardItem key={card.id} votingCard={card} />
        ))}
      </div>
    </div>
  );
}
