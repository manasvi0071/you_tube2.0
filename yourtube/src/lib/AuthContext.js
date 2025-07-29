import { onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { useState, useEffect, useContext, createContext } from "react";
import { provider, auth } from "./firebase";
import axiosInstance from "./axiosinstance";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const login = (userdata) => {
    setUser(userdata);
    localStorage.setItem("user", JSON.stringify(userdata));
  };

  const logout = async () => {
    setUser(null);
    localStorage.removeItem("user");
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  const handlegooglesignin = async () => {
    if (loading) return;
    setLoading(true);
    try {
      // Check if the current domain is authorized before trying popup
      const currentDomain = window.location.hostname;
      const allowedDomains = ["localhost", "127.0.0.1", "you-tube2-0-beta.vercel.app", "your-custom-domain.com"];
      
      if (!allowedDomains.includes(currentDomain)) {
        throw new Error(`Unauthorized domain: ${currentDomain}`);
      }

      const result = await signInWithPopup(auth, provider);
      console.log("Firebase User:", result.user);
      const firebaseuser = result.user;

      const payload = {
        email: firebaseuser.email,
        name: firebaseuser.displayName,
        image: firebaseuser.photoURL || "https://github.com/shadcn.png",
      };
      console.log("Sending payload to backend:", payload);

      const response = await axiosInstance.post("/user/login", payload);
      login(response.data.result);
    } catch (error) {
      if (error.code === "auth/popup-closed-by-user") {
        console.warn("User closed popup before signing in.");
      } else {
        console.error("Google Sign-In error:", error.message || error);
        alert(`Error: ${error.message || error}`);
      }
    } finally {
      setLoading(true);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseuser) => {
      if (firebaseuser && !user) {
        try {
          const payload = {
            email: firebaseuser.email,
            name: firebaseuser.displayName,
            image: firebaseuser.photoURL || "https://github.com/shadcn.png",
          };
          const response = await axiosInstance.post("/user/login", payload);
          login(response.data.result);
        } catch (error) {
          console.error("Login error:", error);
          logout();
        }
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <UserContext.Provider value={{ user, login, logout, handlegooglesignin, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
