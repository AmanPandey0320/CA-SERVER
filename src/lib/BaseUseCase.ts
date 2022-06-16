
export default abstract class BaseUseCase {

    constructor() {
      this.use = this.use.bind(this);
    }
  
    protected abstract useCaseImpl(data: any): Promise<any>;
  
    public use(data: any): Promise<any> {
      return new Promise<any>(async (resolve, reject) => {
        try {
          const result = await this.useCaseImpl(data);
          resolve(result);
          return;
        } catch (error) {
          reject(error);
          return;
        }
      });
    }
  }
  