import * as A from "fp-ts/Array";
import * as E from "fp-ts/Either";
import { pipe } from "fp-ts/function";
import * as IOE from "fp-ts/IOEither";
import * as TE from "fp-ts/TaskEither";
import { z } from "zod";
import { IStorageApi } from "./IStorageApi";
 
type LocalStorageApi<
  Schema extends z.ZodTypeAny,
  Table extends string
> = IStorageApi<Schema, string, Table>;
 
type LocalStorageApiSchema<
  Schema extends z.ZodTypeAny,
  Table extends string
> = Parameters<LocalStorageApi<Schema, Table>>[0];
 
type LocalStorageApiMethod<
  Schema extends z.ZodTypeAny,
  Table extends string
> = ReturnType<LocalStorageApi<Schema, Table>>;
 
type LocalStorageApiData<
  Schema extends z.ZodTypeAny,
  Table extends string
> = z.output<LocalStorageApiSchema<Schema, Table>>;
 
const readAll =
  <Schema extends z.ZodTypeAny, Table extends string>(
    validation: Schema
  ): LocalStorageApiMethod<Schema, Table>["readAll"] =>
  (table) =>
    pipe(
      () =>
        E.tryCatch(
          () => localStorage.getItem(table),
          () => "Error when loading from local storage"
        ),
      IOE.chain((item) =>
        item === null
          ? IOE.fromEither(E.of<string, z.output<typeof validation>[]>([]))
          : pipe(
              () =>
                E.tryCatch(
                  () => JSON.parse(item) as unknown,
                  () => "Error when parsing to JSON"
                ),
              IOE.chain((json) =>
                pipe(
                  z.array(validation).safeParse(json),
                  (parsed): E.Either<string, z.output<typeof validation>[]> =>
                    parsed.success
                      ? E.of(parsed.data)
                      : E.left(
                          `Error when parsing local data: ${parsed.error.issues[0].message}`
                        ),
                  IOE.fromEither
                )
              )
            )
      ),
      TE.fromIOEither
    );
 
const readWhere =
  <Schema extends z.ZodTypeAny, Table extends string>(
    validation: Schema
  ): LocalStorageApiMethod<Schema, Table>["readWhere"] =>
  ([table, check]) =>
    pipe(table, readAll(validation), TE.map(A.filter(check)));
 
const write =
  <Schema extends z.ZodTypeAny, Table extends string>(
    validation: Schema
  ): LocalStorageApiMethod<Schema, Table>["write"] =>
  ([table, item]) =>
    pipe(
      validation.safeParse(item),
      (parsed): E.Either<string, z.output<Schema>> =>
        parsed.success
          ? E.of(parsed.data)
          : E.left(
              `Invalid schema for writing data: ${parsed.error.issues[0].message}`
            ),
      TE.fromEither,
      TE.chain((validItem) =>
        pipe(table, readAll(validation), TE.map(A.append(validItem)))
      ),
      TE.chain((newData) =>
        pipe(
          () =>
            E.tryCatch(
              () => localStorage.setItem(table, JSON.stringify(newData)),
              () => "Error while saving data"
            ),
          TE.fromIOEither,
          TE.map(() => item)
        )
      )
    );
 
const writeAll =
  <Schema extends z.ZodTypeAny, Table extends string>(
    validation: Schema
  ): LocalStorageApiMethod<Schema, Table>["writeAll"] =>
  ([table, items]) =>
    pipe(
      table,
      readAll(validation),
      TE.map(A.concat(items)),
      TE.chain((newData) =>
        pipe(
          () =>
            E.tryCatch(
              () => localStorage.setItem(table, JSON.stringify(newData)),
              () => "Error while saving data"
            ),
          TE.fromIOEither,
          TE.map(() => items)
        )
      )
    );
 
const deleteAll =
  <Schema extends z.ZodTypeAny, Table extends string>(): LocalStorageApiMethod<
    Schema,
    Table
  >["deleteAll"] =>
  (table) =>
    pipe(
      () =>
        E.tryCatch(
          () => localStorage.removeItem(table),
          () => `Error while deleting all storage in '${table}' schema`
        ),
      TE.fromIOEither
    );
 
const update =
  <Schema extends z.ZodTypeAny, Table extends string>(
    validation: Schema
  ): LocalStorageApiMethod<Schema, Table>["update"] =>
  ([table, check]) =>
    pipe(
      table,
      readAll(validation),
      TE.map(A.map(check)),
      TE.chain((newData) =>
        pipe(
          table,
          deleteAll(),
          TE.chain(() => writeAll(validation)([table, newData]))
        )
      )
    );
 
const localStorageApi = <Schema extends z.ZodTypeAny, Table extends string>(
  schema: Schema
): LocalStorageApiMethod<Schema, Table> => ({
  readAll: readAll(schema),
  readWhere: readWhere(schema),
  write: write(schema),
  update: update(schema),
  writeAll: writeAll(schema),
  deleteAll: deleteAll(),
});
 
export type { LocalStorageApiData };
export { localStorageApi };