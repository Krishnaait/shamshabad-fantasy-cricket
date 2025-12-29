import { useState, useMemo } from "react";
import { useParams, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Loader2, Trophy, Star, User, ArrowLeft } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface Player {
  playerId: string;
  playerName: string;
  role: string;
}

interface SelectedPlayer extends Player {
  isCaptain: boolean;
  isViceCaptain: boolean;
}

export default function TeamBuilder() {
  const params = useParams();
  const [, setLocation] = useLocation();
  const matchId = params.matchId as string;

  const [teamName, setTeamName] = useState("");
  const [selectedPlayers, setSelectedPlayers] = useState<SelectedPlayer[]>([]);
  const [captainId, setCaptainId] = useState<string | null>(null);
  const [viceCaptainId, setViceCaptainId] = useState<string | null>(null);

  // Fetch match squad
  const { data: squadData, isLoading } = trpc.team.getMatchSquad.useQuery({
    matchId,
  });

  // Create team mutation
  const createTeamMutation = trpc.team.createTeam.useMutation({
    onSuccess: () => {
      toast.success("Team created successfully!");
      setLocation("/dashboard");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create team");
    },
  });

  // Extract players from squad data
  const allPlayers = useMemo(() => {
    if (!squadData || !Array.isArray(squadData)) return [];
    
    const players: Player[] = [];
    
    // squadData is an array of SquadData (one for each team)
    squadData.forEach((team) => {
      if (team.players && Array.isArray(team.players)) {
        team.players.forEach((player) => {
          players.push({
            playerId: player.id,
            playerName: player.name,
            role: player.role || "Unknown",
          });
        });
      }
    });
    
    return players;
  }, [squadData]);

  // Filter players by role
  const playersByRole = useMemo(() => {
    return {
      all: allPlayers,
      wk: allPlayers.filter((p) => p.role.toLowerCase().includes("keeper")),
      bat: allPlayers.filter((p) => p.role.toLowerCase().includes("batsman") || p.role.toLowerCase().includes("batter")),
      bowl: allPlayers.filter((p) => p.role.toLowerCase().includes("bowler")),
      ar: allPlayers.filter((p) => p.role.toLowerCase().includes("allrounder") || p.role.toLowerCase().includes("all-rounder")),
    };
  }, [allPlayers]);

  const handlePlayerSelect = (player: Player) => {
    if (selectedPlayers.length >= 11 && !selectedPlayers.find((p) => p.playerId === player.playerId)) {
      toast.error("You can only select 11 players");
      return;
    }

    const isSelected = selectedPlayers.find((p) => p.playerId === player.playerId);
    
    if (isSelected) {
      // Deselect player
      setSelectedPlayers(selectedPlayers.filter((p) => p.playerId !== player.playerId));
      if (captainId === player.playerId) setCaptainId(null);
      if (viceCaptainId === player.playerId) setViceCaptainId(null);
    } else {
      // Select player
      setSelectedPlayers([
        ...selectedPlayers,
        {
          ...player,
          isCaptain: false,
          isViceCaptain: false,
        },
      ]);
    }
  };

  const handleSetCaptain = (playerId: string) => {
    if (viceCaptainId === playerId) {
      toast.error("Captain and vice-captain must be different");
      return;
    }
    setCaptainId(playerId);
  };

  const handleSetViceCaptain = (playerId: string) => {
    if (captainId === playerId) {
      toast.error("Captain and vice-captain must be different");
      return;
    }
    setViceCaptainId(playerId);
  };

  const handleSaveTeam = () => {
    if (!teamName.trim()) {
      toast.error("Please enter a team name");
      return;
    }

    if (selectedPlayers.length !== 11) {
      toast.error("Please select exactly 11 players");
      return;
    }

    if (!captainId) {
      toast.error("Please select a captain");
      return;
    }

    if (!viceCaptainId) {
      toast.error("Please select a vice-captain");
      return;
    }

    const playersWithRoles = selectedPlayers.map((player) => ({
      ...player,
      isCaptain: player.playerId === captainId,
      isViceCaptain: player.playerId === viceCaptainId,
    }));

    createTeamMutation.mutate({
      matchId,
      teamName,
      players: playersWithRoles,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="container">
          <Button
            variant="ghost"
            onClick={() => setLocation("/dashboard")}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>

          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">Create Your Fantasy Team</h1>
            <p className="text-muted-foreground">
              Select 11 players, choose your captain (2x points) and vice-captain (1.5x points)
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Player Selection */}
            <div className="lg:col-span-2">
              <Card className="p-6">
                <Tabs defaultValue="all">
                  <TabsList className="grid grid-cols-5 mb-6">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="wk">WK ({playersByRole.wk.length})</TabsTrigger>
                    <TabsTrigger value="bat">BAT ({playersByRole.bat.length})</TabsTrigger>
                    <TabsTrigger value="ar">AR ({playersByRole.ar.length})</TabsTrigger>
                    <TabsTrigger value="bowl">BOWL ({playersByRole.bowl.length})</TabsTrigger>
                  </TabsList>

                  {["all", "wk", "bat", "ar", "bowl"].map((roleKey) => (
                    <TabsContent key={roleKey} value={roleKey} className="space-y-2">
                      {playersByRole[roleKey as keyof typeof playersByRole].map((player) => {
                        const isSelected = selectedPlayers.find((p) => p.playerId === player.playerId);
                        const isCaptain = captainId === player.playerId;
                        const isViceCaptain = viceCaptainId === player.playerId;

                        return (
                          <div
                            key={player.playerId}
                            className={`p-4 border rounded-lg flex items-center justify-between transition-smooth animate-fade-in ${
                              isSelected 
                                ? "bg-gradient-to-r from-primary/10 to-primary/5 border-primary shadow-md" 
                                : "hover:bg-muted hover:border-primary/30 hover:shadow-sm"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <Button
                                variant={isSelected ? "default" : "outline"}
                                size="sm"
                                onClick={() => handlePlayerSelect(player)}
                              >
                                {isSelected ? "Remove" : "Add"}
                              </Button>
                              <div>
                                <div className="font-medium flex items-center gap-2">
                                  {player.playerName}
                                  {isCaptain && (
                                    <Badge variant="default" className="text-xs">
                                      <Trophy className="w-3 h-3 mr-1" />C
                                    </Badge>
                                  )}
                                  {isViceCaptain && (
                                    <Badge variant="secondary" className="text-xs">
                                      <Star className="w-3 h-3 mr-1" />VC
                                    </Badge>
                                  )}
                                </div>
                                <div className="text-sm text-muted-foreground">{player.role}</div>
                              </div>
                            </div>

                            {isSelected && (
                              <div className="flex gap-2">
                                <Button
                                  variant={isCaptain ? "default" : "outline"}
                                  size="sm"
                                  onClick={() => handleSetCaptain(player.playerId)}
                                  disabled={isCaptain}
                                >
                                  <Trophy className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant={isViceCaptain ? "default" : "outline"}
                                  size="sm"
                                  onClick={() => handleSetViceCaptain(player.playerId)}
                                  disabled={isViceCaptain}
                                >
                                  <Star className="w-4 h-4" />
                                </Button>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </TabsContent>
                  ))}
                </Tabs>
              </Card>
            </div>

            {/* Selected Team */}
            <div>
              <Card className="p-6 sticky top-4">
                <h2 className="text-xl font-bold mb-4">Your Team ({selectedPlayers.length}/11)</h2>

                <div className="space-y-4 mb-6">
                  <div>
                    <Label htmlFor="teamName">Team Name</Label>
                    <Input
                      id="teamName"
                      placeholder="Enter team name"
                      value={teamName}
                      onChange={(e) => setTeamName(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    {selectedPlayers.length === 0 ? (
                      <div className="text-center text-muted-foreground py-8">
                        <User className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>No players selected</p>
                      </div>
                    ) : (
                      selectedPlayers.map((player) => (
                        <div
                          key={player.playerId}
                          className="flex items-center justify-between p-3 bg-gradient-to-r from-muted to-muted/50 rounded-lg border border-border/50 hover:border-primary/30 transition-smooth animate-fade-in"
                        >
                          <div className="text-sm">
                            <div className="font-medium flex items-center gap-2">
                              {player.playerName}
                              {captainId === player.playerId && (
                                <Badge variant="default" className="text-xs">
                                  <Trophy className="w-3 h-3 mr-1" />C (2x)
                                </Badge>
                              )}
                              {viceCaptainId === player.playerId && (
                                <Badge variant="secondary" className="text-xs">
                                  <Star className="w-3 h-3 mr-1" />VC (1.5x)
                                </Badge>
                              )}
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">{player.role}</div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <Button
                  className="w-full"
                  onClick={handleSaveTeam}
                  disabled={
                    selectedPlayers.length !== 11 ||
                    !captainId ||
                    !viceCaptainId ||
                    !teamName.trim() ||
                    createTeamMutation.isPending
                  }
                >
                  {createTeamMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating Team...
                    </>
                  ) : (
                    "Create Team"
                  )}
                </Button>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
