export interface IUserDto {
  id: string;
  username: string;
  name: string;
  registeredAt: Date;
}

export interface ICreateUserDto extends Pick<IUserDto, "name" | "username"> {
  password: string;
}
// export interface ICreateUserDto {
//     name: string
//     username: string
//     password: string
// }
