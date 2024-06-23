import { userStorageApi, UserStorageApiData } from './user.schema';


// Example usage of userStorageApi methods

const main =  () => {
  // Define a sample user
  const sampleUser: UserStorageApiData = {
    age: 25,
    link: 'https://example.com',
  };

  // Write a single user to the "User" table
  const writeResult =  userStorageApi.write(['User', sampleUser]);
  console.log('Write Result:', writeResult);

  // Read all users from the "User" table
  const readAllResult = userStorageApi.readAll('User');
  console.log('Read All Result:', readAllResult);

  // Read users where the age is greater than 20
  const readWhereResult = userStorageApi.readWhere(['User', (user) => user.age > 20]);
  console.log('Read Where Result:', readWhereResult);

  // Write multiple users to the "User" table
  const additionalUsers: UserStorageApiData[] = [
    { age: 30, link: 'https://example1.com' },
    { age: 40 },
  ];
  const writeAllResult = userStorageApi.writeAll(['User', additionalUsers])
  console.log('Write All Result:', writeAllResult);

  // Update users, for example, increment the age by 1 for all users
  const updateResult = userStorageApi.update(['User', (user) => ({ ...user, age: user.age + 1 })]);
  console.log('Update Result:', updateResult);

  // Delete all users from the "User" table
  const deleteAllResult = userStorageApi.deleteAll('User');
  console.log('Delete All Result:', deleteAllResult);
}

