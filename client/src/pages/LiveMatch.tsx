import React from "react";
import { useParams } from "wouter";
import { trpc } from "@/lib/trpc";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap, Clock, MapPin, RefreshCw } from "lucide-react";

export default function LiveMatch() {
  const { matchId } = useParams();
  
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
        <div className="max-w-4xl mx-auto">
          {/* Live Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Zap className="w-6 h-6 text-red-500 animate-pulse" />
              <h1 className="text-2xl font-bold">Live Match Center</h1>
            </div>
            <Badge className="bg-red-600 animate-pulse flex items-center gap-1">
              <RefreshCw className="w-3 h-3" /> LIVE UPDATES
            </Badge>
          </div>

          {/* Score Card */}
          <Card className="bg-gray-900 border-red-500/30 mb-8 overflow-hidden">
            <div className="bg-red-500/10 p-6 border-b border-red-500/20">
              <div className="text-center mb-6">
                <p className="text-sm text-gray-400 mb-1">{liveScore?.matchType?.toUpperCase()}</p>
                <h2 className="text-xl font-bold">{liveScore?.name}</h2>
                <p className="text-sm text-red-400 font-medium mt-1">{liveScore?.status}</p>
              </div>

              <div className="flex justify-around items-center">
                <div className="text-center">
                  <img src={liveScore?.t1img} alt={liveScore?.t1} className="w-16 h-16 mx-auto mb-2 rounded-full border-2 border-gray-800" />
                  <p className="font-bold">{liveScore?.t1}</p>
                  <p className="text-2xl font-black text-primary mt-2">{liveScore?.t1s || "0/0"}</p>
                </div>
                
                <div className="text-2xl font-bold text-gray-700">VS</div>

                <div className="text-center">
                  <img src={liveScore?.t2img} alt={liveScore?.t2} className="w-16 h-16 mx-auto mb-2 rounded-full border-2 border-gray-800" />
                  <p className="font-bold">{liveScore?.t2}</p>
                  <p className="text-2xl font-black text-primary mt-2">{liveScore?.t2s || "0/0"}</p>
                </div>
              </div>
            </div>
            
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-gray-400">
                    <MapPin className="w-5 h-5" />
                    <span>{liveScore?.venue || "Venue not specified"}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-400">
                    <Clock className="w-5 h-5" />
                    <span>Started: {new Date(liveScore?.dateTimeGMT).toLocaleString()}</span>
                  </div>
                </div>
                
                <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                  <h3 className="text-sm font-semibold text-gray-400 mb-2 uppercase tracking-wider">Current Status</h3>
                  <p className="text-lg font-medium text-white">{liveScore?.status}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Commentary/Updates Placeholder */}
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-6 text-center py-12">
              <p className="text-gray-500">Live commentary and ball-by-ball updates will appear here as the match progresses.</p>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
