"use client";

import { Trophy, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { useAuth } from "@/hooks/useAuth";

export default function CompletedMatches() {
  const { isAuthenticated, user } = useAuth();

  // Fetch completed matches
  const { data: currentMatches, isLoading } = trpc.cricket.getCurrentMatches.useQuery();

  const completedMatches = (currentMatches || [])
    .filter((m: any) => m.ms === "result")
    .sort((a: any, b: any) => {
      const dateA = new Date(a.dateTimeGMT || a.date).getTime();
      const dateB = new Date(b.dateTimeGMT || b.date).getTime();
      return dateB - dateA; // Most recent first
    });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <Header user={user} onLogout={() => {}} />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Please Login</h1>
          <p className="text-gray-400 mb-8">You need to be logged in to view completed matches</p>
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
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <Trophy className="w-8 h-8 text-yellow-400" />
            Completed Matches
          </h1>
          <p className="text-gray-400">
            {completedMatches.length} match{completedMatches.length !== 1 ? "es" : ""} completed
          </p>
        </div>

        {isLoading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin">
              <RefreshCw className="w-8 h-8 text-yellow-500" />
            </div>
            <p className="text-gray-400 mt-4">Loading completed matches...</p>
          </div>
        )}

        {!isLoading && completedMatches.length === 0 && (
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="pt-8 text-center">
              <Trophy className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No Completed Matches</h3>
              <p className="text-gray-400">Check back later for match results!</p>
            </CardContent>
          </Card>
        )}

        {/* Completed Matches List */}
        <div className="space-y-4">
          {completedMatches.map((match: any) => (
            <Card
              key={match.id}
              className="bg-slate-800 border-slate-700 hover:border-yellow-500 transition-all hover:shadow-lg hover:shadow-yellow-500/20"
            >
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  {/* Match Info */}
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-2">{match.name}</h3>
                    <p className="text-sm text-gray-400 mb-3">{match.venue}</p>

                    {/* Teams with Flags and Scores */}
                    <div className="space-y-2">
                      {match.teamInfo && match.teamInfo.length >= 2 && (
                        <>
                          {/* Team 1 */}
                          <div className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                            <div className="flex items-center gap-3">
                              {match.teamInfo[0]?.img && (
                                <img
                                  src={match.teamInfo[0].img}
                                  alt={match.teamInfo[0].name}
                                  className="w-8 h-8 rounded-full"
                                />
                              )}
                              <div>
                                <p className="text-white font-semibold">
                                  {match.teamInfo[0]?.name}
                                </p>
                                <p className="text-xs text-gray-400">
                                  {match.teamInfo[0]?.shortname}
                                </p>
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
                            <div className="flex items-center gap-3">
                              {match.teamInfo[1]?.img && (
                                <img
                                  src={match.teamInfo[1].img}
                                  alt={match.teamInfo[1].name}
                                  className="w-8 h-8 rounded-full"
                                />
                              )}
                              <div>
                                <p className="text-white font-semibold">
                                  {match.teamInfo[1]?.name}
                                </p>
                                <p className="text-xs text-gray-400">
                                  {match.teamInfo[1]?.shortname}
                                </p>
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
                  </div>

                  {/* Result and Action */}
                  <div className="flex flex-col items-end gap-3">
                    <Badge className="bg-yellow-600">{match.status}</Badge>
                    <Link href={`/match-details/${match.id}`}>
                      <Button variant="outline" className="whitespace-nowrap">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
