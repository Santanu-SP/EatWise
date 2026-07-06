import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { recipes } from '../data/recipes';
import RecipeCard from '../components/RecipeCard';
import RecipeModal from '../components/RecipeModal';
import { Heart, BookOpen, Settings, LogOut, ChevronRight, Leaf, User } from 'lucide-react';

export default function Profile() {
  const { user, logout, updateUserActivity } = useAuth();
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="min-h-screen hero-gradient flex items-center justify-center p-4">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 rounded-2xl bg-dark-800 border border-white/10 flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-gray-500" />
          </div>
          <h2 className="text-xl font-display font-bold text-white mb-2">Sign in to view profile</h2>
          <p className="text-gray-400 text-sm mb-6">Create an account to save recipes, track activity, and get personalized recommendations.</p>
          <div className="flex flex-col gap-3">
            <Link to="/login" className="btn-primary text-center py-3">Log in</Link>
            <Link to="/register" className="btn-ghost border border-white/10 text-center py-3">Sign up free</Link>
          </div>
        </div>
      </div>
    );
  }

  const likedRecipes = recipes.filter(r => user.likedRecipes?.includes(r.id));
  const viewedRecipes = recipes.filter(r => user.viewedRecipes?.slice(0, 6).includes(r.id));

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleOpenRecipe = (recipe) => {
    setSelectedRecipe(recipe);
    updateUserActivity(recipe.id, recipe.category, 'view');
  };

  return (
    <div className="min-h-screen bg-dark-900">
      {/* Profile Header */}
      <div className="relative bg-gradient-to-b from-primary-900/20 to-dark-900 px-4 pt-8 pb-6">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-20 h-20 rounded-2xl bg-dark-700 border-2 border-orange-500/30"
              />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-orange-600 rounded-full flex items-center justify-center">
                <Leaf className="w-3 h-3 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-display font-bold text-white">{user.name}</h1>
              <p className="text-sm text-gray-400">{user.email}</p>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="badge bg-orange-500/10 text-orange-400 text-xs">Member</span>
                {user.dietaryPrefs?.slice(0, 2).map(p => (
                  <span key={p} className="badge bg-dark-700 text-gray-400 text-xs">{p}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mt-6">
            {[
              { val: likedRecipes.length, label: 'Liked', emoji: '❤️' },
              { val: user.viewedRecipes?.length || 0, label: 'Viewed', emoji: '👁️' },
              { val: user.dietaryPrefs?.length || 0, label: 'Prefs', emoji: '🥗' },
            ].map(stat => (
              <div key={stat.label} className="bg-white dark:bg-dark-800 border border-gray-100 dark:border-dark-700 shadow-sm rounded-xl p-3 text-center">
                <p className="text-lg">{stat.emoji}</p>
                <p className="text-xl font-bold font-display text-white">{stat.val}</p>
                <p className="text-xs text-gray-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="px-4 max-w-2xl mx-auto pb-8">
        {/* Liked Recipes */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-title flex items-center gap-2">
              <Heart className="w-4 h-4 text-red-400 fill-red-400" />
              Liked Recipes
            </h2>
          </div>
          {likedRecipes.length > 0 ? (
            <div className="space-y-2">
              {likedRecipes.map(recipe => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  compact
                  onClick={() => handleOpenRecipe(recipe)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-white dark:bg-dark-800 border border-gray-100 dark:border-dark-700 shadow-sm rounded-xl">
              <span className="text-3xl block mb-2">🤍</span>
              <p className="text-sm text-gray-400">No liked recipes yet.</p>
              <Link to="/recipes" className="text-orange-400 text-sm hover:underline mt-1 inline-block">
                Browse recipes
              </Link>
            </div>
          )}
        </section>

        {/* Recently Viewed */}
        {viewedRecipes.length > 0 && (
          <section className="mb-8">
            <h2 className="section-title flex items-center gap-2 mb-4">
              <BookOpen className="w-4 h-4 text-orange-400" />
              Recently Viewed
            </h2>
            <div className="space-y-2">
              {viewedRecipes.map(recipe => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  compact
                  onClick={() => handleOpenRecipe(recipe)}
                />
              ))}
            </div>
          </section>
        )}

        {/* Dietary preferences */}
        <section className="mb-8">
          <h2 className="section-title flex items-center gap-2 mb-4">
            <Settings className="w-4 h-4 text-gray-400" />
            Dietary Preferences
          </h2>
          {user.dietaryPrefs?.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {user.dietaryPrefs.map(p => (
                <span key={p} className="badge bg-orange-500/10 text-orange-400 px-3 py-1.5">{p}</span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No preferences set. Update when registering.</p>
          )}
        </section>

        {/* Actions */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 p-4 rounded-xl border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-all"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Sign out</span>
        </button>
      </div>

      {selectedRecipe && (
        <RecipeModal recipe={selectedRecipe} onClose={() => setSelectedRecipe(null)} />
      )}
    </div>
  );
}
