const findUser = (users, id) => {
  return users.find((u) => u.id === +id);
};

const filterUsers = (users, id) => {
  // eslint-disable-next-line no-param-reassign
  users = users.filter((u) => u.id !== +id);

  return users;
};

module.exports = {
  findUser,
  filterUsers,
};
