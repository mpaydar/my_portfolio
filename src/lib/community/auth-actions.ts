"use server";

import config from "@payload-config";
import { login, logout } from "@payloadcms/next/auth";
import { redirect } from "next/navigation";
import { getPayload } from "payload";

export type AuthActionState = {
  error: string | null;
};

function readTrimmedString(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function readPassword(formData: FormData): string {
  const value = formData.get("password");
  return typeof value === "string" ? value : "";
}

export async function signupAction(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const name = readTrimmedString(formData, "name");
  const email = readTrimmedString(formData, "email");
  const password = readPassword(formData);

  if (!name || !email || !password) {
    return { error: "Name, email, and password are all required." };
  }

  const payload = await getPayload({ config });

  const existing = await payload.find({
    collection: "members",
    where: { email: { equals: email } },
    limit: 1,
  });

  if (existing.docs.length > 0) {
    return { error: "An account with this email already exists." };
  }

  try {
    await payload.create({
      collection: "members",
      data: { name, email, password },
    });
  } catch (error) {
    console.error("Failed to create member:", error);
    return { error: "Something went wrong creating your account. Please try again." };
  }

  try {
    await login({ collection: "members", config, email, password });
  } catch (error) {
    console.error("Auto-login after signup failed:", error);
    return {
      error: "Your account was created. Please log in.",
    };
  }

  redirect("/community/dashboard");
}

export async function loginAction(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const email = readTrimmedString(formData, "email");
  const password = readPassword(formData);

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  try {
    await login({ collection: "members", config, email, password });
  } catch (error) {
    console.error("Member login failed:", error);
    return { error: "The email or password provided is incorrect." };
  }

  redirect("/community/dashboard");
}

export async function logoutAction(): Promise<void> {
  await logout({ config });
  redirect("/community");
}
