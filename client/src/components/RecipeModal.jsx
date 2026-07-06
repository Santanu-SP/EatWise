import { useEffect } from 'react';
import { X, Clock, Flame, ChefHat, Star, Heart, PlayCircle, ShieldCheck, AlertTriangle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function RecipeModal({ recipe, onClose }) {
  const { user, updateUserActivity } = useAuth();
  const isLiked = user?.likedRecipes?.includes(recipe?.id);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  if (!recipe) return null;

  const handleLike = () => {
    if (!user) return;
    updateUserActivity(recipe.id, recipe.category, 'like');
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end lg:items-center justify-center p-0 lg:p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-dark-900/80 backdrop-blur-sm" onClick={onClose} />

      {/* Sheet */}
      <div className="relative w-full lg:max-w-3xl bg-[#fdfaf6] dark:bg-[#1a1714] lg:rounded-2xl rounded-t-3xl border border-black/5 dark:border-white/5 overflow-hidden animate-slide-up max-h-[90vh] overflow-y-auto scrollbar-hide shadow-2xl">
        {/* Handle for mobile */}
        <div className="lg:hidden flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-black/10 dark:bg-white/20 rounded-full" />
        </div>

        {/* Header */}
        <div className="relative px-5 pt-4 pb-4 flex items-start gap-4">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl flex-shrink-0 bg-orange-100 dark:bg-orange-900/30">
            {recipe.emoji}
          </div>
          <div className="flex-1">
            <h2 className="font-display font-bold text-2xl text-dark-900 dark:text-white leading-tight flex items-center gap-2">
              {recipe.name} <span className="text-lg font-normal text-gray-500">({recipe.nameHi})</span>
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5 capitalize">{recipe.category}</p>
            <div className="flex items-center gap-3 mt-2 text-xs">
              <span className="flex items-center gap-1 text-gray-600 dark:text-gray-300">
                <Clock className="w-3.5 h-3.5 text-orange-500" />{recipe.time} min
              </span>
              <span className="flex items-center gap-1 text-gray-600 dark:text-gray-300">
                <Flame className="w-3.5 h-3.5 text-red-500" />
                {recipe.regularCalories} cal <span className="opacity-50">/ {recipe.healthyCalories} cal (Healthy)</span>
              </span>
              <span className="flex items-center gap-1 text-yellow-500">
                <Star className="w-3.5 h-3.5 fill-yellow-500" />{recipe.rating}
              </span>
              <span className="flex items-center gap-1 text-gray-600 dark:text-gray-300">
                <ChefHat className="w-3.5 h-3.5 text-gray-500" />{recipe.servings}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {user && (
              <button
                onClick={handleLike}
                className={`p-2 rounded-xl transition-all ${
                  isLiked ? 'bg-red-100 dark:bg-red-900/30 text-red-500' : 'bg-gray-100 dark:bg-dark-800 text-gray-400 hover:text-red-500'
                }`}
              >
                <Heart className={`w-5 h-5 ${isLiked ? 'fill-red-500' : ''}`} />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-gray-100 dark:bg-dark-800 text-gray-500 hover:text-dark-900 dark:hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Warning if highly unhealthy */}
        {recipe.isUnhealthy && (
          <div className="mx-5 mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 rounded-xl flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-red-700 dark:text-red-400">High Calorie / Unhealthy Warning</p>
              <p className="text-xs text-red-600 dark:text-red-300 mt-0.5">
                The traditional version of this recipe has approx {recipe.regularCalories} calories and uses excessive oil/fat. We strongly recommend our healthy alternatives below ({recipe.healthyCalories} cal).
              </p>
            </div>
          </div>
        )}

        {/* Description */}
        <div className="px-5 mb-4 space-y-2">
          <p className="text-sm text-dark-700 dark:text-gray-300 leading-relaxed">{recipe.description}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed font-hindi">{recipe.descriptionHi}</p>
        </div>

        {/* Tags */}
        <div className="px-5 mb-6 flex flex-wrap gap-2">
          {recipe.tags.map(tag => (
            <span key={tag} className="badge bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400">{tag}</span>
          ))}
        </div>

        {/* Main Tabs for Ingredients/Steps */}
        <div className="mx-5 grid grid-cols-1 md:grid-cols-2 gap-6 pb-8 border-b border-gray-200 dark:border-white/10 mb-8">
          <div>
            <h3 className="font-display font-bold text-lg text-dark-900 dark:text-white mb-3 border-b-2 border-orange-200 dark:border-orange-900/50 inline-block pb-1">
              Ingredients (सामग्री)
            </h3>
            <ul className="space-y-3">
              {recipe.ingredients.map((ing, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-dark-700 dark:text-gray-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-1.5 flex-shrink-0" />
                  <div>
                    <div>{ing.split(' / ')[0]}</div>
                    <div className="text-gray-500 dark:text-gray-500 text-xs mt-0.5">{recipe.ingredientsHi?.[i] || ing.split(' / ')[1]}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="font-display font-bold text-lg text-dark-900 dark:text-white mb-3 border-b-2 border-orange-200 dark:border-orange-900/50 inline-block pb-1">
              Traditional Method (पारंपरिक विधि)
            </h3>
            <ol className="space-y-4">
              {recipe.steps.map((step, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-dark-700 flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold text-gray-600 dark:text-gray-300">
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-dark-700 dark:text-gray-300 leading-relaxed">{step.split(' / ')[0]}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{step.split(' / ')[1]}</p>
                  </div>
                </li>
              ))}
            </ol>
            {recipe.youtubeUrl && (
              <a href={recipe.youtubeUrl} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-red-600 dark:text-red-400 hover:underline">
                <PlayCircle className="w-4 h-4" /> Watch traditional recipe on YouTube
              </a>
            )}
          </div>
        </div>

        {/* Healthy Options Section */}
        {recipe.healthyOptions && recipe.healthyOptions.length > 0 && (
          <div className="px-5 pb-8">
            <div className="flex items-center gap-2 mb-4">
              <ShieldCheck className="w-6 h-6 text-green-500" />
              <h3 className="font-display font-bold text-xl text-dark-900 dark:text-white">
                Healthy Alternatives (स्वस्थ विकल्प)
              </h3>
            </div>
            
            <div className="grid grid-cols-1 gap-5">
              {recipe.healthyOptions.map((opt, i) => (
                <div key={i} className="bg-white dark:bg-dark-800 rounded-xl p-4 border border-gray-200 dark:border-white/10 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded-bl-xl uppercase tracking-wider">
                    {opt.calories} cal
                  </div>
                  
                  <h4 className="font-bold text-dark-900 dark:text-white text-base mb-1">{opt.label.split(' / ')[0]}</h4>
                  <h5 className="font-medium text-gray-500 dark:text-gray-400 text-sm mb-3">{opt.label.split(' / ')[1]}</h5>
                  
                  <p className="text-sm text-dark-700 dark:text-gray-300 mb-1">{opt.description}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mb-4">{opt.descriptionHi}</p>
                  
                  <h6 className="text-xs font-bold text-dark-900 dark:text-white uppercase tracking-wide mb-2">How to make:</h6>
                  <ol className="space-y-2 mb-4">
                    {opt.steps.map((s, si) => (
                      <li key={si} className="text-sm text-dark-700 dark:text-gray-300 flex items-start gap-2">
                        <span className="text-green-500 mt-0.5">•</span> 
                        <div>
                          <div>{s.split(' / ')[0]}</div>
                          <div className="text-xs text-gray-500 mt-0.5">{s.split(' / ')[1]}</div>
                        </div>
                      </li>
                    ))}
                  </ol>
                  
                  {opt.youtubeUrl && (
                    <a 
                      href={opt.youtubeUrl} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="inline-flex items-center gap-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors"
                    >
                      <PlayCircle className="w-4 h-4" /> Watch Healthy Version
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
