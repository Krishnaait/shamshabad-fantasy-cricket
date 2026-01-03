import React, { useEffect, useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, RefreshCw } from "lucide-react";

interface Match {
  id: string;
  name: string;
  matchType: string;
  status: string;
  dateTimeGMT: string;
  teams?: string[];
  teamInfo?: Array<{
    name: string;
    shortname: string;
    img: string;
  }>;
  ms?: string;
  t1?: string;
  t2?: string;
  t1img?: string;
  t2img?: string;
}

interface MatchWithCountdown extends Match {
  countdown: string;
}

export function UpcomingMatches() {
  const [upcomingMatches, setUpcomingMatches] = useState<MatchWithCountdown[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Fetch upcoming matches (fixture status)
  const { data: allMatches = [], isLoading, refetch } = trpc.cricket.getMatchesByStatus.useQuery(
    { status: "fixture" },
    {
      refetchInterval: 15000, // Auto-refresh every 15 seconds
    }
  );

  // Update countdown timers every second
  useEffect(() => {
    const timer = setInterval(() => {
      setUpcomingMatches((prev) =>
        prev.map((match) => ({
          ...match,
          countdown: calculateCountdown(match.dateTimeGMT),
        }))
      );
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (allMatches && Array.isArray(allMatches)) {
      // Map API response to component format
      const upcoming = allMatches.map((match: any) => ({
        id: match.id || "",
        name: match.name || "",
        matchType: match.matchType || "T20",
        status: match.status || "",
        dateTimeGMT: match.dateTimeGMT || "",
        teams: match.teams || [],
        teamInfo: match.teamInfo || [],
        ms: match.ms || "fixture",
        t1: match.t1 || "",
        t2: match.t2 || "",
        t1img: match.t1img || "",
        t2img: match.t2img || "",
        countdown: calculateCountdown(match.dateTimeGMT || ""),
      }));
      setUpcomingMatches(upcoming);
    }
  }, [allMatches]);

  const calculateCountdown = (dateTimeGMT: string): string => {
    if (!dateTimeGMT) return "Time TBA";
    
    try {
      const matchTime = new Date(dateTimeGMT).getTime();
      const now = new Date().getTime();
      const diff = matchTime - now;

      if (diff <= 0) return "Starting soon...";

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      if (days > 0) {
        return `${days}d ${hours}h ${minutes}m`;
      } else if (hours > 0) {
        return `${hours}h ${minutes}m ${seconds}s`;
      } else {
        return `${minutes}m ${seconds}s`;
      }
    } catch (error) {
      return "Time TBA";
    }
  };

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  };

  if (isLoading && upcomingMatches.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">⏰ Upcoming Matches</h2>
        </div>
        <div className="text-center py-8 text-gray-400">Loading upcoming matches...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-bold text-white">⏰ Upcoming Matches</h2>
          <Badge variant="secondary" className="bg-blue-900/50">
            {upcomingMatches.length}
          </Badge>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleManualRefresh}
          disabled={isRefreshing}
          className="gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {upcomingMatches.length === 0 ? (
        <Card className="bg-gray-900 border-gray-800 p-8 text-center">
          <p className="text-gray-400">No upcoming matches scheduled</p>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {upcomingMatches.map((match) => (
            <Card key={match.id} className="bg-gray-900 border-blue-500/30 hover:border-blue-500/60 transition-colors overflow-hidden">
              <div className="bg-gradient-to-r from-blue-900/20 to-transparent p-4">
                {/* Countdown Timer */}
                <div className="flex items-center justify-between mb-3">
                  <Badge variant="outline" className="border-blue-500 text-blue-400 text-xs gap-1">
                    <Clock className="w-3 h-3" />
                    {match.countdown}
                  </Badge>
                  <span className="text-xs text-gray-400">{match.matchType.toUpperCase()}</span>
                </div>

                {/* Teams */}
                <div className="space-y-3">
                  {/* Team 1 */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 flex-1">
                      {match.t1img && (
                        <img src={match.t1img} alt={match.t1} className="w-8 h-8 rounded-full" />
                      )}
                      <span className="text-sm font-semibold text-white truncate">{match.t1 || match.teams?.[0] || "Team 1"}</span>
                    </div>
                  </div>

                  <div className="text-center text-xs text-gray-500">VS</div>

                  {/* Team 2 */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 flex-1">
                      {match.t2img && (
                        <img src={match.t2img} alt={match.t2} className="w-8 h-8 rounded-full" />
                      )}
                      <span className="text-sm font-semibold text-white truncate">{match.t2 || match.teams?.[1] || "Team 2"}</span>
                    </div>
                  </div>
                </div>

                {/* Match Time */}
                <div className="mt-3 pt-3 border-t border-gray-700">
                  <p className="text-xs text-gray-400">
                    {new Date(match.dateTimeGMT).toLocaleString("en-IN", {
                      dateStyle: "short",
                      timeStyle: "short",
                      timeZone: "Asia/Kolkata",
                    })}
                  </p>
                </div>

                {/* Action Button */}
                <Button className="w-full mt-3 bg-blue-600 hover:bg-blue-700 text-white">
                  Create Team
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Auto-refresh indicator */}
      <div className="text-xs text-gray-500 text-center">
        Auto-refreshing every 15 seconds...
      </div>
    </div>
  );
}
