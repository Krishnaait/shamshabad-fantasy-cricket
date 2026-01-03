import { Zap, Clock, MapPin, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { useAuth } from "@/hooks/useAuth";

export default function LiveMatches() {
  const { user } = useAuth();

  // Fetch live matches with auto-refresh every 10 seconds
  const { data: currentMatches, isLoading } = trpc.cricket.getCurrentMatches.useQuery(
    undefined,
    {
      refetchInterval: 10000, // Auto-refresh every 10 seconds
    }
  );

  // Filter live matches
  const liveMatches = ((currentMatches as any) || []).filter((m: any) => m.matchStarted && !m.matchEnded);

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
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
              <Zap className="w-8 h-8 text-red-600" />
              Live Matches
            </h1>
            <p className="text-gray-600">
              {liveMatches.length} match{liveMatches.length !== 1 ? "es" : ""} currently live
            </p>
          </div>
          <Badge className="bg-red-600 animate-pulse">
            <RefreshCw className="w-3 h-3 mr-1" />
            Auto-updating
          </Badge>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
            <p className="text-gray-600 mt-4">Loading live matches...</p>
          </div>
        )}

        {/* No Live Matches State */}
        {!isLoading && liveMatches.length === 0 && (
          <Card className="bg-white">
            <CardContent className="pt-8 text-center">
              <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Live Matches</h3>
              <p className="text-gray-600 mb-6">Check back soon for live cricket action!</p>
              <Link href="/upcoming-matches">
                <Button className="bg-green-600 hover:bg-green-700">View Upcoming Matches</Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Match Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {liveMatches.map((match: any) => (
            <Card key={match.id} className="bg-white hover:shadow-lg transition-shadow border-2 border-red-200">
              <CardContent className="p-6">
                {/* Live Badge */}
                <Badge className="bg-red-600 mb-3 animate-pulse">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-white rounded-full"></span>
                    LIVE
                  </span>
                </Badge>

                {/* Match Title */}
                <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2">
                  {match.name}
                </h3>

                {/* Match Details */}
                <div className="space-y-2 mb-4">
                  {/* Date */}
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
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

                {/* Match Status */}
                <div className="mb-4 p-2 bg-green-50 border border-green-200 rounded text-center">
                  <p className="text-sm font-medium text-green-700">{match.status}</p>
                </div>

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
