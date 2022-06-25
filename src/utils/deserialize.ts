function deserialize(data:any,obj:any){
    for(var prop in data){
        if(obj.hasOwnProperty(prop)){
            obj[prop] = data[CA.utils.nameConvention.toCamelCase(prop)];
        }
    }
}