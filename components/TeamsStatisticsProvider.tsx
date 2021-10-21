import { createContext, useContext, useMemo } from "react";
import type { TeamStatistic } from "lib/scrapper";

const TeamsStatisticsContext = createContext<TeamStatistic[]>([]);

export const TeamsStatisticsProvider = TeamsStatisticsContext.Provider;

export const useAllTeamsStatistics = () => {
  const teamStatistics = useContext(TeamsStatisticsContext);

  return teamStatistics;
};

export const useTeamStatistics = (teamName: string) => {
  const allStatistics = useAllTeamsStatistics();

  const teamStatistics = useMemo(
    () => allStatistics.find(({ name }) => name === teamName),
    [allStatistics, teamName]
  );

  return teamStatistics;
};
