import path from "path";

export abstract class BaseFormClass {
  formDef: any;
  constructor() {
  }

  /**
   * @brife sets the form data
   */
  abstract _defineFormData(): void;

  _validateFormData(): void {
    
  }

  _getFormCode() {
    return "";
  }

  /**
   * 
   * @brief: sets form data to the instance
   * @returns true if formData is set else error
   */
  _setFormDefData(): Promise<boolean> {
    return new Promise<boolean>(async (resolve, reject) => {
      try {
        const formCode = this._getFormCode();
        const formDefPath = path.resolve(
          CA.root,
          "./main/formDef/",
          formCode + ".json"
        );
        this.formDef = await CA.utils.fileReader.json(formDefPath);
        resolve(true);
        return;
      } catch (error) {
        reject(error);
        return;
      }
    });
  }
}
