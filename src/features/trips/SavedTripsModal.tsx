import React, { useState } from 'react';
import {
  SavedTripSummary,
  getSavedTripsLibrary,
  deleteTripFromLibrary,
  duplicateTripInLibrary,
  saveTripToLibrary,
  exportTripsAsJson,
  importTripsFromJson,
} from '../../lib/storage/tripStorage';
import { GeneratedItinerary } from '../../types/travel';
import {
  X,
  Bookmark,
  Calendar,
  Compass,
  Copy,
  Trash2,
  Download,
  Upload,
  Plus,
  ArrowRight,
  Check,
} from 'lucide-react';

interface SavedTripsModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeItinerary: GeneratedItinerary | null;
  onSelectTrip: (itinerary: GeneratedItinerary) => void;
  onShowToast: (title: string, message?: string, type?: 'success' | 'info' | 'warning') => void;
}

export const SavedTripsModal: React.FC<SavedTripsModalProps> = ({
  isOpen,
  onClose,
  activeItinerary,
  onSelectTrip,
  onShowToast,
}) => {
  const [trips, setTrips] = useState<SavedTripSummary[]>(getSavedTripsLibrary());
  const [saveName, setSaveName] = useState('');
  const [isSavingCurrent, setIsSavingCurrent] = useState(false);

  if (!isOpen) return null;

  const refreshList = () => {
    setTrips(getSavedTripsLibrary());
  };

  const handleSaveActive = () => {
    if (!activeItinerary) return;
    const saved = saveTripToLibrary(activeItinerary, saveName.trim() || undefined);
    refreshList();
    setIsSavingCurrent(false);
    setSaveName('');
    onShowToast('Trip Saved to Library', `"${saved.name}" has been preserved in local storage.`, 'success');
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to remove "${name}" from your saved trips?`)) {
      deleteTripFromLibrary(id);
      refreshList();
      onShowToast('Trip Removed', `Deleted "${name}" from local storage.`, 'info');
    }
  };

  const handleDuplicate = (id: string) => {
    const dup = duplicateTripInLibrary(id);
    if (dup) {
      refreshList();
      onShowToast('Trip Duplicated', `Created copy "${dup.name}".`, 'success');
    }
  };

  const handleExport = () => {
    const json = exportTripsAsJson();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `WAYFARER-trips-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    onShowToast('Backup Exported', 'Downloaded your saved trips as JSON.', 'success');
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const res = importTripsFromJson(content);
      if (res.success) {
        refreshList();
        onShowToast('Backup Restored', `Imported ${res.count} trips successfully.`, 'success');
      } else {
        onShowToast('Import Failed', 'Invalid JSON backup format.', 'warning');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-float border border-stone-300 space-y-6 max-h-[90vh] flex flex-col font-sans">
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-4 shrink-0">
          <div className="flex items-center space-x-2">
            <Bookmark className="w-5 h-5 text-champagne-600" />
            <h3 className="font-serif text-2xl font-bold text-ink-950">
              My Saved Trips Library
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Save Current Trip Action */}
        {activeItinerary && (
          <div className="p-4 bg-champagne-50/80 rounded-xl border border-champagne-200 shrink-0">
            {isSavingCurrent ? (
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-champagne-900 block">
                  Name Your Trip
                </span>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={saveName}
                    placeholder={`${activeItinerary.destination.name} Holiday`}
                    onChange={(e) => setSaveName(e.target.value)}
                    className="flex-1 px-3 py-2 text-xs rounded-lg border border-stone-300 focus:ring-1 focus:ring-champagne-600"
                  />
                  <button
                    onClick={handleSaveActive}
                    className="px-4 py-2 bg-ink-900 text-ivory-50 rounded-lg text-xs font-bold hover:bg-ink-800"
                  >
                    Confirm Save
                  </button>
                  <button
                    onClick={() => setIsSavingCurrent(false)}
                    className="px-3 py-2 text-stone-600 text-xs font-medium hover:text-stone-900"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-ink-950 block">
                    Save Active {activeItinerary.destination.name} Trip
                  </span>
                  <span className="text-stone-600">
                    Keep this {activeItinerary.days.length}-day journey in your browser library
                  </span>
                </div>
                <button
                  onClick={() => setIsSavingCurrent(true)}
                  className="px-3.5 py-2 bg-champagne-500 hover:bg-champagne-600 text-ink-950 font-bold rounded-lg transition-all flex items-center space-x-1"
                >
                  <Plus className="w-4 h-4" />
                  <span>Save Current Trip</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Saved Trips List */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {trips.length > 0 ? (
            trips.map((t) => {
              const isActive = activeItinerary?.id === t.id;
              return (
                <div
                  key={t.id}
                  className={`p-4 rounded-xl border transition-all ${
                    isActive
                      ? 'border-champagne-400 bg-champagne-50/40'
                      : 'border-stone-200 hover:border-stone-300 bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="font-serif text-base font-bold text-ink-900">{t.name}</h4>
                        {isActive && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sage-100 text-sage-800 uppercase tracking-wider">
                            Active
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-stone-500 mt-0.5">
                        {t.destinationName} • {t.durationDays} Days • {t.departureDate} to {t.returnDate}
                      </p>
                      <p className="text-xs font-semibold text-champagne-700 mt-1">
                        Total Estimate: ₹{t.totalBudgetInr?.toLocaleString('en-IN') || '0'}
                      </p>
                    </div>

                    <div className="flex items-center space-x-1 shrink-0">
                      <button
                        onClick={() => handleDuplicate(t.id)}
                        title="Duplicate Trip"
                        className="p-1.5 rounded-lg border border-stone-250 hover:bg-stone-100 text-stone-600"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(t.id, t.name)}
                        title="Delete Trip"
                        className="p-1.5 rounded-lg border border-stone-250 hover:bg-red-50 text-red-600"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          onSelectTrip(t.itinerary);
                          onClose();
                          onShowToast('Trip Loaded', `Loaded "${t.name}" into your workspace.`, 'success');
                        }}
                        className="px-3 py-1.5 rounded-lg bg-ink-900 hover:bg-ink-800 text-ivory-50 text-xs font-bold flex items-center space-x-1"
                      >
                        <span>Open</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-10 text-stone-500 space-y-2">
              <Compass className="w-8 h-8 mx-auto text-stone-300" />
              <p className="text-xs italic">
                No trips saved in your local library yet. Generate an itinerary and click "Save Current Trip" to preserve it across sessions!
              </p>
            </div>
          )}
        </div>

        {/* Footer with Backup Actions */}
        <div className="pt-4 border-t border-stone-200 flex items-center justify-between text-xs text-stone-600 shrink-0">
          <span className="text-[11px] text-stone-400">
            Stored privately in browser localStorage • Zero external tracking
          </span>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleExport}
              disabled={trips.length === 0}
              className="flex items-center space-x-1 text-champagne-700 hover:underline disabled:opacity-40 font-semibold"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Backup</span>
            </button>
            <label className="flex items-center space-x-1 text-champagne-700 hover:underline cursor-pointer font-semibold">
              <Upload className="w-3.5 h-3.5" />
              <span>Import Backup</span>
              <input type="file" accept=".json" onChange={handleImport} className="hidden" />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

