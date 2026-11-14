import React, { useState } from 'react';
import {
  BusinessFinanceState,
  CAPITAL_UPGRADES,
  UpgradeId,
  StaffWorker,
  UPGRADABLE_STATIONS,
  UpgradableStationId,
  StationTier,
  STATION_TIER_META,
  DECOR_SHOP_ITEMS,
  DecorItemId,
} from '../game/rules';

interface BizUpgradesModalProps {
  coins: number;
  finance: BusinessFinanceState;
  staff: StaffWorker[];
  stationLevels: Record<UpgradableStationId, StationTier>;
  decorOwned: Record<DecorItemId, boolean>;
  decorEquipped: Record<DecorItemId, boolean>;
  onRestockWholesale: () => void;
  onHireStaffById: (staffId: 'momo' | 'ken') => void;
  onUpgradeStation: (stationId: UpgradableStationId) => void;
  onPurchaseOrToggleDecor: (decorId: DecorItemId) => void;
  onPurchaseUpgrade: (upgradeId: UpgradeId) => void;
  onResetSave: () => void;
  onClose: () => void;
}

type ShopTab = 'all' | 'staff_machines' | 'decor' | 'contracts';

export const BizUpgradesModal: React.FC<BizUpgradesModalProps> = ({
  coins,
  finance,
  staff,
  stationLevels,
  decorOwned,
  decorEquipped,
  onRestockWholesale,
  onHireStaffById,
  onUpgradeStation,
  onPurchaseOrToggleDecor,
  onPurchaseUpgrade,
  onResetSave,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<ShopTab>('all');

  const wholesaleCogs = finance.upgrades.direct_trade_beans ? 0.5 : 2.0;
  const emergencyCogs = finance.upgrades.direct_trade_beans ? 2.5 : 4.0;
  const canAffordRestock = coins >= finance.wholesaleRestockCost;

  const activeDailyPayroll = staff
    .filter((w) => w.hired)
    .reduce((sum, w) => sum + w.dailySalary, 0);

  return (
    <div
      data-testid="biz-upgrades-modal"
      className="fixed inset-0 z-40 flex items-center justify-center p-2 sm:p-3"
      style={{ backgroundColor: 'rgba(9, 11, 14, 0.88)' }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="biz-modal-title"
    >
      <div className="gba-frame w-full max-w-3xl p-3 sm:p-4 text-[#f8fafc] max-h-[94dvh] overflow-y-auto">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b-2 border-[#334155]">
          <div>
            <h2
              id="biz-modal-title"
              className="text-xs sm:text-sm font-['Press_Start_2P'] text-[#facc15]"
            >
              📊 BIZ LEDGER, STAFF PAYROLL &amp; SHOP
            </h2>
            <p className="text-sm font-['VT323'] text-[#94a3b8]">
              Live P&amp;L Statement, Staff Recruitment, Lvl 1→3 Station Evolution &amp; Decor Customization.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span
              data-testid="biz-modal-cash"
              className="text-xs font-['Silkscreen'] font-bold text-[#facc15] bg-[#090b0e] border border-[#475569] px-2.5 py-1 tabular-nums"
            >
              CASH: ${Math.round(coins)}
            </span>
            <button
              type="button"
              data-testid="biz-reset-save-btn"
              onClick={onResetSave}
              className="gba-btn px-2 py-1 text-[8px] text-[#fb7185] cursor-pointer"
            >
              RESET SAVE
            </button>
            <button
              type="button"
              data-testid="biz-close-btn"
              onClick={onClose}
              className="gba-btn px-2.5 py-1 text-[9px] cursor-pointer"
            >
              ✕ ESC
            </button>
          </div>
        </div>

        {/* Live P&L Statement (5 Metrics including Payroll Expense) */}
        <div className="mt-2.5 grid grid-cols-2 sm:grid-cols-5 gap-1.5">
          <div className="bg-[#0b0d12] border-2 border-[#334155] p-2 text-center">
            <div className="text-[6px] font-['Press_Start_2P'] text-[#94a3b8]">GROSS REVENUE</div>
            <div
              data-testid="pnl-gross-revenue"
              className="mt-1 text-xs font-['Press_Start_2P'] text-[#4ade80] tabular-nums"
            >
              ${finance.grossRevenue.toFixed(2)}
            </div>
          </div>

          <div className="bg-[#0b0d12] border-2 border-[#334155] p-2 text-center">
            <div className="text-[6px] font-['Press_Start_2P'] text-[#94a3b8]">TOTAL COGS</div>
            <div
              data-testid="pnl-total-cogs"
              className="mt-1 text-xs font-['Press_Start_2P'] text-[#fb7185] tabular-nums"
            >
              ${finance.totalCogs.toFixed(2)}
            </div>
          </div>

          <div className="bg-[#0b0d12] border-2 border-[#334155] p-2 text-center">
            <div className="text-[6px] font-['Press_Start_2P'] text-[#94a3b8]">PAYROLL EXP</div>
            <div
              data-testid="pnl-payroll-expense"
              className="mt-1 text-xs font-['Press_Start_2P'] text-[#f97316] tabular-nums"
            >
              ${(finance.payrollExpense ?? 0).toFixed(2)}
            </div>
          </div>

          <div className="bg-[#0b0d12] border-2 border-[#334155] p-2 text-center">
            <div className="text-[6px] font-['Press_Start_2P'] text-[#94a3b8]">NET PROFIT</div>
            <div
              data-testid="pnl-net-profit"
              className="mt-1 text-xs font-['Press_Start_2P'] text-[#facc15] tabular-nums"
            >
              ${finance.netProfit.toFixed(2)}
            </div>
          </div>

          <div className="bg-[#0b0d12] border-2 border-[#334155] p-2 text-center col-span-2 sm:col-span-1">
            <div className="text-[6px] font-['Press_Start_2P'] text-[#94a3b8]">MARGIN %</div>
            <div
              data-testid="pnl-margin-pct"
              className="mt-1 text-xs font-['Press_Start_2P'] text-[#7dd3fc] tabular-nums"
            >
              {finance.profitMarginPct}%
            </div>
          </div>
        </div>

        {/* Wholesale Ingredient Restock Strip */}
        <div className="mt-2.5 bg-[#0f172a] border-2 border-[#38bdf8] p-2.5 flex flex-wrap items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[8px] font-['Press_Start_2P'] text-[#7dd3fc]">
                📦 INGREDIENT STOCK:
              </span>
              <span
                data-testid="pnl-stock-units"
                className={`text-[10px] font-['Press_Start_2P'] tabular-nums ${
                  finance.ingredientStock > 0 ? 'text-[#4ade80]' : 'text-[#fb7185]'
                }`}
              >
                {finance.ingredientStock} UNITS
              </span>
              <span className="text-[8px] font-['Press_Start_2P'] text-[#fdba74] ml-2">
                DAILY PAYROLL: ${activeDailyPayroll}/SHIFT
              </span>
            </div>
            <p className="text-sm font-['VT323'] text-[#cbd5e1] mt-0.5">
              Wholesale: ${wholesaleCogs.toFixed(2)} COGS/cup · Emergency Auto-Buy: ${emergencyCogs.toFixed(2)} COGS/cup
            </p>
          </div>

          <button
            type="button"
            data-testid="wholesale-restock-btn"
            onClick={onRestockWholesale}
            className={`gba-btn px-2.5 py-1.5 text-[8px] cursor-pointer whitespace-nowrap ${
              canAffordRestock ? 'gba-btn-active' : 'opacity-75'
            }`}
          >
            +10 WHOLESALE STOCK ($20)
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="mt-2.5 flex flex-wrap items-center gap-1.5 border-b-2 border-[#334155] pb-2">
          <button
            type="button"
            data-testid="shop-tab-all"
            onClick={() => setActiveTab('all')}
            className={`gba-btn px-2.5 py-1 text-[8px] cursor-pointer ${
              activeTab === 'all' ? 'gba-btn-active' : ''
            }`}
          >
            ★ ALL SECTIONS
          </button>
          <button
            type="button"
            data-testid="shop-tab-staff-machines"
            onClick={() => setActiveTab('staff_machines')}
            className={`gba-btn px-2.5 py-1 text-[8px] cursor-pointer ${
              activeTab === 'staff_machines' ? 'gba-btn-active' : ''
            }`}
          >
            👩‍🍳 STAFF &amp; L1→L3 MACHINES
          </button>
          <button
            type="button"
            data-testid="shop-tab-decor"
            onClick={() => setActiveTab('decor')}
            className={`gba-btn px-2.5 py-1 text-[8px] cursor-pointer ${
              activeTab === 'decor' ? 'gba-btn-active' : ''
            }`}
          >
            🎨 DECOR &amp; GARDEN SHOP (6)
          </button>
          <button
            type="button"
            data-testid="shop-tab-contracts"
            onClick={() => setActiveTab('contracts')}
            className={`gba-btn px-2.5 py-1 text-[8px] cursor-pointer ${
              activeTab === 'contracts' ? 'gba-btn-active' : ''
            }`}
          >
            📈 CAPITAL CONTRACTS (4)
          </button>
        </div>

        {/* SECTION 1: HIRE STAFF & PAYROLL ECONOMICS */}
        {(activeTab === 'all' || activeTab === 'staff_machines') && (
          <div className="mt-3">
            <div className="text-[8px] font-['Press_Start_2P'] text-[#fde047] mb-1.5">
              👩‍🍳 CAFE STAFF RECRUITMENT &amp; DAILY PAYROLL ($12/DAY SALARY)
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {staff.map((worker) => {
                const canAfford = coins >= worker.cost;
                return (
                  <div
                    key={worker.id}
                    className={`border-2 p-2.5 flex items-center justify-between gap-2 ${
                      worker.hired
                        ? 'bg-[#14532d]/40 border-[#4ade80]'
                        : 'bg-[#0b0d12] border-[#475569]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[8px] font-['Press_Start_2P'] text-[#f8fafc]">
                          {worker.name.toUpperCase()} —{' '}
                          {worker.role === 'auto_barista'
                            ? 'Sous-Barista'
                            : 'Floor & Garden Server'}
                        </span>
                      </div>
                      <p className="text-sm font-['VT323'] text-[#cbd5e1] mt-0.5">
                        {worker.id === 'momo'
                          ? 'Auto-brews Steps 1–3 at the Espresso Bar.'
                          : 'Auto-serves ready drinks & waters thirsty garden daisies.'}{' '}
                        · Salary: ${worker.dailySalary}/shift
                      </p>
                    </div>
                    <button
                      type="button"
                      data-testid={`biz-hire-${worker.id}`}
                      disabled={worker.hired}
                      onClick={() => onHireStaffById(worker.id)}
                      className={`gba-btn px-2.5 py-1.5 text-[8px] cursor-pointer shrink-0 ${
                        worker.hired
                          ? 'bg-[#166534] text-[#86efac] border-[#4ade80]'
                          : canAfford
                            ? 'gba-btn-active'
                            : ''
                      }`}
                    >
                      {worker.hired ? '✓ ON PAYROLL' : `HIRE · $${worker.cost}`}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* SECTION 2: 5 CORE STATION MULTI-TIER EQUIPMENT UPGRADES (LVL 1 -> LVL 2 -> LVL 3) */}
        {(activeTab === 'all' || activeTab === 'staff_machines') && (
          <div className="mt-3">
            <div className="text-[8px] font-['Press_Start_2P'] text-[#7dd3fc] mb-1.5">
              ⚙️ BAR EQUIPMENT EVOLUTION (LVL 1: 2.8s → LVL 2: 1.5s → LVL 3: 0.65s)
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {UPGRADABLE_STATIONS.map((st) => {
                const currentTier = stationLevels[st.id] ?? 1;
                const tierMeta = STATION_TIER_META[currentTier];
                const isMax = currentTier >= 3;
                const nextTier = isMax ? 3 : ((currentTier + 1) as StationTier);
                const cost = currentTier === 1 ? st.lvl2Cost : st.lvl3Cost;
                const canAfford = !isMax && coins >= cost;

                return (
                  <div
                    key={st.id}
                    className={`border-2 p-2.5 flex flex-col justify-between gap-2 ${
                      isMax
                        ? 'bg-[#14532d]/35 border-[#facc15]'
                        : currentTier === 2
                          ? 'bg-[#0f172a] border-[#38bdf8]'
                          : 'bg-[#0b0d12] border-[#475569]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[8px] font-['Press_Start_2P'] text-[#f8fafc]">
                          {st.name}
                        </span>
                        <span
                          data-testid={`station-tier-${st.id}`}
                          className="text-[7px] font-['Press_Start_2P'] px-1.5 py-0.5 bg-[#090b0e] text-[#facc15] border border-[#475569]"
                        >
                          LVL {currentTier} · {tierMeta.prepDuration}s
                        </span>
                      </div>
                      <div className="text-xs font-['VT323'] text-[#fde047] mt-0.5">
                        Finish: {tierMeta.subtitle}
                      </div>
                      <p className="text-xs font-['VT323'] text-[#cbd5e1] leading-tight mt-0.5">
                        {st.role}
                      </p>
                    </div>

                    <button
                      type="button"
                      data-testid={`upgrade-station-${st.id}`}
                      disabled={isMax}
                      onClick={() => onUpgradeStation(st.id)}
                      className={`gba-btn w-full py-1.5 text-[7px] cursor-pointer ${
                        isMax
                          ? 'bg-[#166534] text-[#fde047] border-[#facc15]'
                          : canAfford
                            ? 'gba-btn-active'
                            : ''
                      }`}
                    >
                      {isMax
                        ? '★ LVL 3 MASTER (0.65s)'
                        : `UPGRADE LVL ${nextTier} (${STATION_TIER_META[nextTier].prepDuration}s) · $${cost}`}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* SECTION 3: INTERIOR & OUTDOOR GARDEN DECOR CUSTOMIZATIONS (6 ITEMS) */}
        {(activeTab === 'all' || activeTab === 'decor') && (
          <div className="mt-3">
            <div className="text-[8px] font-['Press_Start_2P'] text-[#86efac] mb-1.5">
              🎨 INTERIOR &amp; BACKYARD GARDEN DECOR SHOP (6 VISUAL UPGRADES)
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {DECOR_SHOP_ITEMS.map((item) => {
                const owned = Boolean(decorOwned[item.id]);
                const equipped = Boolean(decorEquipped[item.id]);
                const canAfford = coins >= item.cost;

                return (
                  <div
                    key={item.id}
                    className={`border-2 p-2.5 flex flex-col justify-between gap-2 ${
                      owned && equipped
                        ? 'bg-[#14532d]/40 border-[#4ade80]'
                        : 'bg-[#0b0d12] border-[#475569]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[8px] font-['Press_Start_2P'] text-[#f8fafc]">
                          {item.name}
                        </span>
                        <span className="text-[7px] font-['Press_Start_2P'] text-[#7dd3fc] uppercase shrink-0">
                          {item.room} · +♥
                        </span>
                      </div>
                      <p className="text-sm font-['VT323'] text-[#cbd5e1] leading-tight mt-1">
                        {item.description}
                      </p>
                    </div>

                    <button
                      type="button"
                      data-testid={`decor-item-${item.id}`}
                      onClick={() => onPurchaseOrToggleDecor(item.id)}
                      className={`gba-btn w-full py-1.5 text-[8px] cursor-pointer ${
                        owned
                          ? equipped
                            ? 'bg-[#166534] text-[#86efac] border-[#4ade80]'
                            : ''
                          : canAfford
                            ? 'gba-btn-active'
                            : ''
                      }`}
                    >
                      {owned
                        ? equipped
                          ? '✓ EQUIPPED (TAP TO HIDE)'
                          : 'EQUIP DECOR'
                        : `BUY DECOR · $${item.cost}`}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* SECTION 4: 4 CAPITAL CONTRACTS & MERCH UPGRADES */}
        {(activeTab === 'all' || activeTab === 'contracts') && (
          <div className="mt-3">
            <div className="text-[8px] font-['Press_Start_2P'] text-[#94a3b8] mb-1.5">
              📈 CAPITAL CONTRACTS &amp; MERCH UPGRADES (4)
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {CAPITAL_UPGRADES.map((upg) => {
                const owned = finance.upgrades[upg.id];
                const canAfford = coins >= upg.cost;
                return (
                  <div
                    key={upg.id}
                    className={`border-2 p-2.5 flex flex-col justify-between gap-2 ${
                      owned
                        ? 'bg-[#14532d]/40 border-[#4ade80]'
                        : 'bg-[#0b0d12] border-[#475569]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[8px] font-['Press_Start_2P'] text-[#f8fafc]">
                          {upg.name}
                        </span>
                        <span className="text-[8px] font-['Press_Start_2P'] text-[#facc15] shrink-0">
                          {upg.shortBenefit}
                        </span>
                      </div>
                      <p className="text-sm font-['VT323'] text-[#cbd5e1] leading-tight mt-1">
                        {upg.description}
                      </p>
                    </div>

                    <button
                      type="button"
                      data-testid={`buy-upgrade-${upg.id}`}
                      disabled={owned}
                      onClick={() => onPurchaseUpgrade(upg.id)}
                      className={`gba-btn w-full py-1.5 text-[8px] cursor-pointer ${
                        owned
                          ? 'bg-[#166534] text-[#86efac] border-[#4ade80]'
                          : canAfford
                            ? 'gba-btn-active'
                            : ''
                      }`}
                    >
                      {owned ? '✓ OWNED & ACTIVE' : `BUY UPGRADE · $${upg.cost}`}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
