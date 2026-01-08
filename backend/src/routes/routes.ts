import { Router } from "express";
import { createProfile , updateProfile , getHealth , getProjectsBySkills , getTopSkills , readProfile } from "../controllers/index.js";
const router = Router();

//@ts-ignore
router.post("/create" , createProfile);
//@ts-ignore
router.patch("/update/:email" , updateProfile);
//@ts-ignore
router.get("/health" , getHealth);
//@ts-ignore
router.get("/search" , getProjectsBySkills);
//@ts-ignore
router.get("/skills" , getTopSkills );
//@ts-ignore
router.get("/profile", readProfile)

export default router ;
