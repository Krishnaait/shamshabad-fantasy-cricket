import { useEffect, useState } from "react";
import { Calendar, Clock, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { useAuth } from "@/hooks/useAuth";

export default function UpcomingMatches() {
  const { isAuthenticated, user } = useAuth();

  // Fetch upcoming matches from Cricket API
  const { data: currentMatches, isLoading } = trpc.cricket.getCurrentMatches.useQuery();

  // Filter and sort upcoming matches
  const upcomingMatches = ((currentMatches as any) || [])
    .filter((m: any) => m.ms === "fixture")
    .sort((a: any, b: any) => {
      const dateA = new Date(a.dateTimeGMT || a.date).getTime();
      const dateB = new Date(b.dateTimeGMT || b.date).getTime();
      return dateA - dateB;
    });

  const formatMatchDate = (dateTimeGMT: string, date: string) => {
    const matchDate = new Date(dateTimeGMT || date);
    return matchDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatMatchTime = (dateTimeGMT: string, date: string) => {
    const matchDate = new Date(dateTimeGMT || date);
    return matchDate.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} onLogout={() => {}} />

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <Calendar className="w-8 h-8 text-green-600" />
            Upcoming Matches
          </h1>
          <p className="text-gray-600">
            {upcomingMatches.length} match{upcomingMatches.length !== 1 ? "es" : ""} scheduled
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            <p className="text-gray-600 mt-4">Loading matches...</p>
          </div>
        )}

        {/* No Matches State */}
        {!isLoading && upcomingMatches.length === 0 && (
          <Card className="bg-white">
            <CardContent className="pt-8 text-center">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Upcoming Matches</h3>
              <p className="text-gray-600">Check back later for more matches!</p>
            </CardContent>
          </Card>
        )}

        {/* Match Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {upcomingMatches.map((match: any) => (
            <Card key={match.id} className="bg-white hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                {/* Match Badge */}
                <Badge className="bg-green-100 text-green-700 mb-3">
                  {match.matchType?.toUpperCase() || "MATCH"}
                </Badge>

                {/* Match Title */}
                <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2">
                  {match.name}
                </h3>

                {/* Match Details */}
                <div className="space-y-2 mb-4">
                  {/* Date */}
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>{formatMatchDate(match.dateTimeGMT, match.date)}</span>
                  </div>

                  {/* Time */}
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>{formatMatchTime(match.dateTimeGMT, match.date)}</span>
                  </div>

                  {/* Venue */}
                  {match.venue && (
                    <div className="flex items-start gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span className="line-clamp-2">{match.venue}</span>
                    </div>
                  )}
                </div>

                {/* Team Flags */}
                {match.teamInfo && match.teamInfo.length >= 2 && (
                  <div className="flex items-center justify-center gap-4 mb-4 py-3 bg-gray-50 rounded-lg">
                    {/* Team 1 */}
                    <div className="flex flex-col items-center">
                      {match.teamInfo[0]?.img && (
                        <img
                          src={match.teamInfo[0].img}
                          alt={match.teamInfo[0].name}
                          className="w-12 h-12 rounded-full mb-1"
                        />
                      )}
                      <span className="text-xs font-medium text-gray-700">
                        {match.teamInfo[0]?.shortname}
                      </span>
                    </div>

                    <span className="text-gray-400 font-semibold">VS</span>

                    {/* Team 2 */}
                    <div className="flex flex-col items-center">
                      {match.teamInfo[1]?.img && (
                        <img
                          src={match.teamInfo[1].img}
                          alt={match.teamInfo[1].name}
                          className="w-12 h-12 rounded-full mb-1"
                        />
                      )}
                      <span className="text-xs font-medium text-gray-700">
                        {match.teamInfo[1]?.shortname}
                      </span>
                    </div>
                  </div>
                )}

                {/* Create Team Button */}
                {match.fantasyEnabled ? (
                  <Link href={`/team-builder/${match.id}`}>
                    <Button className="w-full bg-green-600 hover:bg-green-700">
                      Create Team
                    </Button>
                  </Link>
                ) : (
                  <Button className="w-full" variant="outline" disabled>
                    Squad Not Available
                  </Button>
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
