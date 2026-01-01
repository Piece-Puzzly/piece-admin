import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"; // shadcn/ui Table 컴포넌트 import
import UserInfoButton from "@/components/user-info/user-info-button";
import { UserWithProfile } from "./user-table-with-pagination";

interface UserTableProps {
  users: UserWithProfile[];
  roleName: string; // 테이블 캡션에 표시할 역할 이름
}

export default function UserTable({ users }: UserTableProps) {
  if (users.length === 0) {
    return (
      <p className="text-muted-foreground mt-4">
        해당 역할의 사용자가 없습니다.
      </p>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>유저</TableHead>
          <TableHead>전화번호</TableHead>

          <TableHead>가입일</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.user_id}>
            <TableCell className="font-medium">
              <UserInfoButton
                userId={user.user_id}
                nickname={user.profile?.nickname || undefined}
              />
            </TableCell>

            <TableCell>{user.phone ?? "-"}</TableCell>

            <TableCell suppressHydrationWarning>
              {user.created_at
                ? new Date(user.created_at).toLocaleString("ko-KR", {
                    timeZone: "UTC",
                  })
                : "N/A"}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
