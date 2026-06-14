import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

const defaultUsers = [
  {
    name: "Administrator",
    email: "admin@test.com",
    password: "admin123",
    role: "admin",
    phone: "",
    city: "",
  },
];

function getStoredUsers() {
  const savedUsers = localStorage.getItem("autoservisUsers");

  if (savedUsers) {
    return JSON.parse(savedUsers);
  }

  localStorage.setItem("autoservisUsers", JSON.stringify(defaultUsers));
  return defaultUsers;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    getStoredUsers();

    const savedUser = localStorage.getItem("autoservisUser");

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  function login(email, password) {
    const users = getStoredUsers();

    const foundUser = users.find(
      (item) =>
        item.email.toLowerCase() === email.toLowerCase() &&
        item.password === password
    );

    if (!foundUser) {
      return {
        success: false,
        message: "Korisnik nije pronađen ili lozinka nije ispravna.",
      };
    }

    const loggedUser = {
      name: foundUser.name,
      email: foundUser.email,
      role: foundUser.role,
      phone: foundUser.phone || "",
      city: foundUser.city || "",
    };

    localStorage.setItem("autoservisUser", JSON.stringify(loggedUser));
    setUser(loggedUser);

    return {
      success: true,
    };
  }

  function register(name, email, password) {
    const users = getStoredUsers();

    const userExists = users.some(
      (item) => item.email.toLowerCase() === email.toLowerCase()
    );

    if (userExists) {
      return {
        success: false,
        message: "Korisnik sa ovom email adresom već postoji.",
      };
    }

    const newUser = {
      name,
      email: email.toLowerCase(),
      password,
      role: "user",
      phone: "",
      city: "",
    };

    const updatedUsers = [...users, newUser];
    localStorage.setItem("autoservisUsers", JSON.stringify(updatedUsers));

    const loggedUser = {
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      phone: newUser.phone,
      city: newUser.city,
    };

    localStorage.setItem("autoservisUser", JSON.stringify(loggedUser));
    setUser(loggedUser);

    return {
      success: true,
    };
  }

  function updateProfile(profileData) {
    const users = getStoredUsers();

    const updatedUsers = users.map((item) =>
      item.email === user.email
        ? {
            ...item,
            name: profileData.name,
            phone: profileData.phone,
            city: profileData.city,
          }
        : item
    );

    localStorage.setItem("autoservisUsers", JSON.stringify(updatedUsers));

    const updatedUser = {
      ...user,
      name: profileData.name,
      phone: profileData.phone,
      city: profileData.city,
    };

    localStorage.setItem("autoservisUser", JSON.stringify(updatedUser));
    setUser(updatedUser);

    return {
      success: true,
    };
  }

  function logout() {
    localStorage.removeItem("autoservisUser");
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{ user, login, register, updateProfile, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}