import { Post, Controller } from "@overnightjs/core";
import { Request, Response } from "express";
import { User } from "@src/models/user";

@Controller("users")
export class UsersController {
  @Post("")
  public async create(req: Request, res: Response): Promise<void> {
    console.log("create");
    const user = new User(req.body);
    const newUser = await user.save();
    res.status(201).send(newUser);
  }
}
