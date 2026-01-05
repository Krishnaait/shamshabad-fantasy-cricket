import { useState, useEffect, useMemo } from "react";
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
  const { data: squadData, isLoading, error } = trpc.team.getMatchSquad.useQuery({
    matchId,
  });

  // Debug logging
  useEffect(() => {
    console.log("[TeamBuilder] Squad Data:", squadData);
    console.log("[TeamBuilder] Loading:", isLoading);
    console.log("[TeamBuilder] Error:", error);
  }, [squadData, isLoading, error]);

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
    if (!squadData) {
      console.log("[TeamBuilder] No squad data");
      return [];
    }

    if (!Array.isArray(squadData)) {
      console.log("[TeamBuilder] Squad data is not an array:", typeof squadData);
      return [];
    }

    const players: Player[] = [];

    // squadData is an array of SquadData (one for each team)
    squadData.forEach((team, teamIndex) => {
      console.log(`[TeamBuilder] Processing team ${teamIndex}:`, team);

      if (team && team.players && Array.isArray(team.players)) {
        team.players.forEach((player) => {
          players.push({
            playerId: player.id,
            playerName: player.name,
            role: player.role || "Unknown",
          });
        });
      }
    });

    console.log("[TeamBuilder] Total players extracted:", players.length);
    return players;
  }, [squadData]);

  // Filter players by role
  const playersByRole = useMemo(() => {
    return {
      all: allPlayers,
      wk: allPlayers.filter((p) => 
        p.role.toLowerCase().includes("keeper") || 
        p.role.toLowerCase().includes("wk")
      ),
      bat: allPlayers.filter(
        (p) =>
          p.role.toLowerCase().includes("batsman") ||
          p.role.toLowerCase().includes("batter") ||
          p.role.toLowerCase().includes("bat")
      ),
      bowl: allPlayers.filter((p) => 
        p.role.toLowerCase().includes("bowler") ||
        p.role.toLowerCase().includes("bowl")
      ),
      ar: allPlayers.filter(
        (p) =>
          p.role.toLowerCase().includes("allrounder") ||
          p.role.toLowerCase().includes("all-rounder") ||
          p.role.toLowerCase().includes("ar")
      ),
    };
  }, [allPlayers]);

  const handlePlayerSelect = (player: Player) => {
    const isSelected = selectedPlayers.find((p) => p.playerId === player.playerId);
    
    if (!isSelected && selectedPlayers.length >= 11) {
      toast.error("You can only select 11 players");
      return;
    }

    setSelectedPlayers((prev) => {
      if (isSelected) {
        // Remove player
        const newPlayers = prev.filter((p) => p.playerId !== player.playerId);
        // Reset captain/vice-captain if they were removed
        if (captainId === player.playerId) setCaptainId(null);
        if (viceCaptainId === player.playerId) setViceCaptainId(null);
        return newPlayers;
      } else {
        // Add player
        return [
          ...prev,
          { ...player, isCaptain: false, isViceCaptain: false },
        ];
      }
    });
  };

  const handleCaptainSelect = (playerId: string) => {
    if (captainId === playerId) {
      setCaptainId(null);
    } else {
      setCaptainId(playerId);
      if (viceCaptainId === playerId) setViceCaptainId(null);
    }
  };

  const handleViceCaptainSelect = (playerId: string) => {
    if (viceCaptainId === playerId) {
      setViceCaptainId(null);
    } else {
      setViceCaptainId(playerId);
      if (captainId === playerId) setCaptainId(null);
    }
  };

  const handleCreateTeam = () => {
    if (!teamName.trim()) {
      toast.error("Please enter a team name");
      return;
    }

    if (selectedPlayers.length !== 11) {
      toast.error("You must select exactly 11 players");
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
      playerId: player.playerId,
      playerName: player.playerName,
      role: player.role,
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

  if (error) {
    console.error("[TeamBuilder] Error occurred:", error);
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Card className="p-8 max-w-md text-center">
            <h2 className="text-xl font-bold mb-2">Error Loading Squad</h2>
            <p className="text-muted-foreground mb-4">{error.message}</p>
            <Button onClick={() => setLocation("/dashboard")}>
              Back to Dashboard
            </Button>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  if (allPlayers.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Card className="p-8 max-w-md text-center">
            <h2 className="text-xl font-bold mb-2">No Players Available</h2>
            <p className="text-muted-foreground mb-4">
              Squad information for this match is not available yet. Please try
              again later.
            </p>
            <Button onClick={() => setLocation("/dashboard")}>
              Back to Dashboard
            </Button>
          </Card>
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
              Select 11 players, choose your captain (2x points) and
              vice-captain (1.5x points)
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Player Selection */}
            <div className="lg:col-span-2">
              <Card className="p-6">
                <Tabs defaultValue="all">
                  <TabsList className="grid grid-cols-5 mb-6">
                    <TabsTrigger value="all">
                      All ({playersByRole.all.length})
                    </TabsTrigger>
                    <TabsTrigger value="wk">
                      WK ({playersByRole.wk.length})
                    </TabsTrigger>
                    <TabsTrigger value="bat">
                      BAT ({playersByRole.bat.length})
                    </TabsTrigger>
                    <TabsTrigger value="ar">
                      AR ({playersByRole.ar.length})
                    </TabsTrigger>
                    <TabsTrigger value="bowl">
                      BOWL ({playersByRole.bowl.length})
                    </TabsTrigger>
                  </TabsList>

                  {["all", "wk", "bat", "ar", "bowl"].map((roleKey) => {
                    const players =
                      playersByRole[roleKey as keyof typeof playersByRole];
                    return (
                      <TabsContent
                        key={roleKey}
                        value={roleKey}
                        className="space-y-2"
                      >
                        {players.length === 0 ? (
                          <div className="text-center py-8 text-muted-foreground">
                            <p>No players available in this category</p>
                          </div>
                        ) : (
                          players.map((player) => {
                            const isSelected = selectedPlayers.find(
                              (p) => p.playerId === player.playerId
                            );
                            const isCaptain = captainId === player.playerId;
                            const isViceCaptain =
                              viceCaptainId === player.playerId;

                            return (
                              <div
                                key={player.playerId}
                                className={`flex items-center justify-between p-4 rounded-lg border transition-colors ${
                                  isSelected
                                    ? "bg-primary/5 border-primary"
                                    : "bg-card border-border hover:border-primary/50"
                                }`}
                              >
                                <div className="flex items-center gap-4">
                                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                    <User className="h-6 w-6 text-primary" />
                                  </div>
                                  <div>
                                    <p className="font-semibold">
                                      {player.playerName}
                                    </p>
                                    <p className="text-xs text-muted-foreground uppercase">
                                      {player.role}
                                    </p>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2">
                                  {isSelected && (
                                    <div className="flex items-center gap-2 mr-4">
                                      <Button
                                        size="sm"
                                        variant={
                                          isCaptain ? "default" : "outline"
                                        }
                                        className="h-8 w-8 p-0 rounded-full"
                                        onClick={() =>
                                          handleCaptainSelect(player.playerId)
                                        }
                                        title="Captain (2x Points)"
                                      >
                                        C
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant={
                                          isViceCaptain ? "default" : "outline"
                                        }
                                        className="h-8 w-8 p-0 rounded-full"
                                        onClick={() =>
                                          handleViceCaptainSelect(
                                            player.playerId
                                          )
                                        }
                                        title="Vice-Captain (1.5x Points)"
                                      >
                                        VC
                                      </Button>
                                    </div>
                                  )}
                                  <Button
                                    size="sm"
                                    variant={isSelected ? "destructive" : "default"}
                                    onClick={() => handlePlayerSelect(player)}
                                  >
                                    {isSelected ? "Remove" : "Select"}
                                  </Button>
                                </div>
                              </div>
                            );
                          })
                        )}
                      </TabsContent>
                    );
                  })}
                </Tabs>
              </Card>
            </div>

            {/* Team Summary */}
            <div className="lg:col-span-1">
              <Card className="p-6 sticky top-24">
                <h2 className="text-xl font-bold mb-6">Team Summary</h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Players</span>
                    <span className="font-bold">
                      {selectedPlayers.length} / 11
                    </span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all"
                      style={{
                        width: `${(selectedPlayers.length / 11) * 100}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Captain</span>
                    <span className="font-bold text-primary">
                      {selectedPlayers.find((p) => p.playerId === captainId)
                        ?.playerName || "Not Selected"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Vice-Captain</span>
                    <span className="font-bold text-primary">
                      {selectedPlayers.find((p) => p.playerId === viceCaptainId)
                        ?.playerName || "Not Selected"}
                    </span>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="space-y-2">
                    <Label htmlFor="teamName">Team Name</Label>
                    <Input
                      id="teamName"
                      placeholder="Enter team name"
                      value={teamName}
                      onChange={(e) => setTeamName(e.target.value)}
                    />
                  </div>
                </div>

                <Button
                  onClick={handleCreateTeam}
                  disabled={
                    selectedPlayers.length !== 11 ||
                    !captainId ||
                    !viceCaptainId ||
                    !teamName.trim() ||
                    createTeamMutation.isPending
                  }
                  className="w-full"
                >
                  {createTeamMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating...
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
