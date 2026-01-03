"use client";

import { useEffect, useState } from "react";
import { Trophy, Zap, RefreshCw, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { useAuth } from "@/hooks/useAuth";

export default function LiveMatches() {
  const { isAuthenticated, user } = useAuth();
  const [refreshKey, setRefreshKey] = useState(0);

  // Fetch live matches
  const { data: currentMatches, isLoading } = trpc.cricket.getCurrentMatches.useQuery(
    undefined,
    {
      refetchInterval: 10000, // Auto-refresh every 10 seconds
    }
  );

  const liveMatches = (currentMatches || []).filter((m: any) => m.ms === "live");

  const handleManualRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <Header user={user} onLogout={() => {}} />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Please Login</h1>
          <p className="text-gray-400 mb-8">You need to be logged in to view live matches</p>
          <Link href="/login">
            <Button className="bg-green-600 hover:bg-green-700">Login</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header user={user} onLogout={() => {}} />

      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
              <Zap className="w-8 h-8 text-yellow-400" />
              Live Matches
            </h1>
            <p className="text-gray-400">
              {liveMatches.length} match{liveMatches.length !== 1 ? "es" : ""} currently live
            </p>
          </div>
          <Button
            onClick={handleManualRefresh}
            variant="outline"
            className="flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
        </div>

        {isLoading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin">
              <RefreshCw className="w-8 h-8 text-green-500" />
            </div>
            <p className="text-gray-400 mt-4">Loading live matches...</p>
          </div>
        )}

        {!isLoading && liveMatches.length === 0 && (
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="pt-8 text-center">
              <Clock className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No Live Matches</h3>
              <p className="text-gray-400 mb-6">Check back soon for live cricket action!</p>
              <Link href="/upcoming-matches">
                <Button className="bg-green-600 hover:bg-green-700">View Upcoming Matches</Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Live Matches Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {liveMatches.map((match: any) => (
            <Card
              key={match.id}
              className="bg-slate-800 border-slate-700 hover:border-green-500 transition-all hover:shadow-lg hover:shadow-green-500/20"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <Badge className="bg-red-600 mb-2 animate-pulse">LIVE</Badge>
                    <CardTitle className="text-lg text-white">{match.name}</CardTitle>
                    <p className="text-sm text-gray-400 mt-1">{match.venue}</p>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                {/* Team Flags and Scores */}
                <div className="space-y-4">
                  {match.teamInfo && match.teamInfo.length >= 2 && (
                    <>
                      {/* Team 1 */}
                      <div className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                        <div className="flex items-center gap-3 flex-1">
                          {match.teamInfo[0]?.img && (
                            <img
                              src={match.teamInfo[0].img}
                              alt={match.teamInfo[0].name}
                              className="w-10 h-10 rounded-full"
                            />
                          )}
                          <div>
                            <p className="text-white font-semibold">{match.teamInfo[0]?.name}</p>
                            <p className="text-xs text-gray-400">{match.teamInfo[0]?.shortname}</p>
                          </div>
                        </div>
                        {match.score && match.score[0] && (
                          <div className="text-right">
                            <p className="text-white font-bold">
                              {match.score[0].r}/{match.score[0].w}
                            </p>
                            <p className="text-xs text-gray-400">{match.score[0].o} ov</p>
                          </div>
                        )}
                      </div>

                      {/* Team 2 */}
                      <div className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                        <div className="flex items-center gap-3 flex-1">
                          {match.teamInfo[1]?.img && (
                            <img
                              src={match.teamInfo[1].img}
                              alt={match.teamInfo[1].name}
                              className="w-10 h-10 rounded-full"
                            />
                          )}
                          <div>
                            <p className="text-white font-semibold">{match.teamInfo[1]?.name}</p>
                            <p className="text-xs text-gray-400">{match.teamInfo[1]?.shortname}</p>
                          </div>
                        </div>
                        {match.score && match.score[1] && (
                          <div className="text-right">
                            <p className="text-white font-bold">
                              {match.score[1].r}/{match.score[1].w}
                            </p>
                            <p className="text-xs text-gray-400">{match.score[1].o} ov</p>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>

                {/* Match Status */}
                <div className="mt-4 p-3 bg-green-900/30 border border-green-700 rounded-lg">
                  <p className="text-sm text-green-300 font-semibold">Status: {match.status}</p>
                </div>

                {/* Create Team Button */}
                {match.fantasyEnabled && (
                  <Link href={`/create-team/${match.id}`}>
                    <Button className="w-full mt-4 bg-green-600 hover:bg-green-700">
                      Create Team
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
