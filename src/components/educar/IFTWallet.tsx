import { motion } from "framer-motion";
import { Coins, Flame, Award, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface IFTWalletProps {
  xp: number;
  streak: number;
  badges: string[];
  level: number;
}

export default function IFTWallet({ xp, streak, badges, level }: IFTWalletProps) {
  const nextLevelXP = level * 200;
  const progressPct = Math.min((xp / nextLevelXP) * 100, 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-border bg-gradient-to-r from-card to-primary/[0.03] p-4 shadow-card"
    >
      <div className="flex items-center gap-4 flex-wrap">
        {/* XP / IFT coins */}
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-[hsl(var(--accent)/0.15)] flex items-center justify-center">
            <Coins className="h-4.5 w-4.5 text-[hsl(var(--accent))]" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">IFT Coins</p>
            <motion.p
              key={xp}
              initial={{ scale: 1.3 }}
              animate={{ scale: 1 }}
              className="text-lg font-bold text-foreground"
            >
              {xp}
            </motion.p>
          </div>
        </div>

        {/* Level */}
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
            <TrendingUp className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Nível</p>
            <p className="text-lg font-bold text-foreground">{level}</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="flex-1 min-w-[120px]">
          <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
            <span>{xp} XP</span>
            <span>{nextLevelXP} XP</span>
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full rounded-full bg-gradient-to-r from-primary to-[hsl(var(--accent))]"
            />
          </div>
        </div>

        {/* Streak */}
        {streak > 0 && (
          <Badge className="bg-[hsl(var(--copsoq-prevencao)/0.15)] text-[hsl(var(--copsoq-prevencao))] border-0 gap-1">
            <Flame className="h-3.5 w-3.5" /> {streak} dias
          </Badge>
        )}

        {/* Badges */}
        {badges.length > 0 && (
          <div className="flex items-center gap-1">
            {badges.slice(0, 3).map((b) => (
              <Badge key={b} variant="outline" className="text-[9px] gap-0.5">
                <Award className="h-2.5 w-2.5" /> {b}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
