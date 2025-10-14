"use client";

import { useState } from "react";
import { votingCardsApi } from "@/services/api";
import toast from "react-hot-toast";

interface CreateVotingCardFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function CreateVotingCardForm({
  onSuccess,
  onCancel,
}: CreateVotingCardFormProps) {
  const [formData, setFormData] = useState({
    category: "",
    title: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await votingCardsApi.create(formData);
      toast.success("Voting topic created successfully!");
      onSuccess();
    } catch (error: any) {
      console.error("Error creating voting card:", error);
      const errorMessage = error.message || "Failed to create voting topic";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="card p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Create New Voting Topic
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="category"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Category
          </label>
          <input
            type="text"
            id="category"
            name="category"
            required
            className="input"
            value={formData.category}
            onChange={handleChange}
            placeholder="e.g., Company Policy, Product Features"
          />
        </div>

        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            required
            className="input"
            value={formData.title}
            onChange={handleChange}
            placeholder="Brief title for the voting topic"
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            required
            rows={4}
            className="input"
            value={formData.description}
            onChange={handleChange}
            placeholder="Detailed description of what users are voting on"
          />
        </div>

        <div className="flex space-x-3">
          <button type="submit" disabled={loading} className="btn btn-primary">
            {loading ? "Creating..." : "Create Topic"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="btn btn-secondary"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
