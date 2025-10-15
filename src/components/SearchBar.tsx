"use client";

interface SearchBarProps {
  searchQuery: string;
  categoryFilter: string;
  onSearchChange: (query: string) => void;
  onCategoryChange: (category: string) => void;
  categories?: string[];
}

export function SearchBar({
  searchQuery,
  categoryFilter,
  onSearchChange,
  onCategoryChange,
  categories = [],
}: SearchBarProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Title Search */}
        <div>
          <label
            htmlFor="search"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Search by Title
          </label>
          <input
            type="text"
            id="search"
            placeholder="Search topics..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="input w-full"
          />
        </div>

        {/* Category Filter */}
        <div>
          <label
            htmlFor="category"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Filter by Category
          </label>
          <select
            id="category"
            value={categoryFilter}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="input w-full"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Active Filters Display */}
      {(searchQuery || categoryFilter) && (
        <div className="mt-3 flex flex-wrap gap-2 items-center">
          <span className="text-sm text-gray-600">Active filters:</span>
          {searchQuery && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              Title: "{searchQuery}"
              <button
                onClick={() => onSearchChange("")}
                className="ml-1 hover:text-blue-900"
              >
                ×
              </button>
            </span>
          )}
          {categoryFilter && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Category: {categoryFilter}
              <button
                onClick={() => onCategoryChange("")}
                className="ml-1 hover:text-green-900"
              >
                ×
              </button>
            </span>
          )}
          <button
            onClick={() => {
              onSearchChange("");
              onCategoryChange("");
            }}
            className="text-xs text-gray-600 hover:text-gray-900 underline"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
}
