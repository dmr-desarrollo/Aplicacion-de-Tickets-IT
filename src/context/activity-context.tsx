
'use client';

import { createContext, useState, ReactNode, useEffect } from 'react';
import { collection, onSnapshot, addDoc, updateDoc, doc, serverTimestamp, query, orderBy, where, getDocs, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Activity, Client, HistoryEntry } from '@/lib/data';

interface ActivityContextType {
  activities: Activity[];
  clients: Client[];
  addActivity: (activity: Omit<Activity, 'id'>) => Promise<void>;
  updateActivity: (activityId: string, updatedData: Partial<Activity>) => Promise<void>;
  deleteActivity: (activityId: string) => Promise<void>;
  addClient: (name: string, technicalDetail?: string, contact?: string) => Promise<Client>;
  addHistoryEntry: (activityId: string, action: string, hours: number, minutes: number, date: Date) => Promise<void>;
  updateHistoryEntry: (activityId: string, entryIndex: number, updatedEntry: HistoryEntry) => Promise<void>;
  closeActivity: (activityId: string, action: string, hours: number, minutes: number, date: Date) => Promise<void>;
}

export const ActivityContext = createContext<ActivityContextType>({
  activities: [],
  clients: [],
  addActivity: async () => {},
  updateActivity: async () => {},
  deleteActivity: async () => {},
  addClient: async () => ({ id: '', name: '' }),
  addHistoryEntry: async () => {},
  updateHistoryEntry: async () => {},
  closeActivity: async () => {},
});

export const ActivityProvider = ({ children }: { children: ReactNode }) => {
    const [activities, setActivities] = useState<Activity[]>([]);
    const [clients, setClients] = useState<Client[]>([]);

    useEffect(() => {
        const qActivities = query(collection(db, "activities"), orderBy("registrationDate", "desc"));
        const unsubscribeActivities = onSnapshot(
            qActivities,
            (snapshot) => {
                const activitiesData = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })) as Activity[];
                setActivities(activitiesData);
            },
            (error) => {
                console.error("Error listening to activities: ", error);
            }
        );

        const qClients = query(collection(db, "clients"), orderBy("name", "asc"));
        const unsubscribeClients = onSnapshot(
            qClients,
            (snapshot) => {
                const clientsData = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })) as Client[];
                const uniqueClients = Array.from(new Map(clientsData.map(client => [client.name.toLowerCase(), client])).values());
                setClients(uniqueClients);
            },
            (error) => {
                console.error("Error listening to clients: ", error);
            }
        );

        return () => {
            unsubscribeActivities();
            unsubscribeClients();
        };
    }, []);

  const addActivity = async (activity: Omit<Activity, 'id'>) => {
    try {
      await addDoc(collection(db, 'activities'), {
        ...activity,
        registrationTimestamp: serverTimestamp() 
      });
    } catch (error) {
      console.error("Error adding activity: ", error);
      throw error;
    }
  };
  
  const updateActivity = async (activityId: string, updatedData: Partial<Activity>) => {
    const activityRef = doc(db, 'activities', activityId);
    try {
      await updateDoc(activityRef, updatedData);
    } catch (error) {
      console.error("Error updating activity: ", error);
      throw error;
    }
  };

  const deleteActivity = async (activityId: string) => {
    const activityRef = doc(db, 'activities', activityId);
    try {
      await deleteDoc(activityRef);
    } catch (error) {
      console.error("Error deleting activity: ", error);
      throw error;
    }
  };

  const addClient = async (name: string, technicalDetail?: string, contact?: string): Promise<Client> => {
     const newClientData = { name, technicalDetail, contact };
    try {
      const docRef = await addDoc(collection(db, 'clients'), newClientData);
      return { ...newClientData, id: docRef.id };
    } catch (error) {
      console.error("Error adding client: ", error);
      throw error;
    }
  };

  const addHistoryEntry = async (activityId: string, action: string, hours: number, minutes: number, date: Date) => {
    const activity = activities.find(a => a.id === activityId);
    if (!activity) {
      const error = new Error(`Activity not found when adding history entry: ${activityId}`);
      console.error(error);
      throw error;
    }

    const newHistoryEntry: HistoryEntry = {
      date: date.toISOString(),
      action,
      hours,
      minutes,
    };
    
    const activityRef = doc(db, 'activities', activityId);
    try {
      await updateDoc(activityRef, {
        history: [...activity.history, newHistoryEntry]
      });
    } catch (error) {
      console.error("Error adding history entry: ", error);
      throw error;
    }
  };
  
  const updateHistoryEntry = async (activityId: string, entryIndex: number, updatedEntry: HistoryEntry) => {
    const activity = activities.find(a => a.id === activityId);
    if (!activity) {
      const error = new Error(`Activity not found when updating history entry: ${activityId}`);
      console.error(error);
      throw error;
    }

    if (entryIndex < 0 || entryIndex >= activity.history.length) {
      const error = new Error(`Invalid history entry index ${entryIndex} for activity ${activityId}`);
      console.error(error);
      throw error;
    }

    const updatedHistory = [...activity.history];
    updatedHistory[entryIndex] = updatedEntry;

    const activityRef = doc(db, 'activities', activityId);
    try {
      await updateDoc(activityRef, {
        history: updatedHistory
      });
    } catch (error) {
      console.error("Error updating history entry: ", error);
      throw error;
    }
  };

  const closeActivity = async (activityId: string, action: string, hours: number, minutes: number, date: Date) => {
    const activity = activities.find(a => a.id === activityId);
    if (!activity) {
      const error = new Error(`Activity not found when closing activity: ${activityId}`);
      console.error(error);
      throw error;
    }

    const newHistoryEntry: HistoryEntry = {
      date: date.toISOString(),
      action: `Completada: ${action}`,
      hours,
      minutes,
    };

    const activityRef = doc(db, 'activities', activityId);
    try {
      await updateDoc(activityRef, {
        status: "Completada",
        history: [...activity.history, newHistoryEntry],
      });
    } catch (error) {
       console.error("Error closing activity: ", error);
       throw error;
    }
  };


  return (
    <ActivityContext.Provider value={{ activities, clients, addActivity, updateActivity, deleteActivity, addClient, addHistoryEntry, updateHistoryEntry, closeActivity }}>
      {children}
    </ActivityContext.Provider>
  );
};
