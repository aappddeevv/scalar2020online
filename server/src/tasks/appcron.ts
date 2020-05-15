import { job } from "cron"
import { logger } from "../config"
import { DateTime, Duration } from "luxon"

async function runJob(jobname: string) {
  logger.debug(`Running ${jobname}`)
}

export const testJob = job({
  cronTime: "0 0/15 * * * * ",
  runOnInit: true,
  onTick: () => runJob("importantJob"),
})