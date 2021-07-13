import { exists,ensureFile } from "https://deno.land/std/fs/mod.ts";
import FastestValidator from "https://esm.sh/fastest-validator@1";
import { throwError } from "./throwError.ts";

const v = new FastestValidator();

/**
 * create an ISDB database
 * @param init
 * @param schema
 * @param path if you provide path in args, data will be saved in files in json format
 */
export const create = <T>(
  init: T,
  schema: Record<string, unknown>,
  path?: string
) => {
  let db = init;

  const check = v.compile(schema);

  const setup = async () => {
    const createFile = async (data: string) => {
      await ensureFile(path!)
      await Deno.writeTextFile(path!, data);
    };

    const setOnState = async () => {
      const readState = JSON.parse(await Deno.readTextFile(path!));
      db = readState;
    };

    path &&
      ((await exists(path))
        ? await setOnState()
        : await createFile(JSON.stringify(db)));
  };

  const validate = (data: T) => {
    const isRight = check(data);
    return isRight === true
      ? isRight
      : throwError(`${isRight[0].message} but get ${isRight[0].actual}`);
  };

  const getState = () => db;

  const setState = async (data: T) => {
    db = Array.isArray(data)
      ? <T>(<unknown>[...data])
      : typeof data === "object"
      ? {
          ...data,
        }
      : data;

      path && await ensureFile(path) 
      path && await Deno.writeTextFile(path, JSON.stringify(data))
  };

  return {
    setup,
    setState,
    getState,
    validate,
    db,
  };
};
