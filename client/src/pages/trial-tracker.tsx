import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { SEOHead } from "@/lib/seo";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Edit3, Trash2, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { format, differenceInCalendarDays, addDays } from "date-fns";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";

interface Trial {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
}

export default function TrialTracker() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const queryClient = useQueryClient();

  const { data: trials = [] } = useQuery<Trial[]>({
    queryKey: ["/api/trials"],
    enabled: isAuthenticated,
  });

  const [filter, setFilter] = useState<string>("all");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [days, setDays] = useState(7);

  const createMutation = useMutation({
    mutationFn: (data: Omit<Trial, "id">) =>
      apiRequest("POST", "/api/trials", data).then((res) => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/trials"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, ...updates }: any) =>
      apiRequest("PUT", `/api/trials/${id}`, updates).then((res) => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/trials"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/trials/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/trials"] });
    },
  });

  const resetForm = () => {
    setName("");
    setStartDate("");
    setDays(7);
    setEditingId(null);
  };

  const handleAddOrUpdate = () => {
    if (!name.trim() || !startDate || days <= 0) return;
    const endDate = addDays(new Date(startDate), days).toISOString();
    if (editingId !== null) {
      updateMutation.mutate({ id: editingId, name, startDate, endDate });
    } else {
      createMutation.mutate({ name, startDate, endDate } as any);
    }
    resetForm();
  };

  const handleEdit = (trial: Trial) => {
    setEditingId(trial.id);
    setName(trial.name);
    setStartDate(trial.startDate);
    const diff = differenceInCalendarDays(
      new Date(trial.endDate),
      new Date(trial.startDate),
    );
    setDays(diff);
  };

  const handleDelete = (id: number) => {
    if (confirm("Delete this trial?")) {
      deleteMutation.mutate(id);
    }
  };

  const filteredTrials = trials.filter((trial) => {
    if (filter === "all") return true;
    const daysLeft = differenceInCalendarDays(
      new Date(trial.endDate),
      new Date(),
    );
    return daysLeft >= 0 && daysLeft <= parseInt(filter);
  });

  if (!authLoading && !isAuthenticated) {
    return (
      <>
        <SEOHead
          title="Trial Tracker - Manage Free Trials | AppsThatMatter"
          description="Keep track of your free trials and know when they expire"
          keywords="trial tracker, subscription tracker, productivity"
        />
        <div
          className="min-h-screen"
          style={{ backgroundColor: "var(--neo-bg)" }}
        >
          <Header />
          <main className="container max-w-md mx-auto px-4 py-16 text-center space-y-4">
            <p className="text-foreground">
              Please{" "}
              <Link href="/login" className="text-primary underline">
                sign in
              </Link>{" "}
              to use Trial Tracker.
            </p>
          </main>
          <Footer />
        </div>
      </>
    );
  }

  return (
    <>
      <SEOHead
        title="Trial Tracker - Manage Free Trials | AppsThatMatter"
        description="Keep track of your free trials and know when they expire"
        keywords="trial tracker, subscription tracker, productivity"
      />
      <div
        className="min-h-screen"
        style={{ backgroundColor: "var(--neo-bg)" }}
      >
        <Header />
        <main className="container max-w-4xl mx-auto px-4 py-8">
          <div className="mb-6">
            <Link
              href="/"
              className="inline-flex items-center text-primary hover:text-primary/80 transition-colors no-underline"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Apps
            </Link>
          </div>
          <div className="text-center mb-8">
            <div className="neumorphic-inset w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-xl">
              <Clock className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold mb-2 text-foreground">
              Trial Tracker
            </h1>
            <p className="text-muted-foreground">
              Track all your free trials and stay ahead of renewals
            </p>
          </div>
          <Card className="neumorphic mb-8">
            <CardHeader>
              <CardTitle>
                {editingId ? "Edit Trial" : "Add New Trial"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Service name"
                  className="neumorphic-inset border-none"
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="neumorphic-inset border-none"
                  />
                </div>
                <div>
                  <Label htmlFor="days">Trial Length (days)</Label>
                  <Input
                    id="days"
                    type="number"
                    min="1"
                    value={days}
                    onChange={(e) => setDays(parseInt(e.target.value) || 0)}
                    className="neumorphic-inset border-none"
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <Button
                  onClick={handleAddOrUpdate}
                  className="neumorphic-button flex-1"
                >
                  {editingId ? "Update Trial" : "Add Trial"}
                </Button>
                {editingId && (
                  <Button
                    onClick={resetForm}
                    variant="outline"
                    className="neumorphic-button"
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => setFilter("all")}
              className={`neumorphic-button px-4 py-2 text-sm ${filter === "all" ? "active" : ""}`}
            >
              All
            </button>
            <button
              onClick={() => setFilter("1")}
              className={`neumorphic-button px-4 py-2 text-sm ${filter === "1" ? "active" : ""}`}
            >
              1 Day
            </button>
            <button
              onClick={() => setFilter("7")}
              className={`neumorphic-button px-4 py-2 text-sm ${filter === "7" ? "active" : ""}`}
            >
              7 Days
            </button>
            <button
              onClick={() => setFilter("30")}
              className={`neumorphic-button px-4 py-2 text-sm ${filter === "30" ? "active" : ""}`}
            >
              30 Days
            </button>
          </div>
          {filteredTrials.length === 0 ? (
            <p className="text-center text-muted-foreground">No trials found</p>
          ) : (
            <div className="space-y-4">
              {filteredTrials.map((trial) => {
                const daysLeft = differenceInCalendarDays(
                  new Date(trial.endDate),
                  new Date(),
                );
                return (
                  <Card key={trial.id} className="neumorphic">
                    <CardContent className="flex items-center justify-between py-4">
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">
                          {trial.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Start:{" "}
                          {format(new Date(trial.startDate), "MMM dd, yyyy")}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          End: {format(new Date(trial.endDate), "MMM dd, yyyy")}{" "}
                          ({daysLeft} days left)
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(trial)}
                          className="neumorphic-button"
                        >
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(trial.id)}
                          className="neumorphic-button"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </main>
        <Footer />
      </div>
    </>
  );
}
