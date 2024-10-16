"use client";

import { createSignerFromKey } from "@nillion/client-payments";
import { useNillionAuth, UserCredentials } from "@nillion/client-react-hooks";
import { useEffect, useState } from "react";

export const Login = ({
  autoLogin = false,
  onAuthChange,
}: {
  autoLogin: boolean;
  onAuthChange: (authenticated: boolean) => void;
}) => {
  const { authenticated, login, logout } = useNillionAuth();
  // Feel free to set this to other values + useSetState
  const SEED = "tinybid";
  const NILLION_KEY = process.env.NEXT_PUBLIC_NILLION_PRIVATE_KEY;

  if (!NILLION_KEY) {
    throw new Error(
      "NEXT_PUBLIC_NILLION_PRIVATE_KEY is not set in .env. Make sure to create a .env file with your private key",
    );
  }

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    onAuthChange(authenticated);
  }, [authenticated]);

  useEffect(() => {
    if (autoLogin && !authenticated) {
      setTimeout(() => {
        handleLogin();
      }, 2000);
    }
  }, [autoLogin]);

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      const credentials: UserCredentials = {
        userSeed: SEED,
        signer: () => createSignerFromKey(NILLION_KEY),
      };
      await login(credentials);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await logout();
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-row flex my-6">
      {authenticated ? (
        <p>Connected to Nillion</p>
      ) : (
        <p>Connecting to Nillion...</p>
      )}
    </div>
  );
};
