import React, { useEffect } from 'react';
import { RECIPES, DrinkId, BusinessFinanceState } from '../game/rules';

interface RecipeMenuModalProps {
  cozyRating: number;
  finance: BusinessFinanceState;
  onClose: () => void;
}

const COMPACT_STEP_BADGES: Record<string, string> = {
  grinder: '1:GRIND',
  espresso: '2:SHOT',
  milk_frother: '3:FOAM',
  kettle: '4:BOIL',
  tea_leaves: '5:TEA',
  cup_counter: 'SPC:POUR',
};

export const RecipeMenuModal: React.FC<RecipeMenuModalProps> = ({
  cozyRating,
  finance,
  onClose,
}) => {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const discount = finance.upgrades.direct_trade_beans ? 1.5 : 0;
  const wholesaleCogs = Math.max(0.5, Number((2.0 - discount).toFixed(2)));
  const emergencyCogs = Math.max(0.5, Number((4.0 - discount).toFixed(2)));
  const activeUnitCogs = finance.ingredientStock > 0 ? wholesaleCogs : emergencyCogs;
  const sleeveBonus = finance.upgrades.custom_sleeves ? 4 : 0;
  const cozyBonus = cozyRating >= 80 ? 5 : cozyRating >= 60 ? 3 : 0;

  const drinkKeys: DrinkId[] = [
    'miata_mocha',
    'daisy_vanilla_latte',
    'catnip_herbal_tea',
    'midnight_cold_brew',
  ];

  return (
    <div
      data-testid="recipe-menu-modal"
      className="fixed inset-0 z-40 flex items-center justify-center p-2 sm:p-4"
      style={{ backgroundColor: 'rgba(7, 9, 14, 0.88)' }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="recipe-menu-title"
    >
      <div className="gba-frame w-full max-w-2xl p-3 sm:p-4 text-[#f8fafc] max-h-[94dvh] overflow-y-auto">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b-2 border-[#334155]">
          <div>
            <h2
              id="recipe-menu-title"
              className="text-xs sm:text-sm font-['Silkscreen'] font-bold text-[#facc15]"
            >
              📖 KLASIK CAFE RECIPE &amp; PROFIT MARGIN GUIDE
            </h2>
            <p className="text-base font-['VT323'] text-[#cbd5e1]">
              Exact 3-step station sequence, live selling price (+${cozyBonus} Cozy Bonus
              {sleeveBonus > 0 ? `, +$${sleeveBonus} Sleeve` : ''}), COGS &amp; Net Profit/cup.
            </p>
          </div>
          <button
            type="button"
            data-testid="close-recipe-menu-btn"
            onClick={onClose}
            className="gba-btn px-2.5 py-1 text-[9px] cursor-pointer"
          >
            ✕ ESC
          </button>
        </div>

        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {drinkKeys.map((drinkId) => {
            const recipe = RECIPES[drinkId];
            const sellPrice = recipe.price + sleeveBonus + cozyBonus;
            const netProfit = Number((sellPrice - activeUnitCogs).toFixed(2));
            const marginPct = Math.round((netProfit / sellPrice) * 100);

            return (
              <div
                key={drinkId}
                data-testid={`recipe-card-${drinkId}`}
                className="bg-[#0b0d12] border-2 border-[#475569] p-3 flex flex-col justify-between gap-2"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3.5 h-3.5 inline-block border border-[#f8fafc] shrink-0"
                        style={{ backgroundColor: recipe.color }}
                      />
                      <span className="text-[10px] font-['Silkscreen'] font-bold text-[#f8fafc]">
                        {recipe.name}
                      </span>
                    </div>
                    <span className="text-[10px] font-['Silkscreen'] font-bold text-[#4ade80] tabular-nums">
                      ${sellPrice}
                    </span>
                  </div>

                  <p className="text-base font-['VT323'] text-[#94a3b8] leading-tight mt-1">
                    {recipe.description}
                  </p>

                  {/* 3-Step Prep Sequence */}
                  <div className="mt-2 flex flex-wrap items-center gap-1">
                    {recipe.steps.map((stId, idx) => (
                      <React.Fragment key={`${drinkId}-step-${idx}`}>
                        <span className="px-1.5 py-0.5 bg-[#1e293b] border border-[#cbd5e1] text-[9px] font-['Silkscreen'] text-[#fde047]">
                          {COMPACT_STEP_BADGES[stId] ?? stId.toUpperCase()}
                        </span>
                        {idx < recipe.steps.length - 1 && (
                          <span className="text-[9px] font-['Silkscreen'] text-[#64748b]">→</span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>

                {/* Economics Row */}
                <div className="pt-2 border-t border-[#1e293b] flex items-center justify-between text-[9px] font-['Silkscreen'] tabular-nums">
                  <span className="text-[#fb7185]">COGS: -${activeUnitCogs.toFixed(2)}</span>
                  <span className="text-[#facc15]">
                    NET: +${netProfit.toFixed(2)} ({marginPct}%)
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-3 bg-[#0f172a] border-2 border-[#38bdf8] p-2.5 flex flex-wrap items-center justify-between gap-2">
          <div className="text-base font-['VT323'] text-[#cbd5e1]">
            💡 Tip: Tap <strong className="text-[#facc15]">⚡ BREW / SERVE</strong> (or press{' '}
            <strong className="text-[#facc15]">[1–5]</strong> +{' '}
            <strong className="text-[#facc15]">[Space]</strong> +{' '}
            <strong className="text-[#facc15]">[Enter]</strong>) to craft any guest&apos;s order automatically!
          </div>
          <button
            type="button"
            onClick={onClose}
            className="gba-btn gba-btn-active px-3 py-1 text-[9px] cursor-pointer"
          >
            GOT IT ►
          </button>
        </div>
      </div>
    </div>
  );
};
