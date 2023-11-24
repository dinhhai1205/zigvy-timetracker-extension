class StorageService {
  constructor(type = 'session') {
    this.type = type;
  }

  get = async (key) => {
    const data = await chrome.storage[this.type].get(key);
    return data[key];
  };

  set = async (key, value) => {
    return chrome.storage[this.type].set({ [key]: value });
  };

  remove = async (key) => {
    return chrome.storage[this.type].remove(key);
  };
}

export default StorageService;
