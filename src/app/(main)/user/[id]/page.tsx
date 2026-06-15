import UserInfo from "@/components/user-info/user-info";

interface UserPageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: UserPageProps) {
  const { id } = await params;
  const userIdBigInt = BigInt(id);

  return (
    <main className="space-y-4">
      <UserInfo id={userIdBigInt} />
    </main>
  );
}
