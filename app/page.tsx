import NextMatch from "@/components/welcome-page/next-match/next-match";
import LoadingMain from "@/components/loaders-anim/loading-main";
import { Suspense } from "react";
import ChanclaCurrentPosition from "@/components/welcome-page/chancla-current-position";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center m-4 p-4">
      <Suspense fallback={<LoadingMain/>} >
      <ChanclaCurrentPosition />
      </Suspense>
      
      <Suspense fallback={<LoadingMain/>} >
      <NextMatch />
      </Suspense>


    </div>
    );
}
