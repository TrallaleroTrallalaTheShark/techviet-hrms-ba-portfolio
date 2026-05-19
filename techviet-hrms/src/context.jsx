import { createContext, useContext } from "react";

// Tách riêng kho chứa Role
export const RoleContext = createContext();
export const useRole = () => useContext(RoleContext);

// Tách riêng kho chứa Data
export const DataContext = createContext();
export const useData = () => useContext(DataContext);

export const LanguageContext = createContext({
  language: "en",
  setLanguage: () => {},
  t: (_key, fallback) => fallback,
});
export const useLanguage = () => useContext(LanguageContext);
