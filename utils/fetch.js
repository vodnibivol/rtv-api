const fetch = require('node-fetch');

const metaApi = 'https://api.rtvslo.si/ava/getRecordingDrm/';
const mediaApi = 'https://api.rtvslo.si/ava/getMedia/';
const clientID = '82013fb3a531d5414f478747c1aca622';

async function getMeta(mediaID) {
  const metaUrl = `${metaApi}${mediaID}?client_id=${clientID}`;

  let r = await fetch(metaUrl);
  let j = await r.json();

  let geoblocked;

  j.response.geoblocked ? (geoblocked = true) : (geoblocked = false);

  let obj = {
    source: j.response.source,
    title: j.response.title,
    jwt: j.response.jwt,
    geoblocked,
  };

  return obj;
}

async function getMedia(mediaID, jwt) {
  let url = `${mediaApi}${mediaID}?client_id=${clientID}&jwt=${jwt}`;

  let r = await fetch(url);
  let j = await r.json();

  let download, stream;

  if ('addaptiveMedia' in j.response) {
    download = j.response.addaptiveMedia.http;
    stream = j.response.addaptiveMedia.hls;
  } else {
    download = j.response.mediaFiles[0].streams.https;
  }

  return { download, stream };
}

async function getData(mediaID) {
  const { source, title, jwt, geoblocked } = await getMeta(mediaID);
  const media = await getMedia(mediaID, jwt);

  let obj = {
    source,
    title,
    geoblocked,
    media,
  };

  return obj;
}

module.exports = getData;
