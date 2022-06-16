import * as fs from "fs";
import * as path from "path";

export interface RouterModuleType {
  path: string;
  module: string;
}

export function loadRoutes(dir: string): Promise<RouterModuleType[]> {
  return new Promise<RouterModuleType[]>(async (resolve, reject) => {
    try {
      fs.readdir(dir, (err, files) => {
        if (err) {
          /**
           * error occured
           */
          console.log(err);
          reject(err);
          return;
        }
        const routes = files
          ?.filter((name) => {
            /**
             * check for directory
             * only directories contribute to routes
             */
            const stats = fs.statSync(path.join(dir, name));
            const isFolder = stats.isDirectory();
            return isFolder;
          })
          .map((name) => ({
            path: `/api/${name}`,
            module: path.resolve(dir, name),
          }));
        resolve(routes);
        return;
      });
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
}
