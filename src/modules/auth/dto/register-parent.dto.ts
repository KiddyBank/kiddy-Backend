import { Gender } from "src/modules/users/user.entity";

export class RegisterParentDto {
    username: string;
    lastName: string;
    email: string;
    password: string;
    dateOfBirth: Date;
    gender: Gender;
    children: {
        username: string;
        email: string;
        dateOfBirth: Date;
        gender: Gender;
    }[];
    
}