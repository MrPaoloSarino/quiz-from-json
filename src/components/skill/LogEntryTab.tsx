import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { SkillTree } from '@/types/skill';

interface LogEntryTabProps<T extends { id: string; skillId: string; date: string; } & Record<string, any>> {
  skillTrees: SkillTree[];
  storageKey: string;
  title: string;
  addEditTitle: string;
  recentEntriesTitle: string;
  formFields: Array<{ name: keyof T; label: string; type: string; placeholder: string; options?: string[]; } & Record<string, any>>;
  renderEntry: (entry: T, skillName: string) => React.ReactNode;
  initialNewEntry: Omit<T, 'id'>;
}

const LogEntryTab = <T extends { id: string; skillId: string; date: string; } & Record<string, any>>({
  skillTrees,
  storageKey,
  title,
  addEditTitle,
  recentEntriesTitle,
  formFields,
  renderEntry,
  initialNewEntry,
}: LogEntryTabProps<T>) => {
  const [entries, setEntries] = useState<T[]>([]);
  const [newEntry, setNewEntry] = useState<Omit<T, 'id'>>(initialNewEntry);
  const [editIdx, setEditIdx] = useState<number | null>(null);
  const [deleteIdx, setDeleteIdx] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setEntries(JSON.parse(localStorage.getItem(storageKey) || '[]'));
    setLoading(false);
  }, [storageKey]);

  const saveEntries = (updated: T[]) => {
    setEntries(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));
  };

  const handleAddOrEdit = () => {
    for (const field of formFields) {
      if (field.name !== 'notes' && field.name !== 'content' && !newEntry[field.name]) {
        toast.error(`Please fill all required fields.`);
        return;
      }
    }

    let updated;
    if (editIdx !== null) {
      updated = [...entries];
      updated[editIdx] = { ...updated[editIdx], ...newEntry, date: new Date(newEntry.date).toISOString().split('T')[0] };
      setEditIdx(null);
      toast.success(`${title} updated.`);
    } else {
      updated = [{ id: Date.now().toString(), ...newEntry, date: new Date(newEntry.date).toISOString().split('T')[0] } as T, ...entries];
      toast.success(`${title} added.`);
    }
    saveEntries(updated);
    setNewEntry(initialNewEntry);
  };

  const handleEdit = (idx: number) => {
    const entryToEdit = entries[idx];
    setNewEntry({ ...entryToEdit, date: new Date(entryToEdit.date).toISOString().split('T')[0] });
    setEditIdx(idx);
  };

  const handleDelete = () => {
    if (deleteIdx === null) return;
    const updated = entries.filter((_, idx) => idx !== deleteIdx);
    saveEntries(updated);
    setDeleteIdx(null);
    toast.success(`${title} deleted.`);
  };

  const sortedEntries = [...entries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const getSkillName = (skillId: string): string => {
    for (const tree of skillTrees) {
      const node = tree.nodes.find(n => n.id === skillId);
      if (node) return node.name;
    }
    return skillId; // fallback to ID if not found
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader><CardTitle>{editIdx !== null ? `Edit ${addEditTitle}` : `Log ${addEditTitle}`}</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          <Select value={newEntry.skillId} onValueChange={(value) => setNewEntry({ ...newEntry, skillId: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select Skill" />
            </SelectTrigger>
            <SelectContent>
              {skillTrees.flatMap(tree => tree.nodes).map(node => (
                <SelectItem key={node.id} value={node.id}>{node.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {formFields.map(field => {
            if (field.name === 'skillId') return null;
            if (field.type === 'textarea') {
              return (
                <Textarea
                  key={field.name as string}
                  value={newEntry[field.name] || ''}
                  onChange={(e) => setNewEntry({ ...newEntry, [field.name]: e.target.value })}
                  placeholder={field.placeholder}
                />
              );
            } else if (field.type === 'select' && field.options) {
              return (
                <Select
                  key={field.name as string}
                  value={newEntry[field.name] || ''}
                  onValueChange={(value) => setNewEntry({ ...newEntry, [field.name]: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={field.placeholder} />
                  </SelectTrigger>
                  <SelectContent>
                    {field.options.map(option => (
                      <SelectItem key={option} value={option}>{option}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              );
            } else {
              return (
                <Input
                  key={field.name as string}
                  type={field.type}
                  value={newEntry[field.name] || ''}
                  onChange={(e) => setNewEntry({ ...newEntry, [field.name]: e.target.value })}
                  placeholder={field.placeholder}
                />
              );
            }
          })}
          <div className="flex gap-2">
            <Button onClick={handleAddOrEdit}>{editIdx !== null ? 'Update' : 'Add'} {addEditTitle}</Button>
            {editIdx !== null && <Button variant="outline" onClick={() => { setEditIdx(null); setNewEntry(initialNewEntry); }}>Cancel</Button>}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>{recentEntriesTitle}</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {loading ? <div className="text-gray-500">Loading...</div> : sortedEntries.length === 0 ? <div className="text-gray-500">No entries yet</div> : sortedEntries.map((entry, idx) => (
            <div key={entry.id} className="border rounded p-2 flex justify-between items-center">
              {renderEntry(entry, getSkillName(entry.skillId))}
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => handleEdit(idx)}>Edit</Button>
                <Button size="sm" variant="destructive" onClick={() => setDeleteIdx(idx)}>Delete</Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
      <Dialog open={deleteIdx !== null} onOpenChange={v => !v && setDeleteIdx(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Delete {title}?</DialogTitle></DialogHeader>
          <p>Are you sure you want to delete this {title.toLowerCase()}?</p>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LogEntryTab;