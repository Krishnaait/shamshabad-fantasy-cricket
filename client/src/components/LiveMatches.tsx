import { useEffect, useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface Match {
  id: string;
  name: string;
  matchType: string;
  status: string;
  dateTimeGMT: string;
  teams: string[];
  teamInfo: Array<{
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
  matchStarted?: boolean;
  matchEnded?: boolean;
}

export function LiveMatches() {
  const [liveMatches, setLiveMatches] = useState<Match[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { data: allMatches = [], isLoading, refetch } = trpc.cricket.getMatchesByStatus.useQuery(
    { status: "live" },
    {
      refetchInterval: 15000, // Auto-refresh every 15 seconds
    }
  );

  useEffect(() => {
    if (allMatches) {
      setLiveMatches(allMatches);
    }
  }, [allMatches]);

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  };

  if (isLoading && liveMatches.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">🔴 Live Matches</h2>
        </div>
        <div className="text-center py-8 text-gray-400">Loading live matches...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-bold text-white">🔴 Live Matches</h2>
          <Badge variant="destructive" className="animate-pulse">
            LIVE
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

      {liveMatches.length === 0 ? (
        <Card className="bg-gray-900 border-gray-800 p-8 text-center">
          <p className="text-gray-400">No live matches at the moment</p>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {liveMatches.map((match) => (
            <Card key={match.id} className="bg-gray-900 border-red-500/30 hover:border-red-500/60 transition-colors overflow-hidden">
              <div className="bg-gradient-to-r from-red-900/20 to-transparent p-4">
                <div className="flex items-center justify-between mb-3">
                  <Badge variant="destructive" className="animate-pulse text-xs">
                    LIVE
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
                      <span className="text-sm font-semibold text-white truncate">{match.t1 || match.teams?.[0]}</span>
                    </div>
                    {match.score && match.score[0] && (
                      <span className="text-lg font-bold text-green-400 ml-2">
                        {match.score[0].r}/{match.score[0].w}
                        <span className="text-xs text-gray-400 ml-1">({match.score[0].o})</span>
                      </span>
                    )}
                  </div>

                  {/* Team 2 */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 flex-1">
                      {match.t2img && (
                        <img src={match.t2img} alt={match.t2} className="w-8 h-8 rounded-full" />
                      )}
                      <span className="text-sm font-semibold text-white truncate">{match.t2 || match.teams?.[1]}</span>
                    </div>
                    {match.score && match.score[1] && (
                      <span className="text-lg font-bold text-blue-400 ml-2">
                        {match.score[1].r}/{match.score[1].w}
                        <span className="text-xs text-gray-400 ml-1">({match.score[1].o})</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Status */}
                <div className="mt-3 pt-3 border-t border-gray-700">
                  <p className="text-xs text-gray-400 line-clamp-2">{match.status}</p>
                </div>

                {/* Action Button */}
                <Button className="w-full mt-3 bg-green-600 hover:bg-green-700 text-white">
                  Watch Live
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
