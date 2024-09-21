export class userDto {
  userId: number;

  constructor(userModel: any) {
    this.userId = userModel.id;
  }
}
