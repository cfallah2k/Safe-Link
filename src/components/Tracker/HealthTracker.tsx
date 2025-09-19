import React, { useState, useEffect, useCallback } from 'react';
import { 
  Calendar, 
  Heart, 
  Droplets, 
  Smile, 
  Frown, 
  Meh,
  Plus,
  Save,
  Target,
  AlertCircle
} from 'lucide-react';
import { format, addDays, subDays, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { offlineStorage } from '../../utils/offlineStorage';

interface CycleEntry {
  id: string;
  date: string;
  flow: 'none' | 'light' | 'medium' | 'heavy';
  symptoms: string[];
  mood: 'happy' | 'sad' | 'neutral' | 'anxious' | 'energetic';
  temperature?: number;
  notes?: string;
  isPeriod: boolean;
}

interface CycleData {
  entries: CycleEntry[];
  cycleLength: number;
  periodLength: number;
  lastPeriod: string;
  predictions: {
    nextPeriod: string;
    ovulation: string;
    fertileWindow: { start: string; end: string };
  };
}

const HealthTracker: React.FC = () => {
  const [cycleData, setCycleData] = useState<CycleData>({
    entries: [],
    cycleLength: 28,
    periodLength: 5,
    lastPeriod: '',
    predictions: {
      nextPeriod: '',
      ovulation: '',
      fertileWindow: { start: '', end: '' }
    }
  });
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showEntryForm, setShowEntryForm] = useState(false);
  const [currentEntry, setCurrentEntry] = useState<Partial<CycleEntry>>({
    flow: 'none',
    symptoms: [],
    mood: 'neutral',
    isPeriod: false
  });

  const flowOptions = [
    { value: 'none', label: 'None', color: 'bg-gray-100' },
    { value: 'light', label: 'Light', color: 'bg-blue-100' },
    { value: 'medium', label: 'Medium', color: 'bg-orange-100' },
    { value: 'heavy', label: 'Heavy', color: 'bg-red-100' }
  ];

  const moodOptions = [
    { value: 'happy', label: 'Happy', icon: Smile, color: 'text-green-600' },
    { value: 'sad', label: 'Sad', icon: Frown, color: 'text-blue-600' },
    { value: 'neutral', label: 'Neutral', icon: Meh, color: 'text-gray-600' },
    { value: 'anxious', label: 'Anxious', icon: AlertCircle, color: 'text-yellow-600' },
    { value: 'energetic', label: 'Energetic', icon: Heart, color: 'text-red-600' }
  ];

  const symptomOptions = [
    'Cramps', 'Bloating', 'Headache', 'Nausea', 'Fatigue', 'Mood swings',
    'Breast tenderness', 'Acne', 'Food cravings', 'Insomnia', 'Hot flashes'
  ];

  const loadCycleData = async () => {
    try {
      const stored = await offlineStorage.getData('cycle_data');
      if (stored) {
        setCycleData(stored);
      }
    } catch (error) {
      console.error('Failed to load cycle data:', error);
    }
  };

  const saveCycleData = async (newData: CycleData) => {
    try {
      await offlineStorage.storeData('cycle_data', newData);
      setCycleData(newData);
    } catch (error) {
      console.error('Failed to save cycle data:', error);
    }
  };

  const calculatePredictions = useCallback(() => {
    const entries = cycleData.entries;
    if (entries.length === 0) return;

    // Find last period
    const lastPeriodEntry = entries
      .filter(entry => entry.isPeriod)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

    if (!lastPeriodEntry) return;

    const lastPeriodDate = new Date(lastPeriodEntry.date);
    const nextPeriodDate = addDays(lastPeriodDate, cycleData.cycleLength);
    const ovulationDate = addDays(lastPeriodDate, cycleData.cycleLength - 14);
    const fertileStart = subDays(ovulationDate, 5);
    const fertileEnd = addDays(ovulationDate, 1);

    const newPredictions = {
      nextPeriod: format(nextPeriodDate, 'yyyy-MM-dd'),
      ovulation: format(ovulationDate, 'yyyy-MM-dd'),
      fertileWindow: {
        start: format(fertileStart, 'yyyy-MM-dd'),
        end: format(fertileEnd, 'yyyy-MM-dd')
      }
    };

    setCycleData(prev => ({
      ...prev,
      predictions: newPredictions
    }));
  }, [cycleData.entries, cycleData.cycleLength]);

  const getEntryForDate = (date: Date): CycleEntry | undefined => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return cycleData.entries.find(entry => entry.date === dateStr);
  };

  useEffect(() => {
    loadCycleData();
  }, []);

  useEffect(() => {
    calculatePredictions();
  }, [calculatePredictions]);

  const getDateColor = (date: Date): string => {
    const entry = getEntryForDate(date);
    const dateStr = format(date, 'yyyy-MM-dd');
    
    if (entry?.isPeriod) {
      switch (entry.flow) {
        case 'light': return 'bg-blue-200';
        case 'medium': return 'bg-orange-200';
        case 'heavy': return 'bg-red-200';
        default: return 'bg-gray-200';
      }
    }
    
    if (dateStr === cycleData.predictions.nextPeriod) return 'bg-pink-100';
    if (dateStr === cycleData.predictions.ovulation) return 'bg-yellow-100';
    if (dateStr >= cycleData.predictions.fertileWindow.start && 
        dateStr <= cycleData.predictions.fertileWindow.end) return 'bg-green-100';
    
    return 'bg-white';
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    const existingEntry = getEntryForDate(date);
    if (existingEntry) {
      setCurrentEntry(existingEntry);
    } else {
      setCurrentEntry({
        flow: 'none',
        symptoms: [],
        mood: 'neutral',
        isPeriod: false
      });
    }
    setShowEntryForm(true);
  };

  const handleSaveEntry = () => {
    const entry: CycleEntry = {
      id: currentEntry.id || Date.now().toString(),
      date: format(selectedDate, 'yyyy-MM-dd'),
      flow: currentEntry.flow || 'none',
      symptoms: currentEntry.symptoms || [],
      mood: currentEntry.mood || 'neutral',
      temperature: currentEntry.temperature,
      notes: currentEntry.notes,
      isPeriod: currentEntry.isPeriod || false
    };

    const existingIndex = cycleData.entries.findIndex(e => e.id === entry.id);
    let newEntries;
    
    if (existingIndex >= 0) {
      newEntries = [...cycleData.entries];
      newEntries[existingIndex] = entry;
    } else {
      newEntries = [...cycleData.entries, entry];
    }

    const newCycleData = { ...cycleData, entries: newEntries };
    saveCycleData(newCycleData);
    setShowEntryForm(false);
  };

  const handleSymptomToggle = (symptom: string) => {
    const symptoms = currentEntry.symptoms || [];
    const newSymptoms = symptoms.includes(symptom)
      ? symptoms.filter(s => s !== symptom)
      : [...symptoms, symptom];
    setCurrentEntry({ ...currentEntry, symptoms: newSymptoms });
  };

  const generateCalendarDays = () => {
    const start = startOfMonth(selectedDate);
    const end = endOfMonth(selectedDate);
    const days = eachDayOfInterval({ start, end });
    
    return days.map(day => ({
      date: day,
      isCurrentMonth: day.getMonth() === selectedDate.getMonth(),
      isToday: isSameDay(day, new Date())
    }));
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Health Tracker</h1>
          <button
            onClick={() => setShowEntryForm(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus size={16} />
            <span>Add Entry</span>
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              <span className="font-medium text-blue-900">Cycle Length</span>
            </div>
            <p className="text-2xl font-bold text-blue-600">{cycleData.cycleLength} days</p>
          </div>
          
          <div className="bg-pink-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Droplets className="w-5 h-5 text-pink-600" />
              <span className="font-medium text-pink-900">Period Length</span>
            </div>
            <p className="text-2xl font-bold text-pink-600">{cycleData.periodLength} days</p>
          </div>
          
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Target className="w-5 h-5 text-green-600" />
              <span className="font-medium text-green-900">Next Period</span>
            </div>
            <p className="text-sm font-bold text-green-600">
              {cycleData.predictions.nextPeriod ? format(new Date(cycleData.predictions.nextPeriod), 'MMM dd') : 'Unknown'}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                {format(selectedDate, 'MMMM yyyy')}
              </h2>
              <div className="flex space-x-2">
                <button
                  onClick={() => setSelectedDate(subDays(selectedDate, 1))}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  ←
                </button>
                <button
                  onClick={() => setSelectedDate(new Date())}
                  className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg"
                >
                  Today
                </button>
                <button
                  onClick={() => setSelectedDate(addDays(selectedDate, 1))}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  →
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {generateCalendarDays().map(({ date, isCurrentMonth, isToday }) => (
                <button
                  key={date.toISOString()}
                  onClick={() => handleDateClick(date)}
                  className={`
                    p-2 text-sm rounded-lg border transition-colors
                    ${isCurrentMonth ? 'text-gray-900' : 'text-gray-400'}
                    ${isToday ? 'ring-2 ring-primary-500' : ''}
                    ${getDateColor(date)}
                    hover:bg-gray-100
                  `}
                >
                  {format(date, 'd')}
                </button>
              ))}
            </div>

            {/* Legend */}
            <div className="mt-4 flex flex-wrap gap-4 text-xs">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-200 rounded"></div>
                <span>Heavy Flow</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-orange-200 rounded"></div>
                <span>Medium Flow</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-200 rounded"></div>
                <span>Light Flow</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-pink-100 rounded"></div>
                <span>Predicted Period</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-100 rounded"></div>
                <span>Ovulation</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-100 rounded"></div>
                <span>Fertile Window</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Predictions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Predictions</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Next Period:</span>
                <span className="text-sm font-medium">
                  {cycleData.predictions.nextPeriod ? format(new Date(cycleData.predictions.nextPeriod), 'MMM dd') : 'Unknown'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Ovulation:</span>
                <span className="text-sm font-medium">
                  {cycleData.predictions.ovulation ? format(new Date(cycleData.predictions.ovulation), 'MMM dd') : 'Unknown'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Fertile Window:</span>
                <span className="text-sm font-medium">
                  {cycleData.predictions.fertileWindow.start ? 
                    `${format(new Date(cycleData.predictions.fertileWindow.start), 'MMM dd')} - ${format(new Date(cycleData.predictions.fertileWindow.end), 'MMM dd')}` 
                    : 'Unknown'}
                </span>
              </div>
            </div>
          </div>

          {/* Recent Entries */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Entries</h3>
            <div className="space-y-3">
              {cycleData.entries
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .slice(0, 5)
                .map(entry => (
                  <div key={entry.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div>
                      <p className="text-sm font-medium">{format(new Date(entry.date), 'MMM dd')}</p>
                      <p className="text-xs text-gray-500">
                        {entry.flow} • {entry.mood} • {entry.symptoms.length} symptoms
                      </p>
                    </div>
                    {entry.isPeriod && (
                      <Droplets className="w-4 h-4 text-red-500" />
                    )}
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* Entry Form Modal */}
      {showEntryForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Entry for {format(selectedDate, 'MMM dd, yyyy')}
                </h3>
                <button
                  onClick={() => setShowEntryForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                {/* Flow */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Flow</label>
                  <div className="grid grid-cols-2 gap-2">
                    {flowOptions.map(option => (
                      <button
                        key={option.value}
                        onClick={() => setCurrentEntry({ ...currentEntry, flow: option.value as any })}
                        className={`p-2 rounded-lg text-sm ${
                          currentEntry.flow === option.value ? option.color : 'bg-gray-100'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Period Toggle */}
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isPeriod"
                    checked={currentEntry.isPeriod || false}
                    onChange={(e) => setCurrentEntry({ ...currentEntry, isPeriod: e.target.checked })}
                    className="rounded"
                  />
                  <label htmlFor="isPeriod" className="text-sm font-medium text-gray-700">
                    This is a period day
                  </label>
                </div>

                {/* Mood */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mood</label>
                  <div className="flex space-x-2">
                    {moodOptions.map(option => {
                      const Icon = option.icon;
                      return (
                        <button
                          key={option.value}
                          onClick={() => setCurrentEntry({ ...currentEntry, mood: option.value as any })}
                          className={`p-2 rounded-lg ${
                            currentEntry.mood === option.value ? 'bg-gray-100' : 'hover:bg-gray-50'
                          }`}
                        >
                          <Icon className={`w-5 h-5 ${option.color}`} />
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Symptoms */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Symptoms</label>
                  <div className="flex flex-wrap gap-2">
                    {symptomOptions.map(symptom => (
                      <button
                        key={symptom}
                        onClick={() => handleSymptomToggle(symptom)}
                        className={`px-3 py-1 rounded-full text-sm ${
                          currentEntry.symptoms?.includes(symptom) 
                            ? 'bg-primary-100 text-primary-700' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {symptom}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Temperature */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Temperature (°C)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={currentEntry.temperature || ''}
                    onChange={(e) => setCurrentEntry({ ...currentEntry, temperature: parseFloat(e.target.value) })}
                    className="input-field"
                    placeholder="36.5"
                  />
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                  <textarea
                    value={currentEntry.notes || ''}
                    onChange={(e) => setCurrentEntry({ ...currentEntry, notes: e.target.value })}
                    className="input-field"
                    rows={3}
                    placeholder="Any additional notes..."
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={() => setShowEntryForm(false)}
                    className="flex-1 btn-outline"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveEntry}
                    className="flex-1 btn-primary flex items-center justify-center space-x-2"
                  >
                    <Save size={16} />
                    <span>Save</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HealthTracker;
