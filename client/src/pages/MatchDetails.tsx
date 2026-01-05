import React from "react";
import { useParams } from "wouter";
import { trpc } from "@/lib/trpc";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Users, Clock, MapPin, Award } from "lucide-react";

export default function MatchDetails() {
  const { matchId } = useParams();
  
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-950 text-white">
      <Header />
      
      <main className="flex-1 pt-24 pb-12 container mx-auto px-4">
        {/* Match Header */}
        <Card className="bg-gray-900 border-gray-800 mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="text-center md:text-left">
                <Badge className="mb-2 bg-primary/20 text-primary border-primary/30">
                  {scorecard?.matchType?.toUpperCase() || "MATCH"}
                </Badge>
                <h1 className="text-2xl md:text-3xl font-bold">{scorecard?.name}</h1>
                <div className="flex items-center gap-4 mt-2 text-gray-400 text-sm">
                  <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {scorecard?.status}</span>
                  {scorecard?.venue && <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {scorecard?.venue}</span>}
                </div>
              </div>
              
              <div className="flex items-center gap-8">
                {scorecard?.score?.map((s: any, idx: number) => (
                  <div key={idx} className="text-center">
                    <p className="text-sm text-gray-400 mb-1">{s.inning}</p>
                    <p className="text-2xl font-bold text-primary">{s.r}/{s.w}</p>
                    <p className="text-xs text-gray-500">{s.o} overs</p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="scorecard" className="w-full">
          <TabsList className="bg-gray-900 border-gray-800 mb-6">
            <TabsTrigger value="scorecard" className="data-[state=active]:bg-primary">Scorecard</TabsTrigger>
            <TabsTrigger value="squad" className="data-[state=active]:bg-primary">Squads</TabsTrigger>
          </TabsList>

          <TabsContent value="scorecard">
            <div className="grid gap-6">
              {scorecard?.scorecard?.map((inning: any, idx: number) => (
                <Card key={idx} className="bg-gray-900 border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Trophy className="w-5 h-5 text-yellow-500" />
                      {inning.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="text-gray-400 border-b border-gray-800">
                            <th className="text-left py-2">Batter</th>
                            <th className="text-right py-2">R</th>
                            <th className="text-right py-2">B</th>
                            <th className="text-right py-2">4s</th>
                            <th className="text-right py-2">6s</th>
                            <th className="text-right py-2">SR</th>
                          </tr>
                        </thead>
                        <tbody>
                          {inning.batting?.map((player: any, pIdx: number) => (
                            <tr key={pIdx} className="border-b border-gray-800/50">
                              <td className="py-3">
                                <p className="font-medium">{player.name}</p>
                                <p className="text-xs text-gray-500">{player.dismissal}</p>
                              </td>
                              <td className="text-right font-bold">{player.r}</td>
                              <td className="text-right text-gray-400">{player.b}</td>
                              <td className="text-right text-gray-400">{player["4s"]}</td>
                              <td className="text-right text-gray-400">{player["6s"]}</td>
                              <td className="text-right text-gray-400">{player.sr}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="squad">
            <div className="grid md:grid-cols-2 gap-6">
              {squad?.map((team: any, tIdx: number) => (
                <Card key={tIdx} className="bg-gray-900 border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Users className="w-5 h-5 text-primary" />
                      {team.teamName}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 gap-2">
                      {team.players?.map((player: any, pIdx: number) => (
                        <div key={pIdx} className="flex items-center justify-between p-2 bg-gray-800/50 rounded">
                          <div className="flex items-center gap-3">
                            {player.img && <img src={player.img} alt={player.name} className="w-8 h-8 rounded-full" />}
                            <span>{player.name}</span>
                          </div>
                          <Badge variant="outline" className="text-[10px] border-gray-700">
                            {player.role}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
      
      <Footer />
    </div>
  );
}
