import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { SEOHead } from "@/lib/seo";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import {
  Plus,
  Search,
  Edit3,
  Trash2,
  ExternalLink,
  Calendar,
  Tag,
  Palette,
  X,
} from "lucide-react";
import { format } from "date-fns";

interface Note {
  id: number;
  title: string;
  content: string;
  tags: string[];
  backgroundColor: string;
  createdAt: string;
  updatedAt: string;
}

const COLOR_OPTIONS = [
  "#fef3c7", // Yellow
  "#fef9e2", // Light Yellow
  "#ecfdf5", // Green
  "#f0f9ff", // Blue
  "#fef7f7", // Pink
  "#f3f4f6", // Gray
  "#fff7ed", // Orange
  "#faf5ff", // Purple
];

export default function PostItNotes() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [newNote, setNewNote] = useState({
    title: "",
    content: "",
    tags: [] as string[],
    backgroundColor: "#fef3c7",
  });
  const [tagInput, setTagInput] = useState("");

  // Check authentication status
  const { data: user, isLoading: authLoading } = useQuery({
    queryKey: ["/api/auth/user"],
    retry: false,
  });

  const isAuthenticated = !!user;

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to access your notes.",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 1000);
      return;
    }
  }, [authLoading, isAuthenticated, toast]);

  // Fetch notes only if authenticated
  const { data: notes = [], isLoading } = useQuery({
    queryKey: searchQuery ? ["/api/notes/search", searchQuery] : ["/api/notes"],
    queryFn: async () => {
      const url = searchQuery
        ? `/api/notes/search?q=${encodeURIComponent(searchQuery)}`
        : "/api/notes";
      const res = await apiRequest("GET", url);
      return (await res.json()) as Note[];
    },
    enabled: isAuthenticated,
  });

  // Fetch available tags for autocomplete only if authenticated
  const { data: availableTags = [] } = useQuery({
    queryKey: ["/api/notes/tags"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/notes/tags");
      return (await res.json()) as string[];
    },
    enabled: isAuthenticated,
  });

  // Create note mutation
  const createMutation = useMutation({
    mutationFn: (note: any) =>
      apiRequest("POST", "/api/notes", note).then((res) => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notes"] });
      queryClient.invalidateQueries({ queryKey: ["/api/notes/tags"] });
      setIsCreateOpen(false);
      setNewNote({
        title: "",
        content: "",
        tags: [],
        backgroundColor: "#fef3c7",
      });
      toast({ title: "Note created successfully!" });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "Please sign in to create notes.",
          variant: "destructive",
        });
        setTimeout(() => (window.location.href = "/api/login"), 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to create note",
        variant: "destructive",
      });
    },
  });

  // Update note mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, ...updates }: any) =>
      apiRequest("PUT", `/api/notes/${id}`, updates).then((res) => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notes"] });
      queryClient.invalidateQueries({ queryKey: ["/api/notes/tags"] });
      setEditingNote(null);
      toast({ title: "Note updated successfully!" });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "Please sign in to update notes.",
          variant: "destructive",
        });
        setTimeout(() => (window.location.href = "/api/login"), 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to update note",
        variant: "destructive",
      });
    },
  });

  // Delete note mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/notes/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notes"] });
      queryClient.invalidateQueries({ queryKey: ["/api/notes/tags"] });
      toast({ title: "Note deleted successfully!" });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "Please sign in to delete notes.",
          variant: "destructive",
        });
        setTimeout(() => (window.location.href = "/api/login"), 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to delete note",
        variant: "destructive",
      });
    },
  });

  const handleCreateNote = () => {
    if (!newNote.title.trim() || !newNote.content.trim()) {
      toast({
        title: "Error",
        description: "Title and content are required",
        variant: "destructive",
      });
      return;
    }
    createMutation.mutate(newNote);
  };

  const handleUpdateNote = () => {
    if (!editingNote) return;
    updateMutation.mutate(editingNote);
  };

  const handleDeleteNote = (id: number) => {
    if (confirm("Are you sure you want to delete this note?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleAddTag = (tag: string, isEditing = false) => {
    const trimmedTag = tag.trim();
    if (!trimmedTag) return;

    if (isEditing && editingNote) {
      if (!editingNote.tags.includes(trimmedTag)) {
        setEditingNote({
          ...editingNote,
          tags: [...editingNote.tags, trimmedTag],
        });
      }
    } else {
      if (!newNote.tags.includes(trimmedTag)) {
        setNewNote({
          ...newNote,
          tags: [...newNote.tags, trimmedTag],
        });
      }
    }
    setTagInput("");
  };

  const handleRemoveTag = (tagToRemove: string, isEditing = false) => {
    if (isEditing && editingNote) {
      setEditingNote({
        ...editingNote,
        tags: editingNote.tags.filter((tag) => tag !== tagToRemove),
      });
    } else {
      setNewNote({
        ...newNote,
        tags: newNote.tags.filter((tag) => tag !== tagToRemove),
      });
    }
  };

  const openNoteInNewTab = (note: Note) => {
    const noteWindow = window.open("", "_blank");
    if (noteWindow) {
      noteWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>${note.title} - Post-it Note</title>
            <style>
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                max-width: 800px;
                margin: 40px auto;
                padding: 20px;
                background-color: ${note.backgroundColor};
                line-height: 1.6;
              }
              .note-header {
                border-bottom: 2px solid rgba(0,0,0,0.1);
                padding-bottom: 20px;
                margin-bottom: 20px;
              }
              .note-title {
                font-size: 28px;
                font-weight: bold;
                margin: 0 0 10px 0;
                color: #1f2937;
              }
              .note-meta {
                color: #6b7280;
                font-size: 14px;
              }
              .note-content {
                white-space: pre-wrap;
                font-size: 16px;
                color: #374151;
                margin-bottom: 20px;
              }
              .note-tags {
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
              }
              .tag {
                background: rgba(59, 130, 246, 0.1);
                color: #1e40af;
                padding: 4px 12px;
                border-radius: 16px;
                font-size: 12px;
                font-weight: 500;
              }
              @media print {
                body { margin: 0; }
              }
            </style>
          </head>
          <body>
            <div class="note-header">
              <h1 class="note-title">${note.title}</h1>
              <div class="note-meta">
                Created: ${format(new Date(note.createdAt), "MMM dd, yyyy 'at' h:mm a")}
                ${
                  note.createdAt !== note.updatedAt
                    ? ` • Updated: ${format(new Date(note.updatedAt), "MMM dd, yyyy 'at' h:mm a")}`
                    : ""
                }
              </div>
            </div>
            <div class="note-content">${note.content}</div>
            ${
              note.tags.length > 0
                ? `
              <div class="note-tags">
                ${note.tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}
              </div>
            `
                : ""
            }
          </body>
        </html>
      `);
      noteWindow.document.close();
    }
  };

  // Handle tag input with Enter key
  const handleTagKeyPress = (e: React.KeyboardEvent, isEditing = false) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag(tagInput, isEditing);
    }
  };

  return (
    <>
      <SEOHead
        title="Post-it Notes - AppsThatMatter"
        description="Create, organize, and manage digital sticky notes with tags, colors, and timestamps for better productivity."
        keywords="notes, sticky notes, post-it, productivity, organization, tags"
      />
      <div
        className="min-h-screen"
        style={{ backgroundColor: "var(--neo-bg)" }}
      >
        <Header />
        <main className="container max-w-7xl mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <div className="neumorphic-inset w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-xl">
              <Plus className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold mb-2 text-foreground">
              Post-it Notes
            </h1>
            <p className="text-muted-foreground">
              Create and organize your digital sticky notes
            </p>
          </div>

          {/* Actions Bar */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="neumorphic pl-10"
              />
            </div>
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Button className="neumorphic-button">
                  <Plus className="h-4 w-4 mr-2" />
                  New Note
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New Note</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Input
                    placeholder="Note title..."
                    value={newNote.title}
                    onChange={(e) =>
                      setNewNote({ ...newNote, title: e.target.value })
                    }
                    className="neumorphic"
                  />
                  <Textarea
                    placeholder="Write your note content..."
                    value={newNote.content}
                    onChange={(e) =>
                      setNewNote({ ...newNote, content: e.target.value })
                    }
                    className="neumorphic min-h-32"
                  />

                  {/* Tags */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Tags</label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {newNote.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="flex items-center gap-1"
                        >
                          {tag}
                          <X
                            className="h-3 w-3 cursor-pointer"
                            onClick={() => handleRemoveTag(tag)}
                          />
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add tag..."
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyPress={handleTagKeyPress}
                        className="neumorphic"
                        list="available-tags"
                      />
                      <datalist id="available-tags">
                        {availableTags.map((tag: string) => (
                          <option key={tag} value={tag} />
                        ))}
                      </datalist>
                      <Button
                        type="button"
                        onClick={() => handleAddTag(tagInput)}
                        className="neumorphic-button"
                      >
                        <Tag className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Color Picker */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Background Color
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {COLOR_OPTIONS.map((color) => (
                        <button
                          key={color}
                          type="button"
                          className={`w-8 h-8 rounded-full border-2 ${
                            newNote.backgroundColor === color
                              ? "border-primary"
                              : "border-gray-300"
                          }`}
                          style={{ backgroundColor: color }}
                          onClick={() =>
                            setNewNote({ ...newNote, backgroundColor: color })
                          }
                        />
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setIsCreateOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleCreateNote}
                      disabled={createMutation.isPending}
                      className="neumorphic-button"
                    >
                      {createMutation.isPending ? "Creating..." : "Create Note"}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Notes Grid */}
          {authLoading ? (
            <div className="text-center py-12">
              <div className="neumorphic-inset w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-xl">
                <Plus className="h-8 w-8 text-muted-foreground animate-pulse" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Loading...</h3>
              <p className="text-muted-foreground">
                Checking authentication status...
              </p>
            </div>
          ) : !isAuthenticated ? (
            <div className="text-center py-12">
              <div className="neumorphic-inset w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-xl">
                <Plus className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">
                Authentication Required
              </h3>
              <p className="text-muted-foreground mb-4">
                Please sign in to access your notes
              </p>
              <Button
                onClick={() => (window.location.href = "/api/login")}
                className="neumorphic-button"
              >
                Sign In
              </Button>
            </div>
          ) : isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="neumorphic h-64 animate-pulse" />
              ))}
            </div>
          ) : notes.length === 0 ? (
            <div className="text-center py-12">
              <div className="neumorphic-inset w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-xl">
                <Plus className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No notes yet</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery
                  ? "No notes match your search."
                  : "Create your first note to get started!"}
              </p>
              {!searchQuery && (
                <Button
                  onClick={() => setIsCreateOpen(true)}
                  className="neumorphic-button"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Note
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {notes.map((note: Note) => (
                <Card
                  key={note.id}
                  className="neumorphic transition-transform hover:scale-105 cursor-pointer"
                  style={{ backgroundColor: note.backgroundColor }}
                >
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg font-semibold text-gray-800 line-clamp-2">
                        {note.title}
                      </CardTitle>
                      <div className="flex gap-1 ml-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            openNoteInNewTab(note);
                          }}
                          className="h-8 w-8 p-0 hover:bg-black/10"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingNote(note);
                          }}
                          className="h-8 w-8 p-0 hover:bg-black/10"
                        >
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteNote(note.id);
                          }}
                          className="h-8 w-8 p-0 hover:bg-red-100 text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 text-sm mb-4 line-clamp-4">
                      {note.content}
                    </p>

                    {note.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {note.tags.slice(0, 3).map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                        {note.tags.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{note.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}

                    <div className="flex items-center text-xs text-gray-500">
                      <Calendar className="h-3 w-3 mr-1" />
                      {format(new Date(note.updatedAt), "MMM dd, yyyy")}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Edit Note Dialog */}
          <Dialog
            open={!!editingNote}
            onOpenChange={() => setEditingNote(null)}
          >
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Edit Note</DialogTitle>
              </DialogHeader>
              {editingNote && (
                <div className="space-y-4">
                  <Input
                    placeholder="Note title..."
                    value={editingNote.title}
                    onChange={(e) =>
                      setEditingNote({ ...editingNote, title: e.target.value })
                    }
                    className="neumorphic"
                  />
                  <Textarea
                    placeholder="Write your note content..."
                    value={editingNote.content}
                    onChange={(e) =>
                      setEditingNote({
                        ...editingNote,
                        content: e.target.value,
                      })
                    }
                    className="neumorphic min-h-32"
                  />

                  {/* Tags */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Tags</label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {editingNote.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="flex items-center gap-1"
                        >
                          {tag}
                          <X
                            className="h-3 w-3 cursor-pointer"
                            onClick={() => handleRemoveTag(tag, true)}
                          />
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add tag..."
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyPress={(e) => handleTagKeyPress(e, true)}
                        className="neumorphic"
                        list="available-tags-edit"
                      />
                      <datalist id="available-tags-edit">
                        {availableTags.map((tag: string) => (
                          <option key={tag} value={tag} />
                        ))}
                      </datalist>
                      <Button
                        type="button"
                        onClick={() => handleAddTag(tagInput, true)}
                        className="neumorphic-button"
                      >
                        <Tag className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Color Picker */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Background Color
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {COLOR_OPTIONS.map((color) => (
                        <button
                          key={color}
                          type="button"
                          className={`w-8 h-8 rounded-full border-2 ${
                            editingNote.backgroundColor === color
                              ? "border-primary"
                              : "border-gray-300"
                          }`}
                          style={{ backgroundColor: color }}
                          onClick={() =>
                            setEditingNote({
                              ...editingNote,
                              backgroundColor: color,
                            })
                          }
                        />
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setEditingNote(null)}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleUpdateNote}
                      disabled={updateMutation.isPending}
                      className="neumorphic-button"
                    >
                      {updateMutation.isPending ? "Updating..." : "Update Note"}
                    </Button>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </main>
        <Footer />
      </div>
    </>
  );
}
