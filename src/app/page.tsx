import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  if (session.user?.role === "ADMIN") {
    redirect("/admin");
  } else if (session.user?.role === "SELLER") {
    redirect("/seller");
  }

  return (
    <div className="flex justify-center items-center h-[50vh]">
      <p>Redirecting...</p>
    </div>
  );
}
