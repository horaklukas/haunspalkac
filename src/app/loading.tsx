import { Loader } from "@/components/ui/Loader";

export default function HomeLoading() {
  return (
    <main className="flex items-center justify-center min-h-screen p-24">
      <Loader />
    </main>
  );
}
