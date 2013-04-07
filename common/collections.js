Users = Model(Meteor.users);
Files = Model(new Meteor.Collection("files"));
Transfers = Model(new Meteor.Collection("transfers"));


/* Users Schema:
{
  _id: ObjectId,
  username: String,
  files[]: {_id},
  online: Boolean
}
*/

/* Files Schema:
{
  _id: ObjectId,
  name: String,
  size: Integer,
  type: String,
  owners[]: { _id, username },
}
*/

/* Transfers Schema:
{
  _id: ObjectId,
  from: { User ObjectId, User username },
  to: { User ObjectId, User username },
  file: { File name, File size, File _id },
  progress: Number
}
*/
