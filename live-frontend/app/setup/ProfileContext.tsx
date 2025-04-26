// app/setup/ProfileContext.tsx
import React, { createContext, useState, useContext } from "react";

type ProfileData = {
  firstName: string;
  lastName: string;
  username: string;
  photoUri?: string;
  locationName?: string;
  shareLocation?: boolean;
  notificationsEnabled?: boolean;
  email: string;
  password: string;
  // add more fields if needed
};

type ProfileContextType = {
  profile: ProfileData;
  setProfile: React.Dispatch<React.SetStateAction<ProfileData>>;
};

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<ProfileData>({
    firstName: "",
    lastName: "",
    username: "",
    photoUri: "",
    locationName: "",
    shareLocation: false,
    notificationsEnabled: false,
    email: "",
    password: "",
  });

  return (
    <ProfileContext.Provider value={{ profile, setProfile }}>
      {children}
    </ProfileContext.Provider>
  );
};

export function useProfile() {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
}
