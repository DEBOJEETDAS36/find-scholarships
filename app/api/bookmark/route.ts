import clientPromise from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { scholarshipId } = await req.json();

  const client = await clientPromise;
  const db = client.db("scholarshipDB");

  const exists = await db.collection("bookmarks").findOne({
    userEmail: session.user.email,
    scholarshipId,
  });

  if (exists) {
    return Response.json({ message: "Already bookmarked" });
  }

  await db.collection("bookmarks").insertOne({
    userEmail: session.user.email,
    scholarshipId,
    createdAt: new Date(),
  });

  return Response.json({ success: true });
}
