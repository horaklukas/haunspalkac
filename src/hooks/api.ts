import useSWR from "swr";
import type { MatchSchedule } from "../scrapper";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function useSchedule(id: string) {
  const { data, error } = useSWR<{ team: string; schedule: MatchSchedule }>(
    id ? `/api/schedule/${id}` : null,
    fetcher
  );
  const { team, schedule } = data ?? {};

  return {
    team,
    schedule,
    isLoading: !error && !data,
    isError: error,
  };
}
