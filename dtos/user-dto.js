module.exports = class UserDto {
  email;
  id;
  isActivated;

  constructor(user) {
    this.email = user.email;
    this.id = user.id;
    this.isActivated = user.is_activate;
    this.name = user.name;
    this.surname = user.surname;
    this.phone = user.phone;
    this.gender = user.gender_name;
  }
};
