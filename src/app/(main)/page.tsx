import PostEditor from "@/components/posts/editor/PostEditor";
import TrendSidebar from "@/components/TrendSidebar";
import ForYouFeed from "./ForYouFeed";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FollowingFeed from "./FollowingFeed";

export default function Home() {
  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <PostEditor />
        <Tabs defaultValue="for-you" className="w-full">
          <TabsList className="w-full bg-card">
            <TabsTrigger value="for-you" className="w-full text-center">
              For you
            </TabsTrigger>
            <TabsTrigger value="following" className="w-full text-center">
              Following
            </TabsTrigger>
          </TabsList>
          <TabsContent value="for-you">
            <ForYouFeed />
          </TabsContent>
          <TabsContent value="following">
            <FollowingFeed />
          </TabsContent>
        </Tabs>
      </div>
      <TrendSidebar />
    </main>
  );
}
