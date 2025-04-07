"use client";

import { Profile } from "@/app/(main)/profiles/columns";
import { UserProfileValidationResponse } from "./types";

export async function getProfiles(page: number, accessToken: string) {
  const response = await fetch(
    `https://admin.puzzly.site/admin/v1/users?page=${page}&size=${10}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  const { data } = await response.json();
  const content = data.content;
  const result = (content as UserProfileValidationResponse[]).map(
    ({
      userId,
      nickname,
      name,
      birthdate,
      phoneNumber,
      joinDate,
      profileStatus,
      rejectImage,
      rejectDescription,
    }) => {
      return {
        userId,
        nickname,
        name,
        birthdate,
        phoneNumber,
        joinDate,
        profileStatus,
        rejectStatus: { image: rejectImage, description: rejectDescription },
        submit: profileStatus === "완료",
      } as Profile;
    }
  );
  data.content = result;

  return data;
}
export const updateProfileStatus = async (
  accessToken: string,
  userId: number,
  rejectImage: boolean,
  rejectDescription: boolean
) => {
  try {
    const response = await fetch(
      `https://admin.puzzly.site/admin/v1/users/${userId}/profile`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          rejectImage,
          rejectDescription,
        }),
      }
    );
    
    return await response.json();
  } catch (error: unknown) {
    alert(error);
  }
};
