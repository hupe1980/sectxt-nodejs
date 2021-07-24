import * as path from "path";
import * as fs from "fs";
import { GatsbyNode } from "gatsby";
import { SecurityTxt, SecurityTxtOptions } from "sectxt";

export const onPostBootstrap: GatsbyNode["onPostBootstrap"] = async (
  { store, actions, parentSpan, reporter },
  pluginOptions
) => {
  const activity = reporter.activityTimer(`Build security.txt`, {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    parentSpan: parentSpan as any,
  });

  activity.start();
  const securityTxt = new SecurityTxt(
    pluginOptions as unknown as SecurityTxtOptions
  );

  const { program } = store.getState();
  const writePath = path.join(program.directory, "public", securityTxt.path);

  if (securityTxt.pathAlternative) {
    actions.createRedirect({
      fromPath: securityTxt.pathAlternative,
      toPath: securityTxt.path,
      isPermanent: true,
      redirectInBrowser: true,
    });
  }

  try {
    fs.mkdirSync(path.dirname(writePath), { recursive: true });
    fs.writeFileSync(writePath, securityTxt.render());
  } catch (error) {
    reporter.panic("Unable to create security.txt", error);
  }

  activity.end();
};
