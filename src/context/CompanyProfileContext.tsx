
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface CompanyProfile {
  logo: string;
  name: string;
  erpName: string;
  description: string;
  website: string;
  email: string;
  whatsapp: string;
}

const defaultProfile: CompanyProfile = {
  logo: "https://s3eed.ae/wp-content/uploads/2025/04/logo13.png",
  name: "Saeed Store Electronics",
  erpName: "Saeed ERP",
  description: "Dubai, United Arab Emirates",
  website: "S3eed.ae",
  email: "info@s3eed.ae",
  whatsapp: "+971553813831",
};

interface CompanyProfileContextType {
  profile: CompanyProfile;
  setProfile: (profile: CompanyProfile) => void;
  loading: boolean;
}

const CompanyProfileContext = createContext<CompanyProfileContextType | undefined>(undefined);

export function CompanyProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfileState] = useState<CompanyProfile>(defaultProfile);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedProfile = localStorage.getItem('erpCompanyProfile');
      if (storedProfile) {
        setProfileState(JSON.parse(storedProfile));
      }
    } catch (error) {
        console.error("Failed to parse company profile from localStorage", error);
        setProfileState(defaultProfile);
    }
    setLoading(false);
  }, []);

  const setProfile = (newProfile: CompanyProfile) => {
    localStorage.setItem('erpCompanyProfile', JSON.stringify(newProfile));
    setProfileState(newProfile);
  };

  const value = { profile, setProfile, loading };

  return (
    <CompanyProfileContext.Provider value={value}>
      {!loading && children}
    </CompanyProfileContext.Provider>
  );
}

export function useCompanyProfile() {
  const context = useContext(CompanyProfileContext);
  if (context === undefined) {
    throw new Error('useCompanyProfile must be used within a CompanyProfileProvider');
  }
  return context;
}
