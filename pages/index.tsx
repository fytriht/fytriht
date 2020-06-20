import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  // index route redirect
  useEffect(() => {
    router.push("/posts");
  }, []);
  return null;
}
