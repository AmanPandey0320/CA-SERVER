import { BaseFormClass } from "../../lib/form/BaseFormClass";

class CAFR0000001 extends BaseFormClass {
    id?:number;
    username?:string;
    password?:string;
    email?:string;
    firstName?:string;

    //constructor
  constructor() {
    super();
  }
  _getFormCode(): string {
    return "CAFR0000001";
  }
  _defineFormData() {}
}

export default CAFR0000001;
