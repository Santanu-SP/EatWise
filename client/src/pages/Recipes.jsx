import { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { recipes, CATEGORIES, DIETARY_TAGS } from '../data/recipes';
import RecipeCard from '../components/RecipeCard';
import RecipeModal from '../components/RecipeModal';
import { useAuth } from '../context/AuthContext';

export default function Recipes() {
  const { user, updateUserActivity } = useAuth();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeTags, setActiveTags] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('rating');
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  const toggleTag = (tag) => {
    setActiveTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  const filtered = useMemo(() => {
    let result = recipes.filter(r => {
      const matchCat = activeCategory === 'all' || r.category === activeCategory;
      const matchSearch = !search || r.name.toLowerCase().includes(search.toLowerCase()) ||
        r.tags.some(t => t.toLowerCase().includes(search.toLowerCase())) ||
        r.description.toLowerCase().includes(search.toLowerCase());
      const matchTags = activeTags.length === 0 || activeTags.every(t => r.tags.includes(t));
      return matchCat && matchSearch && matchTags;
    });

    if (sortBy === 'rating') result = result.sort((a, b) => b.rating - a.rating);
    else if (sortBy === 'time') result = result.sort((a, b) => a.time - b.time);
    else if (sortBy === 'calories') result = result.sort((a, b) => a.calories - b.calories);
    else if (sortBy === 'name') result = result.sort((a, b) => a.name.localeCompare(b.name));

    return result;
  }, [search, activeCategory, activeTags, sortBy]);

  const handleOpenRecipe = (recipe) => {
    setSelectedRecipe(recipe);
    if (user) updateUserActivity(recipe.id, recipe.category, 'view');
  };

  const hasFilters = activeCategory !== 'all' || activeTags.length > 0 || search;

  return (
    <div className="min-h-screen bg-dark-900">
      {/* Header */}
      <div className="sticky top-16 z-30 bg-dark-900/95 backdrop-blur-lg border-b border-white/5 px-4 py-3">
        <div className="max-w-7xl mx-auto space-y-3">
          {/* Search row */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search recipes..."
                className="input-field pl-9 py-2.5 text-sm"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                showFilters || activeTags.length > 0
                  ? 'bg-orange-600/20 border-orange-500/50 text-orange-400'
                  : 'bg-dark-800 border-white/10 text-gray-400 hover:text-white'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span className="hidden sm:inline">Filter</span>
              {activeTags.length > 0 && (
                <span className="w-5 h-5 bg-orange-600 rounded-full text-white text-xs flex items-center justify-center">
                  {activeTags.length}
                </span>
              )}
            </button>
          </div>

          {/* Category pills */}
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0 transition-all duration-200 ${
                  activeCategory === cat.id
                    ? 'bg-orange-600 text-white'
                    : 'bg-dark-800 text-gray-400 hover:bg-dark-700 border border-white/5'
                }`}
              >
                {cat.emoji} {cat.label}
              </button>
            ))}
          </div>

          {/* Expanded filters */}
          {showFilters && (
            <div className="space-y-3 pt-1 animate-slide-down">
              <div>
                <p className="text-xs text-gray-500 mb-2 font-medium uppercase tracking-wider">Dietary</p>
                <div className="flex flex-wrap gap-2">
                  {DIETARY_TAGS.map(tag => (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                        activeTags.includes(tag)
                          ? 'bg-orange-600/20 border-orange-500/50 text-orange-400'
                          : 'border-white/10 text-gray-400 hover:border-white/20 hover:text-white'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-2 font-medium uppercase tracking-wider">Sort by</p>
                <div className="flex gap-2 flex-wrap">
                  {[
                    { val: 'rating', label: '⭐ Rating' },
                    { val: 'time', label: '⏱️ Quickest' },
                    { val: 'calories', label: '🔥 Low Cal' },
                    { val: 'name', label: '🔤 A-Z' },
                  ].map(opt => (
                    <button
                      key={opt.val}
                      onClick={() => setSortBy(opt.val)}
                      className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                        sortBy === opt.val
                          ? 'bg-green-500/20 border-green-500/50 text-green-400'
                          : 'border-white/10 text-gray-400 hover:border-white/20'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Active filter chips */}
          {hasFilters && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-gray-500">{filtered.length} recipes</span>
              {(search || activeCategory !== 'all' || activeTags.length > 0) && (
                <button
                  onClick={() => { setSearch(''); setActiveCategory('all'); setActiveTags([]); }}
                  className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1"
                >
                  <X className="w-3 h-3" /> Clear all
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Grid */}
      <div className="px-4 py-6 max-w-7xl mx-auto">
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((recipe, i) => (
              <div key={recipe.id} style={{ animationDelay: `${(i % 8) * 50}ms` }} className="animate-slide-up">
                <RecipeCard recipe={recipe} onClick={() => handleOpenRecipe(recipe)} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <span className="text-6xl block mb-4">🍽️</span>
            <h3 className="text-lg font-semibold text-white mb-2">No recipes found</h3>
            <p className="text-gray-400 text-sm mb-6">Try adjusting your filters or search term</p>
            <button
              onClick={() => { setSearch(''); setActiveCategory('all'); setActiveTags([]); }}
              className="btn-primary"
            >
              Reset filters
            </button>
          </div>
        )}
      </div>

      {selectedRecipe && (
        <RecipeModal recipe={selectedRecipe} onClose={() => setSelectedRecipe(null)} />
      )}
    </div>
  );
}
