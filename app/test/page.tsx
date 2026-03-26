import LoadingMain from "@/components/loaders-anim/loading-main";
import { Suspense } from "react";
import NextMatch from "@/components/welcome-page/next-match/next-match"
export default function Test() {
        return (
    <div className="flex items-center justify-center">
      <Suspense fallback={<LoadingMain/>} >
        <NextMatch />
      </Suspense>
    </div>);
}





  

