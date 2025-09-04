// app/dashboard/_components/changed-image-card.tsx

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import UserInfoButton from "@/components/user-info/user-info-button";
import Image from "next/image";

// 컴포넌트가 받을 props의 데이터 타입 정의
type ChangedImageData = {
  userId: bigint;
  nickname: string;
  changeTimestamp: Date | null;
  newImages: string[];
};

interface ChangedImageCardProps {
  profiles: ChangedImageData[];
}

// props를 받도록 수정 (더 이상 async 함수가 아님)
export function ChangedImageCard({ profiles }: ChangedImageCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>이미지 변경 요청</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>유저</TableHead>
              <TableHead>새 이미지</TableHead>
              <TableHead className="text-center">변경 일시</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {profiles.map((data) => (
              <TableRow key={data.userId}>
                <TableCell className="text-center">
                  <UserInfoButton
                    userId={data.userId}
                    nickname={data.nickname}
                  />
                </TableCell>

                <TableCell>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {data.newImages.map((imageUrl, index) => (
                      <div
                        key={`new-${index}`}
                        className="relative w-20 h-20 rounded-md overflow-hidden border-2 border-yellow-400"
                      >
                        <Image
                          src={imageUrl}
                          alt={`${data.nickname}의 새 이미지 ${index + 1}`}
                          layout="fill"
                          objectFit="cover"
                        />
                      </div>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  {data.changeTimestamp?.toLocaleString("ko-KR", {
                    timeZone: "UTC",
                  }) || "알 수 없음"}
                </TableCell>
              </TableRow>
            ))}
            {profiles.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  이미지 변경 요청이 없습니다.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
