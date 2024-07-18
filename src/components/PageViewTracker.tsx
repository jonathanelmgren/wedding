"use client";

import { sendEventToGA } from "@/utils/sendEventToGA";
import { useUser } from "./UserProvider";

export const PageViewTracker = ({ children }: React.PropsWithChildren) => {
  const { user } = useUser();
  if (user) {
    sendEventToGA("page|view", user, "page", "album");
  }
  return children;
};
