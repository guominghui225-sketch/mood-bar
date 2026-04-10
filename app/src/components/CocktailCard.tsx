import type { Cocktail } from '@/types';

interface CocktailCardProps {
  cocktail: Cocktail;
  onRemix: () => void;
  onShare: () => void;
}

const CocktailCard = ({ cocktail, onRemix, onShare }: CocktailCardProps) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 py-8 animate-scale-in">
      {/* Card */}
      <div className="w-full max-w-sm card-mood overflow-hidden">
        {/* Cocktail Image */}
        <div className="relative w-full aspect-square overflow-hidden">
          <img
            src={cocktail.imageUrl}
            alt={cocktail.name}
            className="w-full h-full object-cover"
          />
          {/* Image overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-mood-card via-transparent to-transparent" />
        </div>

        {/* Card Content */}
        <div className="p-6">
          {/* Cocktail Name */}
          <h2 className="font-serif text-2xl font-bold text-mood-cream mb-1">
            {cocktail.name}
          </h2>

          {/* Brand */}
          <p className="font-sans text-xs text-mood-text-muted tracking-wider mb-4">
            Mood Bar
          </p>

          {/* Divider */}
          <div className="w-full h-px bg-mood-gold/30 mb-4" />

          {/* Ingredients */}
          <div className="mb-4">
            <p className="font-sans text-xs text-mood-text-muted mb-2">原料</p>
            <div className="flex flex-wrap gap-2">
              {cocktail.ingredients.map((ingredient, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-mood-dark/50 rounded-full text-xs text-mood-text border border-mood-gold/20"
                >
                  {ingredient}
                </span>
              ))}
            </div>
          </div>

          {/* Alcohol Content */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="font-sans text-xs text-mood-text-muted">酒精度数</span>
              <span className="font-serif text-lg font-bold text-mood-gold">
                {cocktail.alcoholContent}%
              </span>
            </div>
            {/* Progress bar */}
            <div className="w-full h-1.5 bg-mood-dark rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-mood-gold to-mood-gold-light rounded-full transition-all duration-1000"
                style={{ width: `${(cocktail.alcoholContent / 15) * 100}%` }}
              />
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <p className="font-sans text-sm text-mood-gold-light text-center leading-relaxed italic">
              &ldquo;{cocktail.description}&rdquo;
            </p>
          </div>


          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={onRemix}
              className="flex-1 py-3 px-4 rounded-xl border border-mood-gold text-mood-gold font-medium text-sm transition-all duration-200 hover:bg-mood-gold/10 active:scale-95 touch-manipulation"
            >
              再摇一杯
            </button>
            <button
              onClick={onShare}
              className="flex-1 py-3 px-4 rounded-xl bg-mood-gold text-mood-dark font-medium text-sm transition-all duration-200 hover:brightness-110 active:scale-95 touch-manipulation"
            >
              保存图片
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CocktailCard;
