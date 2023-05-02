import NgCasghTransferServer from "./server";
import { log } from "logger";
const port = (process.env.PORT as unknown as number) || 4000;
NgCasghTransferServer.listen(port, () => {
  log(`api running on ${port}`);
});
