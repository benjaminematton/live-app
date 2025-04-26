import React, { createContext, useContext, useState } from 'react';
import { ExperienceRequest } from '../types/types';

type ExperienceContextType = {
    experienceData: ExperienceRequest;
  setExperienceData: (data: Partial<ExperienceRequest>) => void;
  clearExperienceData: () => void;
};

const ExperienceCreationContext = createContext<ExperienceContextType | undefined>(undefined);

export const ExperienceCreationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [experienceData, setExperienceDataState] = useState<ExperienceRequest>({});

  const setExperienceData = (data: Partial<ExperienceRequest>) => {
    setExperienceDataState(prev => ({ ...prev, ...data }));
  };

  const clearExperienceData = () => setExperienceDataState({});

  return (
    <ExperienceCreationContext.Provider value={{ experienceData, setExperienceData, clearExperienceData }}>
      {children}
    </ExperienceCreationContext.Provider>
  );
};

export const useExperienceCreation = () => {
  const context = useContext(ExperienceCreationContext);
  if (!context) throw new Error('useExperienceCreation must be used inside ExperienceCreationProvider');
  return context;
};