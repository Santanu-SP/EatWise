import { useState, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Search, Sparkles, TrendingUp, ArrowRight, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { recipes, CATEGORIES, getRecommendations } from '../data/recipes';
import RecipeCard from '../components/RecipeCard';
import RecipeModal from '../components/RecipeModal';

const FEATURED = recipes.sort((a, b) => b.rating - a.rating).slice(0, 6);
const TOP_RATED = [...recipes].sort((a, b) => b.rating - a.rating).slice(0, 3);

export default function Home() {
  const { user, updateUserActivity } = useAuth();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  const recommendations = useMemo(() => {
    if (!user) return [];
    return getRecommendations({
      viewedCategories: user.viewedCategories || [],
      likedIds: user.likedRecipes || [],
      dietaryTags: user.dietaryPrefs || [],
    }, 10);
  }, [user]);

  const filteredFeatured = useMemo(() => {
    return FEATURED.filter(r => {
      const matchCat = activeCategory === 'all' || r.category === activeCategory;
      const matchSearch = !search || r.name.toLowerCase().includes(search.toLowerCase()) || r.description.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [activeCategory, search]);

  const handleOpenRecipe = useCallback((recipe) => {
    setSelectedRecipe(recipe);
    if (user) updateUserActivity(recipe.id, recipe.category, 'view');
  }, [user, updateUserActivity]);

  return (
    <div className="hero-gradient min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 pt-10 pb-8 lg:pt-20 lg:pb-16">
        {/* Background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-20 right-0 w-64 h-64 bg-green-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative">
          {user ? (
            <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 rounded-full px-4 py-1.5 text-sm text-orange-400 mb-4 animate-fade-in">
              <Sparkles className="w-3.5 h-3.5" />
              Welcome back, {user.name.split(' ')[0]}!
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 rounded-full px-4 py-1.5 text-sm text-orange-400 mb-4 animate-fade-in">
              <Sparkles className="w-3.5 h-3.5" />
              Healthy eating, made personal
            </div>
          )}

          <h1 className="font-display font-bold text-4xl lg:text-6xl text-white mb-4 leading-tight text-balance animate-slide-up">
            Discover Recipes{' '}
            <span className="gradient-text">Tailored for You</span>
          </h1>
          <p className="text-gray-400 text-base lg:text-lg mb-8 max-w-xl mx-auto animate-slide-up">
            Personalized healthy recipes based on your taste, dietary needs, and goals. Your journey to mindful eating starts here.
          </p>

          {/* Search Bar */}
          <div className="max-w-lg mx-auto animate-scale-in">
            <div className="relative flex items-center">
              <Search className="absolute left-4 w-5 h-5 text-gray-500 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search recipes, ingredients..."
                className="input-field pl-11 pr-4 py-4 rounded-2xl text-base shadow-glow"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-4 text-gray-500 hover:text-gray-300"
                >✕</button>
              )}
            </div>
          </div>

          {/* CTA for guests */}
          {!user && (
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3 animate-fade-in">
              <Link to="/register" className="btn-primary flex items-center gap-2">
                Get started free <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/login" className="btn-ghost border border-white/10">
                Sign in
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Category Filters */}
      <section className="px-4 mb-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 snap-x-mandatory">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap flex-shrink-0 snap-start transition-all duration-200 ${
                  activeCategory === cat.id
                    ? 'bg-orange-600 text-white shadow-glow'
                    : 'bg-dark-800 text-gray-400 hover:bg-dark-700 hover:text-white border border-white/5'
                }`}
              >
                <span>{cat.emoji}</span> {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Personalized Recommendations (logged in) */}
      {user && recommendations.length > 0 && (
        <section className="px-4 mb-10">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="section-title flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-orange-400" />
                  Top 10 For You
                </h2>
                <p className="section-subtitle">Curated based on your taste & activity</p>
              </div>
              <Link to="/recipes" className="text-sm text-orange-400 hover:text-orange-300 flex items-center gap-1">
                See all <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {recommendations.slice(0, 8).map((recipe, i) => (
                <div
                  key={recipe.id}
                  style={{ animationDelay: `${i * 60}ms` }}
                  className="animate-slide-up"
                >
                  <RecipeCard
                    recipe={recipe}
                    onClick={() => handleOpenRecipe(recipe)}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Recipes */}
      <section className="px-4 mb-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="section-title">
                {search ? '🔍 Search Results' : activeCategory !== 'all' ? `${CATEGORIES.find(c => c.id === activeCategory)?.emoji} ${CATEGORIES.find(c => c.id === activeCategory)?.label}` : '⭐ Featured Recipes'}
              </h2>
              <p className="section-subtitle">
                {filteredFeatured.length} recipes found
              </p>
            </div>
            <Link to="/recipes" className="text-sm text-orange-400 hover:text-orange-300 flex items-center gap-1">
              View all <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {filteredFeatured.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredFeatured.map((recipe, i) => (
                <div key={recipe.id} style={{ animationDelay: `${i * 60}ms` }} className="animate-slide-up">
                  <RecipeCard recipe={recipe} onClick={() => handleOpenRecipe(recipe)} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <span className="text-5xl mb-4 block">🍽️</span>
              <p className="text-gray-400">No recipes found. Try a different search.</p>
              <button
                onClick={() => { setSearch(''); setActiveCategory('all'); }}
                className="mt-4 btn-ghost border border-white/10"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Quick Stats Section */}
      <section className="px-4 mb-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-3 gap-4 p-6 bg-white dark:bg-dark-800 border border-gray-100 dark:border-dark-700 shadow-sm rounded-2xl text-center">
            <div>
              <p className="text-3xl font-display font-bold gradient-text">{recipes.length}+</p>
              <p className="text-xs text-gray-500 mt-1">Healthy Recipes</p>
            </div>
            <div className="border-x border-white/5">
              <p className="text-3xl font-display font-bold gradient-text">10+</p>
              <p className="text-xs text-gray-500 mt-1">Categories</p>
            </div>
            <div>
              <p className="text-3xl font-display font-bold gradient-text">100%</p>
              <p className="text-xs text-gray-500 mt-1">Wholesome</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner for guests */}
      {!user && (
        <section className="px-4 mb-10">
          <div className="max-w-7xl mx-auto">
            <div className="relative overflow-hidden bg-gradient-to-r from-primary-900/60 to-dark-700 border border-orange-500/20 rounded-2xl p-6 lg:p-10 text-center">
              <div className="absolute top-0 right-0 w-48 h-48 bg-orange-500/10 rounded-full blur-3xl" />
              <h2 className="font-display font-bold text-2xl lg:text-3xl text-white mb-2">
                Get Your Top 10 Recipes
              </h2>
              <p className="text-gray-400 mb-6 text-sm lg:text-base">
                Sign up to unlock personalized recipe recommendations based on your preferences.
              </p>
              <Link to="/register" className="btn-primary inline-flex items-center gap-2">
                Create free account <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Recipe Modal */}
      {selectedRecipe && (
        <RecipeModal recipe={selectedRecipe} onClose={() => setSelectedRecipe(null)} />
      )}
    </div>
  );
}
