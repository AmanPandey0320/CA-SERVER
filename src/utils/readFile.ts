import * as jsonfile from "jsonfile";

/**
 *
 * @brife Reads a file and returns its content as a JSON object
 * @param filePath
 * @returns
 */
function json(filePath: string): Promise<any> {
  return new Promise<any>((resolve, reject) => {
    jsonfile
      .readFile(filePath)
      .then((obj) => {
        resolve(obj);
        return;
      })
      .catch((err) => {
        reject(err);
        return;
      });
  });
}

const fileReader = {
  json: json,
};

export default fileReader;
