"use client";

import { DEFAULT_PROFILE_IMAGE, getImageSrc } from "@/lib/utils";
import Image, { type ImageProps } from "next/image";
import { type ReactNode, useEffect, useState } from "react";

type ProfileImageProps = Omit<ImageProps, "src"> & {
  src: string | null | undefined;
  /** 사진이 없거나 로드에 실패했을 때 이미지 대신 보여줄 내용. 없으면 기본 프로필 이미지로 대체한다. */
  fallback?: ReactNode;
};

/**
 * 프로필 이미지를 안전하게 렌더링한다.
 * - URL이 없거나(null·""·"null"·비https) 런타임 로드(404 등)에 실패하면 fallback을 보여준다.
 * - fallback이 없으면 기본 프로필 이미지로 대체한다.
 * 이를 통해 깨진 이미지 아이콘과 alt 텍스트가 그대로 노출되는 것을 막는다.
 */
export default function ProfileImage({
  src,
  alt,
  fallback,
  ...props
}: ProfileImageProps) {
  const resolved = getImageSrc(src);
  const hasValidUrl = resolved !== DEFAULT_PROFILE_IMAGE;
  const [errored, setErrored] = useState(false);

  // src가 바뀌면 직전 이미지의 에러 상태를 초기화한다.
  useEffect(() => setErrored(false), [src]);

  // 유효한 URL이 없거나 로드에 실패했고 fallback이 지정된 경우 fallback을 보여준다.
  if ((!hasValidUrl || errored) && fallback !== undefined) {
    return <>{fallback}</>;
  }

  return (
    <Image
      {...props}
      src={errored ? DEFAULT_PROFILE_IMAGE : resolved}
      alt={alt}
      onError={() => setErrored(true)}
    />
  );
}
