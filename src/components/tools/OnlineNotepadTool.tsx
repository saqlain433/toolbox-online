
"use client";

import { useState, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Save, Trash2, StickyNote } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const LOCAL_STORAGE_KEY = 'onlineNotepadContent';

export function OnlineNotepadTool() {
  const [notes, setNotes] = useState('');
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const savedNotes = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedNotes) {
      setNotes(savedNotes);
      const savedTimestamp = localStorage.getItem(`${LOCAL_STORAGE_KEY}_timestamp`);
      if (savedTimestamp) {
        setLastSaved(new Date(savedTimestamp).toLocaleString());
      }
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem(LOCAL_STORAGE_KEY, notes);
    const now = new Date();
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_timestamp`, now.toISOString());
    setLastSaved(now.toLocaleString());
    toast({ title: 'Notes Saved!', description: 'Your notes have been saved to local storage.' });
  };

  const handleClear = () => {
    setNotes('');
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    localStorage.removeItem(`${LOCAL_STORAGE_KEY}_timestamp`);
    setLastSaved(null);
    toast({ title: 'Notes Cleared!', description: 'Notepad has been cleared.' });
  };

  // Auto-save periodically (e.g., every 30 seconds) or on unmount
  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      if (document.hasFocus() && notes !== localStorage.getItem(LOCAL_STORAGE_KEY)) { // Only save if notes changed and window is focused
        handleSave();
      }
    }, 30000); // Auto-save every 30 seconds

    return () => {
      clearInterval(autoSaveInterval);
      // Optional: save on unmount/page close if notes have changed
      // This can be unreliable, so frequent auto-save is better.
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notes]); // Re-run effect if notes change to reset interval logic or save immediately

  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">
        A simple notepad to quickly jot down notes. Your notes are automatically saved in your browser's local storage.
      </p>
      <Card>
        <CardHeader>
            <div className="flex justify-between items-center">
                <CardTitle className="flex items-center"><StickyNote className="mr-2 h-6 w-6 text-primary"/>Online Notepad</CardTitle>
                {lastSaved && <p className="text-xs text-muted-foreground">Last saved: {lastSaved}</p>}
            </div>
            <CardDescription>Type your notes below. They will be auto-saved periodically.</CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            id="notepad-area"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Start typing your notes here..."
            rows={15}
            className="text-base w-full resize-y"
          />
        </CardContent>
      </Card>
      <div className="flex flex-wrap gap-2">
        <Button onClick={handleSave} className="bg-accent hover:bg-accent/90 text-accent-foreground">
          <Save className="mr-2 h-4 w-4" /> Save Notes
        </Button>
        <Button onClick={handleClear} variant="outline">
          <Trash2 className="mr-2 h-4 w-4" /> Clear Notes
        </Button>
      </div>
       <Card className="bg-secondary/30 mt-4">
        <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">
                <strong>Note:</strong> Your notes are saved in your browser's local storage. They are not stored on any server and will be lost if you clear your browser data.
            </p>
        </CardContent>
       </Card>
    </div>
  );
}
