import { exists } from "https://deno.land/std/fs/mod.ts";
import FastestValidator from "https://esm.sh/fastest-validator@1";
import { throwError } from "./throwError.ts";

export const create = <T>(
  init: T,
  schema: Record<string, unknown>,
  path: string,
  options?: { isInMemory?: boolean }
) => {
  //extract options
  const isInMemory = options?.isInMemory || false;

  let db = init;

  const v = new FastestValidator();
  const check = v.compile(schema);

  const setup = async () => {
    const createFile = async (data: string) => {
      await Deno.writeTextFile(path, data);
    };

    const setOnState = async () => {
      const readState = JSON.parse(await Deno.readTextFile(path));

      return (db = {
        ...readState,
      });
    };

    !isInMemory && (await exists(path))
      ? await setOnState()
      : await createFile(JSON.stringify(db));
  };

  const validate = (data: T) => {
    const isRight = check(data);
    return isRight === true
      ? isRight
      : throwError(`${isRight[0].message} but get ${isRight[0].actual}`);
  };

  const getState = () => db;

  const setState = async (data: T) => {
    db = {
      ...data,
    };
    !isInMemory && (await Deno.writeTextFile(path, JSON.stringify(data)));
  };

  return {
    setup,
    setState,
    getState,
    validate,
    db,
  };
};
