import { create } from 'zustand';
import { User, Team, CarbonLog, TrashReport, Event, Badge } from '../types';

interface AppState {
  // Auth
  user: User | null;
  isAuthenticated: boolean;

  // Theme
  isDarkMode: boolean;

  // Data
  team: Team | null;
  carbonLogs: CarbonLog[];
  trashReports: TrashReport[];
  events: Event[];
  badges: Badge[];

  // Actions
  setUser: (user: User | null) => void;
  setAuthenticated: (isAuth: boolean) => void;
  toggleDarkMode: () => void;
  setTeam: (team: Team | null) => void;
  addCarbonLog: (log: CarbonLog) => void;
  setCarbonLogs: (logs: CarbonLog[]) => void;
  addTrashReport: (report: TrashReport) => void;
  updateTrashReport: (id: string, updates: Partial<TrashReport>) => void;
  setEvents: (events: Event[]) => void;
  addEvent: (event: Event) => void;
  setBadges: (badges: Badge[]) => void;
}

export const useStore = create<AppState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isDarkMode: false,
  team: null,
  carbonLogs: [], // Initialize as empty array
  trashReports: [],
  events: [],
  badges: [],

  setUser: (user) => set({ user }),
                                                        setAuthenticated: (isAuth) => set({ isAuthenticated: isAuth }),
                                                        toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
                                                        setTeam: (team) => set({ team }),

                                                        // Add single log
                                                        addCarbonLog: (log) =>
                                                        set((state) => ({ carbonLogs: [...state.carbonLogs, log] })),

                                                        // Set fetched logs array
                                                        setCarbonLogs: (logs) => set({ carbonLogs: logs ?? [] }),

                                                        addTrashReport: (report) =>
                                                        set((state) => ({ trashReports: [...state.trashReports, report] })),
                                                        updateTrashReport: (id, updates) =>
                                                        set((state) => ({
                                                          trashReports: state.trashReports.map((report) =>
                                                          report.id === id ? { ...report, ...updates } : report
                                                          ),
                                                        })),
                                                        setEvents: (events) => set({ events }),
                                                        addEvent: (event) =>
                                                        set((state) => ({ events: [...state.events, event] })),
                                                        setBadges: (badges) => set({ badges }),
}));
