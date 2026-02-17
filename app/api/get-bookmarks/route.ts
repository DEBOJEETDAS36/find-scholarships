import clientPromise from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return Response.json([], { status: 200 });
  }

  const client = await clientPromise;
  const db = client.db("scholarshipDB");

  const bookmarks = await db
    .collection("bookmarks")
    .find({ userEmail: session.user.email })
    .toArray();

  const ids = bookmarks.map((b) => b.scholarshipId);

  return Response.json(ids);
}
