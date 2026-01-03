import React, { useEffect, useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trophy, RefreshCw } from "lucide-react";

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
  score?: Array<{
    r: number;
    w: number;
    o: number;
    inning: string;
  }>;
  ms?: string;
  t1?: string;
  t2?: string;
  t1img?: string;
  t2img?: string;
  matchWinner?: string;
  matchStarted?: boolean;
  matchEnded?: boolean;
}

export function CompletedMatches() {
  const [completedMatches, setCompletedMatches] = useState<Match[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { data: allMatches = [], isLoading, refetch } = trpc.cricket.getMatchesByStatus.useQuery(
    { status: "result" },
    {
      refetchInterval: 15000, // Auto-refresh every 15 seconds
    }
  );

  useEffect(() => {
    if (allMatches && Array.isArray(allMatches)) {
      // Sort by date, newest first
      const completed = [...allMatches].sort((a: any, b: any) => {
        return new Date(b.dateTimeGMT).getTime() - new Date(a.dateTimeGMT).getTime();
      });
      setCompletedMatches(completed);
    }
  }, [allMatches]);

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  };

  if (isLoading && completedMatches.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">🏆 Completed Matches</h2>
        </div>
        <div className="text-center py-8 text-gray-400">Loading completed matches...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-bold text-white">🏆 Completed Matches</h2>
          <Badge variant="secondary" className="bg-yellow-900/50">
            {completedMatches.length}
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

      {completedMatches.length === 0 ? (
        <Card className="bg-gray-900 border-gray-800 p-8 text-center">
          <p className="text-gray-400">No completed matches yet</p>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {completedMatches.map((match) => {
            // Determine winner
            const team1Score = match.score?.[0];
            const team2Score = match.score?.[1];
            const team1Name = match.t1 || match.teams?.[0];
            const team2Name = match.t2 || match.teams?.[1];

            return (
              <Card key={match.id} className="bg-gray-900 border-yellow-600/30 hover:border-yellow-600/60 transition-colors overflow-hidden">
                <div className="bg-gradient-to-r from-yellow-900/20 to-transparent p-4">
                  {/* Badge */}
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant="outline" className="border-yellow-600 text-yellow-400 text-xs gap-1">
                      <Trophy className="w-3 h-3" />
                      COMPLETED
                    </Badge>
                    <span className="text-xs text-gray-400">{match.matchType.toUpperCase()}</span>
                  </div>

                  {/* Teams with Scores */}
                  <div className="space-y-3">
                    {/* Team 1 */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 flex-1">
                        {match.t1img && (
                          <img src={match.t1img} alt={team1Name} className="w-8 h-8 rounded-full" />
                        )}
                        <span className="text-sm font-semibold text-white truncate">{team1Name}</span>
                      </div>
                      {team1Score && (
                        <span className="text-lg font-bold text-green-400 ml-2">
                          {team1Score.r}/{team1Score.w}
                          <span className="text-xs text-gray-400 ml-1">({team1Score.o})</span>
                        </span>
                      )}
                    </div>

                    {/* Team 2 */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 flex-1">
                        {match.t2img && (
                          <img src={match.t2img} alt={team2Name} className="w-8 h-8 rounded-full" />
                        )}
                        <span className="text-sm font-semibold text-white truncate">{team2Name}</span>
                      </div>
                      {team2Score && (
                        <span className="text-lg font-bold text-blue-400 ml-2">
                          {team2Score.r}/{team2Score.w}
                          <span className="text-xs text-gray-400 ml-1">({team2Score.o})</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Result */}
                  <div className="mt-3 pt-3 border-t border-gray-700">
                    <p className="text-xs text-gray-400 line-clamp-2">{match.status}</p>
                  </div>

                  {/* Action Button */}
                  <Button className="w-full mt-3 bg-yellow-600 hover:bg-yellow-700 text-white">
                    View Details
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Auto-refresh indicator */}
      <div className="text-xs text-gray-500 text-center">
        Auto-refreshing every 15 seconds...
      </div>
    </div>
  );
}
