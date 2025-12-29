import { useState, useMemo, useEffect } from "react";
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
      wk: allPlayers.filter((p) => p.role.toLowerCase().includes("keeper")),
      bat: allPlayers.filter(
        (p) =>
          p.role.toLowerCase().includes("batsman") ||
          p.role.toLowerCase().includes("batter")
      ),
      bowl: allPlayers.filter((p) => p.role.toLowerCase().includes("bowler")),
      ar: allPlayers.filter(
        (p) =>
          p.role.toLowerCase().includes("allrounder") ||
          p.role.toLowerCase().includes("all-rounder")
      ),
    };
  }, [allPlayers]);

  const handlePlayerSelect = (player: Player) => {
    if (
      selectedPlayers.length >= 11 &&
      !selectedPlayers.find((p) => p.playerId === player.playerId)
    ) {
      toast.error("You can only select 11 players");
      return;
    }

    const isSelected = selectedPlayers.find((p) => p.playerId === player.playerId);

    if (isSelected) {
      // Deselect player
      setSelectedPlayers(
        selectedPlayers.filter((p) => p.playerId !== player.playerId)
      );
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
                                className={`p-4 border rounded-lg flex items-center justify-between ${
                                  isSelected
                                    ? "bg-primary/10 border-primary"
                                    : "hover:bg-muted"
                                }`}
                              >
                                <div className="flex items-center gap-3">
                                  <Button
                                    variant={
                                      isSelected ? "default" : "outline"
                                    }
                                    size="sm"
                                    onClick={() => handlePlayerSelect(player)}
                                  >
                                    <User className="w-4 h-4" />
                                  </Button>
                                  <div>
                                    <p className="font-medium">
                                      {player.playerName}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                      {player.role}
                                    </p>
                                  </div>
                                </div>

                                {isSelected && (
                                  <div className="flex gap-2">
                                    <Button
                                      variant={
                                        isCaptain ? "default" : "outline"
                                      }
                                      size="sm"
                                      onClick={() =>
                                        handleCaptainSelect(player.playerId)
                                      }
                                    >
                                      <Trophy className="w-4 h-4 mr-1" />
                                      C
                                    </Button>
                                    <Button
                                      variant={
                                        isViceCaptain ? "default" : "outline"
                                      }
                                      size="sm"
                                      onClick={() =>
                                        handleViceCaptainSelect(player.playerId)
                                      }
                                    >
                                      <Star className="w-4 h-4 mr-1" />
                                      VC
                                    </Button>
                                  </div>
                                )}
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
            <div>
              <Card className="p-6 sticky top-8">
                <h2 className="text-xl font-bold mb-4">Your Team</h2>

                <div className="mb-6">
                  <Label htmlFor="teamName" className="mb-2 block">
                    Team Name
                  </Label>
                  <Input
                    id="teamName"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    placeholder="Enter team name"
                  />
                </div>

                <div className="mb-6">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">
                      Players Selected
                    </span>
                    <Badge
                      variant={
                        selectedPlayers.length === 11 ? "default" : "secondary"
                      }
                    >
                      {selectedPlayers.length}/11
                    </Badge>
                  </div>

                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {selectedPlayers.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        No players selected
                      </p>
                    ) : (
                      selectedPlayers.map((player) => (
                        <div
                          key={player.playerId}
                          className="text-sm p-2 bg-muted rounded flex justify-between items-center"
                        >
                          <span>{player.playerName}</span>
                          <div className="flex gap-1">
                            {captainId === player.playerId && (
                              <Badge variant="default" className="text-xs">
                                C
                              </Badge>
                            )}
                            {viceCaptainId === player.playerId && (
                              <Badge variant="secondary" className="text-xs">
                                VC
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))
                    )}
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
