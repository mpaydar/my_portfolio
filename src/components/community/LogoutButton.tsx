import { logoutAction } from "@/lib/community/auth-actions";

export default function LogoutButton() {
  return (
    <form action={logoutAction}>
      <button
        type="submit"
        className="btn-ghost rounded-md px-4 py-2 text-sm font-semibold"
      >
        Log out
      </button>
    </form>
  );
}
