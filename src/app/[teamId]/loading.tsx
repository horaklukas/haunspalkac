import { Loader } from "@/components/ui/Loader";

export default function TeamDetailLoading() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen gap-5 p-24">
      <Loader />
      <small className="text-sm">Loading team data</small>
    </main>
  );
}
