import { Express } from "express";
import { loadRoutes } from "./routeResolver";

/**
 *
 * @param app
 * @returns
 */
const initRouter = (app: Express): Promise<boolean> => {
  return new Promise<boolean>(async (resolve, reject) => {
    try {
      const routes = await loadRoutes(__dirname);
      routes.forEach((route) => {
        const module = require(route.module);
        app.use(route.path, module);
      });
      return resolve(true);
    } catch (error) {
      console.log(error);
      return reject(false);
    }
  });
};

export default initRouter;
