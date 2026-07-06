import { useState } from 'react';
import { Heart, Clock, Flame, ChefHat, Star, Leaf } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const DIFF_COLOR = {
  Easy: 'text-green-700 bg-green-100 dark:text-green-400 dark:bg-green-400/10 border border-green-200 dark:border-green-400/20',
  Medium: 'text-amber-700 bg-amber-100 dark:text-amber-400 dark:bg-amber-400/10 border border-amber-200 dark:border-amber-400/20',
  Hard: 'text-red-700 bg-red-100 dark:text-red-400 dark:bg-red-400/10 border border-red-200 dark:border-red-400/20',
};

export default function RecipeCard({ recipe, onClick, compact = false }) {
  const { user, updateUserActivity } = useAuth();
  const isLiked = user?.likedRecipes?.includes(recipe.id);
  const [liked, setLiked] = useState(isLiked);
  const [likeAnim, setLikeAnim] = useState(false);

  const handleLike = (e) => {
    e.stopPropagation();
    if (!user) return;
    const newLiked = !liked;
    setLiked(newLiked);
    setLikeAnim(true);
    updateUserActivity(recipe.id, recipe.category, 'like');
    setTimeout(() => setLikeAnim(false), 300);
  };

  if (compact) {
    return (
      <div
        onClick={onClick}
        className="flex items-center gap-3 p-3 bg-white dark:bg-dark-800 border border-gray-100 dark:border-white/5 rounded-xl hover:border-orange-500/30 hover:shadow-md transition-all duration-200 cursor-pointer active:scale-98"
      >
        <div className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 bg-orange-50 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-900/30">
          {recipe.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm text-dark-900 dark:text-white truncate">
            {recipe.name} <span className="font-normal text-gray-500 text-xs">({recipe.nameHi})</span>
          </p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <Clock className="w-3 h-3" />{recipe.time}m
            </span>
            <span className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1 font-medium">
              <Flame className="w-3 h-3" />{recipe.healthyCalories} cal
            </span>
            <span className="text-xs text-yellow-500 flex items-center gap-1">
              <Star className="w-3 h-3 fill-yellow-500" />{recipe.rating}
            </span>
          </div>
        </div>
        <button
          onClick={handleLike}
          className={`p-1.5 rounded-lg transition-all ${liked ? 'text-red-500 bg-red-50 dark:bg-red-900/20' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700'}`}
        >
          <Heart className={`w-5 h-5 ${liked ? 'fill-red-500' : ''} ${likeAnim ? 'scale-125' : 'scale-100'} transition-transform`} />
        </button>
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className="card group bg-white dark:bg-dark-800 border border-gray-200 dark:border-white/5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 rounded-2xl overflow-hidden cursor-pointer flex flex-col"
    >
      {/* Emoji Header */}
      <div className="relative h-40 flex items-center justify-center overflow-hidden bg-orange-50 dark:bg-[#2d251d] border-b border-gray-100 dark:border-white/5">
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-10 pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)', backgroundSize: '24px 24px' }}>
        </div>
        <span className="text-7xl group-hover:scale-110 transition-transform duration-300 drop-shadow-md">
          {recipe.emoji}
        </span>
        <div className="absolute top-3 right-3 flex gap-2 z-10">
          <button
            onClick={handleLike}
            className={`p-2 rounded-full backdrop-blur-md shadow-sm transition-all duration-200 ${
              liked
                ? 'bg-red-50 dark:bg-red-900/30 text-red-500'
                : 'bg-white/80 dark:bg-dark-900/60 text-gray-500 hover:text-red-500'
            } ${likeAnim ? 'scale-125' : 'scale-100'}`}
          >
            <Heart className={`w-4 h-4 ${liked ? 'fill-red-500' : ''}`} />
          </button>
        </div>
        <div className="absolute top-3 left-3 z-10">
          <span className={`px-2 py-1 rounded-md text-xs font-semibold shadow-sm backdrop-blur-md ${DIFF_COLOR[recipe.difficulty] || DIFF_COLOR.Easy}`}>
            {recipe.difficulty}
          </span>
        </div>
        {recipe.isUnhealthy && (
          <div className="absolute bottom-3 right-3 z-10">
            <span className="px-2 py-1 rounded-md text-[10px] font-bold shadow-sm backdrop-blur-md bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300 flex items-center gap-1 uppercase">
              Healthy Option Inside
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-1 gap-2">
          <h3 className="font-display font-bold text-lg text-dark-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors line-clamp-1">
            {recipe.name}
          </h3>
        </div>
        <h4 className="text-xs text-gray-500 font-medium mb-2">{recipe.nameHi}</h4>
        
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2 leading-relaxed flex-1">
          {recipe.description}
        </p>

        {/* Stats row */}
        <div className="flex items-center justify-between text-xs py-3 border-t border-gray-100 dark:border-white/5">
          <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400 font-medium">
            <Clock className="w-4 h-4 text-orange-500" />
            {recipe.time}m
          </span>
          <span className="flex items-center gap-1 text-green-600 dark:text-green-400 font-bold">
            <Flame className="w-4 h-4" />
            {recipe.healthyCalories} cal
          </span>
          <span className="flex items-center gap-1 text-yellow-600 dark:text-yellow-500 font-medium">
            <Star className="w-4 h-4 fill-yellow-500 dark:fill-yellow-500" />
            {recipe.rating}
          </span>
        </div>

        {/* Tags */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {recipe.tags.slice(0, 2).map(tag => (
            <span key={tag} className="px-2 py-1 rounded-md bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-300 text-[10px] font-bold uppercase tracking-wider">
              {tag}
            </span>
          ))}
          {recipe.tags.length > 2 && (
            <span className="px-2 py-1 rounded-md bg-gray-100 text-gray-600 dark:bg-dark-700 dark:text-gray-400 text-[10px] font-bold uppercase tracking-wider">
              +{recipe.tags.length - 2}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
