export interface IUserDto {
  id: string;
  username: string;
  name: string;
  registeredAt: string;
}

// export interface ICreateUserDto extends Pick<User, "name" | "username"> {
//   password: string;
// }
export interface ICreateUserDto {
  name: string;
  username: string;
  password: string;
}

export interface ILoginDto {
  username: string;
  password: string;
}
export interface ILoginResultDto {}
