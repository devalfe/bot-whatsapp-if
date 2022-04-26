const { get, reply, getIA } = require('../adapter');
const { saveExternalFile, checkIsUrl } = require('./handle');

export default {
  getMessages: async message => await get(message),
  responseMessages: async step => {
    const data = await reply(step);
    if (data && data.media) {
      const file = checkIsUrl(data.media) ? await saveExternalFile(data.media) : data.media;
      return { ...data, ...{ media: file } };
    }
    return data;
  },
  bothResponse: async message => {
    const data = await getIA(message);
    if (data && data.media) {
      const file = await saveExternalFile(data.media);
      return { ...data, ...{ media: file } };
    }
    return data;
  }
};
