import { Trophy, Calendar, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { useAuth } from "@/hooks/useAuth";

export default function CompletedMatches() {
  const { user } = useAuth();

  // Fetch completed matches
  const { data: currentMatches, isLoading } = trpc.cricket.getCurrentMatches.useQuery();

  // Filter and sort completed matches (most recent first)
  const completedMatches = ((currentMatches as any) || [])
    .filter((m: any) => m.ms === "result")
    .sort((a: any, b: any) => {
      const dateA = new Date(a.dateTimeGMT || a.date).getTime();
      const dateB = new Date(b.dateTimeGMT || b.date).getTime();
      return dateB - dateA; // Most recent first
    });

  const formatMatchDate = (dateTimeGMT: string, date: string) => {
    const matchDate = new Date(dateTimeGMT || date);
    return matchDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} onLogout={() => {}} />

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <Trophy className="w-8 h-8 text-yellow-600" />
            Completed Matches
          </h1>
          <p className="text-gray-600">
            {completedMatches.length} match{completedMatches.length !== 1 ? "es" : ""} completed
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-600"></div>
            <p className="text-gray-600 mt-4">Loading completed matches...</p>
          </div>
        )}

        {/* No Matches State */}
        {!isLoading && completedMatches.length === 0 && (
          <Card className="bg-white">
            <CardContent className="pt-8 text-center">
              <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Completed Matches</h3>
              <p className="text-gray-600">Check back later for match results!</p>
            </CardContent>
          </Card>
        )}

        {/* Match Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {completedMatches.map((match: any) => (
            <Card key={match.id} className="bg-white hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                {/* Match Badge */}
                <Badge className="bg-yellow-100 text-yellow-700 mb-3">
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

                  {/* Venue */}
                  {match.venue && (
                    <div className="flex items-start gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span className="line-clamp-2">{match.venue}</span>
                    </div>
                  )}
                </div>

                {/* Team Scores */}
                {match.teamInfo && match.teamInfo.length >= 2 && (
                  <div className="space-y-2 mb-4">
                    {/* Team 1 */}
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        {match.teamInfo[0]?.img && (
                          <img
                            src={match.teamInfo[0].img}
                            alt={match.teamInfo[0].name}
                            className="w-8 h-8 rounded-full"
                          />
                        )}
                        <span className="font-medium text-gray-900">
                          {match.teamInfo[0]?.shortname}
                        </span>
                      </div>
                      {match.score && match.score[0] && (
                        <div className="text-right">
                          <p className="font-bold text-gray-900">
                            {match.score[0].r}/{match.score[0].w}
                          </p>
                          <p className="text-xs text-gray-600">{match.score[0].o} ov</p>
                        </div>
                      )}
                    </div>

                    {/* Team 2 */}
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        {match.teamInfo[1]?.img && (
                          <img
                            src={match.teamInfo[1].img}
                            alt={match.teamInfo[1].name}
                            className="w-8 h-8 rounded-full"
                          />
                        )}
                        <span className="font-medium text-gray-900">
                          {match.teamInfo[1]?.shortname}
                        </span>
                      </div>
                      {match.score && match.score[1] && (
                        <div className="text-right">
                          <p className="font-bold text-gray-900">
                            {match.score[1].r}/{match.score[1].w}
                          </p>
                          <p className="text-xs text-gray-600">{match.score[1].o} ov</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Match Result */}
                <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded text-center">
                  <p className="text-sm font-semibold text-yellow-800">{match.status}</p>
                </div>

                {/* View Details Button */}
                <Link href={`/team-builder/${match.id}`}>
                  <Button className="w-full" variant="outline">
                    View Details
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
