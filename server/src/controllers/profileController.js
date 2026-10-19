import { Profile } from '../models/Profile.js';
import { SiteSetting } from '../models/SiteSetting.js';
import { defaultProfileData } from '../utils/seedData.js';

export const getPublicProfile = async (req, res, next) => {
  try {
    let profile = await Profile.findOne();
    if (!profile) {
      profile = await Profile.create(defaultProfileData);
    }

    let settings = await SiteSetting.findOne();
    if (!settings) {
      settings = await SiteSetting.create({});
    }

    res.status(200).json({
      success: true,
      profile,
      settings,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    let profile = await Profile.findOne();
    if (!profile) {
      profile = new Profile(req.body);
    } else {
      Object.assign(profile, req.body);
    }
    await profile.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      profile,
    });
  } catch (error) {
    next(error);
  }
};

export const updateSiteSettings = async (req, res, next) => {
  try {
    let settings = await SiteSetting.findOne();
    if (!settings) {
      settings = new SiteSetting(req.body);
    } else {
      Object.assign(settings, req.body);
    }
    await settings.save();

    res.status(200).json({
      success: true,
      message: 'Site settings updated successfully',
      settings,
    });
  } catch (error) {
    next(error);
  }
};
