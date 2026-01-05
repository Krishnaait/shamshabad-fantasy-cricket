import React, { useEffect } from "react";
import { useParams } from "wouter";
import { trpc } from "@/lib/trpc";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap, Clock, MapPin, RefreshCw, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LiveMatch() {
  const { matchId } = useParams();
  
  // Ensure scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { data: liveScore, isLoading, refetch } = trpc.cricket.getLiveScore.useQuery(
    { matchId: matchId || "" },
    { 
      enabled: !!matchId,
      refetchInterval: 15000 // Refresh every 15 seconds
    }
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-950">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="text-gray-400 animate-pulse">Connecting to live match center...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const formatMatchDate = (dateStr: string) => {
    if (!dateStr) return "Date TBA";
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return "Date TBA";
      return date.toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
        timeZone: "Asia/Kolkata"
      });
    } catch (e) {
      return "Date TBA";
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-950 text-white">
      <Header />
      
      <main className="flex-1 pt-24 pb-12 container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Button 
            variant="ghost" 
            className="mb-6 text-gray-400 hover:text-white gap-2"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </Button>

          {/* Live Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="bg-red-600/20 p-3 rounded-2xl border border-red-600/30">
                <Zap className="w-8 h-8 text-red-500 animate-pulse" />
              </div>
              <div>
                <h1 className="text-3xl font-black tracking-tight">Live Match Center</h1>
                <p className="text-gray-400 text-sm font-medium">Real-time ball-by-ball updates</p>
              </div>
            </div>
            <Badge className="bg-red-600 hover:bg-red-700 px-4 py-1.5 rounded-full animate-pulse flex items-center gap-2 font-bold shadow-lg shadow-red-900/20">
              <RefreshCw className="w-4 h-4" /> LIVE UPDATES
            </Badge>
          </div>

          {/* Score Card */}
          <Card className="bg-gray-900 border-red-500/30 mb-8 overflow-hidden shadow-2xl">
            <div className="bg-gradient-to-b from-red-500/10 to-transparent p-8 border-b border-gray-800">
              <div className="text-center mb-10">
                <Badge variant="outline" className="mb-3 border-red-500/50 text-red-400 px-3 py-1 font-mono">
                  {liveScore?.matchType?.toUpperCase() || "MATCH"}
                </Badge>
                <h2 className="text-2xl md:text-3xl font-black text-white mb-2">{liveScore?.name || "Match Score"}</h2>
                <div className="inline-block bg-red-600/10 px-4 py-1.5 rounded-full border border-red-600/20">
                  <p className="text-sm text-red-400 font-black uppercase tracking-widest">{liveScore?.status || "Match in progress"}</p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row justify-around items-center gap-12">
                {/* Team 1 */}
                <div className="text-center flex-1">
                  <div className="w-24 h-24 mx-auto mb-4 rounded-full border-4 border-gray-800 bg-gray-800 flex items-center justify-center overflow-hidden shadow-xl">
                    {liveScore?.t1img ? (
                      <img src={liveScore.t1img} alt={liveScore.t1} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-2xl font-black text-gray-600">{liveScore?.t1?.substring(0, 2).toUpperCase() || "T1"}</span>
                    )}
                  </div>
                  <p className="font-black text-xl text-white mb-2">{liveScore?.t1 || "Team 1"}</p>
                  <div className="bg-gray-800/50 px-6 py-3 rounded-2xl border border-gray-700">
                    <p className="text-3xl font-black text-primary">{liveScore?.t1s || "0/0"}</p>
                  </div>
                </div>
                
                <div className="text-4xl font-black text-gray-800 italic select-none">VS</div>

                {/* Team 2 */}
                <div className="text-center flex-1">
                  <div className="w-24 h-24 mx-auto mb-4 rounded-full border-4 border-gray-800 bg-gray-800 flex items-center justify-center overflow-hidden shadow-xl">
                    {liveScore?.t2img ? (
                      <img src={liveScore.t2img} alt={liveScore.t2} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-2xl font-black text-gray-600">{liveScore?.t2?.substring(0, 2).toUpperCase() || "T2"}</span>
                    )}
                  </div>
                  <p className="font-black text-xl text-white mb-2">{liveScore?.t2 || "Team 2"}</p>
                  <div className="bg-gray-800/50 px-6 py-3 rounded-2xl border border-gray-700">
                    <p className="text-3xl font-black text-primary">{liveScore?.t2s || "0/0"}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <CardContent className="p-8 bg-gray-900/50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="flex items-center gap-4 text-gray-300 bg-gray-800/30 p-4 rounded-2xl border border-gray-800">
                    <div className="bg-primary/10 p-2 rounded-lg">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Venue</p>
                      <p className="font-bold">{liveScore?.venue || "Venue not specified"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-gray-300 bg-gray-800/30 p-4 rounded-2xl border border-gray-800">
                    <div className="bg-primary/10 p-2 rounded-lg">
                      <Clock className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Match Time</p>
                      <p className="font-bold">{formatMatchDate(liveScore?.dateTimeGMT)}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-800/50 p-6 rounded-2xl border border-gray-700 flex flex-col justify-center">
                  <h3 className="text-xs font-black text-gray-500 mb-3 uppercase tracking-widest">Current Match Status</h3>
                  <p className="text-xl font-black text-white leading-tight">{liveScore?.status || "Waiting for updates..."}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Commentary/Updates Placeholder */}
          <Card className="bg-gray-900 border-gray-800 shadow-xl">
            <CardContent className="p-12 text-center">
              <div className="max-w-md mx-auto">
                <RefreshCw className="w-12 h-12 text-gray-800 mx-auto mb-6 animate-spin-slow" />
                <h3 className="text-xl font-bold text-gray-400 mb-2">Live Commentary</h3>
                <p className="text-gray-600">Ball-by-ball commentary and key match events will be streamed here as they happen in real-time.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
