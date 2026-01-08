import { response, type Request, type Response } from 'express'
import ProfileModel from '../model/index.js';

export const getHealth = async (req: Request, res: Response) => {
    return res.status(200).json({ status: 'UP', timestamp: new Date() });
}

export const createProfile = async (req: Request, res: Response) => {
    try {
        const { name, email, education, skills, projects, work, links } = req.body;
        const existingProfile = await ProfileModel.findOne({ email });
        if (existingProfile) {
            return res.status(400).json({ success: false, message: 'Profile already exists' });
        }
        const newProfile = new ProfileModel({ name, email, education, skills, projects, work, links });
        await newProfile.save();
        return res.status(201).json({ success: true, message: 'Profile created successfully' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
}


export const updateProfile = async (req: Request, res: Response) => {
    try {
        const { email } = req.params as { email: string };
        const updateData = req.body;

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ success: false, message: "No data provided" });
        }

        
        const updatedProfile = await ProfileModel.findOneAndUpdate(
            { email: email },
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if (!updatedProfile) {
            return res.status(404).json({ success: false, message: "Profile not found" });
        }

        return res.status(200).json({ success: true, data: updatedProfile });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};
export const readProfile = async (req: Request, res: Response) => {
    try {
        const profile = await ProfileModel.findOne();
        if (!profile) {
            return res.status(404).json({
                message: "Profile not found. Please create one first using POST /api/profile"
            });
        }

        return res.status(200).json({ success: true, message: profile })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
}


export const getProjectsBySkills = async (req: Request, res: Response) => {
    try {
        const { skills } = req.query;
        const profile = await ProfileModel.findOne();

        if (!profile) {
            return res.status(404).json({ success: false, message: "Profile not found" })
        }
        if (!skills) {
            return res.json(profile.projects);
        }

        const filtered = profile.projects.filter(proj =>
            Array.isArray(skills) ? skills.some(skill => proj.description?.toLowerCase().includes((skill as string).toLowerCase())) :
                proj.description?.toLowerCase().includes((skills as string).toLowerCase())
        ) || profile.projects.filter(proj =>
            Array.isArray(skills) ? skills.some(skill => proj.title?.toLowerCase().includes((skill as string).toLowerCase())) :
                proj.title?.toLowerCase().includes((skills as string).toLowerCase())
        );

        return res.status(200).json({ success: true, message: filtered })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
}


export const getTopSkills = async (req: Request, res: Response) => {
    try {
        const profile = await ProfileModel.findOne();
        if (!profile) return res.status(404).json({ message: "No profile" });
        const topSkils = profile.skills.slice(0, 5);
        return res.status(200).json({ success: true, message: topSkils });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
}


export const globleSearch = async (req: Request, res: Response) => {
    try {
        const q = req.query['q'];
        if (!q || typeof q !== 'string') return res.status(400).json({ message: "Search query required" });
        const regex = new RegExp(q, 'i');
        const results = await ProfileModel.find({
            $or: [
                { name: regex },
                { skills: { $in: [regex] } },
                { "projects.title": regex },
                { "projects.description": regex }
            ]
        });

        return res.status(200).json({success : true , results})

    } catch (error) {
        console.log(error);
         return res.status(500).json({ success: false, message: 'Internal server error' });
    }
}