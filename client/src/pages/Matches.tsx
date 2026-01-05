import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, Loader2, Trophy, Calendar, MapPin } from "lucide-react";

export function Matches() {
  const [, navigate] = useLocation();
  const [selectedTab, setSelectedTab] = useState("upcoming");

  // Fetch current matches (includes live and upcoming)
  const { data: currentMatches, isLoading: isLoadingCurrent } =
    trpc.cricket.getCurrentMatches.useQuery();

  // Fetch completed matches
  const { data: completedMatches, isLoading: isLoadingCompleted } =
    trpc.cricket.getMatches.useQuery();

  // Categorize matches
  const liveMatches = currentMatches?.filter((m) => m.matchStarted && !m.matchEnded) || [];
  const upcomingMatches = currentMatches?.filter((m) => !m.matchStarted) || [];
  const completed = completedMatches?.filter((m) => m.matchEnded) || [];

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Asia/Kolkata",
      });
    } catch {
      return dateStr;
    }
  };

  const MatchCard = ({ match }: { match: any }) => (
    <Card className="p-4 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-sm mb-1">{match.name}</h3>
          <p className="text-xs text-gray-500">{match.matchType}</p>
        </div>
        {match.matchStarted && !match.matchEnded && (
          <Badge className="bg-red-500 animate-pulse">LIVE</Badge>
        )}
        {match.matchEnded && (
          <Badge className="bg-green-500">COMPLETED</Badge>
        )}
        {!match.matchStarted && (
          <Badge className="bg-blue-500">UPCOMING</Badge>
        )}
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <Calendar className="w-3 h-3" />
          <span>{formatDate(match.dateTimeGMT)}</span>
        </div>
        {match.venue && (
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <MapPin className="w-3 h-3" />
            <span>{match.venue}</span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {match.t1img && (
            <img
              src={match.t1img}
              alt={match.t1}
              className="w-6 h-6 rounded-full"
            />
          )}
          <span className="text-sm font-medium">{match.t1}</span>
        </div>
        <span className="text-xs text-gray-500">vs</span>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{match.t2}</span>
          {match.t2img && (
            <img
              src={match.t2img}
              alt={match.t2}
              className="w-6 h-6 rounded-full"
            />
          )}
        </div>
      </div>

      {match.matchStarted && (
        <div className="mb-4 p-2 bg-gray-50 rounded text-xs">
          <p className="text-gray-700">
            <strong>{match.t1}:</strong> {match.t1s || "0"}
          </p>
          <p className="text-gray-700">
            <strong>{match.t2}:</strong> {match.t2s || "0"}
          </p>
        </div>
      )}

      <Button
        onClick={() => navigate(`/team-builder/${match.id}`)}
        className="w-full bg-green-600 hover:bg-green-700"
      >
        <Trophy className="w-4 h-4 mr-2" />
        Create Team
      </Button>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/")}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Browse Matches</h1>
            <p className="text-gray-600 mt-1">
              Select a match and build your fantasy team
            </p>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="upcoming" className="relative">
              Upcoming
              {upcomingMatches.length > 0 && (
                <span className="ml-2 bg-blue-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                  {upcomingMatches.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="live" className="relative">
              Live
              {liveMatches.length > 0 && (
                <span className="ml-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center animate-pulse">
                  {liveMatches.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="completed" className="relative">
              Completed
              {completed.length > 0 && (
                <span className="ml-2 bg-green-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                  {completed.length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Upcoming Matches */}
          <TabsContent value="upcoming">
            {isLoadingCurrent ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-green-600" />
              </div>
            ) : upcomingMatches.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-gray-600">No upcoming matches available</p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {upcomingMatches.map((match) => (
                  <MatchCard key={match.id} match={match} />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Live Matches */}
          <TabsContent value="live">
            {isLoadingCurrent ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-red-600" />
              </div>
            ) : liveMatches.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-gray-600">No live matches right now</p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {liveMatches.map((match) => (
                  <MatchCard key={match.id} match={match} />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Completed Matches */}
          <TabsContent value="completed">
            {isLoadingCompleted ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-green-600" />
              </div>
            ) : completed.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-gray-600">No completed matches yet</p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {completed.map((match) => (
                  <MatchCard key={match.id} match={match} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
