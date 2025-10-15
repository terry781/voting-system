"use client";

import { useState, useEffect, useMemo } from "react";
import { VotingCard, votingCardsApi } from "@/services/api";
import { VotingCardItem } from "./VotingCardItem";
import { SearchBar } from "./SearchBar";
import toast from "react-hot-toast";

export function VotingCardsList() {
  const [votingCards, setVotingCards] = useState<VotingCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

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

  // Get unique categories
  const categories = useMemo(() => {
    const uniqueCategories = new Set(votingCards.map((card) => card.category));
    return Array.from(uniqueCategories).sort();
  }, [votingCards]);

  // Filter voting cards based on search query and category
  const filteredCards = useMemo(() => {
    return votingCards.filter((card) => {
      const matchesSearch = searchQuery
        ? card.title.toLowerCase().includes(searchQuery.toLowerCase())
        : true;
      const matchesCategory = categoryFilter
        ? card.category === categoryFilter
        : true;
      return matchesSearch && matchesCategory;
    });
  }, [votingCards, searchQuery, categoryFilter]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
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

      {/* Search Bar */}
      <SearchBar
        searchQuery={searchQuery}
        categoryFilter={categoryFilter}
        onSearchChange={setSearchQuery}
        onCategoryChange={setCategoryFilter}
        categories={categories}
      />

      {/* Results */}
      {filteredCards.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {votingCards.length === 0
              ? "No voting topics available"
              : "No topics match your search"}
          </h3>
          <p className="text-gray-500">
            {votingCards.length === 0
              ? "Check back later for new voting topics."
              : "Try adjusting your search filters."}
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          <div className="text-sm text-gray-600">
            Showing {filteredCards.length} of {votingCards.length} topics
          </div>
          {filteredCards.map((card) => (
            <VotingCardItem key={card.id} votingCard={card} />
          ))}
        </div>
      )}
    </div>
  );
}
