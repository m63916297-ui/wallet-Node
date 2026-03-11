const Setting = require('../models/Setting');

exports.getAllSettings = async (req, res) => {
  try {
    const { category, publicOnly } = req.query;
    
    let filter = {};
    if (category) filter.category = category;
    if (publicOnly === 'true') filter.isPublic = true;
    
    const settings = await Setting.find(filter).sort({ category: 1, key: 1 });
    
    const grouped = settings.reduce((acc, setting) => {
      const cat = setting.category;
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push({
        key: setting.key,
        value: setting.value,
        description: setting.description,
        dataType: setting.dataType,
        isEditable: setting.isEditable
      });
      return acc;
    }, {});
    
    res.json({
      settings: grouped,
      total: settings.length
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching settings', error: error.message });
  }
};

exports.getSetting = async (req, res) => {
  try {
    const { key } = req.params;
    const setting = await Setting.findOne({ key: key.toUpperCase() });
    
    if (!setting) {
      return res.status(404).json({ message: 'Setting not found' });
    }
    
    res.json({
      key: setting.key,
      value: setting.value,
      category: setting.category,
      description: setting.description,
      dataType: setting.dataType,
      isEditable: setting.isEditable
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching setting', error: error.message });
  }
};

exports.updateSetting = async (req, res) => {
  try {
    const { key } = req.params;
    const { value } = req.body;
    
    const setting = await Setting.findOne({ key: key.toUpperCase() });
    
    if (!setting) {
      return res.status(404).json({ message: 'Setting not found' });
    }
    
    if (!setting.isEditable) {
      return res.status(403).json({ message: 'This setting is not editable' });
    }
    
    setting.value = value;
    await setting.save();
    
    res.json({
      message: 'Setting updated successfully',
      setting: {
        key: setting.key,
        value: setting.value,
        category: setting.category
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating setting', error: error.message });
  }
};

exports.createSetting = async (req, res) => {
  try {
    const { key, value, category, description, isPublic, isEditable, dataType } = req.body;
    
    const existing = await Setting.findOne({ key: key.toUpperCase() });
    if (existing) {
      return res.status(400).json({ message: 'Setting already exists' });
    }
    
    const setting = new Setting({
      key: key.toUpperCase(),
      value,
      category: category || 'GENERAL',
      description,
      isPublic: isPublic || false,
      isEditable: isEditable !== false,
      dataType: dataType || 'STRING'
    });
    
    await setting.save();
    
    res.status(201).json({
      message: 'Setting created successfully',
      setting: {
        key: setting.key,
        value: setting.value,
        category: setting.category
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating setting', error: error.message });
  }
};

exports.deleteSetting = async (req, res) => {
  try {
    const { key } = req.params;
    
    const setting = await Setting.findOne({ key: key.toUpperCase() });
    
    if (!setting) {
      return res.status(404).json({ message: 'Setting not found' });
    }
    
    if (!setting.isEditable) {
      return res.status(403).json({ message: 'This setting cannot be deleted' });
    }
    
    await Setting.deleteOne({ key: key.toUpperCase() });
    
    res.json({ message: 'Setting deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting setting', error: error.message });
  }
};

exports.initSettings = async (req, res) => {
  try {
    await Setting.initDefaults();
    res.json({ message: 'Default settings initialized successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error initializing settings', error: error.message });
  }
};

exports.getPublicSettings = async (req, res) => {
  try {
    const settings = await Setting.find({ isPublic: true });
    
    const publicData = settings.reduce((acc, setting) => {
      acc[setting.key] = setting.value;
      return acc;
    }, {});
    
    res.json(publicData);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching public settings', error: error.message });
  }
};
