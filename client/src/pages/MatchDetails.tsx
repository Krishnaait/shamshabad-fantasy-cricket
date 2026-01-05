import React, { useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Users, Clock, MapPin, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MatchDetails() {
  const { matchId } = useParams();
  const [, setLocation] = useLocation();
  
  // Ensure scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { data: scorecard, isLoading: loadingScorecard } = trpc.cricket.getMatchScorecard.useQuery(
    { matchId: matchId || "" },
    { enabled: !!matchId }
  );

  const { data: squad, isLoading: loadingSquad } = trpc.cricket.getMatchSquad.useQuery(
    { matchId: matchId || "" },
    { enabled: !!matchId }
  );

  if (loadingScorecard || loadingSquad) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-950">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="text-gray-400 animate-pulse">Fetching match details...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-950 text-white">
      <Header />
      
      <main className="flex-1 pt-24 pb-12 container mx-auto px-4">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          className="mb-6 text-gray-400 hover:text-white gap-2"
          onClick={() => window.history.back()}
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </Button>

        {/* Match Header */}
        <Card className="bg-gray-900 border-gray-800 mb-8 shadow-xl">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="text-center md:text-left flex-1">
                <Badge className="mb-3 bg-primary/20 text-primary border-primary/30 px-3 py-1">
                  {scorecard?.matchType?.toUpperCase() || "MATCH"}
                </Badge>
                <h1 className="text-3xl md:text-4xl font-black text-white mb-4 tracking-tight">
                  {scorecard?.name || "Match Details"}
                </h1>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-gray-300">
                  <span className="flex items-center gap-2 bg-gray-800/50 px-3 py-1.5 rounded-full border border-gray-700">
                    <Clock className="w-4 h-4 text-primary" /> 
                    {scorecard?.status || "Status TBA"}
                  </span>
                  {scorecard?.venue && (
                    <span className="flex items-center gap-2 bg-gray-800/50 px-3 py-1.5 rounded-full border border-gray-700">
                      <MapPin className="w-4 h-4 text-primary" /> 
                      {scorecard?.venue}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex flex-wrap justify-center gap-6 md:gap-12">
                {scorecard?.score?.length > 0 ? (
                  scorecard.score.map((s: any, idx: number) => (
                    <div key={idx} className="text-center bg-gray-800/30 p-4 rounded-xl border border-gray-800 min-w-[120px]">
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">{s.inning}</p>
                      <p className="text-3xl font-black text-primary">{s.r}/{s.w}</p>
                      <p className="text-sm font-medium text-gray-400 mt-1">{s.o} overs</p>
                    </div>
                  ))
                ) : (
                  <div className="text-center p-4">
                    <p className="text-gray-500 italic">Scores not yet available</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="scorecard" className="w-full">
          <TabsList className="bg-gray-900 border-gray-800 mb-8 p-1 h-12">
            <TabsTrigger value="scorecard" className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-white font-bold">Scorecard</TabsTrigger>
            <TabsTrigger value="squad" className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-white font-bold">Squads</TabsTrigger>
          </TabsList>

          <TabsContent value="scorecard" className="space-y-8">
            {scorecard?.scorecard?.length > 0 ? (
              scorecard.scorecard.map((inning: any, idx: number) => (
                <Card key={idx} className="bg-gray-900 border-gray-800 overflow-hidden shadow-lg">
                  <CardHeader className="bg-gray-800/50 border-b border-gray-800">
                    <CardTitle className="text-xl flex items-center gap-3 text-white">
                      <Trophy className="w-6 h-6 text-yellow-500" />
                      {inning.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-gray-800/30 text-gray-400 text-xs uppercase tracking-wider">
                            <th className="text-left px-6 py-4 font-bold">Batter</th>
                            <th className="text-right px-4 py-4 font-bold">R</th>
                            <th className="text-right px-4 py-4 font-bold">B</th>
                            <th className="text-right px-4 py-4 font-bold">4s</th>
                            <th className="text-right px-4 py-4 font-bold">6s</th>
                            <th className="text-right px-6 py-4 font-bold">SR</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                          {inning.batting?.map((player: any, pIdx: number) => (
                            <tr key={pIdx} className="hover:bg-gray-800/20 transition-colors">
                              <td className="px-6 py-4">
                                <p className="font-bold text-white text-base">{player.name}</p>
                                <p className="text-xs text-gray-500 mt-0.5">{player.dismissal}</p>
                              </td>
                              <td className="text-right px-4 py-4 font-black text-primary text-lg">{player.r}</td>
                              <td className="text-right px-4 py-4 text-gray-300 font-medium">{player.b}</td>
                              <td className="text-right px-4 py-4 text-gray-400">{player["4s"]}</td>
                              <td className="text-right px-4 py-4 text-gray-400">{player["6s"]}</td>
                              <td className="text-right px-6 py-4 text-gray-500 font-mono text-xs">{player.sr}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="bg-gray-900 border-gray-800 p-12 text-center">
                <Trophy className="w-12 h-12 text-gray-700 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-400">Scorecard Not Available</h3>
                <p className="text-gray-500 mt-2">Detailed scorecard will be updated once the match begins or data is received from the provider.</p>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="squad">
            {squad?.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-8">
                {squad.map((team: any, tIdx: number) => (
                  <Card key={tIdx} className="bg-gray-900 border-gray-800 shadow-lg">
                    <CardHeader className="bg-gray-800/50 border-b border-gray-800">
                      <CardTitle className="text-xl flex items-center gap-3 text-white">
                        <Users className="w-6 h-6 text-primary" />
                        {team.teamName}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="grid grid-cols-1 gap-3">
                        {team.players?.map((player: any, pIdx: number) => (
                          <div key={pIdx} className="flex items-center justify-between p-3 bg-gray-800/30 rounded-xl border border-gray-800 hover:border-primary/30 transition-all group">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden border border-gray-600 group-hover:border-primary/50 transition-colors">
                                {player.img ? (
                                  <img src={player.img} alt={player.name} className="w-full h-full object-cover" />
                                ) : (
                                  <span className="text-xs font-bold text-gray-500">{player.name.substring(0, 2).toUpperCase()}</span>
                                )}
                              </div>
                              <span className="font-bold text-gray-200 group-hover:text-white transition-colors">{player.name}</span>
                            </div>
                            <Badge variant="outline" className="text-[10px] border-gray-700 text-gray-400 uppercase tracking-tighter">
                              {player.role}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="bg-gray-900 border-gray-800 p-12 text-center">
                <Users className="w-12 h-12 text-gray-700 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-400">Squad Information Not Available</h3>
                <p className="text-gray-500 mt-2">Team squads will be updated as soon as they are announced.</p>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </main>
      
      <Footer />
    </div>
  );
}
