import { userStorageApi, UserStorageApiData } from './user.schema';
import { pipe } from 'fp-ts/function';
import { fold } from 'fp-ts/Either';
import { TaskEither } from 'fp-ts/TaskEither';

// Helper function to handle TaskEither results
const runTaskEither = async <E, A>(task: TaskEither<E, A>): Promise<A | undefined> => {
  return await task().then(
    fold(
      (error) => {
        console.error('Error:', error);
        return undefined;
      },
      (result) => result
    )
  );
};

// Example usage of userStorageApi methods

const main = async () => {
  // Define a sample user
  const sampleUser: UserStorageApiData = {
    age: 25,
    link: 'https://example.com',
  };

  // Write a single user to the "User" table
  const writeResult = await runTaskEither(userStorageApi.write(['User', sampleUser]));
  console.log('Write Result:', writeResult);

  // Read all users from the "User" table
  const readAllResult = await runTaskEither(userStorageApi.readAll('User'));
  console.log('Read All Result:', readAllResult);

  // Read users where the age is greater than 20
  const readWhereResult = await runTaskEither(userStorageApi.readWhere(['User', (user) => user.age > 20]));
  console.log('Read Where Result:', readWhereResult);

  // Write multiple users to the "User" table
  const additionalUsers: UserStorageApiData[] = [
    { age: 30, link: 'https://example1.com' },
    { age: 40 },
  ];
  const writeAllResult = await runTaskEither(userStorageApi.writeAll(['User', additionalUsers]));
  console.log('Write All Result:', writeAllResult);

  // Update users, for example, increment the age by 1 for all users
  const updateResult = await runTaskEither(userStorageApi.update(['User', (user) => ({ ...user, age: user.age + 1 })]));
  console.log('Update Result:', updateResult);

  // Delete all users from the "User" table
  const deleteAllResult = await runTaskEither(userStorageApi.deleteAll('User'));
  console.log('Delete All Result:', deleteAllResult);
};

// Run the main function
main().catch(console.error);
