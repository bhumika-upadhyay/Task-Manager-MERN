
import Setting from "../models/settingModel.js";

// /**
//  * Get settings for a specific user
//  * @param {String} userId
//  * @returns {Object} user settings
//  */
export const getSettingsByUser = async (userId) => {
  const settings = await Setting.findOne({ user: userId });
  return settings;
};

// /**
//  * Update settings by ID
//  * @param {String} id - Setting document ID
//  * @param {Object} data - Data to update
//  * @returns {Object} updated settings
//  */
export const updateSettingsById = async (id, data) => {
  const updatedSettings = await Setting.findByIdAndUpdate(id, data, {
    new: true,
  });
  return updatedSettings;
};