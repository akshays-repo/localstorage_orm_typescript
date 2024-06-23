## Local Storage API Library

This library provides a convenient way to interact with local storage using Zod schemas for validation. It includes methods for reading, writing, updating, and deleting data in local storage, with schema validation at each step.

### Installation

Install the necessary dependencies:

```bash
npm install zod fp-ts
```

### Usage

#### Step 1: Define the Schema

Define your data schema using Zod:

```typescript
import { z } from "zod";
import { localStorageApi } from '../index';
 
const schema = z.object({
  age: z
    .number()
    .min(0, {
      message: "No human has less than 0 years, or not?",
    })
    .max(120, {
      message: "You are too old for this app",
    }),
 
  link: z
    .string()
    .url({
      message: "Only valid URLs allowed here (or none)",
    })
    .optional(),
});
 
const userStorageApi = localStorageApi<typeof schema, "User">(schema);
type UserStorageApiData = z.output<typeof schema>;

export type { UserStorageApiData };
export { userStorageApi };
```

#### Step 2: Perform CRUD Operations

Use the `userStorageApi` methods to perform CRUD operations on your data:

```typescript
import { userStorageApi, UserStorageApiData } from './user.schema';

const main = async () => {
  // Define a sample user
  const sampleUser: UserStorageApiData = {
    age: 25,
    link: 'https://example.com',
  };

  // Write a single user to the "User" table
  const writeResult = await userStorageApi.write(['User', sampleUser])();
  console.log('Write Result:', writeResult);

  // Read all users from the "User" table
  const readAllResult = await userStorageApi.readAll('User')();
  console.log('Read All Result:', readAllResult);

  // Read users where the age is greater than 20
  const readWhereResult = await userStorageApi.readWhere(['User', (user) => user.age > 20])();
  console.log('Read Where Result:', readWhereResult);

  // Write multiple users to the "User" table
  const additionalUsers: UserStorageApiData[] = [
    { age: 30, link: 'https://example1.com' },
    { age: 40 },
  ];
  const writeAllResult = await userStorageApi.writeAll(['User', additionalUsers])();
  console.log('Write All Result:', writeAllResult);

  // Update users, for example, increment the age by 1 for all users
  const updateResult = await userStorageApi.update(['User', (user) => ({ ...user, age: user.age + 1 })])();
  console.log('Update Result:', updateResult);

  // Delete all users from the "User" table
  const deleteAllResult = await userStorageApi.deleteAll('User')();
  console.log('Delete All Result:', deleteAllResult);
}

main();
```

### Explanation

1. **Define the Schema**: Create a Zod schema that defines the structure and validation rules for your data.

2. **Initialize the API**: Use the `localStorageApi` function to create an API object for your schema.

3. **CRUD Operations**:
   - **write**: Write a single item to the local storage table.
   - **readAll**: Read all items from the local storage table.
   - **readWhere**: Read items from the local storage table that match a specific condition.
   - **writeAll**: Write multiple items to the local storage table.
   - **update**: Update items in the local storage table based on a condition.
   - **deleteAll**: Delete all items from the local storage table.

### License