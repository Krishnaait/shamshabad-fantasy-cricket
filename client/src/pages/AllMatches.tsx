import React, { useEffect, useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, RefreshCw, ArrowLeft } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLocation } from "wouter";

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
  t1: string;
  t2: string;
  t1img?: string;
  t2img?: string;
}

interface MatchWithCountdown extends Match {
  countdown: string;
}

export default function AllMatches() {
  const [, setLocation] = useLocation();
  const [upcomingMatches, setUpcomingMatches] = useState<MatchWithCountdown[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Fetch all upcoming matches (fixture status)
  const { data: allMatches = [], isLoading, refetch } = trpc.cricket.getMatchesByStatus.useQuery(
    { status: "fixture" },
    {
      refetchInterval: 30000, // Auto-refresh every 30 seconds
    }
  );

  // Fetch all completed matches
  const { data: allCompletedMatches = [], isLoading: isCompletedLoading } = trpc.cricket.getMatchesByStatus.useQuery(
    { status: "result" },
    {
      refetchInterval: 60000,
    }
  );

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

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  };

  const [activeTab, setActiveTab] = useState<"upcoming" | "completed">("upcoming");

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 pt-24 pb-12">
        <div className="container px-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setLocation("/")}
                className="rounded-full"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-white">
                  {activeTab === "upcoming" ? "All Upcoming Matches" : "All Completed Matches"}
                </h1>
                <p className="text-gray-400">
                  {activeTab === "upcoming" 
                    ? "Browse and join upcoming cricket contests" 
                    : "Review past match results and performances"}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex bg-gray-900 p-1 rounded-lg border border-gray-800">
                <Button
                  variant={activeTab === "upcoming" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveTab("upcoming")}
                  className="h-8"
                >
                  Upcoming
                </Button>
                <Button
                  variant={activeTab === "completed" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveTab("completed")}
                  className="h-8"
                >
                  Completed
                </Button>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleManualRefresh}
                disabled={isRefreshing || isLoading}
                className="gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
                Refresh
              </Button>
            </div>
          </div>

          {activeTab === "upcoming" ? (
            isLoading && upcomingMatches.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20">
                <RefreshCw className="w-10 h-10 animate-spin text-blue-500 mb-4" />
                <p className="text-gray-400">Fetching latest match data...</p>
              </div>
            ) : upcomingMatches.length === 0 ? (
              <Card className="bg-gray-900 border-gray-800 p-12 text-center">
                <div className="text-5xl mb-4">🏏</div>
                <h3 className="text-xl font-bold text-white mb-2">No Matches Found</h3>
                <p className="text-gray-400 max-w-md mx-auto">
                  There are currently no upcoming matches scheduled. Please check back later for new series and tournaments.
                </p>
                <Button 
                  className="mt-6 bg-blue-600 hover:bg-blue-700"
                  onClick={() => setLocation("/")}
                >
                  Back to Home
                </Button>
              </Card>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {upcomingMatches.map((match) => (
                  <Card key={match.id} className="bg-gray-900 border-gray-800 hover:border-blue-500/50 transition-all overflow-hidden group">
                    <div className="p-5">
                      <div className="flex items-center justify-between mb-4">
                        <Badge variant="outline" className="border-blue-500/50 text-blue-400 text-xs gap-1 font-mono">
                          <Clock className="w-3 h-3" />
                          {match.countdown}
                        </Badge>
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                          {match.matchType}
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-4 mb-6">
                        <div className="flex flex-col items-center text-center flex-1 gap-2">
                          <div className="w-14 h-14 rounded-full bg-gray-800 flex items-center justify-center overflow-hidden border-2 border-gray-700 group-hover:border-blue-500/30 transition-colors">
                            {match.t1img ? (
                              <img src={match.t1img} alt={match.t1} className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-xl font-bold text-gray-600">{match.t1?.substring(0, 2).toUpperCase() || "T1"}</span>
                            )}
                          </div>
                          <span className="text-sm font-bold text-white line-clamp-1">{match.t1 || match.teams?.[0] || "Team 1"}</span>
                        </div>

                        <div className="flex flex-col items-center">
                          <div className="text-xs font-black text-gray-700 italic">VS</div>
                        </div>

                        <div className="flex flex-col items-center text-center flex-1 gap-2">
                          <div className="w-14 h-14 rounded-full bg-gray-800 flex items-center justify-center overflow-hidden border-2 border-gray-700 group-hover:border-blue-500/30 transition-colors">
                            {match.t2img ? (
                              <img src={match.t2img} alt={match.t2} className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-xl font-bold text-gray-600">{match.t2?.substring(0, 2).toUpperCase() || "T2"}</span>
                            )}
                          </div>
                          <span className="text-sm font-bold text-white line-clamp-1">{match.t2 || match.teams?.[1] || "Team 2"}</span>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-xs text-gray-400 bg-gray-800/50 p-2 rounded">
                          <span>Match Date:</span>
                          <span className="text-gray-200 font-medium">
                            {new Date(match.dateTimeGMT).toLocaleString("en-IN", {
                              dateStyle: "medium",
                              timeStyle: "short",
                              timeZone: "Asia/Kolkata",
                            })}
                          </span>
                        </div>
                        
                        <Button 
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-900/20"
                          onClick={() => setLocation(`/team-builder/${match.id}`)}
                        >
                          Create Team
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )
          ) : (
            isCompletedLoading && allCompletedMatches.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20">
                <RefreshCw className="w-10 h-10 animate-spin text-yellow-500 mb-4" />
                <p className="text-gray-400">Fetching completed matches...</p>
              </div>
            ) : allCompletedMatches.length === 0 ? (
              <Card className="bg-gray-900 border-gray-800 p-12 text-center">
                <div className="text-5xl mb-4">🏆</div>
                <h3 className="text-xl font-bold text-white mb-2">No Completed Matches</h3>
                <p className="text-gray-400 max-w-md mx-auto">
                  There are no recently completed matches to display.
                </p>
              </Card>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {allCompletedMatches.map((match: any) => (
                  <Card key={match.id} className="bg-gray-900 border-gray-800 hover:border-yellow-500/50 transition-all overflow-hidden group">
                    <div className="p-5">
                      <div className="flex items-center justify-between mb-4">
                        <Badge variant="outline" className="border-yellow-500/50 text-yellow-400 text-xs gap-1 font-mono">
                          🏆 COMPLETED
                        </Badge>
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                          {match.matchType}
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-4 mb-6">
                        <div className="flex flex-col items-center text-center flex-1 gap-2">
                          <div className="w-14 h-14 rounded-full bg-gray-800 flex items-center justify-center overflow-hidden border-2 border-gray-700 group-hover:border-yellow-500/30 transition-colors">
                            {match.t1img ? (
                              <img src={match.t1img} alt={match.t1} className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-xl font-bold text-gray-600">{match.t1?.substring(0, 2).toUpperCase() || "T1"}</span>
                            )}
                          </div>
                          <span className="text-sm font-bold text-white line-clamp-1">{match.t1 || match.teams?.[0] || "Team 1"}</span>
                        </div>

                        <div className="flex flex-col items-center">
                          <div className="text-xs font-black text-gray-700 italic">VS</div>
                        </div>

                        <div className="flex flex-col items-center text-center flex-1 gap-2">
                          <div className="w-14 h-14 rounded-full bg-gray-800 flex items-center justify-center overflow-hidden border-2 border-gray-700 group-hover:border-yellow-500/30 transition-colors">
                            {match.t2img ? (
                              <img src={match.t2img} alt={match.t2} className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-xl font-bold text-gray-600">{match.t2?.substring(0, 2).toUpperCase() || "T2"}</span>
                            )}
                          </div>
                          <span className="text-sm font-bold text-white line-clamp-1">{match.t2 || match.teams?.[1] || "Team 2"}</span>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="text-xs text-gray-400 bg-gray-800/50 p-2 rounded text-center">
                          {match.status}
                        </div>
                        
                        <Button 
                          className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-bold shadow-lg shadow-yellow-900/20"
                          onClick={() => window.open(`https://www.cricbuzz.com/cricket-match-highlights/${match.id}`, '_blank')}
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
