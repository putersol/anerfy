import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useMedicusStore, type OnboardingData } from '@/stores/medicusStore';

/**
 * Syncs the local Zustand store with the user's Supabase profile.
 * - On login: loads profile from DB into store
 * - On store changes: debounced save to DB
 */
export function useProfile() {
  const { user } = useAuth();
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout>>();
  
  const store = useMedicusStore();

  // Load profile from Supabase on login
  useEffect(() => {
    if (!user) {
      setLoaded(false);
      return;
    }

    const loadProfile = async () => {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading profile:', error);
        setLoaded(true);
        return;
      }

      if (data) {
        // Load onboarding data
        if (data.country) store.setOnboardingField('country', data.country);
        if (data.anabin_status) store.setOnboardingField('anabinStatus', data.anabin_status);
        if (data.german_level) store.setOnboardingField('germanLevel', data.german_level);
        if (data.in_germany) store.setOnboardingField('inGermany', data.in_germany);
        if (data.city) store.setOnboardingField('city', data.city);
        if (data.family_status) store.setOnboardingField('familyStatus', data.family_status);
        if (data.budget) store.setOnboardingField('budget', data.budget);
        if (data.current_stage) store.setOnboardingField('currentStage', data.current_stage);
        
        // Load checked tasks
        if (data.checked_tasks && typeof data.checked_tasks === 'object') {
          const tasks = data.checked_tasks as Record<string, boolean>;
          Object.entries(tasks).forEach(([taskId, checked]) => {
            if (checked && !store.roadmap.checkedTasks[taskId]) {
              store.toggleTask(taskId);
            }
          });
        }

        // Mark onboarding as completed if we have data
        if (data.country && data.current_stage) {
          store.completeOnboarding();
        }
      }

      setLoaded(true);
    };

    loadProfile();
  }, [user]);

  // Save profile to Supabase (debounced)
  const saveProfile = useCallback(async () => {
    if (!user) return;
    setSaving(true);

    const state = useMedicusStore.getState();

    const profileData = {
      user_id: user.id,
      email: user.email,
      country: state.onboarding.country || null,
      anabin_status: state.onboarding.anabinStatus || null,
      german_level: state.onboarding.germanLevel || null,
      in_germany: state.onboarding.inGermany || null,
      city: state.onboarding.city || null,
      family_status: state.onboarding.familyStatus || null,
      budget: state.onboarding.budget || null,
      current_stage: state.onboarding.currentStage || null,
      checked_tasks: state.roadmap.checkedTasks,
    };

    const { error } = await supabase
      .from('user_profiles')
      .upsert(profileData, { onConflict: 'user_id' });

    if (error) console.error('Error saving profile:', error);
    setSaving(false);
  }, [user]);

  // Debounced save on store changes
  const debouncedSave = useCallback(() => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      saveProfile();
    }, 1500);
  }, [saveProfile]);

  // Subscribe to store changes
  useEffect(() => {
    if (!user || !loaded) return;
    
    const unsubscribe = useMedicusStore.subscribe(() => {
      debouncedSave();
    });

    return () => {
      unsubscribe();
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [user, loaded, debouncedSave]);

  return { loaded, saving };
}
