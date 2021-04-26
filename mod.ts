import FastestValidator from "https://esm.sh/fastest-validator@1";
  
const combinedObject = {
  firstPage: {
    db: {},
    actions: [() => {}, () => {}]
  },
  wareType: {
    db: [{}, {}],
    actions: [() =>{}, () => {}]
  }
}

const create = (schema, initialize, actions) => {
  const v = new FastestValidator();
  const get = () => {
      
  }
  return {
    db: initialize,
    actions,
  };
};

const firstPageSchema = {
  id: { type: "number", positive: true, integer: true },
  name: { type: "string", min: 3, max: 255 },
  status: "boolean", // short-hand def
};

const firstPageInit = {
  id: 0,
  name: "nothing",
  status: false,
};

const firstPageActions = {
  ["getFirstPage"]: (get) => get,
  ["setStatus"]: (get, set, validator, schema) => {
    const check = validator.compile(schema.status);
    check(set);

    // read firstPageState.json and change the set object and save it to disk
    //

    // return the cloned object
    return {
      ...get,
      ...set,
    };
  },
};

const firstPageState = create(firstPageSchema, firstPageInit, firstPageActions);

const isBootstrap = ()

const {
  db: { id },
  actions: { getFirstPage, setStatus },
} = firstPageState;

setStatus();
