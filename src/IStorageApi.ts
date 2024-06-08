import * as RTE from "fp-ts/ReaderTaskEither";
import { z } from "zod";
 
type IStorageApi<Schema extends z.ZodTypeAny, Error, Table extends string> = (
  schema: Schema
) => {
  /**
   * Given a `Table`, return all the data inside storage.
   */
  readAll: RTE.ReaderTaskEither<Table, Error, z.output<Schema>[]>;
 
  /**
   * Read all the data inside `Table` filtered by the `check` function.
   */
  readWhere: RTE.ReaderTaskEither<
    [Table, (check: z.output<Schema>) => boolean],
    Error,
    z.output<Schema>[]
  >;
 
  /**
   * Given a `Table` and a value, write the value inside storage (single value).
   */
  write: RTE.ReaderTaskEither<
    [Table, z.output<Schema>],
    Error,
    z.output<Schema>
  >;
 
  /**
   * Given a `Table` and a list of values, write all the values inside storage.
   */
  writeAll: RTE.ReaderTaskEither<
    [Table, z.output<Schema>[]],
    Error,
    readonly z.output<Schema>[]
  >;
 
  /**
   * Delete all the data inside `Table`.
   */
  deleteAll: RTE.ReaderTaskEither<Table, Error, unknown>;
 
  /**
   * Update all the data inside the given `Table` based on the
   * given `check` function (**map**).
   */
  update: RTE.ReaderTaskEither<
    [Table, (check: z.output<Schema>) => z.output<Schema>],
    Error,
    readonly z.output<Schema>[]
  >;
};
 
export type { IStorageApi };