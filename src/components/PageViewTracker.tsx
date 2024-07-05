"use client";

import { sendEventToGA } from "@/utils/sendEventToGA";

export const PageViewTracker = ({
  children,
  user,
}: React.PropsWithChildren<{ user: string }>) => {
  sendEventToGA("page|view", user, "page", "album");
  return children;
};
