"use client";

import { useEffect, useState } from "react";
import { Calendar, Clock, RefreshCw, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { useAuth } from "@/hooks/useAuth";

interface Match {
  id: string;
  name: string;
  dateTimeGMT: string;
  date: string;
  venue: string;
  teams: string[];
  teamInfo: Array<{ name: string; shortname: string; img: string }>;
  ms: string;
  fantasyEnabled: boolean;
  status: string;
}

export default function UpcomingMatches() {
  const { isAuthenticated, user } = useAuth();
  const [countdowns, setCountdowns] = useState<{ [key: string]: string }>({});

  // Fetch upcoming matches
  const { data: currentMatches, isLoading } = trpc.cricket.getCurrentMatches.useQuery();

  const upcomingMatches = ((currentMatches as any) || [])
    .filter((m: any) => m.ms === "fixture")
    .sort((a: any, b: any) => {
      const dateA = new Date(a.dateTimeGMT || a.date).getTime();
      const dateB = new Date(b.dateTimeGMT || b.date).getTime();
      return dateA - dateB;
    });

  // Update countdowns every second
  useEffect(() => {
    const interval = setInterval(() => {
      const newCountdowns: { [key: string]: string } = {};

      upcomingMatches.forEach((match: Match) => {
        const matchTime = new Date(match.dateTimeGMT || match.date).getTime();
        const now = new Date().getTime();
        const diff = matchTime - now;

        if (diff <= 0) {
          newCountdowns[match.id] = "Starting now!";
        } else {
          const days = Math.floor(diff / (1000 * 60 * 60 * 24));
          const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

          if (days > 0) {
            newCountdowns[match.id] = `${days}d ${hours}h`;
          } else if (hours > 0) {
            newCountdowns[match.id] = `${hours}h ${minutes}m`;
          } else {
            newCountdowns[match.id] = `${minutes}m`;
          }
        }
      });

      setCountdowns(newCountdowns);
    }, 1000);

    return () => clearInterval(interval);
  }, [upcomingMatches]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <Header user={user} onLogout={() => {}} />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Please Login</h1>
          <p className="text-gray-400 mb-8">You need to be logged in to view upcoming matches</p>
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
            <Calendar className="w-8 h-8 text-blue-400" />
            Upcoming Matches
          </h1>
          <p className="text-gray-400">
            {upcomingMatches.length} match{upcomingMatches.length !== 1 ? "es" : ""} coming soon
          </p>
        </div>

        {isLoading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin">
              <RefreshCw className="w-8 h-8 text-blue-500" />
            </div>
            <p className="text-gray-400 mt-4">Loading upcoming matches...</p>
          </div>
        )}

        {!isLoading && upcomingMatches.length === 0 && (
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="pt-8 text-center">
              <Calendar className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No Upcoming Matches</h3>
              <p className="text-gray-400">Check back later for more matches!</p>
            </CardContent>
          </Card>
        )}

        {/* Upcoming Matches List */}
        <div className="space-y-4">
          {upcomingMatches.map((match: Match) => (
            <Card
              key={match.id}
              className="bg-slate-800 border-slate-700 hover:border-blue-500 transition-all hover:shadow-lg hover:shadow-blue-500/20"
            >
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  {/* Match Info */}
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-2">{match.name}</h3>
                    <p className="text-sm text-gray-400 mb-3">{match.venue}</p>

                    {/* Teams with Flags */}
                    <div className="flex items-center gap-4 mb-3">
                      {match.teamInfo && match.teamInfo.length >= 2 && (
                        <>
                          {/* Team 1 */}
                          <div className="flex items-center gap-2">
                            {match.teamInfo[0]?.img && (
                              <img
                                src={match.teamInfo[0].img}
                                alt={match.teamInfo[0].name}
                                className="w-8 h-8 rounded-full"
                              />
                            )}
                            <span className="text-white font-semibold">
                              {match.teamInfo[0]?.shortname}
                            </span>
                          </div>

                          <span className="text-gray-500">vs</span>

                          {/* Team 2 */}
                          <div className="flex items-center gap-2">
                            {match.teamInfo[1]?.img && (
                              <img
                                src={match.teamInfo[1].img}
                                alt={match.teamInfo[1].name}
                                className="w-8 h-8 rounded-full"
                              />
                            )}
                            <span className="text-white font-semibold">
                              {match.teamInfo[1]?.shortname}
                            </span>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Date and Time */}
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Clock className="w-4 h-4" />
                      {new Date(match.dateTimeGMT || match.date).toLocaleString()}
                    </div>
                  </div>

                  {/* Countdown and Action */}
                  <div className="flex flex-col items-end gap-3">
                    <div className="text-right">
                      <Badge className="bg-blue-600 mb-2">
                        {countdowns[match.id] || "Loading..."}
                      </Badge>
                      <p className="text-xs text-gray-400">Starts in</p>
                    </div>

                    {match.fantasyEnabled && (
                      <Link href={`/create-team/${match.id}`}>
                        <Button className="bg-green-600 hover:bg-green-700 whitespace-nowrap">
                          Create Team
                        </Button>
                      </Link>
                    )}
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
